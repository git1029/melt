let par;
let img, font;
let p5shader;

let pts, pos;
let count;

document.body.style.backgroundColor = "#000";
let capturer = new CCapture({ format: "png", framerate: 60 });

function preload() {
  // p5shader = loadShader("js/shaders/shader.vert", "js/shaders/shader.frag");
  // font = loadFont("static/fonts/NeueMontreal-BoldItalic.otf");
  // img = loadImage("static/bg.png");
}

function setup() {
  createCanvas(2440 / 2, 2440 / 2);
  colorMode(HSL, 360, 100, 100, 1);
  smooth();
  setAttributes("antialias", true);
  par = createP();
  osn = new OpenSimplexNoise(1000);

  // strokeJoin(ROUND);
  // strokeCap(ROUND);
  strokeJoin(SQUARE);
  strokeCap(SQUARE);
  // strokeJoin(PROJECT)
  // strokeCap(PROJECT)

  pts = new Points({
    id: "svgPath",
    sampleFactor: 1,
    sampleDistance: 8,
    scl: 0.5,
    closed: false,
  });

  console.log(pts);

  // image(img, 0, 0);

  // pts.paths.forEach((group) => {
  //   group.forEach((path) => {
  //     console.log(path.pointsFinal.length);
  //   });
  // });

  // let tp = font.textToPoints("I", 0, 0, 1000, {
  //   sampleFactor: 0.1,
  //   simplifyThreshold: 0,
  // });
  // let tpx = tp.map((p) => p.x);
  // let tpy = tp.map((p) => p.y);
  // pos = {
  //   min: createVector(min(tpx), min(tpy)),
  //   max: createVector(max(tpx), max(tpy)),
  // };
  // pos.mid = createVector(
  //   (pos.min.x + pos.max.x) / 2,
  //   (pos.min.y + pos.max.y) / 2
  // );
  // pos.w = pos.max.x - pos.min.x;
  // pos.h = pos.max.y - pos.min.y;
  // tp = tp.map((p) => {
  //   return {
  //     p: createVector(
  //       p.x - pos.mid.x + width / 2,
  //       p.y - pos.mid.y + height / 2
  //     ),
  //   };
  // });

  // tpx = tp.map((p) => p.x);
  // tpy = tp.map((p) => p.y);
  // pos = {
  //   min: createVector(min(tpx), min(tpy)),
  //   max: createVector(max(tpx), max(tpy)),
  // };
  // pos.mid = createVector(
  //   (pos.min.x + pos.max.x) / 2,
  //   (pos.min.y + pos.max.y) / 2
  // );
  // pos.w = pos.max.x - pos.min.x;
  // pos.h = pos.max.y - pos.min.y;

  // pts = {
  //   p: pos,
  //   paths: [[{ sub: false, pointsFinal: tp, pos }]],
  // };

  // pts.paths.forEach(group => group.forEach(path => console.log(path.pos)))

  // fill('red')
  // noStroke()
  // pts.paths.forEach(group => {
  //   group.forEach(path => {
  //     path.pointsFinal.forEach(p => ellipse(p.p.x, p.p.y, 4))
  //   })
  // })

  // pointsFinal = pts.paths
  // let pos = pts.p

  // console.log('pointsFinal', pointsFinal)
  // pointsFinal.forEach(g => {
  //   g.forEach(path => {
  //     path.pointsFinal = path.pointsFinal.map(p => createVector(
  //       p.p.x - pos.mid.x,
  //       p.p.y - pos.mid.y
  //     ))
  //   })
  // })
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
  // background("#180024");

  // blendMode(SCREEN)

  // translate(-(1920 - width) / 2, 0);

  // translate(pts.p.mid.x, pts.p.mid.y)

  noFill();
  let n = 8;
  count = n;
  for (let i = 0; i < n; i++) {
    pts.paths.forEach((group, c) => {
      group.forEach((path) => {
        // stroke((i*40 * (8/n) + frameCount*0 + c * 40) % 360, 100, 50)
        // let col = palette(i/101.)
        // console.log(col)
        // let wav = map(i, 0, n, 400, 700)
        // let col = zuc(wav, 0)
        // stroke(col)
        if (i === n - 1) stroke(255);
        strokeWeight(5.7 - (8 - i - 1) * 0.2);
        strokeWeight(map(i, 0, n, 5.7 - 7 * 0.2, 10));
        // strokeWeight(map(i, 0, n, 5.7-7*.2, 5.7))
        // noLoop()
        // strokeWeight(3)
        // if (i === n - 1) strokeWeight(5.7)
        // else strokeWeight(map(i, 0, n - 1, 2, 4))
        // strokeWeight(map(i, 0, n, 2, 5.7))
        // if (i === n - 1) fill('#180024')

        // let h = group[0].pos.max.y - group[0].pos.min.y
        // let w = group[0].pos.max.x - group[0].pos.min.x
        // let dy = h * 1.
        // let dx = 100

        // let loopDuration = 8 * 60
        // let tBase = (frameCount % loopDuration) / loopDuration

        // let off = (map(i, 0, n, 0, 20 * sin(tBase * PI)))
        // let t = ((frameCount + off) % loopDuration) / loopDuration
        // let tRot = easeInOutQuad(t)
        // t = easeInOutCubic(t)

        // let start = createVector(0, 0)
        // let start2 = createVector(0, 0)
        // let end = createVector(
        //   300,
        //   dy
        // )
        // let end2 = createVector(
        //   300,
        //   dy
        // )

        // let c_ = 0
        // if (c < 4) c_ = 2
        // else if (c < 7) c_ = 1
        // else c_ = 0

        // let d = createVector(c % 2 === 0 ? 2 + c_ : -2 - c_, c % 2 === 0 ? 3 + c_ : -3 - c_)

        // // let fi = map(i, 0, n, 1, 0)
        // let fi = 1
        // if (i === n - 1) fi = 0
        // let x0 = lerp(start.x, end.x, sin(d.x * (t) * TWO_PI) * fi)
        // let y0 = lerp(start.y, end.y, sin(d.y * (t) * TWO_PI) * fi)

        let alpha = map(i, 0, n - 1, 0, 1);
        // fill((hue + 0 * 240) % 360, 100, 50, alpha)

        let col = color(
          (i * 40 * (8 / n) + frameCount * 0 + c * 0) % 360,
          100,
          50
        );
        // col.setAlpha(alpha)
        stroke(col);

        // if (i < rep / 2) {
        //   fill(lerpColor(
        //     color(colors.orange),
        //     color(colors.darkBlue),
        //     map(i, 0, rep / 2, 0, 1)
        //   ))
        // }
        // else {
        //   fill(lerpColor(
        //     color(colors.darkBlue),
        //     color(colors.lightBlue),
        //     map(i, rep / 2, rep, 0, 1)
        //   ))
        // }

        if (i === n - 1) stroke("white");

        push();

        // translate(x0, y0)
        // rotate(1 * tRot * TWO_PI * fi)
        // scale(lerp(1, map(i, 0, n, 0.5, 1), sin(t * PI)))

        beginShape();
        path.pointsFinal.forEach((p, pi) => {
          let dir = c % 2 === 0 ? -1 : 1;
          let q = createVector(p.p.x, p.p.y);
          // let q = createVector(p.p.x, p.p.y).sub(pts.p.mid)
          // q.x = p.p.x + sin(frameCount*0.05 * dir + p.p.y * 0.02 + i*.5 + c) * ((n-i-1)*3) * .5 * map(i, 0, n, 1, 0) * 1
          // q.y = p.p.y + tan(frameCount*0.05 * 1 + p.p.y * 0.0001 + i*2 + c) * ((n-i-1)*3) * .001
          // q.y = p.p.y + sin(frameCount*0.05 + p.p.x * 0.01 + i*.5) * ((n-i-1)*3)
          // if (i === 0 && pi == 0) console.log(group[0].pos)
          // noLoop()

          // q = trail(q.copy(), i, group[0].pos, c, n);
          // q = crystals(q.copy(), i, group[0].pos, pi, c);

          // q = rotation(q.copy(), i, path.pos, c);
          // q = drop(q.copy(), i, group[0].pos, c);
          // q = scale1(q.copy(), i, group[0].pos, c);
          // q = scale2(q.copy(), i, group[0].pos, c);
          // q = drawVertex2(q.copy(), i, group[0].pos, c); // displacement glitch
          // q = drawVertex3(q.copy(), i, group[0].pos, c); // displacement
          // q = drawVertex4(q.copy(), i, group[0].pos, c); // displacement (left to right)
          // vertex(q.x, q.y);

          drawVertex(q, i, i, path.pos, c, pi); // extrusions

          // drawVertex5(q.copy(), i, group[0].pos, c); // G 36DOT21

          // noStroke()
          // fill(i*40, 100, 50)
          // if (i === n-1) fill(255)
          // ellipse(q.x, q.y, 4)
          // rotate(q, i, path.pos)
        });
        endShape(CLOSE);

        pop();
      });
    });

    // image(img, 0, 0);
  }

  // shader(p5shader)
  // p5shader.setUniform('resolution', [width, height])
  // p5shader.setUniform('time', frameCount/60)
  // p5shader.setUniform('PI', PI)

  // rect(0, 0, width, height)

  // noLoop()

  if (recording && frameCount > 8 * 60) {
    capturer.stop();
    capturer.save();
    return noLoop();
  }

  if (recording) capturer.capture(document.getElementById("defaultCanvas0"));
}

