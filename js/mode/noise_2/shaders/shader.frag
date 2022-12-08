precision highp float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex;
// uniform sampler2D tex1;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
// uniform float wave_f;
// uniform float x_f;
// uniform float y_f;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 fade(vec4 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

vec3 fade3(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }



// Classic Perlin noise
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Classic Perlin noise
float cnoise3(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade3(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

// Classic Perlin noise
float cnoise(vec4 P)
{
  vec4 Pi0 = floor(P); // Integer part for indexing
  vec4 Pi1 = Pi0 + 1.0; // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec4 Pf0 = fract(P); // Fractional part for interpolation
  vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = vec4(Pi0.zzzz);
  vec4 iz1 = vec4(Pi1.zzzz);
  vec4 iw0 = vec4(Pi0.wwww);
  vec4 iw1 = vec4(Pi1.wwww);

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 ixy00 = permute(ixy0 + iw0);
  vec4 ixy01 = permute(ixy0 + iw1);
  vec4 ixy10 = permute(ixy1 + iw0);
  vec4 ixy11 = permute(ixy1 + iw1);

  vec4 gx00 = ixy00 * (1.0 / 7.0);
  vec4 gy00 = floor(gx00) * (1.0 / 7.0);
  vec4 gz00 = floor(gy00) * (1.0 / 6.0);
  gx00 = fract(gx00) - 0.5;
  gy00 = fract(gy00) - 0.5;
  gz00 = fract(gz00) - 0.5;
  vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
  vec4 sw00 = step(gw00, vec4(0.0));
  gx00 -= sw00 * (step(0.0, gx00) - 0.5);
  gy00 -= sw00 * (step(0.0, gy00) - 0.5);

  vec4 gx01 = ixy01 * (1.0 / 7.0);
  vec4 gy01 = floor(gx01) * (1.0 / 7.0);
  vec4 gz01 = floor(gy01) * (1.0 / 6.0);
  gx01 = fract(gx01) - 0.5;
  gy01 = fract(gy01) - 0.5;
  gz01 = fract(gz01) - 0.5;
  vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
  vec4 sw01 = step(gw01, vec4(0.0));
  gx01 -= sw01 * (step(0.0, gx01) - 0.5);
  gy01 -= sw01 * (step(0.0, gy01) - 0.5);

  vec4 gx10 = ixy10 * (1.0 / 7.0);
  vec4 gy10 = floor(gx10) * (1.0 / 7.0);
  vec4 gz10 = floor(gy10) * (1.0 / 6.0);
  gx10 = fract(gx10) - 0.5;
  gy10 = fract(gy10) - 0.5;
  gz10 = fract(gz10) - 0.5;
  vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
  vec4 sw10 = step(gw10, vec4(0.0));
  gx10 -= sw10 * (step(0.0, gx10) - 0.5);
  gy10 -= sw10 * (step(0.0, gy10) - 0.5);

  vec4 gx11 = ixy11 * (1.0 / 7.0);
  vec4 gy11 = floor(gx11) * (1.0 / 7.0);
  vec4 gz11 = floor(gy11) * (1.0 / 6.0);
  gx11 = fract(gx11) - 0.5;
  gy11 = fract(gy11) - 0.5;
  gz11 = fract(gz11) - 0.5;
  vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
  vec4 sw11 = step(gw11, vec4(0.0));
  gx11 -= sw11 * (step(0.0, gx11) - 0.5);
  gy11 -= sw11 * (step(0.0, gy11) - 0.5);

  vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
  vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
  vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
  vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
  vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
  vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
  vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
  vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
  vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
  vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
  vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
  vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
  vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
  vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
  vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
  vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

  vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
  g0000 *= norm00.x;
  g0100 *= norm00.y;
  g1000 *= norm00.z;
  g1100 *= norm00.w;

  vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
  g0001 *= norm01.x;
  g0101 *= norm01.y;
  g1001 *= norm01.z;
  g1101 *= norm01.w;

  vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
  g0010 *= norm10.x;
  g0110 *= norm10.y;
  g1010 *= norm10.z;
  g1110 *= norm10.w;

  vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
  g0011 *= norm11.x;
  g0111 *= norm11.y;
  g1011 *= norm11.z;
  g1111 *= norm11.w;

  float n0000 = dot(g0000, Pf0);
  float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
  float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
  float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
  float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
  float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
  float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
  float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
  float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
  float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
  float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
  float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
  float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
  float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
  float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
  float n1111 = dot(g1111, Pf1);

  vec4 fade_xyzw = fade(Pf0);
  vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
  vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
  vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
  vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
  float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
  return 2.2 * n_xyzw;
}

//////////////////////////////////////////////////////

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float qinticInOut(float t) {
  return t < 0.5
    ? +16.0 * pow(t, 5.0)
    : -0.5 * pow(2.0 * t - 2.0, 5.0) + 1.0;
}


float brightness(vec2 st)
{
  vec4 color = texture2D(tex, st);
  float b = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  return b;
}


vec4 zuc(float w) {
  float x = (w - 400.) / 300.;
  if (x < 0.) x = 0.;
  if (x > 1.) x = 1.;

  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

  vec3 cs = vec3(3.54541723, 2.86670055, 2.29421995);
  vec3 xs = vec3(0.69548916, 0.49416934, 0.28269708);
  vec3 ys = vec3(0.02320775, 0.15936245, 0.53520021);
  
  vec3 z = vec3(x - xs[0], x - xs[1], x - xs[2]);

  vec3 z1 = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    z1[i] = cs[i] * z[i];
  }

  vec3 z2 = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    z2[i] = 1. - (z1[i] * z1[i + 1]);
  }

  for (int i = 0; i < 3; i++) {
    color[i] = z2[i] - ys[i + 1];
    // color[i] = 1.0 - color[i];
    // color[i] = clamp(color[i], 0., 1.);
  }

  // color[0] = color[2]

  return color;
}



