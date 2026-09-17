(() => {
  const field = document.getElementById('football-field');
  const canvas = document.getElementById('football-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const checkpoints = [
    { x:23, y:27, q:'Who is Aayush?', a:'An engineer at heart, studying Computer Science & Engineering at JIIT (2023-2027, expected). I explored conversational AI during my AI/ML internship at AML Enterprises.', link:'#about', label:'More about me' },
    { x:74, y:27, q:'What have you built?', a:'Orion, RevPay, and FaceAuth explore AI development tools, payment recovery, and biometric authentication. I enjoy building, developing, and solving problems across a growing collection of projects.', link:'#work', label:'Explore my projects' },
    { x:74, y:73, q:'My Interests !!', a:'Full-stack development, AI agents, data structures, Machine Learning, DevOps and decentralized systems. I like understanding how the pieces fit together, from the interface to the workflow behind it.', link:'#about', label:'See my toolkit' },
    { x:23, y:73, q:'What is it like to work with me?', a:'I value clear communication, thoughtful collaboration, and taking ownership of my work. I approach challenges with curiosity, stay open to feedback, and focus on delivering reliable, well-considered solutions.', link:'#contact', label:'Start a conversation' }
  ];
  checkpoints.push({ x:50, y:50, q:'Find me on Medium', a:'Congratulations!! You unlocked the SUPER SECRET medium page :)', link:'https://medium.com/@negiaayush0302', label:'Visit my Medium page' });
  let bonusUnlocked = false;
  const announcement = document.getElementById('football-unlock');
  const buttons = [...field.querySelectorAll('[data-checkpoint]')];
  const keys = new Set();
  const visited = new Set();
  let x=50, y=50, target=null, frame=0, last=0, active=-1, stride=0;
  const speedFactor = () => .65 * (visited.size === checkpoints.length ? 1 : 1 - visited.size * .10);
  function updateClock() {
    const seconds = Math.round(visited.size / checkpoints.length * 90 * 60);
    document.getElementById('football-clock').textContent = `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`;
  }
  function draw() {
    ctx.clearRect(0,0,626,417);
    ctx.imageSmoothingEnabled=false;
    const px=Math.round(x*6.26), py=Math.round(y*4.17);
    ctx.save();
    ctx.translate(px,py);
    ctx.scale(.75,.75);
    ctx.translate(-px,-py);
    ctx.fillStyle='#12362066';ctx.fillRect(px-12,py+16,27,6);
    const step = motion.matches ? 0 : Math.floor(stride/8)%2*3;
    const sprite=[[-5,-21,10,4,'#282329'],[-7,-17,14,10,'#eac197'],[-8,-7,16,15,'#fa7857'],[-12,-5,4,12,'#eac197'],[8,-5,4,12,'#eac197'],[-7,8,14,6,'#263b57'],[-7,14,5,7+step,'#eee9d6'],[2,14,5,10-step,'#eee9d6'],[-8,21+step,7,3,'#232b29'],[1,24-step,7,3,'#232b29'],[-1,-4,3,7,'#fff2db']];
    for(const [dx,dy,w,h,c] of sprite){ctx.fillStyle=c;ctx.fillRect(px+dx,py+dy,w,h);}
    ctx.fillStyle='#fcfaf0';ctx.fillRect(px+13,py+17,9,9);ctx.fillStyle='#303633';ctx.fillRect(px+16,py+20,3,3);
    // Pixel droplets grow more numerous with fatigue, bobbing as he runs.
    for (let i=0; i<visited.size; i++) {
      const side = i%2 ? 1 : -1;
      const fall = motion.matches ? 0 : Math.floor(stride/5+i*2)%7;
      const sx = px + side*(15+Math.floor(i/2)*6);
      const sy = py - 18 + (i%3)*7 + fall;
      ctx.fillStyle='#d5f6ff';ctx.fillRect(sx,sy,2,2);
      ctx.fillStyle='#58bce8';ctx.fillRect(sx-1,sy+2,4,4);
    }
    ctx.restore();
  }
  const popup = document.getElementById('football-dialog');
  const explore = document.getElementById('football-open');
  const arrival = document.getElementById('football-arrival');
  function arrive(i) {
    if (active === i) return;
    active = i;
    buttons.forEach((b,n) => {
      b.classList.toggle('is-active',n===i);
      b.setAttribute('aria-pressed',String(n===i));
    });
    explore.hidden = i < 0;
    arrival.textContent = i < 0 ? 'Reach a checkpoint to explore.' : `Checkpoint 0${i+1} reached. Press Enter to explore.`;
  }
  function checkNearby() {
    arrive(checkpoints.findIndex((cp,i) => (i < 4 || bonusUnlocked) && Math.hypot(cp.x-x,cp.y-y) < 6));
  }
  function openCheckpoint() {
    checkNearby();
    if(active < 0 || popup.open) return;
    keys.clear(); target=null;
    cancelAnimationFrame(frame); frame=0; last=0;
    const cp=checkpoints[active];
    document.getElementById('football-kicker').textContent=`CHECKPOINT 0${active+1}`;
    document.getElementById('football-question').textContent=cp.q;
    document.getElementById('football-answer').textContent=cp.a;
    const link=document.getElementById('football-link');
    link.hidden=!cp.link;
    link.href=cp.link; link.textContent=cp.label+' \u2197';
    visited.add(active);
    updateClock();
    draw();
    buttons.forEach((b,n)=>b.classList.toggle('is-visited',visited.has(n)));
    const regularCount = [...visited].filter(i => i < 4).length;
    if (regularCount === 4 && !bonusUnlocked) {
      bonusUnlocked = true;
      buttons[4].hidden = false;
      announcement.hidden = false;
    }
    document.getElementById('football-score').textContent=`${regularCount} / 4 explored${visited.has(4) ? ' + bonus explored' : ''}`;
    const completed = visited.size === checkpoints.length;
    document.getElementById('football-complete').hidden = !completed;
    if (completed) announcement.hidden = true;
    popup.showModal();
  }
  explore.addEventListener('click',openCheckpoint);
  document.getElementById('football-close').addEventListener('click',()=>popup.close());
  document.getElementById('football-continue').addEventListener('click',()=>popup.close());
  popup.addEventListener('close',()=>field.focus({preventScroll:true}));
  popup.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();popup.close();}});
  document.getElementById('football-link').addEventListener('click',()=>popup.close());
  document.getElementById('playground').addEventListener('keydown',e=>{
    if(e.key==='Enter' && active>=0 && !popup.open && (e.target===field || e.target.matches('[data-checkpoint]'))) {
      e.preventDefault(); openCheckpoint();
    }
  });
  function tick(now) {
    const dt=Math.min((now-last)/1000 || 0, .04);last=now;
    let dx=0,dy=0;
    if(target){dx=target.x-x;dy=target.y-y; if(Math.hypot(dx,dy)<1){x=target.x;y=target.y;arrive(target.i);target=null;dx=dy=0;}}
    else {dx=Number(keys.has('right'))-Number(keys.has('left'));dy=Number(keys.has('down'))-Number(keys.has('up'));}
    const distance=Math.hypot(dx,dy);
    if(distance){const speed=target?Math.min(28*speedFactor()*dt,distance):28*speedFactor()*dt;x=Math.max(10,Math.min(90,x+dx/distance*speed));y=Math.max(12,Math.min(86,y+dy/distance*speed));stride+=dt*60*speedFactor();}
    checkNearby();
    draw();
    if(target||keys.size) frame=requestAnimationFrame(tick);else {frame=0;last=0;}
  }
  function start(){if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
  function go(i){if(i===4&&!bonusUnlocked)return;field.focus({preventScroll:true});keys.clear();const cp=checkpoints[i];if(motion.matches){target=null;x=cp.x;y=cp.y;arrive(i);draw();}else{target={...cp,i};start();}}
  buttons.forEach((b,i)=>{b.disabled=false;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>go(i));});
  const directions={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
  field.addEventListener('keydown',e=>{const direction=directions[e.key]||directions[e.key.toLowerCase()];if(!direction||e.ctrlKey||e.metaKey||e.altKey)return;e.preventDefault();target=null;keys.add(direction);start();});
  field.addEventListener('keyup',e=>{const direction=directions[e.key]||directions[e.key.toLowerCase()];if(direction){e.preventDefault();keys.delete(direction);}});
  field.addEventListener('focusout',()=>keys.clear());
  window.addEventListener('blur',()=>{keys.clear();target=null;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();target=null;}});
  document.querySelectorAll('[data-direction]').forEach(button => {
    button.disabled = false;
    let pointerId = null;
    const stop = () => {
      keys.delete(button.dataset.direction);
      pointerId = null;
    };
    button.addEventListener('pointerdown', event => {
      if (event.button !== 0 || pointerId !== null || popup.open) return;
      event.preventDefault();
      button.focus({preventScroll:true});
      target = null;
      pointerId = event.pointerId;
      button.setPointerCapture(pointerId);
      keys.add(button.dataset.direction);
      start();
    });
    ['pointerup','pointercancel','lostpointercapture'].forEach(type => button.addEventListener(type, stop));
    button.addEventListener('blur', stop);
    // Keyboard and assistive activation keep a single-step action.
    button.addEventListener('click', event => {
      if (event.detail !== 0 || popup.open) return;
      target = null;
      const d = button.dataset.direction, step = 5 * speedFactor();
      x = Math.max(10, Math.min(90, x + (d === 'right' ? step : d === 'left' ? -step : 0)));
      y = Math.max(12, Math.min(86, y + (d === 'down' ? step : d === 'up' ? -step : 0)));
      checkNearby(); draw();
    });
  });
  const reset=document.getElementById('football-reset');reset.disabled=false;
  reset.addEventListener('click',()=>{cancelAnimationFrame(frame);frame=0;last=0;keys.clear();visited.clear();stride=0;updateClock();bonusUnlocked=false;buttons[4].hidden=true;announcement.hidden=true;target=null;active=-1;x=y=50;buttons.forEach(b=>{b.classList.remove('is-active','is-visited');b.setAttribute('aria-pressed','false');});explore.hidden=true;arrival.textContent='Reach a checkpoint to explore.';document.getElementById('football-score').textContent='0 / 4 explored';document.getElementById('football-kicker').textContent='KICK-OFF';document.getElementById('football-question').textContent='Ready for another lap?';document.getElementById('football-answer').textContent='Move to any numbered checkpoint to explore. You can visit them in any order.';document.getElementById('football-complete').hidden=true;const link=document.getElementById('football-link');link.href='#about';link.textContent='Meet Aayush \u2197';draw();});
  const enter = document.getElementById('playground-enter');
  const invitation = document.getElementById('playground-invitation');
  const game = document.getElementById('football-game');
  enter.disabled = false;
  enter.addEventListener('click', () => {
    invitation.hidden = true;
    game.hidden = false;
    enter.setAttribute('aria-expanded','true');
    draw();
    field.focus({preventScroll:true});
    game.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});
  });
  document.getElementById('playground-exit').addEventListener('click', () => {
    keys.clear(); target=null;
    cancelAnimationFrame(frame); frame=0; last=0;
    game.hidden = true;
    invitation.hidden = false;
    enter.setAttribute('aria-expanded','false');
    enter.focus({preventScroll:true});
    invitation.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'center'});
  });
  draw();
})();