// function doubleClicked() {
//   saveCanvas("project", "png");
// }

const trail = (p, i, pos, c, n) => {
  let loopDuration = 6 * 60;
  let t = (frameCount % loopDuration) / loopDuration;
  t = easeInOutCubic(t);
  let u = map(t, 0, 1, 0, TWO_PI);
  // u = PI/2

  let r = map(i, 0, n - 1, 1, 0);
  let fx = map(p.x, pts.p.min.x, pts.p.max.x, -1, 1);
  let fy = map(p.y, pts.p.min.y, pts.p.max.y, -1, 1);
  let x =
    p.x +
    (n - i - 1) * 0 +
    50 *
      (sin(u - abs(p.y - pts.p.mid.y) * 0.01 + i * 0.05) * 0.5 +
        0.5 +
        sin(2 * u - abs(p.y - pts.p.mid.y) * 0.05 + i * 0.05)) *
      r *
      fx *
      sin(t * PI);
  let y =
    p.y +
    (n - i - 1) * 0 +
    50 *
      (sin(u - abs(x - pts.p.mid.x) * 0.01 + i * 0.05) * 0.5 +
        0.5 +
        sin(2 * u - abs(x - pts.p.mid.x) * 0.05 + i * 0.05)) *
      r *
      fy *
      sin(t * PI);
  // y = p.y
  return createVector(x, y);
};

