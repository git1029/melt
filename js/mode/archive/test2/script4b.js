let font;
let par;
let osn;
let pts;
let points;
let count;
let grid;
let ld;
let rot;

function preload() {}

document.body.style.backgroundColor = "#000";
let capturer = new CCapture({ format: "png", framerate: 60 });

function setup() {
  createCanvas(1080, 1080, WEBGL);
  colorMode(HSL, 360, 100, 100, 1);
  smooth();
  osn = new OpenSimplexNoise(1000);
  par = createP();

  // strokeJoin(ROUND);
  // strokeCap(ROUND);

  pts = new Points({
    id: "svgPath3",
    sampleFactor: 4,
    sampleDistance: 4,
    scl: 0.5,
    closed: true,
  });

  console.log(pts);

  points = [];
  // pts.paths.forEach((group, i) => {
  //   group.forEach((path) => {
  //     path.pointsFinal = path.pointsFinal.map(
  //       (p, j) => new Point(p.p, path.pos, i, j)
  //     );
  //   });
  // });

  rot = createVector();

  grid = 20;
  count = 3;
  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      for (let z = 0; z < grid; z++) {
        let w = width / grid;
        let h = height / grid;
        let p = createVector(
          x * w + w / 2 - width / 2,
          y * h + h / 2 - height / 2,
          z * w + w / 2 - width / 2
        );

        let edge = false;
        if (x === 0 && y === 0) {
          edge = true;
        }
        if (x === grid - 1 && y === 0) {
          edge = true;
        }
        if (x === grid - 1 && y === grid - 1) {
          edge = true;
        }
        if (x === 0 && y === grid - 1) {
          edge = true;
        }
        if (x === 0 && z === grid - 1) {
          edge = true;
        }
        if (x === 0 && z === 0) {
          edge = true;
        }
        if (x === grid - 1 && z === 0) {
          edge = true;
        }
        if (x === grid - 1 && z === grid - 1) {
          edge = true;
        }
        if (y === 0 && z === grid - 1) {
          edge = true;
        }
        if (y === 0 && z === 0) {
          edge = true;
        }
        if (y === grid - 1 && z === 0) {
          edge = true;
        }
        if (y === grid - 1 && z === grid - 1) {
          edge = true;
        }

        for (let i = 0; i < count; i++) {
          points.push(new Point(p, x, y, w, h, i, edge, z));
        }
      }
    }
  }
}

let r = 200;

let recording = false;

function draw() {
  par.html(frameRate());

  if (recording && frameCount === ld) {
    capturer.start();
  }

  blendMode(BLEND);
  background(0);

  blendMode(SCREEN);

  ortho(-width / 2, width / 2, height / 2, -height / 2, -2000, 2000);

  ld = 6 * 60;
  let t = (frameCount % ld) / ld;

  scale(0.6 * 1.2);
  rot.x = (PI / 4) * 0.5 + frameCount * 0.0;
  rot.y = PI / 4 + t * TWO_PI + 0.2;
  rotateX(rot.x);
  rotateY(rot.y);

  // translate(-width / 2, -height / 2);

  // noFill();
  // strokeWeight(4);
  // stroke("red");
  // ellipse(mouseX, mouseY, r, r);

  // pts.paths.forEach((group) => {
  //   group.forEach((path) => {
  //     beginShape();
  //     path.pointsFinal.forEach((p) => p.update());
  //     endShape(CLOSE);
  //   });
  // });

  // orbitControl();

  // stroke(255);
  // strokeWeight(8);
  // noFill();
  // let n = 1;
  // for (let i = 0; i < n; i++) {
  //   let col = color((i * 40 * (8 / n)) % 360, 100, 50);
  //   stroke(col);
  //   if (i === n - 1) stroke("white");
  //   // fill("red");
  //   pts.paths.forEach((group) => {
  //     group.forEach((path) => {
  //       beginShape();
  //       path.pointsFinal.forEach((p) => p.display());
  //       endShape(CLOSE);
  //     });
  //   });
  // }

  points.forEach((p) => p.run());

  if (recording && frameCount > ld * 2) {
    capturer.stop();
    capturer.save();
    return noLoop();
  }

  if (recording) capturer.capture(document.getElementById("defaultCanvas0"));
}

