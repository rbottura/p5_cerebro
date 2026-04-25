const WiW = window.innerWidth, WiH = window.innerHeight
const cnvW = WiW, cnvH = WiH, currentImagesNbr = 24
let listBrainSlices = []

function preload() {
  // for nb 2, there are 30 images, and 24 for others
  asyncLoadImages(1, './img/slices/tranche(', currentImagesNbr, listBrainSlices)
  // asyncLoadImages(1, './img/slices2/slices2_(', currentImagesNbr, listBrainSlices)
  // asyncLoadImages(1, './img/slices3/slices3_(', currentImagesNbr, listBrainSlices)
  // asyncLoadImages(1, './img/slices4/slices4_(', currentImagesNbr, listBrainSlices)
  // asyncLoadImages(1, './img/slices5/slices5_(', currentImagesNbr, listBrainSlices)

  // Inverted images
  // asyncLoadImages(1, './img/slices1_inverted/slices1_inv_(', currentImagesNbr, listBrainSlices)
}

let cnv
function setup() {
  cnv = createCanvas(cnvW, cnvH, WEBGL)
  
  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)
  pixelDensity(.3)
  // ortho(-width / 2, width / 2, -height / 2, height / 2)
}

let spacing = 14
function draw() {
  background(0);
  blendMode(LIGHTEST)
  orbitControl()

  push()
  rotateX(90)
  translate(0, 0, -(currentImagesNbr / 2) * spacing)
  if (listBrainSlices.length == currentImagesNbr) {
    for (let i = 0; i < currentImagesNbr; i++) {
      push()
      stroke('white')
      noFill()
      rect(0, 0, listBrainSlices[i].width, listBrainSlices[i].height)
      translate(0, 0, i * spacing)
      if (floor(map(mouseX, 0, cnvW - 150, 0, currentImagesNbr)) == i) {
        tint(255, 255)
      } else {
        // tint(255, int(255/currentImagesNbr))
        tint(255, 127)
      }
      image(listBrainSlices[i], 0, 0, listBrainSlices[i].width, listBrainSlices[i].height)
      pop()
    }
  }
  pop()
}