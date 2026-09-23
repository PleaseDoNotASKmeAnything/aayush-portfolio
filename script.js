// Shared public profile links.
const profile = {
  email: 'negiaayush0302@gmail.com',
  github: 'https://github.com/PleaseDoNotASKmeAnything',
  linkedin: 'https://www.linkedin.com/in/aayush-negi-b468b926b/',
  resume: 'resume.html?v=20260918-accessibility',
};

document.getElementById('year').textContent = new Date().getFullYear();
const projectDetails = {
  "orion": {
    "title": "Orion",
    "category": "TEAM PROJECT / AI DEVELOPMENT TOOLS",
    "description": "A team-built browser IDE for creating, editing, and running web projects through natural-language instructions.",
    "roleHeading": "My contribution",
    "role": "Primary contributor to agent orchestration, including routing, tool execution, shared context, workflow sequencing, and error handling, with support from teammates.",
    "highlights": [
      "Conversational agent workflow for reading, creating, and modifying project files.",
      "CodeMirror editor and WebContainer-powered runtime and preview.",
      "Next.js and TypeScript frontend, Convex backend, and Clerk authentication."
    ],
    "status": "Collaborative project. The contribution described here is agent orchestration; the complete product was built by the team.",
    "repo": "orion-decentralized-IDE"
  },
  "revpay": {
    "title": "RevPay",
    "category": "FULL-STACK / WORKFLOW PROTOTYPE",
    "description": "A dashboard for organizing failed-payment cases, recommending recovery strategies, and tracking recovery attempts.",
    "roleHeading": "Engineering focus",
    "role": "Explainable decision-making and a stateful workflow that separates recovery recommendations from execution.",
    "highlights": [
      "Rule-based strategy selection and recovery prioritization.",
      "Bounded retries, duplicate-execution protection, and escalation to manual review.",
      "React dashboard with a FastAPI backend and PostgreSQL persistence."
    ],
    "status": "Prototype: external recovery actions are simulated. The decision engine is rule-based, not a trained machine-learning model.",
    "repo": "RevPay"
  },
  "faceauth": {
    "title": "FaceAuth",
    "category": "BIOMETRICS / BLOCKCHAIN PROTOTYPE",
    "description": "An experimental authentication system combining password and facial data with credential hashes stored through a smart contract.",
    "roleHeading": "Engineering focus",
    "role": "Connecting facial encoding, a Django API, and local Ethereum smart contracts in an end-to-end authentication workflow.",
    "highlights": [
      "Facial encoding using face_recognition and dlib.",
      "Django API and browser-based webcam capture interface.",
      "Local Ethereum development network using Ganache and Truffle."
    ],
    "status": "Local-development prototype; no claim of production security or independently validated biometric accuracy.",
    "repo": "AI-Decentralized-identity-verification"
  }
};
const dialog = document.getElementById('project-dialog');
document.querySelectorAll('[data-project]').forEach(card => {
  card.disabled = false;
  card.addEventListener('click', () => {
    const project = projectDetails[card.dataset.project];
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-description').textContent = project.description;
    document.getElementById('dialog-category').textContent = project.category;
    document.getElementById('dialog-role-heading').textContent = project.roleHeading;
    document.getElementById('dialog-role').textContent = project.role;
    document.getElementById('dialog-status').textContent = project.status;
    document.getElementById('dialog-repository').href = `https://github.com/PleaseDoNotASKmeAnything/${project.repo}`;
    document.getElementById('dialog-highlights').replaceChildren(...project.highlights.map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    dialog.showModal();
  });
});
dialog.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

// Unconfigured links stay hidden; configured links use native browser navigation.
document.querySelectorAll('[data-profile-link]').forEach(link => {
  const url = profile[link.dataset.profileLink];
  if (!url) return;
  link.href = url;
  if (link.dataset.profileLink === 'resume') {
    link.removeAttribute('target');
    link.removeAttribute('rel');
  } else {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  link.hidden = false;
});
if (profile.email) {
  const contact = document.getElementById('email-button');
  const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email.trim())}`;
  contact.href = composeUrl;
  contact.textContent = 'Say hello';
  contact.target = '_blank';
  contact.rel = 'noopener noreferrer';
  const emailLink = document.getElementById('contact-status');
  document.getElementById('contact-email-text').textContent = profile.email.trim();
  emailLink.href = composeUrl;
  emailLink.target = '_blank';
  emailLink.rel = 'noopener noreferrer';
}
// Enhance below-the-fold text only; original content stays readable without JS.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const headings = document.querySelectorAll('#work h2, #about h2, #playground h2, #contact h2');
  headings.forEach(heading => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word => {
        if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
        const span = document.createElement('span');
        span.className = 'reveal-word';
        span.style.setProperty('--word-delay', `${index++ * 65}ms`);
        span.textContent = word;
        fragment.append(span);
      });
      node.replaceWith(fragment);
    });
    heading.classList.add('scroll-heading');
  });
  const text = document.querySelectorAll('.section-top > p, .about-copy > p, .work-copy > p, .work-copy h3, .contact-bottom > p, .toolkit-row');
  text.forEach(element => element.classList.add('scroll-copy'));
  const targets = [...headings, ...text];
  const reveal = element => element.classList.add('is-revealed');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  targets.forEach(element => observer.observe(element));
  // Never obscure focused content or printed text; respect preference changes.
  document.addEventListener('focusin', event => {
    const target = event.target.closest('.scroll-copy, .scroll-heading');
    if (target) reveal(target);
  });
  motion.addEventListener('change', event => {
    if (event.matches) { targets.forEach(reveal); observer.disconnect(); }
  });
})();

const workMotionToggle = document.getElementById('work-motion-toggle');
workMotionToggle.hidden = false;
workMotionToggle.addEventListener('click', () => {
  const paused = document.getElementById('work').classList.toggle('motion-paused');
  workMotionToggle.setAttribute('aria-pressed', String(paused));
  workMotionToggle.textContent = paused ? 'Resume background animation' : 'Pause background animation';
});

// Custom pointer is progressive enhancement for mouse users only.
(() => {
  const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const cursor = document.createElement('div');
  cursor.className = 'portfolio-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0, visible = false;
  const hide = () => {
    visible = false;
    cursor.classList.remove('is-visible', 'is-hovering', 'is-pressed');
    document.documentElement.classList.remove('custom-pointer');
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const draw = () => {
    x += (targetX - x) * .4;
    y += (targetY - y) * .4;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .1 ? requestAnimationFrame(draw) : 0;
  };
  document.addEventListener('pointermove', event => {
    // Native cursors remain available in dialogs, editable content and the pitch.
    if (!allowed.matches || event.pointerType !== 'mouse' || document.querySelector('dialog[open]') || event.target.closest('input, textarea, select, [contenteditable], #football-field')) { hide(); return; }
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) {
      x = targetX; y = targetY; visible = true;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cursor.classList.add('is-visible');
      document.documentElement.classList.add('custom-pointer');
    }
    cursor.classList.toggle('is-hovering', !!event.target.closest('a, button:not(:disabled), summary, [role="button"]'));
    if (!frame) frame = requestAnimationFrame(draw);
  }, { passive: true });
  document.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); });
  document.addEventListener('keydown', hide);
  document.addEventListener('visibilitychange', hide);
  window.addEventListener('blur', hide);
  allowed.addEventListener('change', hide);
  new MutationObserver(() => { if (document.querySelector('dialog[open]')) hide(); }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
})();