const crystals = (p, n, pos, i, j) => {
  let loopDuration = 6 * 60;
  let tBase = (frameCount % loopDuration) / loopDuration;

  let mn = pos.min;
  let mx = pos.max;

  let dir = i % 2 === 0 ? -1 : 1;
  // dir = 1

  // let dy = dir * -h * 1.25
  // let dx = 50 * dir

  let off =
    i % 3 === 0
      ? map(p.y + 0, mn.y, mx.y, 90, 0)
      : // : (map(p.y + 0, mn.y, mx.y, 0, 90))
        map(p.y + p.x, mn.y + mn.x, mx.y + mx.x, 100, 0);
  // off = (map(p.x, mn.x, mx.x, 0, 150))
  // off = (map(p.y+p.x, mn.y+mx.x, mx.y+mn.x, 0, 100))
  // off = 0
  // off = j % 2 === 0 ? (map(p.x, mn.x, mx.x, 150, 0)) : (map(p.x, mn.x, mx.x, 0, 150))
  let t_ =
    ((loopDuration / 4 + (off + 0 + 0 + n * 4)) % loopDuration) / loopDuration;
  t_ = ((frameCount + (off - j * 10 + n * 4)) % loopDuration) / loopDuration;
  let ns =
    map(
      osn.noise4D(0, p.x * 0.01, p.y * 0.02, sin(t_ * TWO_PI) + 50),
      -1,
      1,
      -100,
      100
    ) * 0.0;
  // t = map(t, 0.2, 0.8, 0, 1)

  let t = 0;
  let gap = 0.25;
  if (t_ < gap) t = 0;
  else if (t_ < 1 - gap) t = map(t_, gap, 1 - gap, 0, 1);
  else t = 1;

  // let dx = sin(t * 0.02 * ( p.x * p.y ) * 0.01) * 50
  // let dy = cos(t * 0.02 * ( p.x * p.y ) * 0.01) * 50

  let fi = map(n, 0, count, 1, 0);
  if (n === count - 1) fi = 0;

  let dxx = map(p.x, pts.p.mid.x, pts.p.max.x, 0, PI);
  let dyy = map(abs(p.y - pts.p.mid.y), 0, pts.p.mid.y, 0, PI);
  let dxy = (sin(tBase * TWO_PI + (dyy + dxx) * 0) * 0.5 + 0.5) * 15;

  let dfx = map(i, 0, count, 1, 0);

  let start = createVector(p.x, p.y - 0);
  let end = createVector(
    // p.x + dx,
    // width / 2,
    p.x + dir * (15 + dxy + ns) * sin(p.y + easeInOutCubic(t) * TWO_PI) * fi,
    p.y + dir * (15 + dxy - ns) * sin(p.x + easeInOutCubic(t) * TWO_PI) * fi
    // p.y
    // p.x + dx,
    // width / 2,
    // p.y - dy * sin(easeInOutQuint(t) * PI)
    // p.y + 10 * sin(easeInOutCubic(t) * PI),
    // p.y + dy
    // height
  );

  let x = lerp(start.x, end.x, sin(1 * easeInOutCubic(t) * TWO_PI));
  let y = lerp(start.y, end.y, sin(1 * easeInOutQuint(t) * TWO_PI));
  // vertex(x, y)
  return createVector(x, y);
};

const scale1 = (p, o, pos, c) => {
  let c_ = 0;
  if (c < 4) c_ = 2;
  else if (c < 7) c_ = 1;
  else c_ = 0;

  let loopDuration = 2 * 60;
  let off = o * 0 + map(p.y, pos.max.y, pos.min.y, 0, 40) + c_ * 15;
  let t = ((frameCount + off) % loopDuration) / loopDuration;
  t = easeInOutCubic(t);
  t = sin(t * PI);
  let s = map(o, 0, 8, 0.1, 1);
  let scl = lerp(1, s, t);

  let q = p.copy().sub(pos.mid);
  q.mult(scl);
  q.add(pos.mid);
  // vertex(q.x, q.y)
  return q;
};

// const displace = (p, o, pos, c) => {
//   let h = pos.max.y - pos.min.y
//   let dy = h * 1.666

//   let loopDuration = 8 * 60
//   let tBase = (frameCount % loopDuration) / loopDuration

//   let off = (map(o, 0, 8, 0, 160 * sin(tBase * PI)))
//   let t = ((frameCount + off) % loopDuration) / loopDuration
//   let tRot = easeInOutQuad(t)
//   t = easeInOutCubic(t)

//   let start = createVector(0, 0)
//   let start2 = createVector(0, 100)
//   let end = createVector(
//     350,
//     dy
//   )
//   let end2 = createVector(
//     330,
//     dy + 100
//   )

//   let x0 = lerp(start.x, end.x, sin(2 * (t) * TWO_PI))
//   let y0 = lerp(start.y, end.y, sin(3 * (t) * TWO_PI))

