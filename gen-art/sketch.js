const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const palette = random.pick(palettes);

  const makeGrid = () => {
    const points = [];
    const count = 30;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push({
          position: [u, v],
          radius: Math.abs(random.gaussian()) * 0.015,
          colour: random.pick(palette),
        });
      }
    }
    return points;
  };

  random.setSeed("random2");
  const points = makeGrid().filter(() => random.value() > 0.5);
  const margin = 200;

  return ({ context, width, height }) => {
    context.fillStyle = "aliceblue";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, colour } = data;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      // context.lineWidth = 10;
      context.arc(x, y, radius * width, 0, Math.PI * 2, true);
      context.fillStyle = colour;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
