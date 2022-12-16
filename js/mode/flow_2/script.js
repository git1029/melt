// const string = "MELT"; //words to be displayed
// const size = 300; //font size
// const showText = true; //whether or not to have an overlay of the original text (in the background color)
// // const textAlpha = 1; //the alpha of the text if displayed (low value will make it slowly fade in)
// const backgroundColor = 0; //kinda self-explanatory
// const strokeAlpha = 50; //the alpha of the lines (lower numbers are more transparent)
// const strokeColor = 255; //the line color

// const fontSampleFactor = 0.5; //How many points there are: the higher the number, the closer together they are (more detail)

// const newPointsCount = 9; //the number of new points added when the mouse is dragged

let par;

let font;
let count;
let osn;
// let img;
// var points = [];
// var startingPoints;

let points;

function preload() {
  // img = loadImage('img00.jpg')
  // font = loadFont("../NeueMontreal-BoldItalic.otf");
  // font = loadFont("Sinistre.otf")
}

let ext;

function setup() {
  createCanvas(2440 / 2, 2440 / 2);
  // background(backgroundColor);
  // drawingContext.letterSpacing = 100
  // textFont(font);
  colorMode(HSL, 360, 100, 100, 1);
  smooth();
  // textSize(size);
  // fill(backgroundColor, textAlpha);
  // stroke(strokeColor, strokeAlpha);
  const noiseOctaves = 4; //The number of octaves for the noise
  const noiseFalloff = 0.5; //The falloff for the noise layers
  noiseDetail(noiseOctaves, noiseFalloff);
  noiseSeed(28);
  osn = new OpenSimplexNoise(1000);
  par = createP();

  // for (let p = 0; p < startingPoints.length; p++) {
  // 	// points[p] = startingPoints[p];
  //   // points[p].zOffset = random();
  //   points.push({...startingPoints[p], zOffset: random()})
  // }

  // strokeCap(ROUND);
  // strokeJoin(ROUND);

  count = 1;
  points = [];
  for (let i = 0; i < count; i++) {
    points.push(new Points_("M", 300, i));
  }
  // points = new Points("MELT", 300);
  console.log(points);
}

class Points_ {
  constructor(text, size, i) {
    const sampleFactor = 0.5;
    this.i = i;
    this.move = null;
    this.getPoints(text, size, sampleFactor);
  }

  run() {
    this.update();
    this.display();
  }

  update() {
    this.checkBounds();
    this.points.forEach((p) => p.update());
    this.bounds = this.getPos(this.points.map((p) => p.p));
  }

  display() {
    noFill();
    strokeWeight(8);
    // stroke(frameCount % 360, 100, 50, 1);
    // strokeWeight(2);
    // stroke(360, 100, 50, strokeAlpha / 100);
    // line(p.x, p.y, newPX, newPY);
    // beginShape();
    // this.points.forEach((p) => p.display());
    this.paths.forEach((path, i) => {
      // let h = floor(map(noise(i, 100), 0, 1, 0, 360) + frameCount / 1) % 360;
      // let c = color(h, 100, 50, 1);
      // stroke(100);

      this.endMove = this.startMove + 1 * 60;
      let t = map(
        constrain(frameCount, this.startMove, this.endMove),
        this.startMove,
        this.endMove,
        0,
        1
      );

      // if (!this.move) {
      //   // stroke(lerpColor(c, color(100), t));
      //   // stroke(lerpColor(c, color(0), t));
      //   // stroke(0);
      // } else {
      //   stroke(lerpColor(c, color(100), 1 - t));
      // }

      // stroke(c);

      // if (!this.move) {
      //   // stroke(0);
      // }

      if (
        i === 0 &&
        !this.move &&
        frameCount >= this.startMove + 0 &&
        frameCount < this.endMove + 2 * 60
      ) {
        let b = map(
          frameCount,
          this.startMove + 0,
          this.endMove + 2 * 60,
          1,
          0
        );
        b = easeInOutCubic(b);
        background(0, 0.5 * sin(b * PI));
      }

      let f = map(
        constrain(frameCount, this.startMove, this.startMove + 20),
        this.startMove,
        this.startMove + 20,
        1,
        0
      );
      // f = easeInOutCubic(f)

      if (this.move) {
        strokeWeight((1 - f) * 8);
      } else {
        strokeWeight(f * 8);
      }

      // if (this.move === null) strokeWeight(0);

      // if (this.move == null) {
      beginShape();
      path.forEach((p) => p.display());
      endShape();
      // }

      // if (i === 0 && !this.move && !this.animate) background(0);

      if (this.move) {
        // strokeWeight(f * 8);
        stroke(100, f);
      } else {
        // strokeWeight((1 - f) * 8);
        stroke(100, 1 - f);
      }
      strokeWeight(8);
      beginShape();
      path.forEach((p) => p.display2());
      endShape();

      // stroke(100);
      // strokeWeight(8);
      // beginShape();
      // path.forEach((p) => p.display3());
      // endShape();
    });
    // endShape();
  }

