let par;
let img, font;
let p5shader;

let pts, pos;
let count;

// document.body.style.backgroundColor = "#000";
// let capturer = new CCapture({ format: "png", framerate: 60 });

function preload() {}

function setup() {
  createCanvas(2440 / 2, 2440 / 2);
  smooth();
  setAttributes("antialias", true);
  par = createP();
  osn = new OpenSimplexNoise(1000);
  rectMode(CENTER);

  strokeJoin(ROUND);
  strokeCap(ROUND);

  pts = new Points({
    id: "svgPath",
    sampleFactor: 1,
    sampleDistance: 8,
    scl: 0.5,
    closed: false,
  });

  console.log(pts);

  mouse = createVector();
  mousePrev = createVector();

  window.addEventListener("mousemove", (e) => {
    (mouse.x = e.pageX), (mouse.y = e.pageY);
  });
}

const recording = false;

let mouse, mousePrev;

function draw() {
  par.html(frameRate());

  if (recording && frameCount === 1) {
    capturer.start();
  }

  let loopDuration = 16 * 60;
  let t = (frameCount % loopDuration) / loopDuration;
  let u = map(t, 0, 1, 0, TWO_PI);

  blendMode(BLEND);
  background(0);
  clear();

  let force = mouse.copy().sub(mousePrev);
  let dir = force.copy().normalize();
  let f = force.mag();

  let grid = 30;
  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      noFill();
      stroke("red");
      let w = width / grid;
      let h = height / grid;
      let p = createVector(x * w + w / 2, y * h + h / 2);
      // rect(p.x, p.y, w, h);

      let angle = osn.noise2D(p.x, p.y) * PI;
      angle = atan2(dir.y, dir.x);

      let d = dist(p.x, p.y, mouse.x, mouse.y);
      let df = 0;
      let r = w * 4;
      if (d < r) df = map(d, 0, r, 1, 0);

      angle = lerp(0, angle, df) + PI / 2;

      push();
      fill("red");
      noStroke();
      fill(map(angle, -PI + PI / 2, PI + PI / 2, 0, 360), 100, 50);
      translate(p.x, p.y);
      rotate(angle * 1);
      beginShape();
      let l = h * f * df * 0.01;
      vertex(0, -l / 2);
      vertex(w / 16, l / 2);
      vertex(-w / 16, l / 2);
      endShape(CLOSE);
      pop();
    }
  }

  mousePrev.x += force.x * 0.1;
  mousePrev.y += force.y * 0.1;
  // mousePrev = mouse.copy();
}

const trail = (p, i, pos_, c, n) => {
  let loopDuration = 9 * 60;
  let pos = pos_;
  pos = pts.p;
  let off = (p.y - pos.mid.y) * 0.5 + i * 2;
  off *= loopDuration / (6 * 60);
  let t = ((frameCount + off) % loopDuration) / loopDuration;
  // t = easeInOutCubic(t);
  let u = map(t, 0, 1, 0, TWO_PI);
  // u = PI/2

  let mf = map(constrain(dist(p.x, p.y, mouseX, mouseY), 0, 200), 0, 200, 1, 0);
  mf = easeInOutCubic(mf);
  // mf *= 1.5;

  let r = map(i, 0, n - 1, 1, 0.5);
  let fx = map(p.x, pos.min.x, pos.max.x, -1, 1);
  let fy = map(p.y, pos.min.y, pos.max.y, -1, 1);
  let x =
    p.x +
    (n - i - 1) * 0 +
    100 *
      (sin(u - (p.y - pos.mid.y) * 0.01 + i * 0.05) * 0.5 +
        0.5 +
        sin(2 * u - (p.y - pos.mid.y) * 0.05 + i * 0.05)) *
      r *
      fx *
      sin(t * 2 * PI) *
      mf;
  let y =
    p.y +
    (n - i - 1) * 0 +
    100 *
      (sin(u - (x - pos.mid.x) * 0.01 + i * 0.05) * 0.5 +
        0.5 +
        sin(2 * u - (x - pos.mid.x) * 0.05 + i * 0.05)) *
      r *
      fy *
      sin(t * 2 * PI) *
      mf;
  // y = p.y
  return createVector(x, y);
};

const zuc = (w, k) => {
  let x = constrain((w - 400) / 300, 0, 1);
  x = (w - 400) / 300;
  let cs = [3.54541723, 2.86670055, 2.29421995];
  let xs = [0.69548916, 0.49416934, 0.28269708];
  let ys = [0.02320775, 0.15936245, 0.53520021];

  let z = xs.map((xs_) => x - xs_);

  let z1 = [];
  for (let i = 0; i < cs.length; i++) {
    if (k % 2 === 0) z1[i] = cs[(i + 1) % cs.length] * z[(i + 1) % z.length];
    else z1[i] = cs[(i + 1) % cs.length] * z[(i + 0) % z.length];
  }

  let z2 = z1.map((z) => 1 - z * z);

  let z3 = [];
  for (let i = 0; i < z2.length; i++) {
    z3[i] = z2[i] - ys[(i + 1) % ys.length];
    z3[i] *= 255;
    z3[i] = constrain(z3[i], 0, 255);
    // z3[i] = 255 - z3[i]
  }

  return z3;
};
