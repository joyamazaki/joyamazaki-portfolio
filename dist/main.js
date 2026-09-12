const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = mobileMenu.querySelectorAll('a');

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
