export const getHistogram = (data: Uint8ClampedArray) => {
  const res = ['r', 'g', 'b', 'avg'].reduce(
    (r, key) => {
      r[key] = new Array(256).fill(0, 0);
      return r;
    },
    {} as any
  );

  for (let i = 0, k = 0; i < data.length; i += 4, k++) {
    const avg = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

    res.avg[Math.round(avg)]++;
    res.r[data[i]]++;
    res.g[data[i + 1]]++;
    res.b[data[i + 2]]++;
  }

  return res;
};
