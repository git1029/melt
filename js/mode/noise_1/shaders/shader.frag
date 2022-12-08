precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform float pi;

uniform sampler2D tex;
// uniform sampler2D tex2;

//
// GLSL textureless classic 2D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-08-22
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/stegu/webgl-noise
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

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
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

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
// float noise (in vec2 _st) {
//     vec2 i = floor(_st);
//     vec2 f = fract(_st);

//     // Four corners in 2D of a tile
//     float a = random(i);
//     float b = random(i + vec2(1.0, 0.0));
//     float c = random(i + vec2(0.0, 1.0));
//     float d = random(i + vec2(1.0, 1.0));

//     vec2 u = f * f * (3.0 - 2.0 * f);

//     return mix(a, b, u.x) +
//             (c - a)* u.y * (1.0 - u.x) +
//             (d - b) * u.x * u.y;
// }

#define NUM_OCTAVES 8

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.5)); // cos(0.5)
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * cnoise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5; // 0.5
    }
    return v;
}

float brightness(vec3 col) {
  return 0.2126 *col.r + 0.7152 *col.g + 0.0722 *col.b;
}

vec3 zuc(float w) {
  float x = (w - 400.) / 300.;
  if (x < 0.) x = 0.;
  if (x > 1.) x = 1.;
  x = 1. - x;

  vec3 color = vec3(0.0, 0.0, 0.0);

  vec3 cs = vec3(3.54541723, 2.86670055, 2.29421995);
  vec3 xs = vec3(0.69548916, 0.49416934, 0.28269708);
  vec3 ys = vec3(0.02320775, 0.15936245, 0.53520021);
  
  vec3 z = vec3(x - xs[0], x - xs[1], x - xs[2]);

  vec3 z1 = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    z1[i] = cs[i] * z[i];
  }

  z1[0] = cs[1] * z[0];
  z1[1] = cs[2] * z[1];
  z1[2] = cs[0] * z[2];

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


vec3 zuc2(float w) {
  float x = (w - 400.) / 300.;
  if (x < 0.) x = 0.;
  if (x > 1.) x = 1.;
  x = 1. - x;

  vec3 color = vec3(0.0, 0.0, 0.0);

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


vec3 zuc3(float w) {
  float x = (w - 400.) / 300.;
  if (x < 0.) x = 0.;
  if (x > 1.) x = 1.;
  x = 1. - x;

  vec3 color = vec3(0.0, 0.0, 0.0);

  vec3 cs = vec3(3.54541723, 2.86670055, 2.29421995);
  vec3 xs = vec3(0.69548916, 0.49416934, 0.28269708);
  vec3 ys = vec3(0.02320775, 0.15936245, 0.53520021);
  
  vec3 z = vec3(x - xs[0], x - xs[1], x - xs[2]);

  vec3 z1 = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    z1[i] = cs[i] * z[i];
  }

  z1[0] = cs[0] * z[1];
  z1[1] = cs[1] * z[2];
  z1[2] = cs[2] * z[0];

  vec3 z2 = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    z2[i] = 1. - (z1[i] * z1[i]);
  }

  for (int i = 0; i < 3; i++) {
    color[i] = z2[i] - ys[i];
    // color[i] = 1.0 - color[i];
    // color[i] += .5;
  }

  color[0] = z2[0] - ys[1];
  color[1] = z2[1] - ys[2];
  color[2] = z2[2] - ys[0];

  return color;
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy*1.;
    st.y = 1. - st.y;
    vec3 color = vec3(0.0);

    float d = 1.-distance(st,mouse);
    d = smoothstep(0.75, 1., d);


