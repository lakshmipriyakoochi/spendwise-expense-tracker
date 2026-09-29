/** Bar chart on <canvas>. data: [{ label, value, forecast? }] */
export function drawBarChart(canvas, data) {
  const dpr = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const css = getComputedStyle(document.documentElement);
  const color = (name) => css.getPropertyValue(name).trim();
  ctx.font = '12px system-ui, sans-serif';

  if (!data.length) {
    ctx.fillStyle = color('--muted');
    ctx.textAlign = 'center';
    ctx.fillText('Add expenses to see your trend.', width / 2, height / 2);
    return;
  }

  const pad = { top: 16, right: 12, bottom: 28, left: 52 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = w / data.length;
  const barW = Math.min(48, slot * 0.6);

  ctx.strokeStyle = color('--line');
  ctx.fillStyle = color('--muted');
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + h - (h * i) / 4;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
    ctx.fillText(Math.round((max * i) / 4).toLocaleString('en-IN'), pad.left - 6, y + 4);
  }

  ctx.textAlign = 'center';
  data.forEach((d, i) => {
    const x = pad.left + slot * i + (slot - barW) / 2;
    const barH = (h * d.value) / max;
    const y = pad.top + h - barH;
    ctx.globalAlpha = d.forecast ? 0.55 : 1;
    ctx.fillStyle = d.forecast ? color('--forecast') : color('--accent');
    ctx.fillRect(x, y, barW, barH);
    ctx.globalAlpha = 1;
    if (d.forecast) {
      ctx.setLineDash([4, 3]); ctx.strokeStyle = color('--forecast');
      ctx.strokeRect(x, y, barW, barH);
      ctx.setLineDash([]); ctx.strokeStyle = color('--line');
    }
    ctx.fillStyle = color('--muted');
    ctx.fillText(d.label, x + barW / 2, height - 8);
  });
}