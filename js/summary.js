export const CATEGORIES = [
  'Food', 'Groceries', 'Transport', 'Fuel', 'Rent', 'Utilities',
  'Study', 'Health', 'Shopping', 'Fun', 'Travel', 'Subscriptions', 'Other',
];

export const round = (n) => Math.round(n * 100) / 100;
export const monthKey = (date) => String(date).slice(0, 7); // "YYYY-MM"

export function nextMonth(key) {
  const [y, m] = key.split('-').map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

export function filterExpenses(list, { category = 'all', month = 'all' } = {}) {
  return list.filter(
    (e) => (category === 'all' || e.category === category) && (month === 'all' || monthKey(e.date) === month)
  );
}

export function totalsByCategory(list) {
  const totals = {};
  for (const e of list) totals[e.category] = round((totals[e.category] || 0) + e.amount);
  return totals;
}

/** Totals for every month between the first and last expense, filling gaps with 0. */
export function monthlyTotals(list) {
  if (!list.length) return [];
  const sums = {};
  for (const e of list) sums[monthKey(e.date)] = (sums[monthKey(e.date)] || 0) + e.amount;
  const keys = Object.keys(sums).sort();
  const out = [];
  for (let k = keys[0]; k <= keys[keys.length - 1]; k = nextMonth(k)) out.push({ month: k, total: round(sums[k] || 0) });
  return out;
}

/** { Food: [m1, m2, ...], ... } using the same month range for every category. */
export function seriesByCategory(list) {
  const months = monthlyTotals(list).map((m) => m.month);
  const series = {};
  for (const cat of new Set(list.map((e) => e.category))) {
    series[cat] = months.map((m) => round(list.filter((e) => e.category === cat && monthKey(e.date) === m).reduce((s, e) => s + e.amount, 0)));
  }
  return series;
}