const WiW = window.innerWidth, WiH = window.innerHeight
const cnvW = WiW, cnvH = WiH, currentImagesNbr = 24

let listBrainSlices = []

// ─── Choose your slice folder here ────────────────────────────────────────────
const SLICE_BASE = './img/slices/tranche('
// const SLICE_BASE = './img/slices2/slices2_('
// const SLICE_BASE = './img/slices3/slices3_('
// const SLICE_BASE = './img/slices4/slices4_('
// const SLICE_BASE = './img/slices5/slices5_('
// const SLICE_BASE = './img/slices1_inverted/slices1_inv_('

function preload() {
  // Intentionally empty — loading is handled manually in setup()
  // so we get real byte-level progress instead of p5's opaque blocking
}

let cnv
function setup() {
  cnv = createCanvas(cnvW, cnvH, WEBGL)
  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)
  pixelDensity(.7)

  // Build the list of paths and start the byte-accurate loader
  const paths = buildImagePaths(SLICE_BASE, currentImagesNbr)

  preloadWithProgress(
    paths,
    (pct) => setProgress(pct),       // called on every XHR progress tick
    (images) => {                     // called once all images are decoded
      listBrainSlices = images.filter(Boolean) // drop any that failed
      hideLoadingScreen()
    }
  )
}

let spacing = 14
function draw() {
  background(0)
  blendMode(LIGHTEST)
  let orbitSpeed = 5
  orbitControl(orbitSpeed, orbitSpeed, orbitSpeed)

  push()
  rotateX(90)
  translate(0, 0, -(currentImagesNbr / 2) * spacing)

  if (listBrainSlices.length === currentImagesNbr) {
    for (let i = 0; i < currentImagesNbr; i++) {
      push()
      stroke('white')
      noFill()
      rect(0, 0, listBrainSlices[i].width, listBrainSlices[i].height)
      translate(0, 0, i * spacing)
      if (floor(map(mouseX, 0, cnvW - 150, 0, currentImagesNbr)) === i) {
        tint(255, 255)
      } else {
        tint(255, 127)
      }
      image(listBrainSlices[i], 0, 0, listBrainSlices[i].width, listBrainSlices[i].height)
      pop()
    }
  }

  pop()
}