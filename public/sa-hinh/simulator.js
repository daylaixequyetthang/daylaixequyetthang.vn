/* Trung Tâm GDNN Quyết Thắng · Sa hình interactive learning beta.
   Original canvas renderer & simplified bicycle-model physics, no external SDK. */
(() => {
'use strict';
const $ = (id) => document.getElementById(id);
const canvas = $('scene'), ctx = canvas.getContext('2d', { alpha:false });
const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
const hypot = (a,b) => Math.hypot(a,b);
const deg = (n) => n*180/Math.PI;
const names = [
 ['Xuất phát','Thắt dây, bật xi nhan trái và cho xe chạy nhẹ nhàng.','Khởi hành'],
 ['Dừng nhường người đi bộ','Dừng đúng vị trí trước vạch dành cho người đi bộ.','Dừng xe'],
 ['Dừng và khởi hành ngang dốc','Dừng ở vùng quy định, rồi khởi hành không bị trôi dốc.','Dốc cầu'],
 ['Vệt bánh xe và đường vuông góc','Đi đúng vệt bánh xe, vào cua vuông góc trong giới hạn.','Đường hẹp'],
 ['Ngã tư có đèn tín hiệu','Quan sát đèn giao thông và dừng đúng vị trí khi đèn đỏ.','Đèn tín hiệu'],
 ['Đường vòng quanh co','Giữ bánh xe trong giới hạn của đường chữ S.','Đường chữ S'],
 ['Ghép xe dọc vào nơi đỗ','Lùi xe vào ô đỗ dọc, đỗ trọn thân xe trong giới hạn.','Lùi chuồng dọc'],
 ['Ghép xe ngang vào nơi đỗ','Lùi xe vào ô đỗ song song, không chạm vạch.','Ghép ngang'],
 ['Tạm dừng nơi có đường sắt','Giảm tốc và dừng trước vạch đường sắt.','Đường sắt'],
 ['Thay đổi số trên đường bằng','Tăng, giảm tốc có kiểm soát và chuyển số theo hướng dẫn.','Chuyển số'],
 ['Kết thúc','Bật xi nhan phải và lái qua vạch đích.','Về đích'],
 ['Luyện đường trường (DAT mô phỏng)','Tập giữ làn, quan sát và chuyển hướng trên tuyến đường minh họa. Không được tính DAT thực tế.','Đường trường']
];
const route = (points,width=7,extra={}) => ({points,width,...extra});
const maps = [
 route([[0,28],[0,17],[0,0],[0,-23]],8,{tag:'start'}),
 route([[0,28],[0,11],[0,-2],[0,-24]],8,{stop:7,tag:'walk'}),
 route([[0,28],[0,11],[0,-2],[0,-24]],8,{stop:6,tag:'hill'}),
 route([[0,29],[0,10],[0,-2],[19,-2],[19,-24]],5.8,{tag:'corner'}),
 route([[0,29],[0,11],[0,-5],[0,-25]],8,{stop:8,tag:'light'}),
 route([[-11,31],[-11,20],[7,12],[10,1],[-8,-11],[-9,-29]],6.8,{tag:'curve'}),
 route([[0,28],[0,12],[0,-6]],9,{park:{x:8,y:11,w:6.8,h:3.0},tag:'bay'}),
 route([[0,28],[0,14],[0,-7]],9,{park:{x:6.4,y:8,w:3.0,h:7.8},tag:'parallel'}),
 route([[0,28],[0,12],[0,-1],[0,-25]],8,{stop:6,tag:'rail'}),
 route([[0,29],[0,12],[0,-2],[0,-27]],9,{tag:'speed'}),
 route([[0,29],[0,12],[0,-2],[0,-25]],8,{tag:'finish'}),
 route([[0,85],[0,30],[0,-20],[24,-45],[24,-108],[-15,-145],[-15,-208],[15,-245],[15,-322]],9,{tag:'dat'})
];
const roundedPath=(points,radius=6,steps=8)=>{
 const res=[points[0]];
 for(let i=1;i<points.length-1;i++){
  const a=points[i-1],b=points[i],c=points[i+1],la=hypot(b[0]-a[0],b[1]-a[1])||1,lb=hypot(c[0]-b[0],c[1]-b[1])||1;
  const u=[(b[0]-a[0])/la,(b[1]-a[1])/la],v=[(c[0]-b[0])/lb,(c[1]-b[1])/lb],turn=Math.acos(clamp(u[0]*v[0]+u[1]*v[1],-1,1));
  if(turn<.12||turn>3){res.push(b);continue;}
  const cut=Math.min(radius,la*.34,lb*.34),enter=[b[0]-u[0]*cut,b[1]-u[1]*cut],exit=[b[0]+v[0]*cut,b[1]+v[1]*cut];
  res.push(enter);
  for(let k=1;k<=steps;k++){const t=k/(steps+1),q=1-t;res.push([q*q*enter[0]+2*q*t*b[0]+t*t*exit[0],q*q*enter[1]+2*q*t*b[1]+t*t*exit[1]]);}
  res.push(exit);
 }
 res.push(points.at(-1));return res;
};
for(const map of maps){if(['corner','curve','dat'].includes(map.tag))map.points=roundedPath(map.points,map.tag==='dat'?11:6,8);}

const state = {dragSteer:null,steerTarget:0,camera:{yaw:0,distance:17.8,height:10.8},cls:'bat',mode:'practice',lesson:0,view:0,guides:true,score:100,elapsed:0,distance:0,errors:[],done:new Set(),gameOver:false,paused:false,finished:false,keys:{},steer:0,car:null,stageElapsed:0,stopped:false,stopChecked:false,reverseUsed:false,maxSpeed:0,shifted:false,edgeActive:false,overSpeed:0,hazard:null,noticeTimer:0,progress:0};
const classes={bat:{name:'HẠNG B TỰ ĐỘNG',gears:['P','R','N','D'],time:1080,top:24,length:4.4},bmt:{name:'HẠNG B SỐ SÀN',gears:['N','R','1','2'],time:1080,top:24,length:4.4},c1:{name:'HẠNG C1',gears:['N','R','1','2'],time:1200,top:20,length:6.0}};
const list=()=>state.mode==='dat'?[11]:(state.cls==='c1'?[0,1,2,3,4,5,6,8,9,10]:names.slice(0,11).map((_,i)=>i));
const lessonId=()=>list()[state.lesson];
const lesson=()=>maps[lessonId()];
const carLength=()=>classes[state.cls].length;
let lastFrame=0, displayTick=0;
function announce(msg, warning=false) {
 const el=$('notice');el.textContent=msg;el.className='screenNotice visible'+(warning?' warning':'');
 clearTimeout(state.noticeTimer);state.noticeTimer=setTimeout(()=>el.classList.remove('visible'),2500);
}
function penalty(msg,pts=5) {
 if(state.mode==='practice' && state.finished) return;
 state.score=Math.max(0,state.score-pts);
 state.errors.push({lesson:lessonId()+1,message:msg,points:pts,at:Math.round(state.elapsed)});
 announce(`−${pts} điểm: ${msg}`,true);
 if(state.mode==='exam' && state.score<80){state.gameOver=true;announce('Bài thi tham khảo: dưới 80 điểm. Chọn Làm lại để thử tiếp.',true);}
}
function initCar() {
 const p=lesson().points,dx=p[1][0]-p[0][0],dy=p[1][1]-p[0][1];
 const heading=Math.atan2(dx,-dy);
 state.car={x:p[0][0],y:p[0][1],heading,speed:0,gear:classes[state.cls].gears.includes('P')?'P':'N',belt:false,signal:'',hazard:false};
 state.steer=0;state.steerTarget=0;state.stageElapsed=0;state.stopped=false;state.stopChecked=false;state.reverseUsed=false;state.maxSpeed=0;state.shifted=false;state.edgeActive=false;state.overSpeed=0;state.progress=0;state.finished=false;state.keys={};state.dragSteer=null;state.beltPenalized=false;state.startSignalChecked=false;state.finishSignalChecked=false;state.lightChecked=false;state.warnedPark=false;state.warnedShift=false;state.warnedSpeed=false;
 $('nextBtn').disabled=true;
 updateUI();
}
function resetAll(){state.score=100;state.elapsed=0;state.distance=0;state.errors=[];state.done.clear();state.gameOver=false;state.lesson=0;state.paused=false;state.hazard=null;initCar();renderList();}
function pickClass(cls){state.cls=cls;document.querySelectorAll('[data-class]').forEach(b=>b.classList.toggle('active',b.dataset.class===cls));resetAll();}
function setMode(mode){state.mode=mode;state.guides=mode!=='exam';$('practiceBtn').classList.toggle('chosen',mode==='practice');$('examBtn').classList.toggle('chosen',mode==='exam');$('datBtn')?.classList.toggle('chosen',mode==='dat');resetAll();announce(mode==='exam'?'Thi thử theo chuỗi bài; điểm số chỉ mang tính tham khảo.':mode==='dat'?'Tuyến đường trường minh họa: không ghi nhận km DAT thực tế.':'Chế độ luyện tập: làm từng bài, có hướng dẫn.');}
function selectLesson(index){if(state.mode==='exam'){announce('Chế độ thi theo chuỗi bài: hoàn thành lần lượt từng bài.',true);return;}state.lesson=index;state.gameOver=false;initCar();renderList();}
function nextStage(){if(!state.finished && state.mode==='exam')return;if(state.lesson<list().length-1){state.lesson++;initCar();renderList();announce('Chuyển sang bài '+String(state.lesson+1).padStart(2,'0'));}else{state.gameOver=true;announce(`Hoàn tất! Kết quả mô phỏng: ${state.score}/100 điểm.`);}}
function renderList(){
 $('lessonCount').textContent=list().length+' bài';$('progressCount').textContent=state.done.size+' / '+list().length;
 $('lessonList').innerHTML=list().map((id,i)=>`<button class="lesson ${i===state.lesson?'active':''} ${state.done.has(i)?'done':''}" data-index="${i}" type="button"><span class="lessonNo">${String(i+1).padStart(2,'0')}</span><span class="lessonText"><strong>${names[id][0]}</strong><small>${names[id][2]}</small></span>${state.done.has(i)?'<span class="lessonCheck">✓</span>':''}</button>`).join('');
 $('lessonList').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{selectLesson(+b.dataset.index);if(isPhone())setDrawer(false);}));
}
function updateUI(){
 const id=lessonId(),n=list().length,c=state.car;
 $('breadcrumb').textContent=`BÀI ${String(state.lesson+1).padStart(2,'0')} / ${n} · ${classes[state.cls].name}`;
 $('lessonTitle').textContent=names[id][0];$('lessonDesc').textContent=names[id][1];
 $('lessonNumber').textContent=`${String(state.lesson+1).padStart(2,'0')}/${n}`;
 $('gearDisplay').textContent=c.gear;$('transmissionLabel').textContent=state.cls==='bat'?'SỐ TỰ ĐỘNG':'SỐ CƠ KHÍ';
 $('gearButtons').innerHTML=classes[state.cls].gears.map(g=>`<button type="button" data-gear="${g}" class="${g===c.gear?'selected':''}">${g}</button>`).join('');
 $('gearButtons').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setGear(b.dataset.gear)));
 $('beltBtn').classList.toggle('on',c.belt);$('beltState').textContent=c.belt?'ĐÃ CÀI':'CHƯA';
 $('signalLeft').classList.toggle('on',c.signal==='left');$('signalRight').classList.toggle('on',c.signal==='right');$('hazardBtn').classList.toggle('on',c.hazard);
 $('viewName').textContent=['3D sau xe','Góc ghế lái','Sơ đồ trên cao'][state.view];
 $('viewLabel').textContent=['GÓC NHÌN SAU XE · CHẠM ◉ ĐỂ ĐỔI','VÔ LĂNG TRÁI · GÓC NHÌN HỌC VIÊN','GÓC NHÌN TRÊN CAO · BẢN ĐỒ'][state.view];
 document.body.classList.toggle('orbitView',state.view===0);
}
function setGear(g){if(Math.abs(state.car.speed)>.35){announce('Phải dừng xe trước khi đổi chiều chuyển động.',true);return;}state.car.gear=g;if(g==='2')state.shifted=true;updateUI();}
function toggleBelt(){state.car.belt=!state.car.belt;updateUI();}
function signal(dir){state.car.signal=state.car.signal===dir?'':dir;updateUI();}
function hazard(){state.car.hazard=!state.car.hazard;updateUI();}
function steerInput(){return state.dragSteer===null ? (state.keys.right?1:0)-(state.keys.left?1:0) : state.dragSteer;}
const distSegment=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],q=clamp(((p.x-a[0])*dx+(p.y-a[1])*dy)/(dx*dx+dy*dy||1),0,1);return {d:hypot(p.x-a[0]-q*dx,p.y-a[1]-q*dy),q};};
function roadDistance(){const c=state.car,p=lesson().points;let min=Infinity;for(let i=1;i<p.length;i++)min=Math.min(min,distSegment(c,p[i-1],p[i]).d);if(lesson().park){const z=lesson().park,d=hypot(Math.max(0,Math.abs(c.x-z.x)-z.w/2),Math.max(0,Math.abs(c.y-z.y)-z.h/2));min=Math.min(min,d);}return min;}
function currentTrafficGreen(){return (state.stageElapsed%17)>6;}
function carInsideBay(c,box){
 const halfL=carLength()*.5,halfW=state.cls==='c1'?1.18:.99,f=[Math.sin(c.heading),-Math.cos(c.heading)],r=[Math.cos(c.heading),Math.sin(c.heading)];
 for(const front of [-halfL,halfL])for(const side of [-halfW,halfW]){
  const x=c.x+f[0]*front+r[0]*side,y=c.y+f[1]*front+r[1]*side;
  if(Math.abs(x-box.x)>box.w*.5-.08||Math.abs(y-box.y)>box.h*.5-.08)return false;
 }
 return true;
}
function checkRules(dt) {
 const c=state.car, l=lesson(),id=lessonId(),sp=Math.abs(c.speed)*3.6;
 if(!c.belt && sp>1&&!state.beltPenalized){penalty('Chưa cài dây an toàn',5);state.beltPenalized=true;}
 if(id===0 && sp>1 && c.signal!=='left' && !state.startSignalChecked){penalty('Không bật xi nhan trái khi xuất phát',5);state.startSignalChecked=true;}
 if(id===10 && sp>1 && c.signal!=='right' && !state.finishSignalChecked){penalty('Chưa bật xi nhan phải ở bài kết thúc',5);state.finishSignalChecked=true;}
 if(l.stop!==undefined){
   if(Math.abs(c.y-l.stop)<2.6 && sp<.75)state.stopped=true;
   if(c.y<l.stop-3 && !state.stopChecked){state.stopChecked=true;if(!state.stopped)penalty('Chưa dừng xe đúng vạch',id===4?10:5);else announce('Đã dừng đúng khu vực. Tiếp tục bài tập.');}
   if(id===4 && c.y<l.stop-2 && !currentTrafficGreen() && !state.lightChecked){penalty('Qua ngã tư khi đèn đỏ',10);state.lightChecked=true;}
 }
 if((id===6||id===7) && c.speed<-.2) state.reverseUsed=true;
 state.maxSpeed=Math.max(state.maxSpeed,sp);
 const off=roadDistance() > l.width/2+0.2;
 if(off && !state.edgeActive && state.stageElapsed>1.1){penalty('Bánh xe ra ngoài đường giới hạn',5);state.edgeActive=true;}else if(!off)state.edgeActive=false;
 if(sp>classes[state.cls].top){state.overSpeed+=dt;if(state.overSpeed>3){penalty('Vượt tốc độ giới hạn trong sân',1);state.overSpeed=0;}}else state.overSpeed=0;
 if(state.hazard && !state.hazard.closed){const hz=state.hazard;
   hz.t+=dt;
   if(sp<1 && !hz.braked){hz.braked=true;if(hz.t>3)penalty('Phanh chậm trong tình huống bất ngờ',10);}
   if(c.hazard&&!hz.lit){hz.lit=true;if(hz.t>5)penalty('Bật tín hiệu nguy hiểm chậm',10);}
   if(hz.t>6 && !hz.closed){if(!hz.braked)penalty('Không dừng xe khi gặp nguy hiểm',10);if(!hz.lit)penalty('Không bật cảnh báo nguy hiểm',10);hz.closed=true;announce('Tình huống nguy hiểm đã kết thúc. Tắt đèn cảnh báo để đi tiếp.');}
 }
 const p=l.points,goal=l.park||{x:p.at(-1)[0],y:p.at(-1)[1]};
 const arrive=l.park?carInsideBay(c,l.park):hypot(c.x-goal.x,c.y-goal.y)<4.4;
 if(arrive && !state.finished && state.stageElapsed>3){
   if(l.park && (!state.reverseUsed||sp>3)){if(!state.warnedPark){announce('Hãy lùi xe bằng số R và dừng trọn thân xe trong ô đỗ.',true);state.warnedPark=true;}return;}
   if(id===9 && state.cls!=='bat' && !state.shifted){if(!state.warnedShift){announce('Cần chuyển sang số 2 trong bài thay đổi số.',true);state.warnedShift=true;}return;}
   if(id===9 && state.maxSpeed<12){if(!state.warnedSpeed){announce('Tăng tốc có kiểm soát trước khi kết thúc bài.',true);state.warnedSpeed=true;}return;}
   if(l.stop!==undefined && !state.stopChecked){return;}
   finishStage();
 }
}
function finishStage(){if(state.finished)return;state.finished=true;state.done.add(state.lesson);$('nextBtn').disabled=false;renderList();announce(`Hoàn thành bài ${state.lesson+1}! Điểm hiện tại: ${state.score}/100.`);if(state.mode==='exam'){setTimeout(()=>{if(state.finished&&!state.gameOver)nextStage();},1700);} }
function step(dt){
 if(state.paused||state.finished||state.gameOver)return;
 state.elapsed+=dt;state.stageElapsed+=dt;
 const c=state.car;const gas=!!state.keys.gas,brake=!!state.keys.brake;
 const direction=(state.keys.right?1:0)-(state.keys.left?1:0);
 if(direction)state.steerTarget=clamp(state.steerTarget+direction*dt*.38,-1,1);
 state.steer+=(state.steerTarget-state.steer)*Math.min(1,dt*2.4);
 let target=0;
 if(c.gear==='D'||c.gear==='1'||c.gear==='2')target=gas?6.7:0;
 if(c.gear==='R')target=gas?-3:0;
 if(brake){const sign=Math.sign(c.speed);c.speed=sign*Math.max(0,Math.abs(c.speed)-dt*8);}
 else{const d=target-c.speed;const power=gas?2.8:1.25;c.speed+=clamp(d,-power*dt,power*dt);if(Math.abs(c.speed)<.014)c.speed=0;}
 if(c.gear==='P')c.speed=0;
 const wb=state.cls==='c1'?3.6:2.65;
 c.heading+=(c.speed/wb)*Math.tan(state.steer*.56)*dt;
 const distance=c.speed*dt;
 c.x+=Math.sin(c.heading)*distance;c.y-=Math.cos(c.heading)*distance;
 state.distance+=Math.abs(distance);
 if(state.mode==='exam' && state.elapsed>classes[state.cls].time){state.gameOver=true;penalty('Quá thời gian mô phỏng',5);announce('Hết thời gian thi thử. Chọn Làm lại để thử tiếp.',true);}
 if(state.mode==='exam' && state.elapsed>35 && !state.hazard)state.hazard={t:0,braked:false,lit:false,closed:false};
 checkRules(dt);
}
function guideMessage(){const c=state.car,l=lesson(),id=lessonId();if(state.finished)return 'Tốt! Bạn đã hoàn thành bài. Nhấn “Tiếp theo” để chuyển bài.';if(state.gameOver)return 'Kết thúc lượt. Chọn “Làm lại” để bắt đầu lượt mới.';if(!c.belt)return 'Bước 1: Cài dây an toàn trước khi bắt đầu.';if(c.gear==='P'||c.gear==='N')return 'Bước 2: Chọn D / số 1 để tiến, R để lùi. Sử dụng W hoặc ↑ để tăng ga.';if(state.hazard && !state.hazard.closed)return '⚠ Tình huống bất ngờ: phanh dừng xe ngay và bật đèn cảnh báo!';if(state.hazard && state.hazard.closed && c.hazard)return 'Tình huống đã hết. Tắt cảnh báo nguy hiểm trước khi lái tiếp.';if(id===11)return 'Luyện giữ làn, quan sát và điều tốc. Đây là mô phỏng, không ghi nhận quãng đường DAT thực tế.';if(id===0&&!state.startSignalChecked)return 'Bật xi nhan trái (Q), giữ chân ga và lái qua vạch xuất phát.';if(l.stop!==undefined&&!state.stopped)return `Đi chậm tới vạch dừng: y ≈ ${l.stop} m trên bản đồ; nhấn Space để dừng.`;if(id===4)return currentTrafficGreen()?'Đèn xanh: quan sát và lái xe qua ngã tư.':'Đèn đỏ: phanh dừng xe trước vạch.';if(l.park)return 'Lái vượt ô đỗ, chọn R và đánh lái từ từ để lùi gọn xe vào ô được tô xanh.';if(id===9)return state.cls==='bat'?'Tăng ga lên khoảng 12 km/h rồi giảm tốc trước điểm kết thúc.':'Tăng ga, dừng xe chuyển từ số 1 sang 2, rồi tới đích.';if(id===10)return 'Bật xi nhan phải (E), giữ hướng xe và đi qua vạch kết thúc.';return names[id][1]+' Lái theo đường trắng; dùng phanh để giữ tốc độ an toàn.';}
function status(){const c=state.car;if(state.gameOver)return 'KẾT THÚC LƯỢT';if(state.finished)return 'ĐÃ HOÀN THÀNH';if(state.paused)return 'ĐANG TẠM DỪNG';if(Math.abs(c.speed)<.1)return 'SẴN SÀNG TẬP LÁI';return 'XE ĐANG DI CHUYỂN';}
function updateStats(){const c=state.car;$('speedText').innerHTML=String(Math.round(Math.abs(c.speed)*3.6)).padStart(2,'0')+'<small> km/h</small>';$('scoreText').textContent=state.score;$('clockText').textContent=String(Math.floor(state.elapsed/60)).padStart(2,'0')+':'+String(Math.floor(state.elapsed%60)).padStart(2,'0');$('distanceText').textContent=Math.round(state.distance)+' m';$('errorCount').textContent=state.errors.length;$('steerText').textContent=(state.steer>0.015?'↱ ':state.steer<-.015?'↰ ':'')+Math.round(Math.abs(state.steer*540))+'°';$('wheel').setAttribute('aria-valuenow',String(Math.round(state.steer*100)));$('wheel').style.transform=`rotate(${state.steer*540}deg)`;$('statusText').textContent=state.gameOver?(state.score>=80?'Hoàn tất':'Chưa đạt'):state.finished?'Đã hoàn thành':'Đang luyện';$('systemStatus').textContent=status();$('instruction').textContent=state.guides?guideMessage():'Hướng dẫn đang tắt. Nhấn “Hiện hướng dẫn” để bật lại.';if($('compactGuideText'))$('compactGuideText').textContent=state.guides?guideMessage():'Đã tắt hướng dẫn (bấm ✦ để bật).';}
// ----------------------------------------------------------------------
// QUYET THANG V4 — procedural perspective 3D learning environment.
// World-space objects are projected against the same car position, heading
// and route geometry used by the driving/penalty engine. No remote assets.
// NOTE: perspective rendering ≠ surveyed/official exam-track geometry.
// ----------------------------------------------------------------------
function resize(){
 const b=canvas.getBoundingClientRect(), dpr=Math.min(2,window.devicePixelRatio||1);
 const w=Math.max(1,Math.round(b.width*dpr)),h=Math.max(1,Math.round(b.height*dpr));
 if(canvas.width!==w || canvas.height!==h){canvas.width=w;canvas.height=h;}
 ctx.setTransform(dpr,0,0,dpr,0,0);return {W:b.width,H:b.height};
}
function roadElevation(y){
 if(lessonId()!==2)return 0;
 if(y>4)return 0;
 if(y>-1)return 1.08*(4-y)/5;
 if(y>-5)return 1.08;
 if(y>-10)return 1.08*(y+10)/5;
 return 0;
}
function makeProjection(W,H){
 const c=state.car,inside=state.view===1,fcar=[Math.sin(c.heading),-Math.cos(c.heading)],rcar=[Math.cos(c.heading),Math.sin(c.heading)];
 let f=fcar,r=rcar,cx,cy;
 if(inside){cx=c.x-fcar[0]*1.27-rcar[0]*.68;cy=c.y-fcar[1]*1.27-rcar[1]*.68;}
 else{
  const cam=state.camera,dist=cam.distance,yaw=cam.yaw;
  cx=c.x-fcar[0]*Math.cos(yaw)*dist+rcar[0]*Math.sin(yaw)*dist;
  cy=c.y-fcar[1]*Math.cos(yaw)*dist+rcar[1]*Math.sin(yaw)*dist;
  const aimX=c.x+fcar[0]*6,aimY=c.y+fcar[1]*6,mag=hypot(aimX-cx,aimY-cy)||1;
  f=[(aimX-cx)/mag,(aimY-cy)/mag];r=[-f[1],f[0]];
 }
 const cameraZ=roadElevation(c.y)+(inside?1.6:state.camera.height);
 const focal=W*(inside?.87:.81),horizon=H*(inside?.405:.32);
 const near=.78;
 const depth=(x,y)=>(x-cx)*f[0]+(y-cy)*f[1];
 function project(x,y,z=0){
   const d=depth(x,y);if(d<near-1e-6)return null;
   const s=focal/(d+1.35);
   return {x:W*.5+((x-cx)*r[0]+(y-cy)*r[1])*s,y:horizon+(cameraZ-z)*s,depth:d,scale:s};
 }
 project.depth=depth;project.near=near;project.focal=focal;project.horizon=horizon;
 return project;
}
function drawPolygon(points,fill,stroke,width=1){
 if(points.length<3||points.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)))return;
 ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
 if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
}
function line(a,b,col,w=2,dash=[]){
 if(!a||!b)return;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
 ctx.strokeStyle=col;ctx.lineWidth=w;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
}
function polyWorld(P,vertices,fill,stroke,width=1){
 // Sutherland–Hodgman clipping avoids giant/vanishing road triangles when
 // the bonnet/vehicle crosses the near edge of a road segment.
 let clipped=vertices;
 if(P.depth){
   const near=P.near+.01,out=[];
   for(let i=0;i<vertices.length;i++){
     const a=vertices[(i+vertices.length-1)%vertices.length],b=vertices[i];
     const da=P.depth(a[0],a[1]),db=P.depth(b[0],b[1]);
     const ia=da>=near,ib=db>=near;
     if(ia!==ib){const t=(near-da)/(db-da||1);out.push(a.map((v,j)=>v+(b[j]-v)*t));}
     if(ib)out.push(b);
   }
   clipped=out;
 }
 if(clipped.length<3)return;
 drawPolygon(clipped.map(p=>P(p[0],p[1],p[2]||0)),fill,stroke,width);
}
function worldLine(P,a,b,color,width=2,dash=[]){
 if(P.depth){
  const near=P.near+.01,da=P.depth(a[0],a[1]),db=P.depth(b[0],b[1]);
  if(da<near&&db<near)return;
  if(da<near||db<near){let t=(near-da)/(db-da||1);const cut=a.map((v,j)=>v+(b[j]-v)*t);if(da<near)a=cut;else b=cut;}
 }
 line(P(...a),P(...b),color,width,dash);
}
function rand01(n){let x=Math.sin(n*137.13+9.17)*43758.5453;return x-Math.floor(x);}
function drawAtmosphere(W,H){
 const horizon=H*.415;
 const sky=ctx.createLinearGradient(0,0,0,H*.64);
 sky.addColorStop(0,'#4d98d2');sky.addColorStop(.45,'#89c5ea');sky.addColorStop(.77,'#c6eafa');sky.addColorStop(1,'#e7f5e8');
 ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 // distant sunlight and cloud clusters
 const glow=ctx.createRadialGradient(W*.78,H*.13,5,W*.78,H*.13,Math.max(W,H)*.5);
 glow.addColorStop(0,'#fff5d963');glow.addColorStop(1,'#fff5d900');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
 for(let i=0;i<4;i++){
   const x=W*(.08+.28*i),y=H*(.12+.045*(i%2)),s=W*(.055+(i%2)*.015);
   ctx.fillStyle=i%2?'#f8ffff7d':'#e8f7ff9a';ctx.beginPath();
   ctx.ellipse(x,y,s,.016*H,0,0,Math.PI*2);ctx.ellipse(x+s*.32,y-H*.007,s*.76,.028*H,0,0,Math.PI*2);ctx.ellipse(x-s*.3,y+H*.005,s*.68,.018*H,0,0,Math.PI*2);ctx.fill();
 }
 ctx.fillStyle='#8db6b0';ctx.beginPath();ctx.moveTo(0,horizon);for(let x=0;x<=W+20;x+=15)ctx.lineTo(x,horizon-9-Math.sin((x/W)*14.8+1.6)*8-Math.sin(x/W*29)*3);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
 ctx.fillStyle='#5a986c';ctx.beginPath();ctx.moveTo(0,horizon+18);for(let x=0;x<=W+20;x+=19)ctx.lineTo(x,horizon+14-Math.sin((x/W)*11.1+.8)*10);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
 const grass=ctx.createLinearGradient(0,horizon,0,H);
 grass.addColorStop(0,'#76a67a');grass.addColorStop(.5,'#5d966a');grass.addColorStop(1,'#417a53');
 ctx.fillStyle=grass;ctx.fillRect(0,horizon+28,W,H-horizon);
 // grass retains a muted, uncluttered surface around critical road marks
 ctx.fillStyle='#ffffff0a';for(let i=0;i<40;i++){
  const px=rand01(i+21)*W,py=horizon+28+rand01(i+91)*(H-horizon);
  ctx.fillRect(px,py,1+rand01(i)*3,1);
 }
}
function courseScenery(){
 const l=lesson(),id=lessonId();
 if(courseScenery.cache?.id===id)return courseScenery.cache.objects;
 const objects=[];
 // Fixed real-world locations: environmental objects don't slide with the camera.
 l.points.slice(1).forEach((to,index)=>{
  const from=l.points[index],dx=to[0]-from[0],dy=to[1]-from[1],len=Math.hypot(dx,dy)||1;
  const nx=-dy/len,ny=dx/len;
  for(let d=3;d<len-2;d+=10){
    for(const side of [-1,1]){
      const j=id*85+index*29+d*3+side*11;
      const off=side*(l.width*.5+4.2+rand01(j)*3.4);
      objects.push({type:rand01(j+5)>.21?'tree':'bush',x:from[0]+dx*d/len+nx*off,y:from[1]+dy*d/len+ny*off,size:.78+rand01(j+6)*.5,hue:rand01(j+15)});
    }
  }
 });
 // School warehouses outside the driving lane, distant backdrop only.
 for(let i=0;i<4;i++){
  const side=i%2?1:-1;
  objects.push({type:'building',x:side*(19+(i%2)*5),y:-35+i*7,w:6+i%2*2,d:5,h:3.8+i%3*1.2,seed:i});
 }
 courseScenery.cache={id,objects};return objects;
}
function shadow(P,x,y,rx,ry,alpha=.16){
 const s=P(x,y,roadElevation(y));if(!s)return;
 ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#10352f';ctx.beginPath();ctx.ellipse(s.x,s.y,Math.min(200,rx*s.scale),Math.min(32,ry*s.scale),0,0,Math.PI*2);ctx.fill();ctx.restore();
}
function tree(P,o){
 const h=(o.type==='tree'?4.8:1.5)*o.size,foot=P(o.x,o.y,roadElevation(o.y)),top=P(o.x,o.y,roadElevation(o.y)+h);
 if(!foot||!top)return;const spread=(o.type==='tree'?1.65:1.25)*o.size*foot.scale;
 if(spread<1||spread>450)return;
 shadow(P,o.x+.6,o.y+.6,o.size*1.7,o.size*.68);
 if(o.type==='tree'){
  const trunk=P(o.x,o.y,roadElevation(o.y)+h*.41);worldLine(P,[o.x,o.y,roadElevation(o.y)],[o.x,o.y,roadElevation(o.y)+h*.66],'#6d5540',Math.max(2,foot.scale*.23));
 }
 const col=o.hue>.5?['#245f4d','#408969','#77bd78']:['#286b50','#4a965f','#8cc17c'];
 const centers=o.type==='tree'?[.59,.74,.86]:[.48,.63];
 centers.forEach((at,i)=>{
  const p=P(o.x+(i===1?-.2:.18),o.y,roadElevation(o.y)+h*at);if(!p)return;
  const rr=spread*(o.type==='tree'?(.68+.2*(i===0?1:0)):1.0);
  const g=ctx.createRadialGradient(p.x-rr*.34,p.y-rr*.34,Math.max(.2,rr*.05),p.x,p.y,Math.max(1,rr));
  g.addColorStop(0,col[2]);g.addColorStop(.4,col[1]);g.addColorStop(1,col[0]);ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(p.x,p.y,rr,rr*.77,0,0,Math.PI*2);ctx.fill();
 });
}
function building(P,o){
 const x=o.x,y=o.y,w=o.w,d=o.d,h=o.h;
 const z=roadElevation(y),lo=[ [x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z] ];
 const hi=lo.map(v=>[v[0],v[1],z+h]);
 polyWorld(P,[lo[0],lo[1],hi[1],hi[0]],'#ced9db','#7795a1',.7);
 polyWorld(P,[lo[1],lo[2],hi[2],hi[1]],'#93aebb','#7896ab',.7);
 polyWorld(P,[lo[2],lo[3],hi[3],hi[2]],'#c2d5d9','#7b9ab0',.7);
 polyWorld(P,hi,'#506d82');
 for(let i=0;i<3;i++){
   const xx=x-w/2+w*(.2+.3*i);
   polyWorld(P,[[xx,y+d/2+.03,z+h*.35],[xx+w*.13,y+d/2+.03,z+h*.35],[xx+w*.13,y+d/2+.03,z+h*.70],[xx,y+d/2+.03,z+h*.70]],'#3f7698','#e3f6ff',.4);
 }
}
function drawScenery(P){
 const objects=courseScenery().slice();
 objects.sort((a,b)=>P.depth(b.x,b.y)-P.depth(a.x,a.y));
 for(const item of objects){const d=P.depth(item.x,item.y);if(d<P.near||d>95)continue;if(item.type==='building')building(P,item);else tree(P,item);}
}
function drawBoundaryPosts(P){
 const l=lesson();
 l.points.slice(1).forEach((b,i)=>{
   const a=l.points[i],dx=b[0]-a[0],dy=b[1]-a[1],len=hypot(dx,dy)||1,n=[-dy/len,dx/len];
   for(let d=2;d<len;d+=7.5){
      const x=a[0]+dx*d/len,y=a[1]+dy*d/len,z=roadElevation(y);
      for(const side of [-1,1]){
        const xx=x+n[0]*side*(l.width*.5+2.3),yy=y+n[1]*side*(l.width*.5+2.3);
        const low=P(xx,yy,z),high=P(xx,yy,z+.84);if(!low||!high)continue;
        const thick=clamp(high.scale*.12,1,8);
        line(low,high,'#f4f0df',thick);const cap=P(xx,yy,z+.84),band=P(xx,yy,z+.68);
        if(cap&&band)line(cap,band,'#e35242',thick*1.25);
      }
   }
 });
}
function bandVertices(a,b,halfWidth,zfn){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
 const p=(pt,side)=>[pt[0]+nx*side,pt[1]+ny*side,zfn(pt[1])];
 return [p(a,-halfWidth),p(a,halfWidth),p(b,halfWidth),p(b,-halfWidth)];
}
function roadSegment(P,a,b,width,i){
 const bottom=(y)=>roadElevation(y);
 polyWorld(P,bandVertices(a,b,(width+1.65)/2,y=>bottom(y)-.09),'#c1c8bf');
 polyWorld(P,bandVertices(a,b,(width+.55)/2,y=>bottom(y)-.018),'#75828a');
 polyWorld(P,bandVertices(a,b,width/2,bottom),i%2?'#404e5b':'#43515d');
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,n=[-dy/len,dx/len];
 const edge=(pt,s)=>[pt[0]+n[0]*s*width/2,pt[1]+n[1]*s*width/2,bottom(pt[1])+.035];
 for(const side of [-1,1]){
    worldLine(P,edge(a,side),edge(b,side),'#edf5ee',2.4);
    // narrow reflective paint glow outlines the real road boundary, not a fictitious lane centre.
    worldLine(P,edge(a,side*.985),edge(b,side*.985),'#fff9dd36',.8);
 }
 if(lesson().tag==='dat'&&i%4<2){worldLine(P,[a[0],a[1],bottom(a[1])+.06],[b[0],b[1],bottom(b[1])+.06],'#edf1ef',1.6);}
 if(i%3===0){
   const mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];
   for(const v of [-1.8,1.3]){
    const aa=[mid[0]+n[0]*v-.18,mid[1]+n[1]*v-.1,bottom(mid[1])+.02];
    const bb=[mid[0]+n[0]*v+.19,mid[1]+n[1]*v+.1,bottom(mid[1])+.02];
    worldLine(P,aa,bb,'#84929a22',.8);
   }
 }
}
function drawRoad(P,mapView){
 const l=lesson(),segments=[];
 for(let i=1;i<l.points.length;i++){
  const a=l.points[i-1],b=l.points[i],len=hypot(b[0]-a[0],b[1]-a[1]),steps=Math.max(1,Math.ceil(len/3));
  for(let k=0;k<steps;k++){
    const lerp=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    const p=lerp(k/steps),q=lerp((k+1)/steps);segments.push({a:p,b:q,dist:P.depth?P.depth((p[0]+q[0])/2,(p[1]+q[1])/2):0,index:i*50+k});
  }
 }
 if(P.depth)segments.sort((a,b)=>b.dist-a.dist);
 else segments.sort((a,b)=>a.index-b.index);
 segments.forEach(({a,b,index})=>roadSegment(P,a,b,l.width,index));
 drawExerciseMarkings(P,mapView);
}
function groundRect(P,x0,y0,x1,y1,fill,stroke,width=1,zfn=roadElevation){
 polyWorld(P,[[x0,y0,zfn(y0)+.07],[x1,y0,zfn(y0)+.07],[x1,y1,zfn(y1)+.07],[x0,y1,zfn(y1)+.07]],fill,stroke,width);
}
function crossLine(P,y,w,color='#f9faff',thickness=.26){groundRect(P,-w/2,y+thickness/2,w/2,y-thickness/2,color);}
function drawExerciseMarkings(P,mapView){
 const l=lesson(),tag=l.tag,w=l.width;
 // Sa hình has no generic yellow dashed centre-line: show only each exercise's marks.
 if(l.stop!==undefined)crossLine(P,l.stop,w*.92,'#f8fcff',.26);
 if(tag==='start'){
  crossLine(P,20,w*.92,'#ffcd66',.35);
 }else if(tag==='finish'){
  crossLine(P,-18,w*.92,'#ffcd66',.33);
 }else if(tag==='walk'){
  for(let k=0;k<6;k++)groundRect(P,-3.4+k*1.15,1.9,-2.88+k*1.15,-1.6,'#eef7f8');
 }else if(tag==='hill'){
  // Raised ramp trapezoid uses the same elevation function as the camera.
  for(const yy of [4,-1,-5,-10])crossLine(P,yy,w*.88,yy===4?'#e7eeec':'#e1f1e985',.14);
  const p=roadElevation(-1);
  for(const side of [-1,1]){
    const x=side*w*.5;
    polyWorld(P,[[x,4,0],[x,-1,0],[x,-1,p],[x,4,0]],'#959d9f','#cfd8d7',.7);
    polyWorld(P,[[x,-5,0],[x,-10,0],[x,-10,0],[x,-5,p]],'#657481','#e9f4ef',.7);
  }
 }else if(tag==='corner'){
  // Two clear wheel-track guides; never render an arbitrary lane divider.
  for(const x of [-1,1])groundRect(P,x-.16,10,x+.16,-1.3,'#f5f8ee');
 }else if(tag==='light'){
  // Traffic signal drawn separately, stop line follows the configured rule point.
  for(let i=0;i<3;i++)groundRect(P,-3.2+i*2.2,-1.1,-2.3+i*2.2,-3.9,'#f8fbfc');
 }else if(tag==='bay'||tag==='parallel'){
  const p=l.park;
  groundRect(P,p.x-p.w/2,p.y-p.h/2,p.x+p.w/2,p.y+p.h/2,'#5ce0ba2a','#ffe789',mapView?2:2.6,()=>0);
  // Park-space perimeter and stop gate stay legible in the overhead view.
 }else if(tag==='rail'){
  // Two parallel steel rails across the road, sleepers along track (not road-centre dashes).
  for(let x=-w*.65;x<=w*.65;x+=.9){groundRect(P,x-.13,-1.6,x+.13,1.6,'#65503f');}
  for(const y of [-1.25,1.25]){
    groundRect(P,-w*.60,y-.11,w*.60,y+.11,'#47515a');
    crossLine(P,y,w*1.18,'#c2d4db',.07);
  }
 }else if(tag==='speed'){
  crossLine(P,8,w*.88,'#e4f4ff',.21);
  crossLine(P,-7,w*.88,'#e4f4ff',.21);
 }
 if(tag==='curve'){
  // Slightly brighter corner edges indicate road boundaries, not a centre marking.
 }
}
function drawPaintedWord(P,text,x,y,size){
 const at=P(x,y,roadElevation(y)+.08);if(!at||at.scale<4)return;
 ctx.save();ctx.translate(at.x,at.y);ctx.scale(1,clamp(at.scale/18,.28,.68));ctx.textAlign='center';ctx.fillStyle='#ffffffa6';
 ctx.font=`800 ${Math.min(26,Math.max(10,at.scale*size*.48))}px system-ui`;ctx.fillText(text,0,0);ctx.restore();
}
function signboard(P,x,y,text,sub='',color='#17629b'){
 const base=P(x,y,0),top=P(x,y,2.85);if(!base||!top)return;
 const scale=top.scale,sw=clamp(scale*2.65,18,210),sh=clamp(scale*1.25,12,103);
 if(top.x< -sw*1.5||top.x>canvas.clientWidth+sw*1.5)return;
 line(base,top,'#d6e0e0',clamp(scale*.14,1,5));
 const xx=top.x-sw/2,yy=top.y-sh;
 ctx.fillStyle='#021c2c55';ctx.fillRect(xx+3,yy+4,sw,sh);
 ctx.fillStyle=color;ctx.fillRect(xx,yy,sw,sh);
 ctx.strokeStyle='#e1eff7';ctx.lineWidth=clamp(scale*.09,.8,2.5);ctx.strokeRect(xx+2,yy+2,sw-4,sh-4);
 if(sw<33)return;
 ctx.textAlign='center';ctx.fillStyle='#f7feff';ctx.font=`800 ${clamp(sw/8,7,15)}px system-ui`;
 ctx.fillText(text,top.x,yy+sh*.45,sw-5);
 if(sub&&sw>50){ctx.font=`700 ${clamp(sw/11,6,10)}px system-ui`;ctx.fillStyle='#cdefff';ctx.fillText(sub,top.x,yy+sh*.74,sw-6);}
}
function trafficSignal(P,x,y){
 const base=P(x,y,0),top=P(x,y,4.9);if(!base||!top)return;
 line(base,top,'#b4bfc4',clamp(top.scale*.16,1,5));
 const unit=clamp(top.scale*.44,3,15),bw=unit*1.7,bh=unit*4.7;
 ctx.fillStyle='#151e2e';ctx.fillRect(top.x-bw*.5,top.y-bh,bw,bh);
 ctx.strokeStyle='#a5b3ba';ctx.lineWidth=1;ctx.strokeRect(top.x-bw*.5,top.y-bh,bw,bh);
 const colors=['#5d2833','#565023','#265340'];
 const active=currentTrafficGreen()?2:0;
 for(let j=0;j<3;j++){
  const cx=top.x,cy=top.y-bh+(j+.5)*bh/3;
  ctx.beginPath();ctx.arc(cx,cy,unit*.54,0,Math.PI*2);
  ctx.fillStyle=j===active?(j===0?'#ff4b48':'#49e993'):colors[j];ctx.fill();
  if(j===active){ctx.strokeStyle=j===0?'#ff5e5690':'#5aeba890';ctx.lineWidth=unit*.35;ctx.stroke();}
 }
}
function cone(P,x,y,z=0){
 const b=P(x,y,z),t=P(x,y,z+.75);if(!b||!t)return;
 const h=b.y-t.y,w=clamp(b.scale*.36,2,25);
 if(h<2)return;
 polyWorld(P,[[x-.48,y-.27,z],[x+.48,y-.27,z],[x+.48,y+.27,z],[x-.48,y+.27,z]],'#1b2e38c4');
 drawPolygon([{x:b.x-w/2,y:b.y},{x:b.x+w/2,y:b.y},{x:t.x,y:t.y}], '#f77b32','#ffac67',.8);
 line({x:b.x-w*.28,y:b.y-h*.34},{x:b.x+w*.28,y:b.y-h*.34},'#fff7ef',Math.max(1,w*.2));
}
function drawCourseObjects(P){
 const l=lesson(),p=l.points,tag=l.tag;
 const origin=p[0],next=p[1],dx=next[0]-origin[0],dy=next[1]-origin[1],len=hypot(dx,dy)||1,n=[-dy/len,dx/len];
 const sx=origin[0]+dx*.30+n[0]*(l.width*.5+3.5),sy=origin[1]+dy*.30+n[1]*(l.width*.5+3.5);
 signboard(P,sx,sy,'BÀI '+String(lessonId()+1).padStart(2,'0'),names[lessonId()][2].toUpperCase());
 if(tag==='dat')signboard(P,l.width*.5+3,40,'ĐƯỜNG TRƯỜNG','DAT MÔ PHỎNG', '#176b8a');
 if(tag==='walk')signboard(P,l.width*.5+3,1.5,'NGƯỜI ĐI BỘ','QUAN SÁT', '#176b8a');
 if(tag==='hill')signboard(P,l.width*.5+2.8,6,'DỐC CẦU','DỪNG ĐÚNG VẠCH','#996524');
 if(tag==='light')trafficSignal(P,l.width*.5+2.5,6.3);
 if(tag==='rail')signboard(P,l.width*.5+2,6.5,'ĐƯỜNG SẮT','DỪNG QUAN SÁT','#9b662d');
 if(tag==='bay'||tag==='parallel'){
   const q=l.park;
   const corners=[[q.x-q.w/2,q.y-q.h/2],[q.x+q.w/2,q.y-q.h/2],[q.x+q.w/2,q.y+q.h/2],[q.x-q.w/2,q.y+q.h/2]];
   corners.forEach(pt=>cone(P,pt[0],pt[1]));
   signboard(P,q.x+q.w/2+2,q.y,'Ô ĐỖ XE','GIỮ ĐÚNG VẠCH','#156868');
 }
 if(tag==='corner'||tag==='curve'){
   p.slice(1,-1).forEach((v,i)=>{
     const s=i%2?-1:1;
     cone(P,v[0]+s*(l.width/2+1),v[1]);
   });
 }
 if(tag==='start'||tag==='finish'){
   const y=tag==='start'?20:-18;
   for(const x of [-l.width*.5-1.1,l.width*.5+1.1]){
    const a=P(x,y,0),b=P(x,y,2.1);if(a&&b){line(a,b,'#dfeef4',Math.max(2,b.scale*.13));}
   }
 }
}
function drawCarWorld(P){
 const c=state.car,truck=state.cls==='c1',w=truck?2.34:1.94,L=carLength();
 const f=[Math.sin(c.heading),-Math.cos(c.heading)],r=[Math.cos(c.heading),Math.sin(c.heading)];
 const base=roadElevation(c.y);
 const point=(front,side,z)=>[c.x+f[0]*front+r[0]*side,c.y+f[1]*front+r[1]*side,base+z];
 const body=(front,side,z)=>point(front*L,side*w,z);
 const ground=P(c.x,c.y,base-.07);
 if(ground){ctx.fillStyle='#071f2b77';ctx.beginPath();ctx.ellipse(ground.x,ground.y,Math.min(170,L*.66*ground.scale),Math.min(38,w*.55*ground.scale),0,0,Math.PI*2);ctx.fill();}
 const shell=[body(-.50,-.5,.36),body(-.50,.5,.36),body(.50,.5,.52),body(.50,-.5,.52)];
 polyWorld(P,shell,'#e9f5fb','#849eb1',2);
 if(truck){
  // C1 represents a light truck, NOT a passenger van. Cargo compartment is
  // behind the separate cab; high rectangular rear door with proper depth.
  const back=-.47,boxFront=.105,half=.48,bottom=.74,top=2.83;
  const a=body(back,-half,bottom),b=body(back,half,bottom),cc=body(back,half,top),d=body(back,-half,top);
  const e=body(boxFront,-half,bottom),f2=body(boxFront,half,bottom),g=body(boxFront,half,top),h=body(boxFront,-half,top);
  polyWorld(P,[b,f2,g,cc],'#d1dee8','#839caa',1.7);
  polyWorld(P,[a,e,h,d],'#eaf3f7','#8ca5b8',1.7);
  polyWorld(P,[d,cc,g,h],'#f9ffff','#a9c3d4',1.5);
  polyWorld(P,[a,b,cc,d],'#f0f5f5','#769ab0',2);
  // Twin cargo doors, latches and edge hinges are anchored to rear face.
  worldLine(P,body(back,0,bottom+.06),body(back,0,top-.05),'#6c92a8',1.8);
  for(const side of [-1,1]){
    const x=side*.425;
    worldLine(P,body(back,x,1.02),body(back,x,top-.08),'#9caebc',1.3);
    worldLine(P,body(back,side*.03,1.42),body(back,side*.03,1.84),'#5c829e',2);
  }
  worldLine(P,body(back,-half,top-.28),body(back,half,top-.28),'#2778ba',Math.max(2,Math.min(6,P.depth?4:3)));
  // Blue rear bumper and two reflectors, seen from behind.
  polyWorld(P,[body(-.51,-.5,.37),body(-.51,.5,.37),body(-.51,.5,.59),body(-.51,-.5,.59)],'#376f96','#b1d9eb',1);
 }else{
  // Compact Vietnamese training car: bonnet + sloped glazing + rear window.
  const upper=[body(-.30,-.44,1.50),body(-.30,.44,1.50),body(.15,.43,1.50),body(.15,-.43,1.50)];
  polyWorld(P,[body(-.49,-.5,.45),body(-.49,.5,.45),body(-.30,.43,1.13),body(-.30,-.43,1.13)],'#d6e7f2');
  polyWorld(P,[body(-.30,-.44,1.13),body(-.30,.44,1.13),upper[1],upper[0]],'#5484a7','#dbf3ff',1.2);
  polyWorld(P,[body(-.30,.44,1.13),body(.15,.43,1.13),upper[2],upper[1]],'#7dacc3','#e4f1f7',1.1);
  polyWorld(P,[body(-.30,-.44,1.13),body(.15,-.43,1.13),upper[3],upper[0]],'#b2d0dc','#e4f1f7',1.1);
  polyWorld(P,upper,'#f8feff','#b5cadd',1.3);
  polyWorld(P,[body(.15,-.43,1.13),body(.15,.43,1.13),body(.49,.5,.55),body(.49,-.5,.55)],'#dcecf3','#8daac4',1.3);
  // Front windshield tinted, not a duplicate side window.
  polyWorld(P,[upper[3],upper[2],body(.15,.43,1.13),body(.15,-.43,1.13)],'#517c98','#a6d9f0',1.1);
 }
 // Reflectors and plate mounted on the true rear, closest to trailing camera.
 for(const side of [-1,1]){
   const p=P(...body(-.51,side*.39,.52));if(!p)continue;
   const bright=(c.signal===(side===-1?'left':'right')||c.hazard)&&Math.floor(state.elapsed*3)%2===0;
   const radius=clamp(p.scale*.13,2,8);
   ctx.fillStyle=bright?'#ffd05d':'#fa5262';ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();
 }
 const plate=P(...body(-.52,0,.52));if(plate&&plate.scale>3){
  const h=clamp(plate.scale*.36,6,15);ctx.fillStyle='#fdfdff';ctx.fillRect(plate.x-h,plate.y-h*.5,h*2,h);
  ctx.fillStyle='#1c4f78';ctx.font=`bold ${Math.max(5,h*.58)}px system-ui`;ctx.textAlign='center';ctx.fillText('QT',plate.x,plate.y+h*.23);
 }
}
function drawCockpit(W,H){
 const Hs=H,compact=H<270,s=clamp(Math.min(W/430,H/320),.53,1.2);
 // Windshield border and mirror are *inside* the car. Driver's seat is on LEFT.
 const dashY=H*.835;
 const dash=ctx.createLinearGradient(0,dashY-24,0,H);dash.addColorStop(0,'#263850');dash.addColorStop(.3,'#122136');dash.addColorStop(1,'#07121f');
 ctx.fillStyle=dash;ctx.beginPath();ctx.moveTo(0,dashY+H*.008);ctx.quadraticCurveTo(W*.46,dashY-H*.085,W,dashY+H*.015);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
 // A-pillars and tinted windshield seal. Thin enough to keep stop lines visible.
 ctx.fillStyle='#203047';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W*.048,0);ctx.lineTo(W*.018,H*.70);ctx.lineTo(0,H*.86);ctx.fill();
 ctx.beginPath();ctx.moveTo(W*.955,0);ctx.lineTo(W,0);ctx.lineTo(W,H*.86);ctx.lineTo(W*.985,H*.70);ctx.fill();
 ctx.fillStyle='#a4cce622';ctx.beginPath();ctx.moveTo(W*.06,H*.06);ctx.lineTo(W*.18,H*.06);ctx.lineTo(W*.12,H*.4);ctx.lineTo(W*.055,H*.43);ctx.fill();
 // Rearview mirror: visible on windshield, never misrepresented as right-side steering.
 const mw=clamp(W*.2,55,145),mh=clamp(H*.09,12,32),mx=W*.49-mw*.5,my=Math.max(10,H*.028);
 ctx.fillStyle='#111d2d';ctx.fillRect(W*.486,0,W*.012,my+3);
 ctx.fillStyle='#263a53';ctx.beginPath();ctx.roundRect(mx,my,mw,mh,clamp(mh*.25,3,8));ctx.fill();
 const mg=ctx.createLinearGradient(0,my,0,my+mh);mg.addColorStop(0,'#a5d3e2');mg.addColorStop(1,'#4d8db7');ctx.fillStyle=mg;ctx.fillRect(mx+4,my+4,mw-8,mh-8);
 ctx.fillStyle='#ffffff49';ctx.fillRect(mx+mw*.15,my+5,mw*.18,Math.max(2,mh-10));
 // Left instrument binnacle, right dashboard trim, small active signal lamps.
 ctx.fillStyle='#0c1726';ctx.beginPath();ctx.ellipse(W*.26,H*.91,W*.18,H*.21,0,Math.PI,Math.PI*2);ctx.fill();
 const cx=W*.26,cy=H*.965,r=clamp(H*.19,20,74)*s;
 ctx.save();ctx.translate(cx,cy);ctx.rotate(state.steer*.92);
 ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.strokeStyle='#293e59';ctx.lineWidth=clamp(r*.22,6,13);ctx.stroke();
 ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.strokeStyle='#8798a8';ctx.lineWidth=1.7;ctx.stroke();
 for(const a of [-Math.PI*.12,Math.PI*.82,Math.PI*1.65]){ctx.save();ctx.rotate(a);ctx.fillStyle='#344b64';ctx.fillRect(0,-Math.max(3,r*.11),r*.8,Math.max(6,r*.2));ctx.restore();}
 ctx.beginPath();ctx.arc(0,0,r*.34,0,Math.PI*2);ctx.fillStyle='#5c7999';ctx.fill();ctx.fillStyle='#f1fbff';ctx.font=`900 ${Math.max(9,r*.32)}px system-ui`;ctx.textAlign='center';ctx.fillText('QT',0,r*.11);ctx.restore();
 const meterW=W*.15,meterH=clamp(H*.10,14,35),meterX=W*.63,meterY=H*.85;
 ctx.fillStyle='#0c1724';ctx.beginPath();ctx.roundRect(meterX,meterY,meterW,meterH,5);ctx.fill();
 ctx.fillStyle='#71d9f3';ctx.font=`800 ${clamp(H*.046,10,17)}px system-ui`;ctx.textAlign='center';
 ctx.fillText(`${Math.round(Math.abs(state.car.speed)*3.6)} km/h`,meterX+meterW/2,meterY+meterH*.68,meterW-5);
 ctx.fillStyle=state.car.signal==='left'?'#66f5c1':'#345c67';ctx.font=`bold ${clamp(H*.055,11,22)}px system-ui`;ctx.fillText('◀',W*.56,H*.925);
 ctx.fillStyle=state.car.signal==='right'?'#66f5c1':'#345c67';ctx.fillText('▶',W*.86,H*.925);
}
function drawTopdown(W,H){
 const c=state.car,scale=clamp(Math.min(W/58,H/68),4.2,12.5);
 const P=(x,y,z=0)=>({x:W*.5+(x-c.x)*scale,y:H*.56+(y-c.y)*scale-z*scale,depth:100,scale});
 const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#5b906b');g.addColorStop(1,'#3e785a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='#ffffff12';ctx.lineWidth=1;
 for(let x=-100;x<=100;x+=5){line(P(x,-100),P(x,100),'#effff010',1);line(P(-100,x),P(100,x),'#effff010',1);}
 drawRoad(P,true);
 const f=[Math.sin(c.heading),-Math.cos(c.heading)],r=[Math.cos(c.heading),Math.sin(c.heading)],L=carLength(),width=state.cls==='c1'?2.3:1.95;
 const at=(forward,side)=>P(c.x+f[0]*forward+r[0]*side,c.y+f[1]*forward+r[1]*side,0);
 drawPolygon([at(-L*.5,-width*.5),at(-L*.5,width*.5),at(L*.5,width*.5),at(L*.5,-width*.5)],'#f4fbff','#367bd5',2);
 drawPolygon([at(-L*.22,-width*.42),at(-L*.22,width*.42),at(L*.13,width*.42),at(L*.13,-width*.42)],'#4a94c9');
 drawPolygon([at(L*.5,-width*.34),at(L*.5,width*.34),at(L*.66,0)],'#5aefe0');
 ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='900 11px system-ui';ctx.fillText('XE',W*.5,H*.56+3);
}
function drawScene3D(W,H){
 drawAtmosphere(W,H);
 const P=makeProjection(W,H);
 drawScenery(P);
 drawRoad(P,false);
 drawBoundaryPosts(P);
 drawCourseObjects(P);
 if(state.view===1)drawCockpit(W,H);else drawCarWorld(P);
 // Transparency gradient softens near-camera aliasing without hiding lane boundaries.
 const haze=ctx.createLinearGradient(0,H*.30,0,H*.62);
 haze.addColorStop(0,'#e4f4ff0c');haze.addColorStop(1,'#ffffff00');ctx.fillStyle=haze;ctx.fillRect(0,H*.30,W,H*.32);
}
function render(){const {W,H}=resize();if(W<2||H<2)return;ctx.save();if(state.view===2)drawTopdown(W,H);else drawScene3D(W,H);ctx.restore();}
function isPhone(){return window.matchMedia('(max-width: 1024px)').matches;}
function setDrawer(open){const drawer=$('lessonDrawer'),backdrop=$('drawerBackdrop');if(!drawer||!backdrop)return;drawer.classList.toggle('open',open);backdrop.classList.toggle('show',open);document.body.classList.toggle('drawerOpen',open);}
function frame(now){const dt=Math.min((now-lastFrame)/1000||0,.05);lastFrame=now;step(dt);render();if(now-displayTick>120){updateStats();displayTick=now;}requestAnimationFrame(frame);}
function bindHold(id,key){const el=$(id);const on=e=>{if(e)e.preventDefault();state.keys[key]=true;if(key==='left'||key==='right')state.steerTarget=clamp(state.steerTarget+(key==='left'?-.032:.032),-1,1);el.classList.add('pressed');};const off=e=>{if(e)e.preventDefault();state.keys[key]=false;el.classList.remove('pressed');};el.addEventListener('pointerdown',e=>{on(e);try{el.setPointerCapture(e.pointerId)}catch(_){}});['pointerup','pointercancel','lostpointercapture'].forEach(event=>el.addEventListener(event,off));}
bindHold('leftBtn','left');bindHold('rightBtn','right');bindHold('gasBtn','gas');bindHold('brakeBtn','brake');
const keyMap={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowUp:'gas',w:'gas',W:'gas',ArrowDown:'brake',' ':'brake',s:'brake',S:'brake'};
window.addEventListener('keydown',e=>{if(e.key in keyMap){if(e.code!=='Space'&&e.target instanceof HTMLInputElement)return;e.preventDefault();state.keys[keyMap[e.key]]=true;return;}if(e.repeat)return;switch(e.key.toLowerCase()){case 'q':signal('left');break;case 'e':signal('right');break;case 'b':toggleBelt();break;case 'h':hazard();break;case 'v':state.view=(state.view+1)%3;updateUI();break;case 'r':if(Math.abs(state.car.speed)<.35)setGear('R');break;case '1':if(Math.abs(state.car.speed)<.35)setGear('1');break;case '2':if(Math.abs(state.car.speed)<.35)setGear('2');break;}});
window.addEventListener('keyup',e=>{if(e.key in keyMap){e.preventDefault();state.keys[keyMap[e.key]]=false;}});
window.addEventListener('blur',()=>{state.keys={};document.querySelectorAll('.pressed').forEach(e=>e.classList.remove('pressed'));});
$('practiceBtn').addEventListener('click',()=>{setMode('practice');if(isPhone())setDrawer(false);});$('examBtn').addEventListener('click',()=>{setMode('exam');if(isPhone())setDrawer(false);});$('datBtn')?.addEventListener('click',()=>{setMode('dat');if(isPhone())setDrawer(false);});
document.querySelectorAll('[data-class]').forEach(b=>b.addEventListener('click',()=>{pickClass(b.dataset.class);if(isPhone())setDrawer(false);}));
$('viewBtn').addEventListener('click',()=>{state.view=(state.view+1)%3;updateUI();});
$('restartBtn').addEventListener('click',()=>{if(state.mode==='exam')resetAll();else{state.score=100;state.errors=[];state.distance=0;state.gameOver=false;initCar();}announce('Bài luyện đã khởi động lại.');});
$('nextBtn').addEventListener('click',nextStage);$('pauseBtn').addEventListener('click',()=>{state.paused=!state.paused;$('pauseBtn').textContent=state.paused?'Tiếp tục ▶':'Tạm dừng Ⅱ';});
$('guideToggle').addEventListener('click',()=>{state.guides=!state.guides;$('guideToggle').textContent=state.guides?'Ẩn hướng dẫn':'Hiện hướng dẫn';});
$('beltBtn').addEventListener('click',toggleBelt);$('signalLeft').addEventListener('click',()=>signal('left'));$('signalRight').addEventListener('click',()=>signal('right'));$('hazardBtn').addEventListener('click',hazard);
$('lessonDrawerBtn')?.addEventListener('click',()=>setDrawer(!$('lessonDrawer').classList.contains('open')));
$('drawerBackdrop')?.addEventListener('click',()=>setDrawer(false));
window.addEventListener('resize',()=>{if(!isPhone())setDrawer(false);});

