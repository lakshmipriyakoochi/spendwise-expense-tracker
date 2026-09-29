// Pure functions only: no DOM, no storage. Easy to test.

/** Least-squares line through (0, v0), (1, v1), ... */
export function linearRegression(values) {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: values[0] ?? 0 };
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  values.forEach((y, x) => { num += (x - meanX) * (y - meanY); den += (x - meanX) ** 2; });
  const slope = num / den;
  return { slope, intercept: meanY - slope * meanX };
}

export function movingAverage(values, window = 3) {
  if (!values.length) return 0;
  const recent = values.slice(-window);
  return recent.reduce((a, b) => a + b, 0) / recent.length;
}

/** Next value: moving average for < 3 data points, linear regression after that. Never negative. */
export function forecastNext(values) {
  if (!values.length) return 0;
  let v;
  if (values.length < 3) v = movingAverage(values);
  else { const { slope, intercept } = linearRegression(values); v = slope * values.length + intercept; }
  return Math.max(0, Math.round(v * 100) / 100);
}

export function forecastByCategory(series) {
  return Object.fromEntries(Object.entries(series).map(([cat, values]) => [cat, forecastNext(values)]));
}