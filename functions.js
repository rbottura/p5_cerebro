// ─── Loading screen helpers ────────────────────────────────────────────────────

function setProgress(pct) {
  const fill  = document.getElementById('progress-bar-fill');
  const label = document.getElementById('loading-label');
  const p = Math.min(100, Math.round(pct * 100));
  if (fill)  fill.style.width  = p + '%';
  if (label) label.textContent = `Loading… ${p}%`;
}

function hideLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  screen.classList.add('hidden');
  screen.addEventListener('transitionend', () => screen.remove(), { once: true });
}

// ─── Byte-accurate XHR pre-loader ─────────────────────────────────────────────
//
// Fetches all images in parallel via XHR, tracking real bytes received.
// Once all downloads are done, hands blob URLs to p5's loadImage() for decoding.
// Calls onProgress(0..1) continuously, then onComplete() when everything is ready.

function preloadWithProgress(paths, onProgress, onComplete) {
  const count       = paths.length;
  const bytesLoaded = new Array(count).fill(0);
  const bytesTotal  = new Array(count).fill(0); // 0 = Content-Length unknown yet
  const blobURLs    = new Array(count).fill(null);
  let   downloaded  = 0;

  function reportProgress() {
    const totalLoaded = bytesLoaded.reduce((a, b) => a + b, 0);
    const totalSize   = bytesTotal.reduce((a, b) => a + b, 0);
    // Use byte ratio when Content-Length is known for all files, else fall back to file count
    const knownCount  = bytesTotal.filter(b => b > 0).length;
    const pct = (knownCount === count && totalSize > 0)
      ? totalLoaded / totalSize
      : downloaded / count;
    onProgress(pct);
  }

  function decodeAll() {
    // p5's loadImage decodes the blob URLs into p5.Image objects
    let decoded = 0;
    const result = new Array(count).fill(null);

    paths.forEach((path, i) => {
      if (!blobURLs[i]) {
        // This file failed to download — skip it but still count
        decoded++;
        if (decoded === count) onComplete(result);
        return;
      }

      loadImage(blobURLs[i], (img) => {
        result[i] = img;
        URL.revokeObjectURL(blobURLs[i]); // free blob memory once decoded
        decoded++;
        if (decoded === count) onComplete(result);
      }, (err) => {
        console.error('p5 failed to decode:', path, err);
        URL.revokeObjectURL(blobURLs[i]);
        decoded++;
        if (decoded === count) onComplete(result);
      });
    });
  }

  paths.forEach((path, i) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'blob';

    xhr.onprogress = (e) => {
      bytesLoaded[i] = e.loaded;
      if (e.lengthComputable) bytesTotal[i] = e.total;
      reportProgress();
    };

    xhr.onload = () => {
      bytesLoaded[i] = xhr.response.size;
      if (bytesTotal[i] === 0) bytesTotal[i] = xhr.response.size; // use final size if header was missing
      blobURLs[i] = URL.createObjectURL(xhr.response);
      downloaded++;
      reportProgress();
      if (downloaded === count) decodeAll();
    };

    xhr.onerror = () => {
      console.error('XHR failed for:', path);
      downloaded++;
      reportProgress();
      if (downloaded === count) decodeAll();
    };

    xhr.send();
  });
}

// ─── Build image path list from your naming convention ────────────────────────
// Generates: ['./img/slices/tranche(1).png', ..., './img/slices/tranche(N).png']

function buildImagePaths(basePath, count) {
  const paths = [];
  for (let i = 1; i <= count; i++) {
    paths.push(basePath + i + ').png');
  }
  return paths;
}