  getPoints(text, size, sampleFactor) {
    // this.points = font.textToPoints(text, 0, 0, size, { sampleFactor });

    const pts = new Points({
      id: "svgPath4",
      sampleFactor: 1,
      sampleDistance: 4,
      scl: 0.5,
      closed: false,
    });

    // console.log(pts);
    this.paths = pts.paths
      .flat()
      .map((path) => path.pointsFinal.map((p) => p.p));
    this.points = this.paths.flat();

    this.pos = this.getPos(this.points);

    this.points = this.points.map((p) =>
      createVector(
        p.x - this.pos.mid.x + width / 2,
        p.y - this.pos.mid.y + height / 2
      )
    );

    this.pos = this.getPos(this.points);
    this.bounds = this.pos;

    // this.points = this.points.map(
    //   (p) => new Point(p, this.pos, this.bounds, this.i)
    // );

    this.paths = this.paths.map((path, k) =>
      path.map((p, j) => new Point(p, this, j, k))
    );
    this.points = this.paths.flat();
  }

  getPos(points) {
    const px = points.map((p) => p.x);
    const py = points.map((p) => p.y);

    const pos = {
      min: createVector(min(px), min(py)),
      max: createVector(max(px), max(py)),
    };

    pos.mid = createVector(
      (pos.min.x + pos.max.x) / 2,
      (pos.min.y + pos.max.y) / 2
    );

    pos.w = pos.max.x - pos.min.x;
    pos.h = pos.max.y - pos.min.y;

    return pos;
  }

  checkBounds() {
    if (frameCount < 20) {
      this.move = null;
      return;
    }

    const move =
      mouseX >= this.bounds.min.x &&
      mouseX <= this.bounds.max.x &&
      mouseY >= this.pos.min.y;
    // mouseY <= points.bounds.max.y + 50

    if (move !== this.move) {
      this.startMove = frameCount;
    }

    this.move = move;
  }
}

class Point {
  constructor(p, points, j, k) {
    // this.q = p;
    this.pStart = createVector(p.x, p.y);
    this.p = this.pStart.copy();
    this.q = this.p.copy();
    this.points = points;
    this.i = this.points.i;

    this.o = 1;

    this.pos = this.points.pos;
    this.bounds = this.points.bounds;

    this.noiseZoom = 0.006; //how zoomed in the perlin noise is
    this.lineSpeed = 0.5; //the maximum amount each point can move each frame
    this.lineSpeed = 1; //the maximum amount each point can move each frame

    // this.radius = width / 4;
    // this.move = false;
    this.move = false;
    this.animate = false;
    this.animateDur = 2 * 60;

    this.history = [this.pStart];

    this.j = j;
    this.k = k;
  }

