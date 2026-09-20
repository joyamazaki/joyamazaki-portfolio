document.documentElement.classList.add('js');

document.querySelectorAll('.site-footer').forEach((footer) => {
  footer.textContent = '© 2026 joyamazaki';
});

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = mobileMenu.querySelectorAll('a');
const printElements = document.querySelectorAll('.work-card, .profile-image');
const printElementList = Array.from(printElements);

document.querySelector('.site-header').append(mobileMenu);

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  printElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const readyToPrint = new Set();
  const waitingForImage = new WeakSet();
  let nextPrintIndex = 0;
  let printInProgress = false;
  let sequenceStarted = false;

  function revealNextPrint() {
    if (printInProgress || nextPrintIndex >= printElements.length) return;

    const nextElement = printElements[nextPrintIndex];
    if (!readyToPrint.has(nextElement)) return;

    printInProgress = true;
    nextElement.style.setProperty('--reveal-delay', '0ms');
    nextElement.classList.add('is-visible');
    revealObserver.unobserve(nextElement);

    window.setTimeout(() => {
      nextPrintIndex += 1;
      printInProgress = false;
      revealNextPrint();
    }, 760);
  }

  function beginPrintSequence() {
    if (sequenceStarted) {
      revealNextPrint();
      return;
    }

    sequenceStarted = true;
    window.setTimeout(revealNextPrint, 760);
  }

  function markReadyToPrint(element) {
    if (readyToPrint.has(element) || waitingForImage.has(element)) return;

    const image = element.querySelector('img');
    const markReady = () => {
      if (readyToPrint.has(element)) return;
      readyToPrint.add(element);
      beginPrintSequence();
    };

    if (!image || image.complete) {
      markReady();
      return;
    }

    waitingForImage.add(element);
    image.addEventListener('load', markReady, { once: true });
    image.addEventListener('error', markReady, { once: true });
    window.setTimeout(markReady, 2500);
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const entryIndex = printElementList.indexOf(entry.target);
      for (let index = nextPrintIndex; index <= entryIndex; index += 1) {
        markReadyToPrint(printElementList[index]);
      }
    });
  }, { threshold: 0.02, rootMargin: '40% 0px 40% 0px' });

  window.requestAnimationFrame(() => {
    while (nextPrintIndex < printElements.length) {
      const previousElement = printElements[nextPrintIndex];
      if (previousElement.getBoundingClientRect().top >= 0) break;

      previousElement.style.setProperty('--reveal-delay', '-840ms');
      previousElement.classList.add('is-visible');
      nextPrintIndex += 1;
    }

    Array.from(printElements)
      .slice(nextPrintIndex)
      .forEach((element) => revealObserver.observe(element));
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
