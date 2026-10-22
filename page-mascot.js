/* Vanilla JS adaptation of nilbuild/page-mascot (MIT, Kamran Ahmed).
   Original code and sprite credits: https://github.com/nilbuild/page-mascot
   License retained in assets/mascot/LICENSE.txt. */
(() => {
  const dock = document.querySelector('#mascot-dock');
  if (!dock) return;
  const button = dock.querySelector('.page-mascot');
  const sprite = button.querySelector('.mascot-sprite');
  const direction = button.querySelector('.mascot-direction');
  const reaction = button.querySelector('.mascot-reaction');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clockwise = [5,8,7,6,3,0,1,2];
  let sector = -1, timers = [], boops = 0, lastBoop = 0, frame = 0, point;
  const cell = (layer, index) => {const frame=index+(layer===reaction?9:0);layer.style.backgroundPosition=`${frame%3*50}% ${Math.floor(frame/3)*20}%`;};
  const wrap = angle => Math.atan2(Math.sin(angle),Math.cos(angle));
  function aim() {
    frame = 0;
    if (!point || !fine.matches || reduced.matches || button.hidden || document.hidden) return;
    const box = button.getBoundingClientRect();
    const dx = point.x - box.left - box.width/2, dy = point.y - box.top - box.height/2;
    if (Math.hypot(dx,dy) < 70) {sector=-1;cell(direction,4);return;}
    const angle = Math.atan2(dy,dx), size = Math.PI/4;
    if (sector !== -1 && Math.abs(wrap(angle-sector*size)) < size/2 + .12) return;
    sector = (Math.round(angle/size)+8)%8;
    cell(direction,clockwise[sector]);
  }
  window.addEventListener('pointermove', event => {
    point={x:event.clientX,y:event.clientY};
    if (!frame && !button.hidden && fine.matches && !reduced.matches) frame=requestAnimationFrame(aim);
  },{passive:true});
  button.addEventListener('click', () => {
    timers.forEach(clearTimeout); timers=[];
    const now=Date.now(); boops=now-lastBoop<1600?boops+1:1;lastBoop=now;
    const show=index=>{cell(reaction,index);reaction.style.opacity=1;direction.style.opacity=0;};
    const later=(ms,fn)=>timers.push(setTimeout(fn,ms));
    if(boops>=4){boops=0;show(7);later(1100,reset);}else{show(0);later(120,()=>show([1,2,8][(boops-1)%3]));later(560,reset);}
    if(!reduced.matches) sprite.animate([{transform:'scale(1)'},{transform:'scale(1.1,.86)',offset:.18},{transform:'scale(.95,1.08)',offset:.45},{transform:'scale(1)'}],{duration:420,easing:'ease-out'});
  });
  function reset(){reaction.style.opacity=0;direction.style.opacity=1;}
  cell(direction,4);cell(reaction,0);
  window.addEventListener('pagehide',()=>{timers.forEach(clearTimeout);cancelAnimationFrame(frame);});
})();