  display() {
    // curveVertex(this.p.x, this.p.y);

    if (this.animate) {
      // stroke(0);
      // strokeWeight(9);
      // point(this.q.x, this.q.y);
    }

    let k = this.k;
    if (this.k < 3) k = 0;
    else if (this.k < 6) k = 1;
    else if (this.k < 7) k = 2;
    else if (this.k < 8) k = 3;

    let h =
      floor(
        map(
          noise(this.noiseX + this.j * 0.1 + k, this.noiseY + this.k),
          0,
          1,
          0,
          360
        ) +
          frameCount / 1
      ) % 360;
    let c = color(h, 100, 50, 1);
    // strokeWeight(8);
    stroke(c);

    // let t = map(
    //   constrain(frameCount, this.startMove, this.endMove),
    //   this.startMove,
    //   this.endMove,
    //   0,
    //   1
    // );

    // if (!this.move) {
    //   stroke(lerpColor(c, color(100), t));
    //   // stroke(lerpColor(c, color(0), t));
    //   // stroke(0);
    // } else {
    //   stroke(lerpColor(c, color(100), 1 - t));
    // }

    // stroke(c);

    vertex(this.p.x, this.p.y);

    // beginShape()
    // this.history.forEach(p => vertex(p.x, p.y))
    // endShape()
  }

  display2() {
    vertex(this.p.x, this.p.y);
  }
  display3() {
    vertex(this.pStart.x, this.pStart.y);
  }

  check() {
    let d = dist(this.p.x, this.p.y, mouseX, mouseY);
    // let move = d < this.radius;
    // move = this.checkBounds();
    const move = this.points.move;
    if (move) {
      this.move = true;
      this.animate = false;
    } else if (move !== this.move) {
      this.startMove =
        frameCount +
        map(this.p.y, this.bounds.min.y, this.bounds.max.y, 0, 60) * 0;
      this.endMove = this.startMove + this.animateDur;
      this.animate = true;
      this.move = false;
    }
    if (this.animate && frameCount > this.startMove + this.animateDur) {
      this.history = [this.pStart];
      // if (this.j === 0) console.log("CLEARING HISTORY", this.history.length);
      this.animate = false;
    }

    this.f = map(constrain(d, 0, this.radius), 0, this.radius, 1, 0);
    this.f = easeInOutCubic(this.f);
    this.f = move ? 1 : 0;
    // this.f = 1;

    let dx = constrain(abs(mouseX - this.p.x), 0, this.bounds.w / 4);
    this.fx = map(dx, 0, this.bounds.w / 4, 1, 0);
    this.fx = easeInOutCubic(this.fx);
    this.fx = map(this.fx, 1, 0, 1, 0.1);
  }

  update() {
    this.check();

    // if (!this.move) return;

    this.noiseX = this.p.x * this.noiseZoom;
    this.noiseY = this.p.y * this.noiseZoom;
    // let noiseZ = 0;

    // f = 1;

    // let dir = this.move ? 1 : -1;
    let dir = map(this.p.x, this.pos.min.x, this.pos.max.x, 0, 1);
    dir = sin(dir * TWO_PI);
    dir = 1;

    let fy = map(this.pStart.y, this.pos.min.y, this.pos.max.y, 0, 1);
    // fy = sin(fy * TWO_PI);

    // let newPX =
    this.p.x +=
      map(this.p.y, this.pos.min.y, height, 2, 4) *
      map(
        // noise(noiseX, noiseY),
        // noise(noiseX, noiseY, noiseZ),
        osn.noise2D(this.noiseX, this.noiseY),
        -1,
        1,
        -this.lineSpeed,
        this.lineSpeed
      ) *
      fy *
      this.f *
      this.fx *
      this.o *
      1;

    // let newPY =
    this.p.y +=
      (2 *
        map(
          // noise(noiseX, noiseY),
          // noise(noiseX, noiseY, noiseZ + 214),
          osn.noise2D(this.noiseX, this.noiseY),
          -1,
          1,
          -this.lineSpeed * 0,
          this.lineSpeed
        ) +
        1) *
      fy *
      this.f *
      this.fx *
      this.o *
      dir;

    // if (newPY >= height) {
    //   newPY = height
    // }
    // if (pt > points.length - startingPoints.length) {
    // stroke(255, 0, 0, strokeAlpha);

    // stroke(360, 100, 50, 1);
    // strokeWeight(2);
    // stroke(360, 100, 50, strokeAlpha / 100);
    // line(p.x, p.y, newPX, newPY);

    // this.q.x = lerp(this.pStart.x, this.p.x, this.f);
    // this.q.y = lerp(this.pStart.y, this.p.y, this.f);
    // vertex(newPX, newPY);

    // this.p.y = max(this.p.y, this.pStart.y);

    if (this.animate) {
      let t = map(
        constrain(frameCount, this.startMove, this.endMove),
        this.startMove,
        this.endMove,
        0,
        1
      );
      // t = t * (1 - this.f) * this.fx;
      t = easeInOutCubic(t);
      t = constrain(t, 0, 1);
      // this.p.x = lerp(this.p.x, this.pStart.x, t);
      // this.p.y = lerp(this.p.y, this.pStart.y, t);

      // this.q = this.p.copy();

      if (this.history.length > 0) {
        this.p.x = this.history[floor((this.history.length - 1) * (1 - t))].x;
        this.p.y = this.history[floor((this.history.length - 1) * (1 - t))].y;
      }

      if (this.history.length > 0) this.history.splice(this.history.length - 1);
    } else {
      // this.q = this.p.copy();
    }

    if (this.move) {
      this.history.push(createVector(this.p.x, this.p.y));
    }

    // if (this.j === 0) console.log(this.history.length);
  }
}

