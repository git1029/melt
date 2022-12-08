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
    id: "svgPath2",
    sampleFactor: 4,
    sampleDistance: 4,
    scl: 0.5,
    closed: true,
  });

  console.log(pts);

  points = [];
  pts.paths.forEach((group, i) => {
    group.forEach((path) => {
      path.pointsFinal = path.pointsFinal.map(
        (p, j) => new Point(p.p, path.pos, i, j)
      );
    });
  });
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

  stroke(255);
  strokeWeight(8);
  noFill();
  pts.paths.forEach((group) => {
    group.forEach((path) => {
      beginShape();
      path.pointsFinal.forEach((p) => p.run());
      endShape(CLOSE);
    });
  });

  let pf = "";
  if (frameCount < 10) pf = "000";
  else if (frameCount < 100) pf = "00";
  else if (frameCount < 1000) pf = "0";
  // if (frameCount <= 5 * 60) saveCanvas(`img${pf}${frameCount}`, 'png')
  // if (frameCount > 5 * 60) noLoop()
}

class Point {
  constructor(p, pos, i, j) {
    this.p = p;
    this.pos = pos;
    this.q = p.copy();
    this.a = 0;
    this.i = i;
    this.j = j;
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
    if (this.j === 0) vertex(this.q.x, this.q.y);
    curveVertex(this.q.x, this.q.y);
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
