// Minimal dependency-free smoke tests for the isolated interactive driving simulator.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('public/sa-hinh/simulator.js','utf8');
const grad={addColorStop(){}};
const ctx=new Proxy({
 createLinearGradient:()=>grad,createRadialGradient:()=>grad
}, {get(target,key){return key in target?target[key]:()=>{}},set(target,key,value){target[key]=value;return true}});
const elements=new Map();
function el(id){
 if(elements.has(id))return elements.get(id);
 const classes=new Set(),handlers=new Map();
 const node={id,style:{},dataset:{},innerHTML:'',textContent:'',className:'',handlers,clientWidth:800,clientHeight:450,
  classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle(x,force){if(force===undefined)force=!classes.has(x);force?classes.add(x):classes.delete(x);return force}},
  addEventListener(name,fn){if(!handlers.has(name))handlers.set(name,[]);handlers.get(name).push(fn)},
  querySelectorAll:()=>[],setAttribute(){},getBoundingClientRect:()=>({left:0,top:0,width:id==='wheel'?120:800,height:id==='wheel'?120:450}),
  setPointerCapture(){},getContext:()=>ctx
 };
 elements.set(id,node);return node;
}
const body=el('body');
const document={getElementById:el,body,documentElement:el('html'),querySelectorAll:()=>[],addEventListener(){}};
const window={devicePixelRatio:1,matchMedia:()=>({matches:false}),addEventListener(){}};
let frame=null;
const sandbox={document,window,console,setTimeout:()=>1,clearTimeout(){},requestAnimationFrame:callback=>{frame=callback},HTMLInputElement:class{}};
vm.runInNewContext(source,sandbox,{filename:'simulator.js',timeout:5000});
function emit(id,event,payload={}){for(const fn of el(id).handlers.get(event)||[])fn({pointerId:1,clientX:0,clientY:0,preventDefault(){},...payload})}
const debug=()=>window.QuyetThangSaHinhDebug.getState();
assert.equal(window.QuyetThangSaHinhDebug.lessonCount(),11,'B auto should have 11 exercises');
assert.equal(debug().view,0,'default exterior camera');
assert.equal(debug().camera.distance,17.8);
assert.ok(typeof frame==='function','render loop should be registered');
frame(1000);
// Rotate wheel: a quarter-turn should not instantly reach full lock.
emit('wheel','pointerdown',{clientX:120,clientY:60});
emit('wheel','pointermove',{clientX:60,clientY:120});
emit('wheel','pointerup');
assert.ok(debug().steerTarget>0.12&&debug().steerTarget<0.2,'wheel angle should be progressive');
frame(1016);
assert.ok(debug().steer>0&&debug().steer<debug().steerTarget,'steering should smooth toward target');
emit('centerSteerBtn','click');
assert.equal(debug().steerTarget,0,'return steering to centre');
// Orbit camera by touch; reset camera position.
emit('scene','pointerdown',{clientX:300,clientY:200});
emit('scene','pointermove',{clientX:360,clientY:220});
assert.ok(debug().camera.yaw>0,'drag rotates the camera');
emit('scene','pointerup');
emit('cameraResetBtn','click');
assert.equal(debug().camera.yaw,0);
emit('cameraPlusBtn','click');
assert.ok(debug().camera.distance<17.8);
// Changing modes must not accidentally append DAT to the official 11-exercise chain.
emit('datBtn','click');
assert.equal(debug().mode,'dat');
assert.equal(window.QuyetThangSaHinhDebug.lessonCount(),1);
frame(1048);
emit('practiceBtn','click');
assert.equal(window.QuyetThangSaHinhDebug.lessonCount(),11);
console.log('PASS: 11 sa-hinh lessons, DAT isolation, frame rendering, steering and camera interactions');