vec4 zuc2(float w) {
  float x = (w - 400.) / 300.;
  if (x < 0.) x = 0.;
  if (x > 1.) x = 1.;

  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

  vec3 cs = vec3(3.54541723, 2.86670055, 2.29421995);
  vec3 xs = vec3(0.69548916, 0.49416934, 0.28269708);
  vec3 ys = vec3(0.02320775, 0.15936245, 0.53520021);
  
  vec3 z = vec3(x - xs[0], x - xs[1], x - xs[2]);

  vec3 z1 = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    z1[i] = cs[i] * z[i];
  }

  z1[0] = cs[1] * z[1];
  z1[1] = cs[2] * z[2];
  z1[2] = cs[0] * z[0];

  vec3 z2 = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    z2[i] = 1. - (z1[i] * z1[i]);
  }

  for (int i = 0; i < 3; i++) {
    color[i] = z2[i] - ys[i];
    // color[i] = 1.0 - color[i];
  }

  color[0] = z2[0] - ys[1];
  color[1] = z2[1] - ys[2];
  color[2] = z2[2] - ys[0];


  return color;
}

#define PI 3.14159265359

void main(void)
{
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  // uv.x = 1.0 - uv.x; 

  // vec2 uv = gl_FragCoord.xy/resolution;
  // uv *= 2.0;
  // uv -= 1.0;
  
  // vec4 color = vec4(1.0, 1.0, 1.0, 1.0);


// b = 1.0;
  float x = uv.x * 1080.0 * 1.0;
  float y = uv.y * 1080.0 * 1.0;

  float fc = time / 60.0;
  // fc *= 0.0;

float loopDuration = 6. * 60.;
    float off = map(uv.y + uv.x, 0., 2., 0., 250.);
    float t = mod(fc*60. + off, loopDuration) / loopDuration;
    // float t = 0.5;
    float u = map(t, 0., 1., 0., 2. * PI);

    // float d = distance(vec2(0.5), uv);
  //     float d = distance(vec2(0.5, 0. + (sin(t * 0.01 + 4.) + 1.) / 2.), uv);
  // vec2 dUv = uv - 0.5;
  // // dUv *= 0.5;
  // dUv += 0.5;
  // if (d < 0.1) d = 0.1;

  float fb = map(abs(y - 1080./2.), 0.0, 1080.0 /2., 0.5, 1.);
  float f = map(y, 0.0, 1080.0, 0.5, 1.) * fb;
  float fx = map(y, 0.0, 1080.0, 0.03, 0.015);
  if (uv.y < 0.5) {
    f = map(uv.y, 0., 0.5, 1.4, .5) * fb;
    fx = -map(uv.y, 0., 0.5, 0.015, 0.015);
  }
  else {
    f = map(uv.y, 0.5, 1., .5, 1.4) * fb;
    fx = map(uv.y, 0.5, 1., 0.015, 0.015);
  }

// float b = brightness(uv);
float b = 0.;
  // float nt = cnoise(vec2(sin(u), cos(u)));
  // fx *= map(b, 0., 1., 2., 2.);
  // f *= map(b, 0., 1., 2., 2.);
  // float fx2 = map(x, 0.0, 1080.0, -0.015, 0.015);
  // float n2 = pnoise(vec2(x * fx + fc, y * fx + fc), vec2(0.0, 0.0)) * 1.0;
  float n2 = cnoise(vec2(x * fx, y * fx + fc + b)) * 30.0;
  float n = (cnoise3(vec3(x * 0.02, y * 0.01, n2 * 0.1 + fc)) + 1.0) / 2.0;
  // n = (n + 1.) / 2.;
  n = map(n, 0., 1., -1., 1.);
  n *= f;
  // n *= fx;


    float d = 1.-distance(uv,mouse);
    d = smoothstep(0.75, 1., d);

  vec4 color = texture2D(tex, uv + n * 0.2 * d);


      // let radius = osn.noise4D(
      //   x * 1 * 0.01 + b * 0.05,
      //   y * 1 * 0.01 + b * 0.05,
      //   1 * cos(u + b * 0.01) * 1,
      //   1 * sin(u) * 1
      // )
      // radius *= 200 + b * 0


  // float n = cnoise(vec4(
  //   x * 0.02, y * 0.01, n2 * 0.1 + sin(u + d), cos(u + d)
  // ));
  // n = (n + 1.) / 2.;
  // n = n * f * b;


  // n = qinticInOut(n);
  // n = qinticInOut(n * (b+0.25));
  // if (n < 0.5) {
  //   n = 0.0;
  // } else {
  //   n = 1.0;
  // }
  // if (n < 0.0) n = 0.0;
  // if (n > 1.0) n = 1.0;

  // color.a = n;
  // color = vec4(n);

  // color.a = 1.;

  // color.rgb = vec3(brightness(uv + n * 0.01));

  // vec4 stops = vec4(0.11, 0.11, 0.57, 0.57);
  // // stops = vec4(0.21, 0.21, 0.67, 0.67);
  // // vec4 col0 = vec4(237./255., 80./255., 127./255., 1.0);
  // vec4 col2 = vec4(160./255., 153./255., 156./255., 1.0);
  // vec4 col3 = vec4(160./255., 153./255., 156./255., 1.0);
  // vec4 col0 = vec4(87./255., 59./255., 255./255., 1.0);
  // vec4 col1 = vec4(87./255., 59./255., 255./255., 1.0);
  // // vec4 col1 = vec4(235./255., 114./255., 72./255., 1.0);
  // // vec4 col2 = vec4(38./255., 177./255., 166./255., 1.0);
  // // vec4 col3 = vec4(43./255., 172./255., 255./255., 1.0);



  // // col3 = vec4(0.8, 0.8, 0.8, 1.0);
  // // col2 = vec4(0.8, 0.8, 0.8, 1.0);

  // if (n >= stops.a) {
  //   float fb = map(n, stops.a, 1., 0., 1.);
  //   color = mix(col2, col3, fb);
  // }
  // else if (n >= stops.b) {
  //   float fb = map(n, stops.b, stops.a, 0., 1.);
  //   color = mix(col1, col2, fb);
  // }
  // else if (n >= stops.g) {
  //   float fb = map(n, stops.g, stops.b, 0., 1.);
  //   color = mix(col0, col1, fb);
  // }
  // else if (n >= stops.r) {
  //   float fb = map(n, stops.r, stops.g, 0., 1.);
  //   color = mix(vec4(0.), col0, fb);
  // }
  // else {
  //   color = vec4(0.);
  // }




// n *= 1.;



//         float wav = map(n, 0., 1., 400., 900.);
// // float wav = mod(n * 200. + sin(u / .5) * 100. * 0. - 100., 300.) + 400.;
//                         // n * 0.01

// color = zuc(wav);



// // color.r *= 1./200.;
// // color.g *= 1./200.;
// // color.b *= 1./100.;

// // if (f < 0.1) color = 1. - color;


//   // color.r *= n*3.;
//   // color.g *= n*2.;
//   // color.b *= n*10.;
//   // color.a *= n*1.;


//   // wav = map(n, 0., 1., 680., 500.);
//   // color = zuc(wav);
//   // color.r *= n*3.;
//   // color.g *= n*1.;
//   // color.b *= n*1.;
//   // color.a = n;


//   // wav = map(n, 0.25, 2., 400., 700.);
//   wav = map(n, 1., 1.5, 400., 700.) - 0. * pow(uv.y, 2.);
//   // wav = map(n, 1., 2., 400., 700.) - 0. * pow(uv.y, 2.);
//   color = zuc2(wav);
//   color.a = n;

  // color.rgb = vec3(n);

  
  gl_FragColor = color;
}