//   let x1 = lerp(start2.x, end2.x, sin(5 * (1 - t) * TWO_PI))
//   let y1 = lerp(start2.y, end2.y, sin(4  * (1 - t) * TWO_PI))

//   // x0 = start.x
//   // x1 = start.x
//   // y0 = start.y
//   // y1 = start.y

//   if (o === 8 - 1) {
//     let c0 = color(zuc(550))
//     let c1 = color(zuc(530))
//     let t_
//     let cs = 0.005
//     let ce = 0.995
//     if (t < cs) t_ = map(t, 0, cs, 0, 1)
//     else if (t > ce) t_ = map(t, ce, 1, 1, 0)
//     else t_ = 1

//     let c = lerpColor(c0, c1, t_)

//     // stroke(c)
//   }

//   push()
//   translate(x0, y0)
//   rotate(1 * tRot * TWO_PI)
//   textSize(map(j, 0, count, size * (1 - sin(t * PI)), size))
//   // textSize(size)
//   text('D', 0, 0)
//   pop()
// }

const scale2 = (p, o, pos, c) => {
  let c_ = 0;
  if (c < 4) c_ = 2;
  else if (c < 7) c_ = 1;
  else c_ = 0;

  let loopDuration = 4 * 60;
  let toff = 0;
  // if (c_ === 1) toff = 80
  // toff += c_ * 40

  let c2 = 0;
  if (c < 4) {
    if (c < 2) c2 = 0;
    else c2 = 1;
  }

  // if (c2 === 0) toff = 60

  // let off = o * 3 + map(p.y + p.x, pos.max.y, pos.min.y, 0, 0) + c_*15 + c * 10
  let offf = c2 % 2 === 1 ? [0, 20] : [20, 0];
  offf = [0, 20];
  let off =
    o * 3 + map(p.y + p.x, pos.max.y, pos.min.y, ...offf) + c_ * 15 + c2 * 10;
  // if (c2 % 2 === 1) off = o * 3 + map(-p.y + p.x, pos.max.y, pos.min.y, ...offf) + c_*15 + c2 * 10

  let t_ =
    ((frameCount + off + loopDuration + toff) % loopDuration) / loopDuration;
  // if (t < 0.5) t = map(t, 0, 0.5, 0, 1)
  // else t = 1

  let t = 0;
  let gap = 0.25;
  if (t_ < gap) t = 0;
  else if (t_ < 1 - gap) t = map(t_, gap, 1 - gap, 0, 1);
  else t = 1;

  t = easeInOutCubic(t);
  t = sin(t * PI * 2);
  let s = map(o, 0, 8, 2, 1);
  let scl = lerp(1, s, t);

  let q = p.copy().sub(pos.mid);
  // q.mult(scl)
  q.x *= scl;
  q.add(pos.mid);
  // vertex(q.x, q.y)

  // if (o === 8 - 1) return p
  return q;
};