class Point {
  constructor(p, i, j, w, h, k, edge, jj) {
    this.p = p;
    // this.pos = pos;
    this.q = p.copy();
    this.a = 0;
    this.i = i;
    this.j = j;
    this.jj = jj;
    this.w = w;
    this.h = h;
    this.k = k;
    this.edge = edge;
    this.forcem = createVector();
    this.dir = createVector();
    this.t = 0;
  }

  update = () => {
    let kf = map(this.k, 0, count, 0, 0.002);
    let off = this.k * 1;
    let t = ((frameCount + off) % ld) / ld;
    this.t = t;
    let t2 = ((frameCount - 1 + off) % ld) / ld;
    // let mp = createVector(pmouseX, pmouseY);
    let r2 = width / 2.5;
    let p2 = createVector(
      sin(-t2 * TWO_PI * 4) * r2,
      sin(-t2 * TWO_PI * 3) * r2,
      sin(-t2 * TWO_PI * 5) * r2
    );
    // p2.add(width / 2, height / 2);
    let p = createVector(
      sin(-t * TWO_PI * 4) * r2,
      sin(-t * TWO_PI * 3) * r2,
      sin(-t * TWO_PI * 5) * r2
    );

    this.dir = p.copy().sub(p2).normalize().mult(255);

    let tf = 0;
    let ts = 30;
    let te = ld - ts;
    if (frameCount < ts) {
      tf = map(frameCount, 0, ts, 0, 1);
    } else if (frameCount < te) {
      tf = 1;
    } else if (frameCount >= te && frameCount < ld) {
      tf = map(frameCount, te, ld, 1, 0);
    } else if (frameCount >= ld) tf = 0;
    // tf = 1;
    tf = easeInOutCubic(tf);
    tf = 1;

    // let p3 = createVector(
    //   sin(-t2 * TWO_PI * 4) * r2,
    //   sin(-t2 * TWO_PI * 3) * r2,
    //   sin(-t2 * TWO_PI * 5) * r2
    // );
    // // p2.add(width / 2, height / 2);
    // let p4 = createVector(
    //   sin(-t * TWO_PI * 4) * r2,
    //   sin(-t * TWO_PI * 3) * r2,
    //   sin(-t * TWO_PI * 5) * r2
    // );

    push();
    fill("black");
    noStroke();
    // stroke("red");
    translate(p.x, p.y, p.z);
    // if (this.k === 2) sphere(r / 4, r / 4, r / 4);
    pop();
    // p.add(width / 2, height / 2);
    // let m = createVector(mouseX, mouseY);
    let mp = createVector(p2.x, p2.y, p2.z);
    let m = createVector(p.x, p.y, p.z);
    let force = this.q.copy().sub(m);
    this.forcem = m.sub(mp);

    // let mp4 = createVector(p3.x, p3.y, p3.z);
    // let m4 = createVector(p4.x, p4.y, p4.z);
    // let force2 = this.q.copy().sub(m4);
    // let forcem2 = m4.sub(mp4);

    let f = map(constrain(force.mag(), 0, r / 2), 0, r / 2, 1, 0);
    f = easeInOutCubic(f) * (0.99 + kf);

    // let f2 = map(constrain(force2.mag(), 0, r / 2), 0, r / 2, 1, 0);
    // f2 = easeInOutCubic(f2) * (0.99 + kf);

    this.forcem.mult(f * 1 * tf);
    // forcem2.mult(f2 * 1);
    // if (f > 0) fill("red");
    // else fill(255);
    this.q.add(this.forcem);
    // this.q.add(forcem2);
    let force_ = this.p.copy().sub(this.q);
    // this.q.add(force_.mult(0.02 + kf));
    this.q.add(force_.mult(0.1 + kf));
  };

