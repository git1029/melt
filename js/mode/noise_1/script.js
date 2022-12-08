let myShader;
let par;
let pg, pg2;
let font;
let canvas;

document.body.style.backgroundColor = "#000";
let capturer = new CCapture({ format: "png", framerate: 60 });

function preload() {
  // font = loadFont("assets/fonts/NeueMontreal-Bold.otf");
  myShader = loadShader("shaders/shader.vert", "shaders/shader.frag");
  img = loadImage("../../../assets/img/melt_2440.png");
}

function setup() {
  canvas = createCanvas(2440 / 2, 2440 / 2, WEBGL);
  par = createP();
  setAttributes("antialias", true);
  smooth();
  img.resize(width, height);
}

let recording = false;

function draw() {
  par.html(frameRate());

  if (recording && frameCount === 1) {
    capturer.start();
  }

  let loopDuration = 1 * 60;
  let t = (frameCount % loopDuration) / loopDuration;
  let u = map(t, 0, 1, 0, TWO_PI);
  if (t === 0 && frameCount > 0) loop++;

  // pg.background(0)
  // pg.ellipse(sin(u) * 100, 0, 400, 400)

  clear();

  shader(myShader);
  myShader.setUniform("resolution", [width, height]);
  myShader.setUniform("mouse", [
    map(mouseX, 0, width, 0, 1),
    map(mouseY, 0, height, 0, 1),
  ]);
  myShader.setUniform("tex", img);
  // myShader.setUniform("tex2", pg2);
  myShader.setUniform("time", frameCount / 60);
  myShader.setUniform("pi", PI);

  rect(0, 0, width, height);

  // pg.image(canvas)
  if (frameCount > 10) myShader.setUniform("iChannel0", canvas);

  // noLoop()

  // if (frameCount === 88) saveCanvas(`warp-${frameCount}`, 'png')

  if (recording && frameCount > 12 * 60) {
    capturer.stop();
    capturer.save();
    return noLoop();
  }

  if (recording) capturer.capture(document.getElementById("defaultCanvas0"));
}

// function doubleClicked() {
//   saveCanvas(`warp-${frameCount}`, "png");
// }
