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
}

const recording = false;

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

  noFill();
  let n = 8;
  count = n;
  for (let i = 0; i < n; i++) {
    pts.paths.forEach((group, c) => {
      group.forEach((path) => {
        let wav = map(i, 0, n, 400, 700);
        let col = zuc(wav, 1);
        stroke(col);
        strokeWeight(5.7 - (8 - i - 1) * 0.2);
        strokeWeight(map(i, 0, n, 5.7 - 7 * 0.2, 10));

        if (i === n - 1) stroke(255);
        else {
          stroke(lerpColor(color("blue"), color("cyan"), i / n));
        }

        push();

        beginShape();
        path.pointsFinal.forEach((p, pi) => {
          let dir = c % 2 === 0 ? -1 : 1;
          let q = createVector(p.p.x, p.p.y);
          q = trail(q.copy(), i, path.pos, c, n);
          if (pi === 0) vertex(q.x, q.y);
          curveVertex(q.x, q.y);
        });
        endShape(CLOSE);

        pop();
      });
    });
  }
}

const trail = (p, i, pos_, c, n) => {
  let loopDuration = 9 * 60;
  let pos = pos_;
  // pos = pts.p;
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