  display = () => {
    // if (this.j === 0) vertex(this.q.x, this.q.y);
    // curveVertex(this.q.x, this.q.y);
    let off = this.k * 1;
    let t = ((frameCount + off) % ld) / ld;

    noStroke();
    let fm = constrain(this.p.copy().sub(this.q).mag(), 0.75, 1);
    let s = 15 * 1;
    // s *= map(this.k, 0, count, 0.5, 1);
    noFill();
    // fill(zuc(map(this.i, 0, grid, 450, 650), 0));

    fill((this.k * 360) / count, 100, 50);
    // if (fm > 0.75) fill(this.dir.x, this.dir.y, this.dir.z);
    // fill("blue");
    // if (fm > 0.75) fill((this.k * 360) / count, 100, 50, 0.5);
    // if (fm > 0.75)
    //   fill(palette(t * 4 + this.i * 0.5 + this.j / grid + this.jj / grid));
    // if (fm > 0.75) fill(map(fm, 0.75, 4, 0, 360), 100, 50);
    // let c = lerpColor(color(150, 100, 10), color("lime"), fm);
    // c.setAlpha(0.5);
    // stroke(c);
    // strokeWeight(2 * map(abs(this.i - 10), 0, 10, 1, 0.5));
    // if (this.k === count - 1) fill(255);
    push();
    translate(this.q.x, this.q.y, this.q.z);
    rotateY(-rot.y);
    rotateX(-rot.x);
    translate(0, 0, this.k * 0.1 + fm * 0);
    // rotate(map(this.k, 0, count, 0, TWO_PI) + frameCount * 0.1);
    // scale(s);
    // if (this.edge) {
    //   fill(100);
    //   // stroke(100);
    // }
    // if (!this.edge) rect(0, 0, s, s);
    // else if (this.k === 0) rect(0, 0, s, s);
    let n = 4;
    if (fm > 0.75) {
      if (this.k < 2) {
        rect(0, 0, s, s);
      }
    } else if (
      this.i < n ||
      this.j < n ||
      this.jj < n ||
      this.i > grid - 1 - n ||
      this.j > grid - 1 - n ||
      this.jj > grid - 1 - n
    ) {
      pop();
      return;
    } else if (
      this.i === n ||
      this.j === n ||
      this.i === grid - 1 - n ||
      this.j === grid - 1 - n ||
      this.jj === n ||
      this.jj === grid - 1 - n
    )
      rect(0, 0, s, s);
    // box(s, s, s);
    pop();
  };

  run = () => {
    this.update();
    this.display();
  };
}

// const drawVertex = (p, pos, pp) => {
//   // noStroke();
//   // fill(255);

//   let q = p;
//   let mp = createVector(pmouseX, pmouseY);
//   let m = createVector(mouseX, mouseY);
//   let force = q.copy().sub(m);
//   let forcem = m.sub(mp);
//   let f = map(constrain(force.mag(), 0, r / 2), 0, r / 2, 1, 0);
//   // f = easeInOutCubic(f) * 0.9;
//   forcem.mult(f * 1);
//   // if (f > 0) fill("red");
//   // else fill(255);
//   q.add(forcem);

//   let force_ = pp.copy().sub(q);
//   q.add(force_.mult(0.5));

//   curveVertex(q.x, q.y);
// };

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
    else z1[i] = cs[(i + 1) % cs.length] * z[(i + 2) % z.length];
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

const palette = (t) => {
  let a = [0.5, 0.5, 0.5];
  let b = [0.5, 0.5, 0.5];
  let c = [1, 1, 1];
  let d = [0, 0.33, 0.67];

  let e = [];
  for (let i = 0; i < c.length; i++) {
    e[i] = cos(c[i] * t + d[i] * TWO_PI) * b[i] + a[i];
    e[i] *= 255;
  }

  return e;
};
