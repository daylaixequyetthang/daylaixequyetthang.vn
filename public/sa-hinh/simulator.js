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
 ['Kết thúc','Bật xi nhan phải và lái qua vạch đích.','Về đích']
];
const route = (points,width=7,extra={}) => ({points,width,...extra});
const maps = [
 route([[0,28],[0,17],[0,0],[0,-23]],8,{tag:'start'}),
 route([[0,28],[0,11],[0,-2],[0,-24]],8,{stop:7,tag:'walk'}),
 route([[0,28],[0,11],[0,-2],[0,-24]],8,{stop:6,tag:'hill'}),
 route([[0,29],[0,10],[0,-2],[19,-2],[19,-24]],5.8,{tag:'corner'}),
 route([[0,29],[0,11],[0,-5],[0,-25]],8,{stop:8,tag:'light'}),
 route([[-11,31],[-11,20],[7,12],[10,1],[-8,-11],[-9,-29]],6.8,{tag:'curve'}),
 route([[0,28],[0,12],[0,-6]],9,{park:{x:8,y:11,w:4.6,h:9.5},tag:'bay'}),
 route([[0,28],[0,14],[0,-7]],9,{park:{x:7,y:8,w:4.2,h:7.8},tag:'parallel'}),
 route([[0,28],[0,12],[0,-1],[0,-25]],8,{stop:6,tag:'rail'}),
 route([[0,29],[0,12],[0,-2],[0,-27]],9,{tag:'speed'}),
 route([[0,29],[0,12],[0,-2],[0,-25]],8,{tag:'finish'})
];
const state = {cls:'bat',mode:'practice',lesson:0,view:0,guides:true,score:100,elapsed:0,distance:0,errors:[],done:new Set(),gameOver:false,paused:false,finished:false,keys:{},steer:0,car:null,stageElapsed:0,stopped:false,stopChecked:false,reverseUsed:false,maxSpeed:0,shifted:false,edgeActive:false,overSpeed:0,hazard:null,noticeTimer:0,progress:0};
const classes={bat:{name:'HẠNG B TỰ ĐỘNG',gears:['P','R','N','D'],time:1080,top:24,length:4.4},bmt:{name:'HẠNG B SỐ SÀN',gears:['N','R','1','2'],time:1080,top:24,length:4.4},c1:{name:'HẠNG C1',gears:['N','R','1','2'],time:1200,top:20,length:6.0}};
const list=()=>state.cls==='c1'?[0,1,2,3,4,5,6,8,9,10]:names.map((_,i)=>i);
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
 state.steer=0;state.stageElapsed=0;state.stopped=false;state.stopChecked=false;state.reverseUsed=false;state.maxSpeed=0;state.shifted=false;state.edgeActive=false;state.overSpeed=0;state.progress=0;state.finished=false;state.keys={};state.beltPenalized=false;state.startSignalChecked=false;state.finishSignalChecked=false;state.lightChecked=false;state.warnedPark=false;state.warnedShift=false;state.warnedSpeed=false;
 $('nextBtn').disabled=true;
 updateUI();
}
function resetAll(){state.score=100;state.elapsed=0;state.distance=0;state.errors=[];state.done.clear();state.gameOver=false;state.lesson=0;state.paused=false;state.hazard=null;initCar();renderList();}
function pickClass(cls){state.cls=cls;document.querySelectorAll('[data-class]').forEach(b=>b.classList.toggle('active',b.dataset.class===cls));resetAll();}
function setMode(mode){state.mode=mode;state.guides=mode==='practice';$('practiceBtn').classList.toggle('chosen',mode==='practice');$('examBtn').classList.toggle('chosen',mode==='exam');resetAll();announce(mode==='exam'?'Thi thử theo chuỗi bài; điểm số chỉ mang tính tham khảo.':'Chế độ luyện tập: làm từng bài, có hướng dẫn.');}
function selectLesson(index){if(state.mode==='exam'){announce('Chế độ thi theo chuỗi bài: hoàn thành lần lượt từng bài.',true);return;}state.lesson=index;state.gameOver=false;initCar();renderList();}
function nextStage(){if(!state.finished && state.mode==='exam')return;if(state.lesson<list().length-1){state.lesson++;initCar();renderList();announce('Chuyển sang bài '+String(state.lesson+1).padStart(2,'0'));}else{state.gameOver=true;announce(`Hoàn tất! Kết quả mô phỏng: ${state.score}/100 điểm.`);}}
function renderList(){
 $('lessonCount').textContent=list().length+' bài';$('progressCount').textContent=state.done.size+' / '+list().length;
 $('lessonList').innerHTML=list().map((id,i)=>`<button class="lesson ${i===state.lesson?'active':''} ${state.done.has(i)?'done':''}" data-index="${i}" type="button"><span class="lessonNo">${String(i+1).padStart(2,'0')}</span><span class="lessonText"><strong>${names[id][0]}</strong><small>${names[id][2]}</small></span>${state.done.has(i)?'<span class="lessonCheck">✓</span>':''}</button>`).join('');
 $('lessonList').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>selectLesson(+b.dataset.index)));
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
}
function setGear(g){if(Math.abs(state.car.speed)>.35){announce('Phải dừng xe trước khi đổi chiều chuyển động.',true);return;}state.car.gear=g;if(g==='2')state.shifted=true;updateUI();}
function toggleBelt(){state.car.belt=!state.car.belt;updateUI();}
function signal(dir){state.car.signal=state.car.signal===dir?'':dir;updateUI();}
function hazard(){state.car.hazard=!state.car.hazard;updateUI();}
function steerInput(){return (state.keys.right?1:0)-(state.keys.left?1:0);}
const distSegment=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],q=clamp(((p.x-a[0])*dx+(p.y-a[1])*dy)/(dx*dx+dy*dy||1),0,1);return {d:hypot(p.x-a[0]-q*dx,p.y-a[1]-q*dy),q};};
function roadDistance(){const c=state.car,p=lesson().points;let min=Infinity;for(let i=1;i<p.length;i++)min=Math.min(min,distSegment(c,p[i-1],p[i]).d);if(lesson().park){const z=lesson().park;const d=hypot(c.x-z.x,c.y-z.y);min=Math.min(min,Math.max(0,d-z.w/2));}return min;}
function currentTrafficGreen(){return (state.stageElapsed%17)>6;}
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
 const arrive=hypot(c.x-goal.x,c.y-goal.y)<(l.park?Math.max(2.2,goal.w*.42):4.4);
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
 const c=state.car;const gas=!!state.keys.gas,brake=!!state.keys.brake,axis=steerInput();
 state.steer+=(axis-state.steer)*Math.min(1,dt*5);
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
function guideMessage(){const c=state.car,l=lesson(),id=lessonId();if(state.finished)return 'Tốt! Bạn đã hoàn thành bài. Nhấn “Tiếp theo” để chuyển bài.';if(state.gameOver)return 'Kết thúc lượt. Chọn “Làm lại” để bắt đầu lượt mới.';if(!c.belt)return 'Bước 1: Cài dây an toàn trước khi bắt đầu.';if(c.gear==='P'||c.gear==='N')return 'Bước 2: Chọn D / số 1 để tiến, R để lùi. Sử dụng W hoặc ↑ để tăng ga.';if(state.hazard && !state.hazard.closed)return '⚠ Tình huống bất ngờ: phanh dừng xe ngay và bật đèn cảnh báo!';if(state.hazard && state.hazard.closed && c.hazard)return 'Tình huống đã hết. Tắt cảnh báo nguy hiểm trước khi lái tiếp.';if(id===0&&!state.startSignalChecked)return 'Bật xi nhan trái (Q), giữ chân ga và lái qua vạch xuất phát.';if(l.stop!==undefined&&!state.stopped)return `Đi chậm tới vạch dừng: y ≈ ${l.stop} m trên bản đồ; nhấn Space để dừng.`;if(id===4)return currentTrafficGreen()?'Đèn xanh: quan sát và lái xe qua ngã tư.':'Đèn đỏ: phanh dừng xe trước vạch.';if(l.park)return 'Lái vượt ô đỗ, chọn R và đánh lái từ từ để lùi gọn xe vào ô được tô xanh.';if(id===9)return state.cls==='bat'?'Tăng ga lên khoảng 12 km/h rồi giảm tốc trước điểm kết thúc.':'Tăng ga, dừng xe chuyển từ số 1 sang 2, rồi tới đích.';if(id===10)return 'Bật xi nhan phải (E), giữ hướng xe và đi qua vạch kết thúc.';return names[id][1]+' Lái theo đường trắng; dùng phanh để giữ tốc độ an toàn.';}
function status(){const c=state.car;if(state.gameOver)return 'KẾT THÚC LƯỢT';if(state.finished)return 'ĐÃ HOÀN THÀNH';if(state.paused)return 'ĐANG TẠM DỪNG';if(Math.abs(c.speed)<.1)return 'SẴN SÀNG TẬP LÁI';return 'XE ĐANG DI CHUYỂN';}
function updateStats(){const c=state.car;$('speedText').innerHTML=String(Math.round(Math.abs(c.speed)*3.6)).padStart(2,'0')+'<small> km/h</small>';$('scoreText').textContent=state.score;$('clockText').textContent=String(Math.floor(state.elapsed/60)).padStart(2,'0')+':'+String(Math.floor(state.elapsed%60)).padStart(2,'0');$('distanceText').textContent=Math.round(state.distance)+' m';$('errorCount').textContent=state.errors.length;$('steerText').textContent=Math.round(state.steer*100)+'%';$('wheel').style.transform=`rotate(${state.steer*115}deg)`;$('statusText').textContent=state.gameOver?(state.score>=80?'Hoàn tất':'Chưa đạt'):state.finished?'Đã hoàn thành':'Đang luyện';$('systemStatus').textContent=status();$('instruction').textContent=state.guides?guideMessage():'Hướng dẫn đang tắt. Nhấn “Hiện hướng dẫn” để bật lại.';}
// ----------------------------------------------------------------------
// Scene: original software 3D projection + live 2D map. No remote assets.
// ----------------------------------------------------------------------
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);if(canvas.width!==Math.round(r.width*dpr)||canvas.height!==Math.round(r.height*dpr)){canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);return {W:r.width,H:r.height};}
function roadPoint(p,normal,offset){return [p[0]+normal[0]*offset,p[1]+normal[1]*offset];}
function drawPolygon(points,fill,stroke,width=1){if(points.some(p=>!p))return;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function line(a,b,col,w=2,dash=[]){if(!a||!b)return;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=col;ctx.lineWidth=w;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function projFactory(W,H){const c=state.car,view=state.view;
 const f=[Math.sin(c.heading),-Math.cos(c.heading)],r=[Math.cos(c.heading),Math.sin(c.heading)],behind=view===1?1.25:12;
 const camera={x:c.x-f[0]*behind+(view===1?-0.63*r[0]:0),y:c.y-f[1]*behind+(view===1?-0.63*r[1]:0),z:view===1?1.52:4.0};
 const focal=W*(view===1?.89:.76);
 return (x,y,z=0)=>{const dx=x-camera.x,dy=y-camera.y;const depth=dx*f[0]+dy*f[1];if(depth<.6)return null;const horiz=dx*r[0]+dy*r[1],s=focal/(depth+1.3);return {x:W/2+horiz*s,y:H*.36+(camera.z-z)*s,depth};};
}
function drawBand(p1,p2,width,color,P,edge=false){const dx=p2[0]-p1[0],dy=p2[1]-p1[1],len=hypot(dx,dy)||1,n=[-dy/len,dx/len];const poly=[roadPoint(p1,n,-width/2),roadPoint(p1,n,width/2),roadPoint(p2,n,width/2),roadPoint(p2,n,-width/2)].map(q=>P(q[0],q[1],0));drawPolygon(poly,color);if(edge){line(P(...roadPoint(p1,n,-width/2),.025),P(...roadPoint(p2,n,-width/2),.025),'#e1f0ff',1.9);line(P(...roadPoint(p1,n,width/2),.025),P(...roadPoint(p2,n,width/2),.025),'#e1f0ff',1.9);}
 return {n,len};}
function drawStopLine(y,P,width=7,style='stop'){const thick=.22;drawPolygon([[ -width/2,y-thick], [width/2,y-thick], [width/2,y+thick],[-width/2,y+thick]].map(p=>P(p[0],p[1],.05)),style==='stop'?'#fff':'#ffd454');}
function drawCarWorld(P,view){if(view===1)return;const c=state.car,w=state.cls==='c1'?2.3:1.95,l=carLength(),f=[Math.sin(c.heading),-Math.cos(c.heading)],r=[Math.cos(c.heading),Math.sin(c.heading)];
 const pt=(along,side,z)=>P(c.x+f[0]*along+r[0]*side,c.y+f[1]*along+r[1]*side,z);
 const b=[pt(-l*.5,-w/2,.16),pt(-l*.5,w/2,.16),pt(l*.5,w/2,.16),pt(l*.5,-w/2,.16)];
 const top=[pt(-l*.28,-w*.44,1.47),pt(-l*.28,w*.44,1.47),pt(l*.17,w*.42,1.47),pt(l*.17,-w*.42,1.47)];
 drawPolygon([pt(-l*.57,-w*.59,.02),pt(-l*.57,w*.59,.02),pt(l*.57,w*.59,.02),pt(l*.57,-w*.59,.02)],'#0008');
 drawPolygon([b[0],b[1],top[1],top[0]],'#93b9da');drawPolygon([b[1],b[2],top[2],top[1]],'#d7e8fb');drawPolygon([b[0],b[3],top[3],top[0]],'#b7c8e5');drawPolygon([top[0],top[1],top[2],top[3]],'#f4f9ff','#9abbdc',1);drawPolygon([b[3],b[2],top[2],top[3]],'#dceefa');
 drawPolygon([pt(-l*.17,-w*.4,1.49),pt(-l*.17,w*.4,1.49),pt(l*.08,w*.39,1.49),pt(l*.08,-w*.39,1.49)],'#1663bd');
 const nose=pt(l*.52,0,.6),back=pt(-l*.52,0,.6);if(nose&&back){ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('QT',nose.x,nose.y);}
}
function drawTopdown(W,H){const c=state.car,scale=clamp(Math.min(W/70,H/77),3.7,8.5),X=x=>W*.5+(x-c.x)*scale,Y=y=>H*.59+(y-c.y)*scale;
 const P=(x,y,z=0)=>({x:X(x),y:Y(y)-z*scale});
 ctx.fillStyle='#285a4b';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#ffffff09';ctx.lineWidth=1;for(let x=-90;x<=90;x+=5){line(P(x,-90),P(x,90),'#ffffff0e',1);line(P(-90,x),P(90,x),'#ffffff0e',1);}
 drawRoad(P,true);const f=[Math.sin(c.heading),-Math.cos(c.heading)],r=[Math.cos(c.heading),Math.sin(c.heading)],l=carLength(),w=state.cls==='c1'?2.3:1.95;
 const pt=(forward,side)=>({x:X(c.x+f[0]*forward+r[0]*side),y:Y(c.y+f[1]*forward+r[1]*side)});
 drawPolygon([pt(-l/2,-w/2),pt(-l/2,w/2),pt(l/2,w/2),pt(l/2,-w/2)],'#ecf7ff','#448ce6',2);
 drawPolygon([pt(.08*l,-w*.4),pt(.08*l,w*.4),pt(.27*l,w*.4),pt(.27*l,-w*.4)],'#3391db');
 drawPolygon([pt(l*.5,-w*.32),pt(l*.5,w*.32),pt(l*.62,0)],'#72eff1');
 ctx.fillStyle='#fff';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('XE',W*.5,H*.59+3);
}
function drawScene3D(W,H){
 const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#65a9dc');sky.addColorStop(.42,'#d1efff');sky.addColorStop(.43,'#82bb8a');sky.addColorStop(1,'#2d6d4a');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#85af8c';ctx.beginPath();ctx.moveTo(0,H*.41);for(let i=0;i<=W;i+=35)ctx.lineTo(i,H*.4-Math.sin(i*.013)*9);ctx.lineTo(W,H*.57);ctx.lineTo(0,H*.57);ctx.fill();
 const P=projFactory(W,H);drawRoad(P,false);
 if(state.view===1)drawCockpit(W,H);else drawCarWorld(P,0);
}
function drawRoad(P,mapView){const l=lesson(),pts=l.points,p=l.park;
 // Road polygons sorted far to near from car: this also supports bent tracks.
 const segments=[];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];const mid=((a[0]+b[0])/2-state.car.x)**2+((a[1]+b[1])/2-state.car.y)**2;segments.push({a,b,mid});}
 segments.sort((a,b)=>b.mid-a.mid);
 segments.forEach(({a,b})=>{drawBand(a,b,l.width+1.1,'#aab6bc',P);const meta=drawBand(a,b,l.width,'#3c4651',P,true);const dx=b[0]-a[0],dy=b[1]-a[1];for(let d=2;d<meta.len-1;d+=5){const ta=d/meta.len,tb=Math.min(d+2.2,meta.len)/meta.len;line(P(a[0]+dx*ta,a[1]+dy*ta,.04),P(a[0]+dx*tb,a[1]+dy*tb,.04),'#d3b95d',mapView?2:1.8);}});
 if(p){const corners=[[p.x-p.w/2,p.y-p.h/2],[p.x+p.w/2,p.y-p.h/2],[p.x+p.w/2,p.y+p.h/2],[p.x-p.w/2,p.y+p.h/2]].map(q=>P(q[0],q[1],.045));drawPolygon(corners,'#3dbd9b50','#68f1c7',mapView?2:3);}
 if(l.stop!==undefined)drawStopLine(l.stop,P,l.width*.9);
 if(l.tag==='walk'){for(let k=0;k<6;k++){const x=-3.4+k*1.15;drawPolygon([[x,-1.5],[x+.55,-1.5],[x+.55,2],[x,2]].map(q=>P(...q,.07)),'#f4f7fa');}}
 if(l.tag==='hill'){drawPolygon([[-3.5,3],[3.5,3],[3.5,-7],[-3.5,-7]].map(q=>P(...q,.055)),'#ecb76433');}
 if(l.tag==='rail'){for(const y of [-1.7,0,1.7])drawStopLine(y,P,l.width,'rail');}
 if(l.tag==='light')drawSignalLight(P,mapView);
 if(l.tag==='start'||l.tag==='finish')drawStopLine(l.tag==='start'?20:-18,P,l.width,'finish');
 if(l.tag==='corner'||l.tag==='curve'){const path=l.points;path.forEach((pt,i)=>{if(i>0&&i<path.length-1){const q=P(pt[0],pt[1],.08);if(q){ctx.beginPath();ctx.arc(q.x,q.y,mapView?3:2,0,Math.PI*2);ctx.fillStyle='#5df5e7';ctx.fill();}}});}
}
function drawSignalLight(P,mapView){const green=currentTrafficGreen();const x=6.2,y=6,z=mapView?0:4.6;const loc=P(x,y,z);if(!loc)return;if(mapView){ctx.beginPath();ctx.arc(loc.x,loc.y,8,0,Math.PI*2);ctx.fillStyle=green?'#42d78f':'#fc6268';ctx.fill();return;}const base=P(x,y,0),hi=P(x,y,z);line(base,hi,'#3c4c65',3);ctx.fillStyle='#142238';ctx.fillRect(hi.x-9,hi.y-19,18,37);ctx.beginPath();ctx.arc(hi.x,hi.y-10,5,0,Math.PI*2);ctx.fillStyle=green?'#85333c':'#fa4c54';ctx.fill();ctx.beginPath();ctx.arc(hi.x,hi.y+7,5,0,Math.PI*2);ctx.fillStyle=green?'#4ded93':'#285440';ctx.fill();}
function drawCockpit(W,H){ctx.fillStyle='#101a2b';ctx.beginPath();ctx.moveTo(0,H*.78);ctx.quadraticCurveTo(W*.5,H*.7,W,H*.8);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();ctx.fillStyle='#111c2d';ctx.fillRect(0,0,W*.055,H);ctx.fillRect(W*.95,0,W*.05,H);ctx.fillStyle='#22354d';ctx.fillRect(W*.34,10,W*.3,17);ctx.fillStyle='#192e44';ctx.fillRect(W*.41,26,W*.16,26);
 const cx=W*.29,cy=H*.91,r=Math.min(67,H*.14);ctx.save();ctx.translate(cx,cy);ctx.rotate(state.steer*1.2);ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.lineWidth=12;ctx.strokeStyle='#111821';ctx.stroke();ctx.beginPath();ctx.arc(0,0,r-6,0,Math.PI*2);ctx.lineWidth=2;ctx.strokeStyle='#71829b';ctx.stroke();for(const a of [.1,2.2,4.2]){ctx.save();ctx.rotate(a);ctx.fillStyle='#334a64';ctx.fillRect(0,-7,r-12,14);ctx.restore();}ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fillStyle='#5a769a';ctx.fill();ctx.fillStyle='#eaf6ff';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText('QT',0,5);ctx.restore();ctx.fillStyle='#0a101d';ctx.fillRect(W*.65,H*.83,W*.19,H*.12);ctx.fillStyle='#83d9ff';ctx.font='bold 13px system-ui';ctx.fillText(`${Math.round(Math.abs(state.car.speed)*3.6)} km/h`,W*.75,H*.9);}