// Mobile-first cockpit, left-side steering and multi-touch drag on steering wheel.
function setFocus(on){document.body.classList.toggle('focusDriving',on);$('focusBtn')?.setAttribute('aria-pressed',String(on));$('focusBtn').querySelector('.actionGlyph').textContent=on?'▤':'◫';$('focusBtn').querySelector('.actionText').textContent=on?' Thông tin':' Tập trung';$('focusBtn').setAttribute('aria-label',on?'Thoát chế độ tập trung':'Bật chế độ tập trung');}
$('focusBtn')?.addEventListener('click',()=>setFocus(!document.body.classList.contains('focusDriving')));
$('fullscreenBtn')?.addEventListener('click',async()=>{
 try {if(document.fullscreenElement){await document.exitFullscreen();}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();}else{setFocus(true);announce('Trình duyệt chưa hỗ trợ toàn màn hình. Đã bật chế độ tập trung.');}}
 catch(_){setFocus(true);announce('Không thể bật toàn màn hình trong trình duyệt này. Đã bật chế độ tập trung.');}
});
document.addEventListener('fullscreenchange',()=>{$('fullscreenBtn').textContent=document.fullscreenElement?'⛶ Thoát':'⛶';});
$('compactGuideToggle')?.addEventListener('click',()=>{const hidden=document.body.classList.toggle('guideCompactHidden');$('compactGuideToggle').textContent=hidden?'✦ Hiện hướng dẫn':'×';});
$('centerSteerBtn')?.addEventListener('click',()=>{state.steerTarget=0;announce('Đang trả lái về thẳng.');});
function resetCamera(){state.camera={yaw:0,distance:17.8,height:10.8};}
$('cameraResetBtn')?.addEventListener('click',()=>{resetCamera();announce('Đã đặt lại góc camera.');});
$('cameraPlusBtn')?.addEventListener('click',()=>{state.camera.distance=clamp(state.camera.distance-2.5,9,40);state.camera.height=clamp(state.camera.height-1.2,4,21);});
$('cameraMinusBtn')?.addEventListener('click',()=>{state.camera.distance=clamp(state.camera.distance+2.5,9,40);state.camera.height=clamp(state.camera.height+1.2,4,21);});
const cameraTouches=new Map();let cameraPinch=null;
canvas.addEventListener('pointerdown',e=>{
 if(state.view!==0)return;
 e.preventDefault();cameraTouches.set(e.pointerId,{x:e.clientX,y:e.clientY});
 try{canvas.setPointerCapture(e.pointerId);}catch(_){}
 if(cameraTouches.size>=2){const pts=[...cameraTouches.values()];cameraPinch={distance:hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y),zoom:state.camera.distance,height:state.camera.height};}
});
canvas.addEventListener('pointermove',e=>{
 if(state.view!==0||!cameraTouches.has(e.pointerId))return;
 e.preventDefault();const before=cameraTouches.get(e.pointerId);cameraTouches.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(cameraTouches.size>1&&cameraPinch){
  const pts=[...cameraTouches.values()],now=hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)||1,ratio=cameraPinch.distance/now;
  state.camera.distance=clamp(cameraPinch.zoom*ratio,9,40);state.camera.height=clamp(cameraPinch.height*ratio,4,21);
 }else{
  state.camera.yaw=clamp(state.camera.yaw+(e.clientX-before.x)*.006,-2.7,2.7);
  state.camera.height=clamp(state.camera.height+(e.clientY-before.y)*.035,4,21);
 }
});
for(const eventName of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(eventName,e=>{cameraTouches.delete(e.pointerId);cameraPinch=null;});
canvas.addEventListener('wheel',e=>{if(state.view!==0)return;e.preventDefault();const d=e.deltaY>0?1.15:.87;state.camera.distance=clamp(state.camera.distance*d,9,40);state.camera.height=clamp(state.camera.height*d,4,21);},{passive:false});
const steeringWheel=$('wheel');let startPoint=null;
steeringWheel.setAttribute('role','slider');steeringWheel.setAttribute('aria-label','Xoay vô lăng sang trái hoặc phải');steeringWheel.setAttribute('aria-valuemin','-100');steeringWheel.setAttribute('aria-valuemax','100');steeringWheel.setAttribute('tabindex','0');
function pointerAngle(e){const b=steeringWheel.getBoundingClientRect();return Math.atan2(e.clientY-(b.top+b.height/2),e.clientX-(b.left+b.width/2));}
steeringWheel.addEventListener('pointerdown',e=>{e.preventDefault();startPoint={angle:pointerAngle(e),id:e.pointerId};try{steeringWheel.setPointerCapture(e.pointerId);}catch(_){}});
steeringWheel.addEventListener('pointermove',e=>{
 if(!startPoint||e.pointerId!==startPoint.id)return;
 e.preventDefault();const angle=pointerAngle(e);let delta=angle-startPoint.angle;
 if(delta>Math.PI)delta-=2*Math.PI;
 if(delta<-Math.PI)delta+=2*Math.PI;
 // Rotating one and a half turns reaches full lock; letting go retains the steering position.
 state.steerTarget=clamp(state.steerTarget+delta/(Math.PI*3),-1,1);startPoint.angle=angle;
});
function releaseWheel(){startPoint=null;}
for(const event of ['pointerup','pointercancel','lostpointercapture'])steeringWheel.addEventListener(event,releaseWheel);
window.addEventListener('blur',releaseWheel);

// For classroom troubleshooting and automated QA, read-only public diagnostics.
window.QuyetThangSaHinhDebug=Object.freeze({getState:()=>({cls:state.cls,mode:state.mode,lesson:state.lesson,view:state.view,gear:state.car?.gear,belt:state.car?.belt,signal:state.car?.signal,steer:state.steer,steerTarget:state.steerTarget,camera:{...state.camera},score:state.score,errors:state.errors.length,position:state.car?{x:state.car.x,y:state.car.y,heading:state.car.heading,speed:state.car.speed}:null,finished:state.finished}),lessonCount:()=>list().length});
resetAll();if(isPhone()){state.view=0;updateUI();}requestAnimationFrame(frame);if(!isPhone())announce('Mời chọn bài, cài dây an toàn và bắt đầu luyện lái.');
})();