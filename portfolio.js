import * as pdfjsLib from './vendor/pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.mjs', import.meta.url).href;

const viewer = document.querySelector('[data-pdf-document]');
const nativeViewer = document.querySelector('[data-native-pdf]');
const headerTrigger = document.querySelector('.portfolio-header-trigger');
const siteHeader = document.querySelector('.site-header');

if (viewer && nativeViewer) {
  nativeViewer.src = nativeViewer.dataset.pdfSrc;
  nativeViewer.hidden = false;
  viewer.hidden = true;
  viewer.setAttribute('aria-busy', 'false');

  let collapseTimer;
  const setHeaderCollapsed = (collapsed) => {
    window.clearTimeout(collapseTimer);
    document.body.classList.toggle('portfolio-header-collapsed', collapsed);
    headerTrigger?.setAttribute('aria-expanded', String(!collapsed));
  };
  const scheduleCollapse = (delay = 360) => {
    window.clearTimeout(collapseTimer);
    collapseTimer = window.setTimeout(() => setHeaderCollapsed(true), delay);
  };

  headerTrigger?.addEventListener('mouseenter', () => setHeaderCollapsed(false));
  headerTrigger?.addEventListener('click', () => {
    setHeaderCollapsed(!document.body.classList.contains('portfolio-header-collapsed'));
  });
  siteHeader?.addEventListener('mouseenter', () => window.clearTimeout(collapseTimer));
  siteHeader?.addEventListener('mouseleave', () => scheduleCollapse());
  nativeViewer.addEventListener('load', () => scheduleCollapse(900), { once: true });
  scheduleCollapse(1800);
} else if (viewer) {
  const resourceRoot = new URL('./vendor/pdfjs/', import.meta.url);
  const pdfUrl = new URL(viewer.dataset.pdfDocument, document.baseURI).href;
  const loadingText = viewer.querySelector('.portfolio-status');
  let renderQueue = Promise.resolve();

  const loadingTask = pdfjsLib.getDocument({
    url: pdfUrl,
    cMapUrl: new URL('cmaps/', resourceRoot).href,
    cMapPacked: true,
    standardFontDataUrl: new URL('standard_fonts/', resourceRoot).href,
    wasmUrl: new URL('wasm/', resourceRoot).href,
    iccUrl: new URL('iccs/', resourceRoot).href,
  });

  loadingTask.promise.then(async (pdf) => {
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const pageElement = document.createElement('section');
      const canvas = document.createElement('canvas');

      pageElement.className = 'pdf-page';
      pageElement.style.aspectRatio = `${baseViewport.width} / ${baseViewport.height}`;
      pageElement.dataset.pageNumber = String(pageNumber);
      pageElement.setAttribute('aria-label', `Page ${pageNumber} of ${pdf.numPages}`);
      canvas.setAttribute('aria-hidden', 'true');
      pageElement.append(canvas);
      pages.push({ page, pageElement, canvas, baseViewport, renderTask: null });
    }

    loadingText?.remove();
    pages.forEach(({ pageElement }) => viewer.append(pageElement));
    viewer.setAttribute('aria-busy', 'false');

    const renderPage = async (entry) => {
      const { page, pageElement, canvas, baseViewport } = entry;
      const cssWidth = pageElement.clientWidth;
      if (!cssWidth || pageElement.dataset.rendering === 'true') return;

      const renderedWidth = Number(pageElement.dataset.renderedWidth || 0);
      if (pageElement.classList.contains('is-rendered') && Math.abs(renderedWidth - cssWidth) < 2) return;

      pageElement.dataset.rendering = 'true';
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
      const targetWidth = Math.min(cssWidth * pixelRatio, 4096);
      const viewport = page.getViewport({ scale: targetWidth / baseViewport.width });

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      entry.renderTask = page.render({ canvasContext: canvas.getContext('2d'), viewport });

      try {
        await entry.renderTask.promise;
        pageElement.dataset.renderedWidth = String(cssWidth);
        pageElement.classList.add('is-rendered');
      } finally {
        pageElement.dataset.rendering = 'false';
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries
        .sort((a, b) => Number(a.target.dataset.pageNumber) - Number(b.target.dataset.pageNumber))
        .forEach((observerEntry) => {
          const pageEntry = pages[Number(observerEntry.target.dataset.pageNumber) - 1];
          pageEntry.pageElement.dataset.nearViewport = String(observerEntry.isIntersecting);

          if (observerEntry.isIntersecting) {
            renderQueue = renderQueue.then(() => renderPage(pageEntry));
            return;
          }

          window.setTimeout(() => {
            if (pageEntry.pageElement.dataset.nearViewport === 'true') return;
            pageEntry.canvas.width = 1;
            pageEntry.canvas.height = 1;
            pageEntry.pageElement.classList.remove('is-rendered');
            delete pageEntry.pageElement.dataset.renderedWidth;
          }, 4000);
        });
    }, { rootMargin: '100% 0px', threshold: 0.01 });

    pages.forEach(({ pageElement }) => observer.observe(pageElement));

    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        pages
          .filter(({ pageElement }) => pageElement.dataset.nearViewport === 'true')
          .forEach((pageEntry) => {
            renderQueue = renderQueue.then(() => renderPage(pageEntry));
          });
      }, 180);
    });
  }).catch(() => {
    viewer.setAttribute('aria-busy', 'false');
    if (loadingText) loadingText.hidden = true;
    viewer.querySelector('.pdf-fallback')?.removeAttribute('hidden');
  });
}