const drawVertex = (p, n, s, pos, c, i) => {
  let loopDuration = (TWO_PI / 6) * 10 * 60;
  loopDuration = 8 * 60;
  let delay = 6 * 60;
  // delay = 0
  let t = ((frameCount + delay) % loopDuration) / loopDuration;
  // t = easeInOutQuint(t);
  let u = map(t, 0, 1, 0, TWO_PI);

  u = PI / 2;

  let mf = map(constrain(dist(p.x, p.y, mouseX, mouseY), 0, 200), 0, 200, 1, 0);
  mf = easeInOutCubic(mf);

  // let u4 = map(easeInOutQuint(t), 0, 1, 0, PI);
  let u4 = map(easeInOutCubic(t), 0, 1, 0, 2 * PI);

  let tf = frameCount * 0.01;
  tf = u;

  let f = sin(tf) * 10;
  f = 10 + (sin(map(t, 0, 1, 0, 2 * PI)) * 0.5 + 0.5) * 10;

  let q = p.copy().sub(pos.mid);
  // f = sin(u) * 20
  // let p = createVector(points[i].x, points[i].y)
  let o = createVector(1, 0);
  let r = dist(q.x, q.y, o.x, o.y);
  // console.log(p, r, o)
  let a = o.angleBetween(q);

  // let ns = osn.noise3D(sin(a * 2) * 1, frameCount * 0, sin(a * 2) * 1) * 1;
  // let ns = noise.noise3D(sin(a * 2) * cos(a) + 1000, frameCount * 0. + cos(a), sin(a * 2) * cos(a)) * 1

  let dir = p.x < 0 ? -1 : 1;
  // dir *= -1
  // dir = 1

  let df = map(r, 0, 540, 1, 1 + 0.5 * (sin(t * TWO_PI) * 0.5 + 0.5));
  // df = 1

  let nf = map(n, 0, count, 1, 0);

  let off = n * 0 * sin(u * 5) + s * 0;
  // off = 0
  let rf = -r / 2; // r / 3
  // rf *= map(ns, -1, 1, 0.5, 2); // map(ns, -1, 1, 0.5, 2)
  let r_ =
    r *
      (1.5 +
        sin(u4) * 0.25 +
        (0.0 * (sin(t * TWO_PI) * 0.5 + 0.5) - 0.5 * (1 - nf) * 0) +
        map(n, 0, 8, 0, 0)) +
    abs(
      sin(u * 15 * df + cos(a + PI * 0) * f + off * 1 + frameCount * 0 * dir)
    ) *
      rf *
      df;
  // r_ = r_ + r / 2

  let x = p.x;
  let y = p.y;

  // let midAll = pos.mid.copy().sub(width / 2 + (1920-width)/2, height / 2)
  let midAll = pts.p.mid.copy().sub(pos.mid);
  let aAll = o.angleBetween(midAll);

  // console.log(a)
  // if (frameCount > 2) noLoop()

  let a2 = map(a, -PI, PI, 0, TWO_PI);
  // if (frameCount < 2 && c == 0) console.log(a)
  // let a2 = a
  // if (a < 0) a2 = TWO_PI + a
  // TOP = >PI [PI-2PI]
  // BOTTOM = <PI [0-PI]
  // LEFT = [>0.5PI] [<1.5PI]
  // RIGHT = [<0.5PI] [>1.5PI]
  let aOff = (c * PI) / 8 + PI * 0.5 + i * 0.0;
  aOff *= 0;
  aOff = map(aAll, -PI, PI, 0, TWO_PI) + PI * 1;
  let aGap = PI * 1.99;
  // aGap = abs(aGap) % TWO_PI;

  let ld = 2 * 60;
  let offt = c + n * 2;
  let t2 = ((frameCount + offt) % ld) / ld;
  // t2 = easeInOutCubic(t2)
  let u2 = map(t2, 0, 1, 0, TWO_PI) * 1;
  if (c % 2 === 0) u2 = TWO_PI - u2;

  let aStart = u2 + aOff - (aGap / 2) * 0;
  // if (aStart < 0) aStart = TWO_PI + aStart
  let aEnd = aStart + aGap / 1;
  aStart %= TWO_PI;
  aEnd %= TWO_PI;

  // t2 = 0;

  // push()
  // // noStroke()
  // let ind = 100
  // stroke('green')
  // if (c == 0 && i == ind) ellipse(map(aStart, 0, TWO_PI, 0, width) + (1920-width)/2, 0, 10, 10)
  // stroke('red')
  // if (c == 0 && i == ind) ellipse(map(aEnd, 0, TWO_PI, 0, width) + (1920-width)/2, 0, 10, 10)
  // // fill('cyan')
  // // if (c == 0 && i == 0) ellipse(map(a2, 0, TWO_PI, 0, width) + (1920-width)/2, 0, 10, 10)
  // pop()

  // if (frameCount === 40) noLoop()

  if (
    (aStart < aEnd && a2 >= aStart && a2 < aEnd) ||
    (aStart >= aEnd && (a2 >= aStart || a2 < aEnd))
  ) {
    // if (a3 >= aStart && a3 < aEnd) {
    // x = lerp(x_, p.x, map(abs(a) - PI/4, 0, PI/4, 1, 0))
    // y = lerp(y_, p.y, map(abs(a) - PI/4, 0, PI/4, 1, 0))
    let af = 1;
    if (aStart < aEnd && a2 >= aStart && a2 < aEnd) {
      let aMid = (aStart + aEnd) / 2;
      af = map(abs(a2 - aMid), 0, aGap / 2, 1, 0);
      // stroke('red')
      // if (c == 0 && i == 150) ellipse(map(aStart, 0, TWO_PI, 0, width) + (1920-width)/2, 0, 10, 10)
      // stroke('green')
      // if (c == 0 && i == 150) ellipse(map(aEnd, 0, TWO_PI, 0, width) + (1920-width)/2, 0, 10, 10)
      // af = 1
      // x = lerp(p.x, x_, af)
      // y = lerp(p.y, y_, af)

      // stroke('cyan')
      // if (c == 0 && i == ind) ellipse(map(a2, 0, TWO_PI, 0, width) + (1920-width)/2, 0, af * 10)
    } else if (aStart >= aEnd && (a2 >= aStart || a2 < aEnd)) {
      let aEnd2 = aEnd + TWO_PI;
      let aMid = (aStart + aEnd2) / 2;
      let a3 = a2 < aEnd ? a2 + TWO_PI : a2;
      // stroke('red')
      // if (c == 0 && i == 150) ellipse(map(aStart, 0, TWO_PI, 0, width) + (1920-width)/2, 0, 10, 10)
      // stroke('green')
      // if (c == 0 && i == 150) ellipse(map(aEnd, 0, TWO_PI, 0, width) + (1920-width)/2, 0, 10, 10)
      af = map(abs(a3 - aMid), 0, aGap / 2, 1, 0);
      // if (i == 0 && c == 0) console.

      // stroke('pink')
      // if (c == 0 && i == ind) ellipse(map(a2, 0, TWO_PI, 0, width) + (1920-width)/2, 0, af * 10)

      //   let aMid = ((aStart + (TWO_PI-aStart)) % TWO_PI + (aEnd + (TWO_PI-aStart)) % TWO_PI) / 2
      //   // af = map(abs(a2 - aMid), 0, aMid, 1, 0)
      //   af = map(abs((a2 + (TWO_PI-aStart)) % TWO_PI - aMid), 0, aMid, 1, 0)
      //   // af = easeInOutCubic(af)
      // af = 1
    }
    af = pow(af, 0.5) * (sin(t2 * TWO_PI + c + n * 0.5) * 0.5 + 0.5);
    // af = easeInOutCubic(af);
    // t = easeInOutCubic(t);
    // af *= sin(t * TWO_PI) * 0.5 + 0.5;
    // af = easeInOutCubic(af) * 1;
    // af = 1
    // af = easeInOutCubic(af) * (sin(frameCount*0.1)*.5+.5)

    // mf = 1;
    x = lerp(p.x, r_ * 1.25 * cos(a) + pos.mid.x, af * mf);
    y = lerp(p.y, r_ * 1.25 * sin(a) + pos.mid.y, af * mf);

    // x = lerp(p.x, r_ * cos(a) + pos.mid.x, 1)
    // y = lerp(p.y, r_ * sin(a) + pos.mid.y, 1)
  }

  // let x_ = p.x
  // let y_ = p.y

  // ellipse(x_, y_, 5)
  curveVertex(x, y);
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

const drawVertex2 = (q, n, pos, j) => {
  let loopDuration = 3 * 60;

  let c_ = 0;
  if (j < 4) c_ = 2;
  else if (j < 7) c_ = 1;
  else c_ = 0;

  let p = q.copy();

  let dir = j % 2 === 0 ? -1 : 1;

  let h = pos.max.y - pos.min.y;
  let w = pos.max.x - pos.min.x;

  let diry = map(p.y, pts.p.min.y, pts.p.max.y, -1, 1);
  diry = 1;
  // let dy = dir * -h * (1 + r)
  let dy = 1 * -h * 1 * diry;
  // let dx = 100 * (1 + r)
  let dx = 100;

  // let off = (map(p.x, mn.x, mx.x, 0, 60))
  // let off = (map(p.y + p.x / 4, mn.y + mn.x / 4, mx.y + mx.x / 4, 0, 120))
  let off = map(p.y, pos.min.y, pos.max.y, 0, 40 + random(0));
  // if (c_ === 1) off = (map(p.y, pos.min.y, pos.max.y, 0, 40 + random(0)))
  // if (c_ === 2) off = (map(p.y, pos.max.y, pos.min.y, 0, 40 + random(0)))
  let t3 =
    ((frameCount + (off + n * 2 + c_ * 15)) % loopDuration) / loopDuration;
  let t4 = map(t3, 0.15, 0.85, 0, 1);
  t4 = t3;

  // let xd = map(abs(md.x - p.x), 0, md.x, 0, w)
  // if (md.x - p.x < 0) xd *= -1

  // p.add(pos.mid)

  let start = createVector(p.x, p.y);
  let end = createVector(
    // p.x + dx * sin(easeInOutQuint(t4) * TWO_PI),
    // p.x + dx,
    // pos.mid.x,
    // pts.p.mid.x,
    pts.p.mid.x + map(p.x, pts.p.min.x, pts.p.max.x, -w / 2, w / 2),
    // p.x * 1,
    // pts.p.mid.x + map(p.x, pos.min.x, pos.max.x, -300, 300) * 0,
    // p.y - dy * tan(easeInOutQuint(t4) * PI / 4)
    p.y - dy * sin(easeInOutQuint(t4) * PI)
    // p.y - dy
  );

  let x3 = lerp(start.x, end.x, sin(2 * easeInOutQuint(t4) * PI));
  let y3 = lerp(start.y, end.y, sin(1 * easeInOutQuint(t4) * TWO_PI));
  // vertex(x3, y3)

  // if (c_ === 1) return createVector(x3, p.y)
  return createVector(x3, y3);
};

const rotation = (p, o, pos, c) => {
  let dir = c % 2 === 0 ? 1 : -1;
  const loopDuration = 4 * 60;

  let x = p.x;
  let y = p.y;
  let z = 0;

  let hf = height / 900;

  let c_ = 0;
  if (c < 4) c_ = 0;
  else if (c < 7) c_ = 1;
  else c_ = 2;

  // let off = map(y + x*.25*0, 100 * hf, height - 100 * hf, 0, -100*hf)
  // off *= 5/4 * 1
  // off += this.n * 10
  // off += o * 0.8

  // let off = createVector(
  //   map(x, 100 * hf, height - 100 * hf, 0, -100*hf) + o * 0.8,
  //   map(y, 100 * hf, height - 100 * hf, 0, -100*hf) + o * 0.8,
  //   map(y, 100 * hf, height - 100 * hf, 0, -100*hf) + o * 0.8
  // )

  // const tBase = ((frameCount + off) % loopDuration) / loopDuration
  // // this.tBase = easeInOutQuint(this.tBase)
  // let uBase = map(tBase, 0, 1, 0, TWO_PI)

  // let t_ = ((frameCount + off) % loopDuration) / loopDuration
  // t_ = easeInOutQuint(t_)
  // let u = map(t_, 0, 1, 0, TWO_PI)

  let off0 = map(y + x * 0.25 * 0, 100 * hf, height - 100 * hf, 0, -100 * hf);
  // let off0 = map(y + x*.25*0, pos.min.y, pos.max.y, 0, 20)

  // off0 += o * 0.8
  off0 += o * 3 + c_ * 15 * 1;
  // off0 += this.n * 10
  // let off1 = map(x + x*.25*0, 100 * hf, height - 100 * hf, 0, -100*hf)
  // // off1 += o * 0.8
  // off1 += o * 3 + c_ * 15*1
  // off1 += this.n * 10

  let t_ = ((frameCount + off0) % loopDuration) / loopDuration;
  // let tb1 = ((frameCount + off1) % loopDuration) / loopDuration

  // let t = createVector()

  // if (tb0 < .75) {
  //   t.y = map(tb0, 0., .75, 0, 1)
  // }
  // else t.y = 0

  let t = 0;
  let gap = 0.15;
  if (t_ < gap) t = 0;
  else if (t_ < 1 - gap) t = map(t_, gap, 1 - gap, 0, 1);
  else t = 1;

  t = easeInOutCubic(t);

  // t.y = tb0

  // if (tb1 >= .25) {
  //   t.x = map(tb1, 0.25, 1, 0, 1)
  // }
  // else t.x = 0

  // t.x = easeInOutQuint(t.x) * dir
  // t.y = easeInOutQuint(t.y) * dir
  // t.z = easeInOutQuint(t.z) * dir

  let q = createVector(x, y, z);
  let angle = createVector(
    // TWO_PI * t.x * 1 * 0,
    // TWO_PI * t.y * 1 * 1,
    // TWO_PI * t.z * 1 * 0
    0,
    TWO_PI * t * dir,
    0
  );

  const v = project(q, angle, pos);

  // vertex(v.x, v.y)
  return v;
};

const drawVertex5 = (p, o, pos, j) => {
  let dir = p.x < pos.mid.x ? -1 : 1;
  dir = map(p.x, pos.min.x, pos.max.x, -1, 1);

  let loopDuration = 2 * 60;

  // let n = osn.noise3D(p.x * 0.01, p.y * 0.01, i * 0.01) * 1
  let n = 0;
  let off = +p.x * 0.05 + p.y * 0.05 + n * 0;
  off *= loopDuration / (2 * 60);
  let t = ((frameCount + off) % loopDuration) / loopDuration;
  t = easeInOutQuint(t);
  // t = map(t, 0.02, 0.98, 0, 1)
  let u = map(t, 0, 1, 0, PI);

  let s = 2 + 4 * sin(u);
  let sb = 10;
  // u = -PI / 4

  let vals = [
    { x: 6 * cos(u), y: -6 * cos(u), w: sb + (200 / 2) * sin(u), h: s },
    { x: 8 * cos(u), y: -8 * sin(u), w: sb + (190 / 2) * sin(u), h: s },
    { x: 4 * sin(u), y: -4 * sin(u), w: sb + (180 / 2) * sin(u), h: s },
    { x: 8 * sin(u), y: 8 * cos(u), w: sb + (190 / 2) * sin(u), h: s },
    { x: 6 * sin(u), y: 6 * cos(u), w: sb + (100 / 2) * sin(u), h: s },
  ];

  let cols = [
    color("rgba(0, 0, 255, 0.9)"),
    // color(270, 100, 50, 0.9),
    color("#4D03FF"),
    color("rgba(0, 255, 0, 0.9)"),
    // color(240, 100, 50, 0.9),
    color("#FF25E9"),
    // color(230, 100, 50, 0.9),
    color("rgba(255, 0, 0, 0.9)"),
    // color('cyan'),
    // color(250, 100, 50, 0.9),
  ];

  vals.forEach((v, i) => {
    push();
    translate(p.x, p.y);
    let rot = u + n * 0.2 + p.x * 0.05 * sin(u) * 0.1 + p.y * 0.05 * sin(u) * 0;
    rotate(rot);
    // noFill()
    noStroke();
    // strokeWeight(1)
    fill(cols[i % cols.length]);
    ellipse(v.x, v.y, v.w, v.h);
    pop();
  });
};

const drawVertex4 = (p, n, pos, j) => {
  let loopDuration = 6 * 60;

  let c_ = 0;
  if (j < 4) c_ = 2;
  else if (j < 7) c_ = 1;
  else c_ = 0;

  let dir = c_ % 2 == 0 ? 1 : -1;
  dir = 1;

  let mn = pos.min;
  let mx = pos.max;
  let h = mx.y - mn.y;

  let start = createVector(p.x - 0, p.y - 0);
  // let end = createVector(p.x + 200 + 0, p.y +10)
  // let off = (map(p.y + p.x, points0[0].y + points0[0].x, points0[0].y + points0[0].x + w + h, -0, 100 + random(0)))
  let off = map(p.y, mn.y, mx.y + h, -0, 600);

  // off = (map(p.y, 0, 300, 0, 1 * 140 + random(0.5) *0))
  off = map(p.y, pts.p.max.y, pts.p.min.y, 0, 1 * 140 + random(0.5) * 0);

  let dy = -50;
  // let off = (map(p.x, points0[0].x, points0[0].x + w, -0, 100 + random(0)))
  let t3 = ((frameCount + (off + n * 5)) % loopDuration) / loopDuration;
  let t4 = map(t3, 0.4, 0.8, 0, 1);
  // t4 = t3

  let t = 0;
  let gap = 0.1;
  if (t3 < gap) t = 0;
  else if (t3 < 1 - gap) t = map(t3, gap, 1 - gap, 0, 1);
  else t = 1;

  let end = createVector(
    p.x + 150 * sin(easeInOutQuint(t) * TWO_PI * dir),
    p.y + dy * sin(t * TWO_PI) * 0
  );
  let x3 = lerp(start.x, end.x, 1 * sin(1 * easeInOutQuint(t) * PI));
  let y3 = lerp(start.y, end.y, sin(1 * easeInOutQuint(t) * PI));

  return createVector(x3, y3);
  // vertex(x3, y3 * 1.2)
};

// inwards out
const drawVertex3 = (q, n, pos, j) => {
  let loopDuration = 4 * 60;

  let p = q.copy();

  let c_ = 0;
  if (j < 4) c_ = 2;
  else if (j < 7) c_ = 1;
  else c_ = 0;

  let dir = c_ % 2 === 0 ? -1 : 1;
  dir = -1;
  // dir = j < 4 ? 1 : -1
  // if (counter) dir *= -1
  // dir = 1
  let offx = dir === 1 ? 0 : loopDuration - 40;
  offx = 0;
  // if (j >= 3) dir *= -1
  // if (j >= 4) dir === -1
  // let dir = 1

  let h = pos.max.y - pos.min.y;
  let w = pos.max.x - pos.min.x;

  let dy = -h * 0.5 * dir;
  let dx = w * -dir;
  // dx = 150

  // let off = (map(p.x, mn.x, mx.x, 0, 120))
  let off = map(
    p.y + p.x / 1,
    pos.min.y + pos.min.x / 1,
    pos.max.y + pos.max.x / 1,
    -dir * 100,
    0
  );
  // if (dir === -1) off = (map(p.y + p.x / 1, pos.min.y + pos.min.x / 1, pos.max.y + pos.max.x / 1, -dir * 100, 0))

  off = map(
    p.x + p.y * 0,
    pts.p.min.x + pts.p.min.y,
    pts.p.max.x + pts.p.max.y,
    0,
    100
  );
  // off = map(p.x + p.y*0, pts.p.max.x + pts.p.max.y, pts.p.min.x + pts.p.min.y, 0, 100)

  // off += map(p.x + p.y, pos.min.x + pos.min.y, pos.max.x + pos.max.y, 0, 10)

  // if (j === 7) off -= 30
  // if (j === 6) off -= 15
  // if (dir === -1) off = -off
  // let off = (map(p.y, mn.y, mx.y, 0, 90))
  let t3 =
    ((frameCount + (off + n * 2 + j * 0 + offx + c_ * 15 + j * 0)) %
      loopDuration) /
    loopDuration;
  // let t4 = map(t3, 0.05, 0.95,0, 1)
  // t4 = t3

  let t = 0;
  let gap = 0.1;
  if (t3 < gap) t = 0;
  else if (t3 < 1 - gap) t = map(t3, gap, 1 - gap, 0, 1);
  else t = 1;

  let start = createVector(p.x, p.y);
  let end = createVector(
    // p.x - dx * sin(easeInOutQuint(t4) * TWO_PI),
    // p.x,
    p.x +
      ((easeInOutCubic(map(p.x, pts.p.min.x, pts.p.max.x, 0, 1)) * 2 - 1) * w) /
        4,
    p.y + dy * sin(easeInOutQuint(t) * PI)
    // p.y
  );

  let x3 = lerp(start.x, end.x, sin(3 * easeInOutQuint(t) * TWO_PI));
  let y3 = 1 * lerp(start.y, end.y, sin(1 * easeInOutQuint(t) * TWO_PI));
  // vertex(x3, y3)

  return createVector(x3, y3);
};

const drop = (p, o, pos, c) => {
  // let dir = this.n % 2 === 0 ? 1 : -1
  const loopDuration = 4 * 60;

  let x = p.x;
  let y = p.y;
  let z = 0;

  let c_ = 0;
  if (c < 4) c_ = 2;
  else if (c < 7) c_ = 1;
  else c_ = 0;

  let off = o * 6 + map(p.y, pos.min.y, pos.max.y, 20, 0) + c_ * 15;

  let t_ = ((frameCount + off) % loopDuration) / loopDuration;

  let t = 0;
  if (t_ < 0.25) t = 0;
  else if (t_ < 0.75) t = map(t_, 0.25, 0.75, 0, 1);
  else t = 1;
  t = easeInOutCubic(t);
  t = sin(t * PI);

  let v = createVector(x, y);

  // v.y = lerp(p.y, c_ % 2 === 0 ? pos.min.y : pos.max.y, t)
  v.y = lerp(p.y, pos.max.y, t);

  // vertex(v.x, v.y)
  return v;
};

const project = (point, angle, pos) => {
  let p = point.copy().sub(pos.mid);

  const projection = [
    [1, 0, 0],
    [0, 1, 0],
  ];

  const rotationX = [
    [1, 0, 0],
    [0, cos(angle.x), -sin(angle.x)],
    [0, sin(angle.x), cos(angle.x)],
  ];

  const rotationY = [
    [cos(angle.y), 0, sin(angle.y)],
    [0, 1, 0],
    [-sin(angle.y), 0, cos(angle.y)],
  ];

  const rotationZ = [
    [cos(angle.z), -sin(angle.z), 0],
    [sin(angle.z), cos(angle.z), 0],
    [0, 0, 1],
  ];

  let rotated = matmul(rotationY, p);
  let rotated2 = matmul(rotationX, rotated);
  let rotated3 = matmul(rotationZ, rotated2);

  let projected2d = matmul(projection, rotated3);

  projected2d.add(pos.mid);

  return projected2d;
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
