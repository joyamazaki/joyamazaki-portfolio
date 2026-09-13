document.documentElement.classList.add('js');

document.querySelectorAll('.site-footer').forEach((footer) => {
  footer.textContent = `© ${new Date().getFullYear()} jo yamazaki`;
});

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = mobileMenu.querySelectorAll('a');
const printElements = document.querySelectorAll('.work-card, .profile-image');

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  printElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  printElements.forEach((element, index) => {
    const startsOnScreen = element.getBoundingClientRect().top < window.innerHeight;
    const delay = startsOnScreen ? 760 + (index * 110) : Math.min(index, 2) * 80;
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    revealObserver.observe(element);
  });
}

function setMenu(open) {
  const openLabel = menuButton.dataset.labelOpen || 'Open menu';
  const closeLabel = menuButton.dataset.labelClose || 'Close menu';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? closeLabel : openLabel);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);

  if (open) {
    mobileLinks[0].focus();
  } else if (document.activeElement !== menuButton) {
    menuButton.focus();
  }
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  setMenu(open);
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720 && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
  }
});
