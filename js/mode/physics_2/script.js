let font;
let par;
let osn;

let pts;

function preload() {
  // font = loadFont("NeueMontreal-BoldItalic.otf");
  // font = loadFont('GT-America-Mono-Bold-Trial.otf')
  // font = loadFont('FormulaCondensed-Bold.otf')
  // font = loadFont('NeueMontreal-Bold.otf')
  // font = loadFont('Coconat-Regular.otf')
  // font = loadFont('Sinistre.otf')
}

function setup() {
  createCanvas(2440 / 2, 2440 / 2);
  colorMode(HSL, 360, 100, 100, 1);
  smooth();
  osn = new OpenSimplexNoise(1000);
  par = createP();

  strokeJoin(ROUND);
  strokeCap(ROUND);

  pts = new Points({
    id: "svgPath",
    sampleFactor: 1,
    sampleDistance: 3,
    scl: 0.5,
    closed: false,
  });

  console.log(pts);
}

function draw() {
  par.html(frameRate());
  // frameRate(2)

  blendMode(BLEND);
  background(0);

  stroke(255);
  strokeWeight(8);
  noFill();
  pts.paths.forEach((group) => {
    group.forEach((path) => {
      beginShape();
      // path.pointsFinal.forEach((p) => vertex(p.p.x, p.p.y));
      // path.pointsFinal.forEach((p) => drawVertex(p.p, path.pos));
      path.pointsFinal.forEach((p) => drawVertex2(p.p, path.pos));
      endShape();
    });
  });

  // translate(width / 2, height / 2);

  // fill(0);
  // noStroke();

  // paths.chars.forEach((char) => {
  //   let pos = char.posChar;

  //   char.path.forEach((obj, i) => {
  //     if (obj.counter) {
  //       beginContour();
  //       obj.points.forEach((p) => drawVertex(p, pos));
  //       endContour();
  //       if (!char.path[(i + 1) % char.path.length].counter) endShape(CLOSE);
  //     } else {
  //       beginShape();
  //       obj.points.forEach((p) => drawVertex(p, pos));
  //       if (obj.c === 0) endShape(CLOSE);
  //     }
  //   });
  // });

  let pf = "";
  if (frameCount < 10) pf = "000";
  else if (frameCount < 100) pf = "00";
  else if (frameCount < 1000) pf = "0";
  // if (frameCount <= 5 * 60) saveCanvas(`img${pf}${frameCount}`, 'png')
  // if (frameCount > 5 * 60) noLoop()
}

const drawVertex = (p, pos) => {
  let loopDuration = 5 * 60;

  let off = map(p.y, pos.min.y, pos.max.y, 0, 80);

  let fx = map(abs(p.x - pos.mid.x), 0, pos.w / 2, 1, 0.2);
  fx = easeInOutCubic(fx);
  // fx = 1

  let fy = map(p.y, pos.min.y, pos.max.y, 0.9, 1);
  fy = easeInOutQuint(fy);
  // fy = 1

  let t = ((frameCount + off + fx * 20) % loopDuration) / loopDuration;

  let ns = osn.noise2D(p.x * 0.01, p.y * 0.01);
  ns = (ns + 1) / 2;
  ns *= 100 * sin((t * PI) / 2);

  let dx = (5 - ns / 20) * fx * fy * sin((easeInOutCubic(t) * PI) / 2);
  let dy = (200 + ns) * fx * fy * sin((easeInOutCubic(t) * PI) / 2);

  let start = createVector(p.x, p.y);
  let end = createVector(p.x + dx, p.y + dy);

  let x = lerp(start.x, end.x, sin((easeInOutCubic(t) * PI) / 2));
  let y = lerp(start.y, end.y, sin((easeInOutCubic(t) * PI) / 2));

  vertex(x, y);
};

const drawVertex2 = (p, pos) => {
  let loopDuration = 8 * 60;

  let mn = pos.min;
  let mx = pos.max;
  let md = pos.mid;

  // let off = (map(p.y + p.x, points0[0].y + points0[0].x, points0[0].y + points0[0].x + w + h, -0, 100 + random(0)))
  // let off = (map(abs(p.x - md.x), 0, w / 2, 200, 0))
  let off = map(p.y, mn.y, mx.y, 0, 120);
  let f = map(abs(p.x - md.x), 0, md.x, 1, 0.0);
  let fy = map(p.y, mn.y, mx.y, 0.9, 1);
  f = easeInOutCubic(f);
  fy = easeInOutQuint(fy);
  // f = sin(f * PI / 2)

  // let off = (map(p.x, points0[0].x, points0[0].x + w, -0, 100 + random(0)))
  let t3 =
    ((frameCount + (0 + off + fy * 100 + f * 20)) % loopDuration) /
    loopDuration;
  let t4 = map(t3, 0.4, 0.8, 0, 1);
  t4 = t3;

  let start = createVector(p.x - 0, p.y - 0);
  let end = createVector(
    p.x + 0 + 5 * f * sin((easeInOutCubic(t4) * PI) / 2 + p.x * 0.0) * fy,
    p.y + 200 * f * sin((easeInOutCubic(t4) * PI) / 2 + p.x * 0) * fy
  );

  if (end.y >= height / 2 + 200) end.y = height / 2 + 200;

  let x3 = lerp(start.x, end.x, 1 * sin(1 * easeInOutCubic(t4) * TWO_PI));
  // let y3 = lerp(start.y, end.y, cos(1 * easeInOutCubic(t4) * PI))
  let y3 = lerp(start.y, end.y, 1 * sin((1 * easeInOutCubic(t4) * PI) / 2));

  vertex(x3, y3);
};