//   // let pad = 50
//   for (let x = 0; x < width; x+=5) {
//     for (let y = 0; y < height; y+=5) {

//       // let fpx = 1
//       // let fpy = 1
//       // if (x < pad) fpx = map(x, 0, pad, 0, 1)
//       // if (x > width - pad) fpx = map(x, width - pad, width, 1, 0)
//       // if (y < pad) fpy = map(y, 0, pad, 0, 1)
//       // if (y > height - pad) fpy = map(y, height - pad, height, 1, 0)

//       let f = map(y, 0, height, 1.2, 0.7)
//       let fx = map(y, 0, height, 0.01, 0.02)
//       let b = brightness(pg.get(x, y))
//       let fb = map(b, 0, 100, 0.5, 1)
//       if (b > 0) {
//         f = map(y, 0, height, 1.4, 1) * fb
//         fx = map(y, 0, height, 0.03, 0.015)
//       }
//       let n2 = noise(x * fx, y * fx) * 10
//       let n = (noise2.noise4D(
//         x * 0.01, 
//         y * 0.01, 
//         n2 * 1 + sin(frameCount * 0.1),
//         cos(frameCount * 0.1)
//       ) + 1) / 2
//       n = round(n * f * fpy * fpx)
//       noStroke()
//       fill(0, 0, 0, n)
//       if (b > 0) rect(x, y, 5, 5)
//     }
//   }
// }