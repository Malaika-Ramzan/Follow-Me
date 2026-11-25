function toggleDark(){document.body.classList.toggle('dark');}
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
let W,H,gapSize=8;
function resize(){
  W=canvas.width=window.innerWidth;
  H=canvas.height=window.innerHeight;
  if(W<600)gapSize=6;else if(W<1024)gapSize=7;else gapSize=8;
}
resize();
window.addEventListener('resize',resize);
window.addEventListener('orientationchange',function(){setTimeout(resize,200);});
let pointer={x:window.innerWidth/2,y:window.innerHeight/2};
let target={x:window.innerWidth/2,y:window.innerHeight/2};
function setTarget(x,y){target.x=x;target.y=y;}
window.addEventListener('mousemove',function(e){setTarget(e.clientX,e.clientY);});
window.addEventListener('touchmove',function(e){if(e.touches[0])setTarget(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
window.addEventListener('touchstart',function(e){if(e.touches[0])setTarget(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
const N=60;
let points=[];
for(let i=0;i<N;i++){points.push({x:W/2-i*5,y:H/2});}
let hairs=[];
for(let i=0;i<120;i++){hairs.push({len:20+Math.random()*70,angle:Math.random()*Math.PI*2});}
let frm=0;
function run(){
  requestAnimationFrame(run);
  frm+=0.08;
  pointer.x+=(target.x-pointer.x)*0.08;
  pointer.y+=(target.y-pointer.y)*0.08;
  points[0].x=pointer.x;points[0].y=pointer.y;
  for(let i=1;i<N;i++){
    let prev=points[i-1],curr=points[i];
    let dx=prev.x-curr.x,dy=prev.y-curr.y;
    let dist=Math.sqrt(dx*dx+dy*dy)||1;
    if(dist>gapSize){curr.x=prev.x-(dx/dist)*gapSize;curr.y=prev.y-(dy/dist)*gapSize;}
    curr.x+=Math.sin(frm+i*0.4)*0.6;
    curr.y+=Math.cos(frm+i*0.3)*0.6;
  }
  ctx.clearRect(0,0,W,H);
  let isDark=document.body.classList.contains('dark');
  let creatureColor=isDark?'#FFFFFF':'#111111';
  let hairColor=isDark?'rgba(255,255,255,0.45)':'rgba(0,0,0,0.28)';
  let eyeColor=isDark?'#121212':'#FFFFFF';
  ctx.strokeStyle=hairColor;ctx.lineWidth=1;
  for(let h of hairs){
    let hx=pointer.x+Math.sin(h.angle+frm)*130;
    let hy=pointer.y+Math.cos(h.angle+frm)*130;
    ctx.beginPath();ctx.moveTo(hx,hy);
    ctx.lineTo(hx+Math.cos(h.angle+frm*2)*h.len,hy+Math.sin(h.angle+frm*2)*h.len);
    ctx.stroke();
  }
  if(isDark){ctx.shadowColor='#D4AF37';ctx.shadowBlur=18;}else{ctx.shadowBlur=0;}
  ctx.strokeStyle=creatureColor;ctx.lineCap='round';
  for(let i=0;i<N-1;i++){
    ctx.lineWidth=13*(1-i/N)+2;
    ctx.beginPath();ctx.moveTo(points[i].x,points[i].y);ctx.lineTo(points[i+1].x,points[i+1].y);ctx.stroke();
  }
  ctx.shadowBlur=0;
  ctx.fillStyle=creatureColor;
  ctx.beginPath();ctx.arc(points[0].x,points[0].y,12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=eyeColor;
  ctx.beginPath();ctx.arc(points[0].x+4,points[0].y-3,2.5,0,Math.PI*2);ctx.fill();
}
run();