// const drawVertex2 = (s, i, j, n) => {
//   let loopDuration = 5 * 60

//   let p = pointsRoot[s][i]
//   let mn = posRoot[s].mn
//   let mx = posRoot[s].mx
//   let md = posRoot[s].md
//   let h = posRoot[s].h
//   let w = posRoot[s].w

//   // let off = (map(p.y + p.x, points0[0].y + points0[0].x, points0[0].y + points0[0].x + w + h, -0, 100 + random(0)))
//   // let off = (map(abs(p.x - md.x), 0, w / 2, 200, 0))
//   let off = map(p.y, mn.y, mx.y, 0, 80)
//   let f = (map(abs(p.x - md.x), 0, w / 2, 1, 0))
//   let fy = map(p.y, mn.y, mx.y, 0.9, 1)
//   f = easeInOutCubic(f)
//   fy = easeInOutQuint(fy)
//   // f = sin(f * PI / 2)

//   // let off = (map(p.x, points0[0].x, points0[0].x + w, -0, 100 + random(0)))
//   let t3 = ((frameCount + (0 + off + n * 1 + fy * 100 + f * 20)) % loopDuration) / loopDuration
//   let t4 = map(t3, 0.4, 0.8, 0, 1)
//   t4 = t3

//   let ns = noise.noise2D(p.x * 0.01, p.y * 0.01)
//   // ns = (ns + 1) / 2
//   ns *= 200 * sin(t4 * PI / 2)

//   let start = createVector(p.x - 0, p.y -0)
//   let end = createVector(
//     p.x + 0 + 5 * f * sin(easeInOutCubic(t4) * PI / 2 + p.x * 0.0) * fy,
//     p.y + (200 + ns) * f * sin(easeInOutCubic(t4) * PI / 2 + p.x * 0.0) * fy
//   )

//   let x3 = lerp(start.x, end.x, 1 * sin(1 * easeInOutCubic(t4) * TWO_PI))
//   // let y3 = lerp(start.y, end.y, cos(1 * easeInOutCubic(t4) * PI))
//   let y3 = lerp(start.y, end.y, 1 * sin(1 * easeInOutCubic(t4) * PI / 2))

//   vertex(x3, y3)
// }

function mousePressed() {
  saveCanvas("canvas", "png");
}

const getPaths = (str, size, sf, distThreshold) => {
  let points = font.textToPoints(str, 0, 0, size, {
    sampleFactor: sf,
    simplifyThreshold: 0,
  });

  let px = points.map((p) => p.x);
  let py = points.map((p) => p.y);
  let paths = {
    posAll: {
      min: createVector(min(px), min(py)),
      max: createVector(max(px), max(py)),
      mid: createVector((min(px) + max(px)) / 2, (min(py) + max(py)) / 2),
      w: max(px) - min(px),
      h: max(py) - min(py),
    },
    chars: [],
  };
  points = points.map((p) => createVector(p.x, p.y).sub(paths.posAll.mid));
  paths.posAll.min.sub(paths.posAll.mid);
  paths.posAll.max.sub(paths.posAll.mid);
  paths.posAll.mid = createVector(0, 0);

  let ct = [];
  let start = 0;
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let q = points[(i + 1) % points.length];

    let end = (i + 1) % points.length;

    if (dist(p.x, p.y, q.x, q.y) > distThreshold) {
      if (end === 0) {
        end = points.length;
      }
      ct.push({ start: start, end: end - 1 });
      start = end;
    }
    if (i === points.length - 1 && ct.length === 0) {
      ct.push({ start: 0, end: points.length - 1 });
    }
  }

  let ind = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    let c1 = "abdegopq0469ADOPQR";
    let c2 = "B8";
    let c3 = "ij";

    let info = {
      char,
      path: [],
    };

    if (c1.includes(char)) {
      info.path.push(
        {
          counter: false,
          c: 1,
          points: points.slice(ct[ind].start, ct[ind].end + 1),
        },
        {
          counter: true,
          c: 0,
          points: points.slice(ct[ind + 1].start, ct[ind + 1].end + 1),
        }
      );
      paths.chars.push(info);
      ind += 2;
    } else if (c2.includes(char)) {
      info.path.push(
        {
          counter: false,
          c: 2,
          points: points.slice(ct[ind].start, ct[ind].end + 1),
        },
        {
          counter: true,
          c: 0,
          points: points.slice(ct[ind + 1].start, ct[ind + 1].end + 1),
        },
        {
          counter: true,
          c: 0,
          points: points.slice(ct[ind + 2].start, ct[ind + 2].end + 1),
        }
      );
      paths.chars.push(info);
      ind += 3;
    } else if (c3.includes(char)) {
      info.path.push(
        {
          counter: false,
          c: 0,
          points: points.slice(ct[ind].start, ct[ind].end + 1),
        },
        {
          counter: false,
          c: 0,
          points: points.slice(ct[ind + 1].start, ct[ind + 1].end + 1),
        }
      );
      paths.chars.push(info);
      ind += 2;
    } else {
      info.path.push({
        counter: false,
        c: 0,
        points: points.slice(ct[ind].start, ct[ind].end + 1),
      });
      paths.chars.push(info);
      ind++;
    }
  }

  paths.chars.forEach((char) => {
    let points = char.path.map((p) => p.points).flat();

    let px = points.map((p) => p.x);
    let py = points.map((p) => p.y);
    char.posChar = {
      min: createVector(min(px), min(py)),
      max: createVector(max(px), max(py)),
      mid: createVector((min(px) + max(px)) / 2, (min(py) + max(py)) / 2),
      w: max(px) - min(px),
      h: max(py) - min(py),
    };
  });

  console.log("paths", paths);

  return paths;
};