function draw() {
  par.html(frameRate());

  blendMode(BLEND);
  // background(0, 0.05);
  // background(0);

  // frameRate(10);
  // if (frameCount > 0) {
  push();
  // translate(0, 100);

  // blendMode(SCREEN);

  points.forEach((p) => p.run());
  // blendMode(BLEND)
  // noStroke()
  // fill(250, 4, 3, 0.05)
  // blendMode(SCREEN)
  // noFill()
  // stroke(360, 100, 100, 1)
  // text(string, width / 2 - textWidth(string) / 2, height / 2);
  //   stroke(360, 100, 100, 0.25)
  //     text(string, width / 2 - textWidth(string) / 2 - 1, height / 2 - 1);
  //     stroke(360, 100, 100, 0.25)
  //       text(string, width / 2 - textWidth(string) / 2 + 1, height / 2 + 1);
  // background(0,0,0, 0.05)
  // if(showText){
  //   // stroke(0)
  //   noStroke();
  //   // stroke(255, 255, 255, 10)
  //   // fill(10)
  //   // fill('hsl(240, 90%, 10%')

  // }
  // blendMode(DIFFERENCE);
  // beginShape();
  // for (let pt = 0; pt < points.length; pt++) {
  //   let p = points[pt];
  //   let noiseX = p.x * noiseZoom;
  //   let noiseY = p.y * noiseZoom;
  //   let noiseZ = frameCount * zOffsetChange + p.zOffset * individualZOffset;
  //   let f = map(
  //     constrain(dist(p.x, p.y, mouseX, mouseY), 0, width / 2),
  //     0,
  //     width / 2,
  //     1,
  //     0
  //   );
  //   // f = 1;
  //   let newPX =
  //     p.x +
  //     2 *
  //       map(noise(noiseX, noiseY, noiseZ), 0, 1, -lineSpeed, lineSpeed) *
  //       map(points[pt].y, exty.mn, exty.mx, 0, 1) *
  //       f;
  //   let newPY =
  //     p.y +
  //     (2 *
  //       map(
  //         noise(noiseX, noiseY, noiseZ + 214),
  //         0,
  //         1,
  //         -lineSpeed,
  //         lineSpeed
  //       ) +
  //       1) *
  //       map(points[pt].y, exty.mn, exty.mx, 0, 1) *
  //       f;

  //   // if (newPY >= height) {
  //   //   newPY = height
  //   // }
  //   // if (pt > points.length - startingPoints.length) {
  //   // stroke(255, 0, 0, strokeAlpha);
  //   let h =
  //     floor(
  //       map(noise(noiseX, noiseY, noiseZ), 0, 1, 0, 360) + frameCount / 2
  //     ) % 360;
  //   stroke(h, 100, 50, 1);
  //   stroke(360, 100, 50, 1);
  //   strokeWeight(2);
  //   // stroke(360, 100, 50, strokeAlpha / 100);
  //   // line(p.x, p.y, newPX, newPY);
  //   vertex(newPX, newPY);
  //   // stroke((h + 120) % 360, 100, 50, 0.9);
  //   // // stroke(120, 100, 50, strokeAlpha / 100)
  //   // line(p.x + 3, p.y + 3, newPX, newPY);
  //   // stroke((h + 240) % 360, 100, 50, 0.9);
  //   // // stroke(240, 100, 50, strokeAlpha / 100)
  //   // line(p.x - 3, p.y - 3, newPX, newPY);
  //   // stroke((h + 300) % 360, 100, 50, 0.9);
  //   // // stroke(240, 100, 50, strokeAlpha / 100)
  //   // line(p.x - 6, p.y - 6, newPX, newPY);
  //   // stroke((h + 180) % 360, 100, 50, 0.9);
  //   // line(p.x + 6, p.y + 6, newPX, newPY);
  //   // stroke((h + 60) % 360, 100, 50, 0.9);
  //   // line(p.x - 3, p.y + 3, newPX, newPY);

  //   // blendMode(BLEND)
  //   // stroke(0, 0, 0, 0.1)
  //   // line(p.x, p.y, newPX, newPY);
  //   // stroke(0, 255, 0, strokeAlpha);
  //   // line(p.x + 1, p.y + 1, newPX, newPY);
  //   // stroke(0, 0, 255, strokeAlpha);
  //   // line(p.x - 1, p.y - 1, newPX, newPY);
  //   // }
  //   // else {
  //   //   let h = (floor(map(noise(noiseX, noiseY, noiseZ), 0, 1, 0, 360) + frameCount / 2)) % 360
  //   //   stroke((h + 180) % 360, 100, 70, 0.5)
  //   //   newPX = p.x + map(noise(noiseX * 0.1, noiseY * 0.1, noiseZ), 0, 1, -lineSpeed, lineSpeed);
  //   //   newPY = p.y + map(noise(noiseX * 0.1, noiseY * 0.1, noiseZ + 214), 0, 1, -lineSpeed, lineSpeed);

  //   //   line(p.x, p.y, newPX, newPY);
  //   //   line(p.x + 1, p.y + 1, newPX, newPY);
  //   //   line(p.x - 1, p.y - 1, newPX, newPY);
  //   // }
  //   // p.x = newPX;
  //   // p.y = newPY;
  // }
  // endShape();

  // push();
  // noStroke();
  // fill(100, 50, 100, 0.1);
  // ellipse(mouseX, mouseY, points.points[0].radius * 2);
  // pop();

  // noStroke()
  // blendMode(BLEND)
  // stroke(360, 100, 100, 0.5)
  // fill(360, 0, 100, 0.5)
  // text(string, width / 2 - textWidth(string) / 2, height / 2);
  pop();

  // if (frameCount > 300) background(0, 0.1);

  // blendMode(BLEND)
  // for (let pt = 0; pt < points.length; pt++) {
  // 	let p = points[pt];
  // 	let noiseX = p.x * noiseZoom;
  // 	let noiseY = p.y * noiseZoom;
  //   let noiseZ = frameCount * zOffsetChange + p.zOffset*individualZOffset;
  // 	let newPX = p.x +2 * map(noise(noiseX, noiseY, noiseZ), 0, 1, -lineSpeed, lineSpeed);
  //   let newPY = p.y + 2* map(noise(noiseX, noiseY, noiseZ + 214), 0, 1, -lineSpeed, lineSpeed) - 1;

  //   // if (newPY >= height) {
  //   //   newPY = height
  //   // }
  //   // if (pt > points.length - startingPoints.length) {
  //     // stroke(255, 0, 0, strokeAlpha);
  //     let h = (floor(map(noise(noiseX, noiseY, noiseZ), 0, 1, 0, 360) + frameCount / 2)) % 360
  //     stroke(h, 100, 0, 0.9)
  //     // stroke(360, 100, 50, strokeAlpha / 100)
  //     line(p.x, p.y, newPX, newPY);

  // 	p.x = newPX;
  // 	p.y = newPY;
  // }

  // blendMode(BLEND)
  // }
}
