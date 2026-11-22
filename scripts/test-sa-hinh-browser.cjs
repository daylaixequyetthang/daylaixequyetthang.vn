const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve('public');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const requested=decodeURI(new URL(req.url,'http://localhost').pathname);
 const p=path.resolve(root,'.'+requested);
 if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(p,(err,buf)=>{if(err){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream'});res.end(buf)});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});
 const port=server.address().port;
 fs.mkdirSync('test-artifacts',{recursive:true});
 const devices=[[393,852],[375,667],[844,390],[667,320],[1280,900]];
 try{for(const [width,height] of devices){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:width<1100,hasTouch:width<1100});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:'+port+'/sa-hinh/index.html',{waitUntil:'load'});
  await page.waitForTimeout(250);
  const measures=await page.evaluate(()=>{
   const viewport={w:innerWidth,h:innerHeight};
   const ids=['scene','wheel','gasBtn','brakeBtn','gearButtons'];
   const positions={};for(const id of ids){const element=document.getElementById(id),r=element.getBoundingClientRect();positions[id]={x:r.left,y:r.top,w:r.width,h:r.height,b:r.bottom};}
   return {viewport,positions,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,view:window.QuyetThangSaHinhDebug.getState().view};
  });
  assert.deepEqual(errors,[],'Unexpected JS errors at '+width+'x'+height);
  assert.equal(measures.view,0,'Third-person default at '+width+'x'+height);
  assert.ok(measures.positions.scene.w>100&&measures.positions.scene.h>90,'Scene collapsed at '+width+'x'+height);
  if(width<=1024){
   for(const id of ['wheel','gasBtn','brakeBtn']){
    const r=measures.positions[id];
    assert.ok(r.w>20&&r.h>20&&r.y>=-4&&r.b<=height+4,id+' missing from cockpit at '+width+'x'+height+': '+JSON.stringify(r));
   }
   assert.ok(measures.scrollWidth<=width+3,'Horizontal overflow at '+width+'x'+height);
  }
  await page.screenshot({path:'test-artifacts/sa-hinh-v5-'+width+'x'+height+'.png',fullPage:true});
  if(width===393){
   const after=await page.evaluate(()=>{
    const target=document.getElementById('scene');
    const send=(name,x,y)=>target.dispatchEvent(new PointerEvent(name,{bubbles:true,pointerId:9,clientX:x,clientY:y}));
    send('pointerdown',200,150);send('pointermove',250,150);send('pointerup',250,150);
    return window.QuyetThangSaHinhDebug.getState().camera.yaw;
   });
   assert.ok(after>0,'Camera drag did not change yaw');
   await page.locator('#cameraResetBtn').click();
   assert.equal(await page.evaluate(()=>window.QuyetThangSaHinhDebug.getState().camera.yaw),0);
   await page.locator('#lessonDrawerBtn').click();
   await page.locator('#datBtn').click();
   assert.equal(await page.evaluate(()=>window.QuyetThangSaHinhDebug.getState().mode),'dat');
  }
  await ctx.close();
  console.log('PASS viewport '+width+'x'+height);
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