//     vec2 q = vec2(0.);
//     q.x = fbm( st + vec2(1.7,9.2) - 0.15*time);

    // q.y = fbm( st + vec2(1.0));


    // vec2 r = vec2(0.);
    // r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time );
    // r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);
    

    // vec4 cc = texture2D(tex2, st+r*.5);
    // float bb = brightness(cc.rgb);
    // float bb = 0.;

  float n = cnoise(vec2(st.x * 4. + time * 0.4 + d, st.y * 4. + time * 0.4 + d));
  // float n2 = cnoise(vec2(st.x * n + time * 0.4 + d, st.y * n + time * 0.4 + d));

    vec4 c = texture2D(tex, st + n * d);
    float b = brightness(c.rgb);




    // r = vec2(0.);
    // r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time );
    // r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time+b);
    // // r *= tf;

    // c = texture2D(tex, st + r.y*.5);
    // b = brightness(c.rgb);




    // float f = fbm(st+r + bb*0.);
    // float f2 = f;
    // float f3 = f;
    // float f2 = fbm(st+r - .5 + bb*0.);
    // float f3 = fbm(st+r + .5 + b*0.);

    // f = clamp(f, 0.,1.);
    // f2 = clamp(f2, 0.,1.);
    // f3 = clamp(f3, 0.,1.);

    // color = mix(vec3(0.101961,0.619608,0.666667),
    //             vec3(0.666667,0.666667,0.498039),
    //             clamp((f*f)*4.0,0.0,1.0));

    // color = mix(color,
    //             vec3(0,0,0.164706),
    //             clamp(length(q),0.0,1.0));

    // color = mix(color,
    //             vec3(0.666667,1,1),
    //             clamp(length(r.x),0.0,1.0));

    // float wav = length(q) + length(r) + f*f*4.;
    // wav += f*f*f+.6*f*f+.5*f;
    // wav *= 400. + 300.;
    // wav = mod(wav, 300.) + 400.;
    // color = mix(color, zuc(wav), 0.);



  //   vec3 c0 = zuc(length(r * 4.) * 300. + 400.);
  //   vec3 c1 = zuc(length(r * 4.) * 300. + 400.);
  //   // c1 = zuc2(map(c0.r + c0.g + c0.b, 0., 3., 450., 650.));
  //   vec3 c2 = zuc((length(r * 3.) + length(r * 2.)*0.) * 300. + 400.);
  //   color = vec3(pow(f * 3., 1.), f2 * 3., f3 * 3.);
  //   color += (c0 + c1 + c2) / 5.5;
  //   // color += vec3(c0.r, c1.g, c2.b);
  //   // color = mix(color, c0, .5);
  //   // color = mix(color, vec3(0., r*6.), .25);
            
  //   float wav1 = map(length(r), 0., .2, 400., 650.);

  //   float wav2 = map(length(r), 0., .2, 450., 650.);
  //   // float wav1 = map(length(r), 0., .2, 650., 300.);
  //   // float wav2 = map(length(r.x), 0., 1., 400., 650.);
  //   color = mix(zuc(wav2), zuc(wav1), tf);
  //   // if (length(r) < .15/2.) color = zuc(wav1);

  //   // float r_ = fbm(st + r) * 150.0 + 10.0 * sin(time / 2.0);
  //   // float g_ = fbm(st + r_) * 100.0 + 10.0 * sin(time / 2.0);
  //   // float b_ = fbm(st + g_) * 190.0 + 10.0 * sin(time / 2.0);
  //   // // float a = f(x, y, b, d) * 255.0;
  //   // // a = 255.0;
  
  //   // vec3 color_ = vec3(r_ / 10.0, g_ / 10.0, b_ / 10.0);




  // // color.rgb = pow(color.rgb, vec3(2.1)); // gamma correction
  // color = pow(color, vec3(0.5)); // gamma correction
  // color *= smoothstep(.4, .6, b);
  // color *= mix(1., b, tf);
  // color = vec3(length(r));
  color = vec3(b);
  // color = vec3(d);

  // if (random(st) > .99) color = vec3(1.);

    // gl_FragColor = vec4((f*f+1.*f+2.*f * 1.)*color,1.);
    gl_FragColor = vec4(color,1.);
}

