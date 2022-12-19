let font;
let par;
let osn;
let pts;
let points;

function preload() {}

function setup() {
  createCanvas(2440 / 2, 2440 / 2);
  colorMode(HSL, 360, 100, 100, 1);
  smooth();
  osn = new OpenSimplexNoise(1000);
  par = createP();

  strokeJoin(ROUND);
  strokeCap(ROUND);

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

  let grid = 30;
  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      let w = width / grid;
      let h = height / grid;
      let p = createVector(x * w + w / 2, y * h + h / 2);

      points.push(new Point(p, x, y, w, h));
    }
  }
}

let r = 400;

function draw() {
  par.html(frameRate());
  // frameRate(2)

  blendMode(BLEND);
  background(0);

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

  let pf = "";
  if (frameCount < 10) pf = "000";
  else if (frameCount < 100) pf = "00";
  else if (frameCount < 1000) pf = "0";
  // if (frameCount <= 5 * 60) saveCanvas(`img${pf}${frameCount}`, 'png')
  // if (frameCount > 5 * 60) noLoop()
}

class Point {
  constructor(p, i, j, w, h) {
    this.p = p;
    // this.pos = pos;
    this.q = p.copy();
    this.a = 0;
    this.i = i;
    this.j = j;
    this.w = w;
    this.h = h;
  }

  update = () => {
    let mp = createVector(pmouseX, pmouseY);
    let m = createVector(mouseX, mouseY);
    let force = this.q.copy().sub(m);
    let forcem = m.sub(mp);
    let f = map(constrain(force.mag(), 0, r / 2), 0, r / 2, 1, 0);
    f = easeInOutCubic(f) * 0.99;
    forcem.mult(f * 1);
    // if (f > 0) fill("red");
    // else fill(255);
    this.q.add(forcem);
    let force_ = this.p.copy().sub(this.q);
    this.q.add(force_.mult(0.02));
  };

  display = () => {
    // if (this.j === 0) vertex(this.q.x, this.q.y);
    // curveVertex(this.q.x, this.q.y);
    rect(this.q.x, this.q.y, 10, 10);
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
