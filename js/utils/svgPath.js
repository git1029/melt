function Points(params) {
  this.paths = getSVGPaths(params);
  this.points = [];

  this.paths.forEach((group) => {
    group.forEach((path) => {
      this.points.push(...path.pointsFinal.map((point) => point.p));
    });
  });

  let px = this.points.map((p) => p.x);
  let py = this.points.map((p) => p.y);
  this.p = {
    min: createVector(min(px), min(py)),
    max: createVector(max(px), max(py)),
    mid: createVector((min(px) + max(px)) / 2, (min(py) + max(py)) / 2),
    w: max(px) - min(px),
    h: max(py) - min(py),
  };
}

// Returns x,y point data for bezier curves within SVG element
// Note: SVG element must have grouped paths (clipped/joined/subtracted paths within same group)
const getSVGPaths = ({
  id,
  sampleFactor,
  sampleDistance,
  shift,
  scl,
  closed,
}) => {
  shift = shift === undefined ? 0 : shift;
  scl = scl === undefined ? 1 : scl;
  closed = closed === undefined ? true : closed;

  let svg = document.getElementById(id);

  // let svgGroups = svg.querySelectorAll('g')
  let str = "MELT";
  if (id === "svgPath2") str = "MELT11111";
  if (id === "svgPath3") str = "MELT1111";
  if (id === "svgPath4") str = "M11E11LT";
  let svgPathsAll = svg.querySelectorAll("path");
  let svgGroups = [];
  let j = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str[i];
    if (["B", "P", "R", "A"].includes(c)) {
      svgGroups.push([
        {
          c,
          path: svgPathsAll[j],
        },
        {
          c,
          path: svgPathsAll[j + 1],
        },
      ]);
      j++;
    } else {
      svgGroups.push([
        {
          c,
          path: svgPathsAll[j],
        },
      ]);
    }
    j++;
  }
  // console.log(svgGroups);

  // Container for SVG path data
  let paths = [];

  // Loop over each group within SVG
  svgGroups.forEach((g, i) => {
    paths[i] = [];

    // let svgPaths = g.querySelectorAll('path')
    let svgPaths = g.map((p) => p.path);

    // Loop over paths in group
    svgPaths.forEach((path, j) => {
      paths[i][j] = {
        sub: path.classList.contains("s"),
        beziers: [],
        points: [],
        pointsFinal: [],
        bezierPoints: [],
        len: 0,
        pos: {},
      };

      // Get bezier path data
      let pathData = path.getPathData({ normalize: true });

      pathData.forEach((p) => {
        let type = p.type;
        let v = p.values;
        if (type !== "Z") {
          if (type === "M" || type === "L") {
            paths[i][j].beziers.push({
              type,
              c1: createVector(v[0], v[1]).mult(scl),
              c2: createVector(v[0], v[1]).mult(scl),
              a: createVector(v[0], v[1]).mult(scl),
            });
          } else if (type === "C") {
            paths[i][j].beziers.push({
              type,
              c1: createVector(v[0], v[1]).mult(scl),
              c2: createVector(v[2], v[3]).mult(scl),
              a: createVector(v[4], v[5]).mult(scl),
            });
          }
        }
      });
    });
  });

  // Get sample of points along bezier curves (non-uniform distances)
  paths.forEach((group) => {
    group.forEach((path) => {
      let points = [];

      let offset = closed ? 0 : 1;
      // console.log(offset);

      for (let i = 0; i < path.beziers.length - offset; i++) {
        let p = path.beziers[i];
        let q = path.beziers[(i + 1) % path.beziers.length];

        let a = p.a.copy();
        let c1 = q.c1.copy();
        let c2 = q.c2.copy();
        let b = q.a.copy();

        let steps = dist(a.x, a.y, b.x, b.y) * sampleFactor;

        for (let i = 0; i < steps; i++) {
          let x = bezierPoint(a.x, c1.x, c2.x, b.x, i / steps);
          let y = bezierPoint(a.y, c1.y, c2.y, b.y, i / steps);
          points.push(createVector(x, y));
        }
      }

      let dTotal = 0;
      for (let i = 0; i < points.length; i++) {
        let p = points[i];
        let q = points[(i + 1) % points.length];

        let d = dist(p.x, p.y, q.x, q.y);
        dTotal += d;

        path.points.push({
          p,
          d,
          dTotal,
        });
      }

      path.len = dTotal;
    });
  });

  // Get sample of points along bezier over uniform distance
  paths.forEach((group) => {
    group.forEach((path) => {
      // let bezierPoints = []

      let points = [...path.points];

      for (let d = 0; d < path.len; d += sampleDistance) {
        let d2 = (d + path.len * shift) % path.len;

        points.forEach((p) => (p.d = abs(p.dTotal - d2)));
        points.sort((a, b) => a.d - b.d);

        path.pointsFinal.push(points[0]);
        // bezierPoints.push(points[0])
      }

      // path.bezierPoints = [...bezierPoints]
    });
  });

  paths.forEach((group) => {
    group.forEach((path) => {
      let px = path.pointsFinal.map((p) => p.p.x);
      let py = path.pointsFinal.map((p) => p.p.y);
      path.pos = {
        min: createVector(min(px), min(py)),
        max: createVector(max(px), max(py)),
        mid: createVector((min(px) + max(px)) / 2, (min(py) + max(py)) / 2),
        w: max(px) - min(px),
        h: max(py) - min(py),
      };
    });
  });

  return paths;
};
