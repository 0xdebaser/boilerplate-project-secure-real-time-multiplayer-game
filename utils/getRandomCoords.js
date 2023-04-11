module.exports = () => {
  const xMin = 50;
  const xMax = 600;
  const yMin = 50;
  const yMax = 440;
  const x = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
  const y = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
  return [x, y];
};