function render(){const {W,H}=resize();ctx.save();ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);if(state.view===2)drawTopdown(W,H);else drawScene3D(W,H);ctx.restore();}
function frame(now){const dt=Math.min((now-lastFrame)/1000||0,.05);lastFrame=now;step(dt);render();if(now-displayTick>120){updateStats();displayTick=now;}requestAnimationFrame(frame);}
function bindHold(id,key){const el=$(id);const on=e=>{if(e)e.preventDefault();state.keys[key]=true;el.classList.add('pressed');};const off=e=>{if(e)e.preventDefault();state.keys[key]=false;el.classList.remove('pressed');};el.addEventListener('pointerdown',e=>{on(e);try{el.setPointerCapture(e.pointerId)}catch(_){}});['pointerup','pointercancel','lostpointercapture'].forEach(event=>el.addEventListener(event,off));}
bindHold('leftBtn','left');bindHold('rightBtn','right');bindHold('gasBtn','gas');bindHold('brakeBtn','brake');
const keyMap={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowUp:'gas',w:'gas',W:'gas',ArrowDown:'brake',' ':'brake',s:'brake',S:'brake'};
window.addEventListener('keydown',e=>{if(e.key in keyMap){if(e.code!=='Space'&&e.target instanceof HTMLInputElement)return;e.preventDefault();state.keys[keyMap[e.key]]=true;return;}if(e.repeat)return;switch(e.key.toLowerCase()){case 'q':signal('left');break;case 'e':signal('right');break;case 'b':toggleBelt();break;case 'h':hazard();break;case 'v':state.view=(state.view+1)%3;updateUI();break;case 'r':if(Math.abs(state.car.speed)<.35)setGear('R');break;case '1':if(Math.abs(state.car.speed)<.35)setGear('1');break;case '2':if(Math.abs(state.car.speed)<.35)setGear('2');break;}});
window.addEventListener('keyup',e=>{if(e.key in keyMap){e.preventDefault();state.keys[keyMap[e.key]]=false;}});
window.addEventListener('blur',()=>{state.keys={};document.querySelectorAll('.pressed').forEach(e=>e.classList.remove('pressed'));});
$('practiceBtn').addEventListener('click',()=>setMode('practice'));$('examBtn').addEventListener('click',()=>setMode('exam'));
document.querySelectorAll('[data-class]').forEach(b=>b.addEventListener('click',()=>pickClass(b.dataset.class)));
$('viewBtn').addEventListener('click',()=>{state.view=(state.view+1)%3;updateUI();});
$('restartBtn').addEventListener('click',()=>{if(state.mode==='exam')resetAll();else{state.score=100;state.errors=[];state.distance=0;state.gameOver=false;initCar();}announce('Bài luyện đã khởi động lại.');});
$('nextBtn').addEventListener('click',nextStage);$('pauseBtn').addEventListener('click',()=>{state.paused=!state.paused;$('pauseBtn').textContent=state.paused?'Tiếp tục ▶':'Tạm dừng Ⅱ';});
$('guideToggle').addEventListener('click',()=>{state.guides=!state.guides;$('guideToggle').textContent=state.guides?'Ẩn hướng dẫn':'Hiện hướng dẫn';});
$('beltBtn').addEventListener('click',toggleBelt);$('signalLeft').addEventListener('click',()=>signal('left'));$('signalRight').addEventListener('click',()=>signal('right'));$('hazardBtn').addEventListener('click',hazard);
// For classroom troubleshooting and automated QA, read-only public diagnostics.
window.QuyetThangSaHinhDebug=Object.freeze({getState:()=>({cls:state.cls,mode:state.mode,lesson:state.lesson,score:state.score,errors:state.errors.length,position:state.car?{x:state.car.x,y:state.car.y,heading:state.car.heading,speed:state.car.speed}:null,finished:state.finished}),lessonCount:()=>list().length});
resetAll();requestAnimationFrame(frame);announce('Mời chọn bài, cài dây an toàn và bắt đầu luyện lái.');
})();
