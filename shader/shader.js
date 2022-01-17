const canvasSketch = require("canvas-sketch");
const createShader = require("canvas-sketch-util/shader");
const glsl = require("glslify");

// Setup our sketch
const settings = {
  context: "webgl",
  animate: true,
};

// Your glsl code
const frag = glsl(/* glsl */ `
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
    // vec3 colorA = vec3(0.0, 0.0, 1.0);
    // vec3 colorB = vec3(0.0, 1.0, 0.0);

    vec2 centre = vUv - 0.5;
    centre.x *= aspect;
    float dist = length(centre);

    float alpha = 1.0 - smoothstep(0.497, 0.5, dist);
    // vec3 color = mix(colorA, colorB, vUv.x);
    // gl_FragColor = vec4(color, alpha);


    float n = noise(vec3(centre * 2.0, time / 8.0));

    vec3 colour = hsl2rgb(0.7 + n * 0.2, 0.5, 0.5);

    gl_FragColor = vec4(colour, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: "white",
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height,
    },
  });
};

canvasSketch(sketch, settings);
