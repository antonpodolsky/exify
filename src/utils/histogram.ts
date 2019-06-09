export const getHistogram = (pixels: Uint8ClampedArray) => {
  const res = ['r', 'g', 'b', 'avg'].reduce(
    (r, key) => {
      r[key] = new Array(256).fill(0, 0);
      return r;
    },
    {} as any
  );

  for (let i = 0, k = 0; i < pixels.length; i += 4, k++) {
    const avg =
      0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];

    res.avg[Math.round(avg)]++;
    res.r[pixels[i]]++;
    res.g[pixels[i + 1]]++;
    res.b[pixels[i + 2]]++;
  }

  return res;
};
