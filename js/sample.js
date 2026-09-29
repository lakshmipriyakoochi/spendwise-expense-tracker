const ROWS = [
  ['Groceries', 'Food', 2400], ['Metro pass', 'Transport', 600], ['Course books', 'Study', 900],
  ['Movie night', 'Fun', 500], ['Hostel fee', 'Rent', 5000],
];

/** Five previous months of data with a gentle upward trend, so the forecast has something to show. */
export function sampleExpenses(today = new Date()) {
  const out = [];
  for (let back = 5; back >= 1; back--) {
    const growth = 1 + (5 - back) * 0.06;
    ROWS.forEach(([title, category, base], i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - back, 5 + i * 4);
      const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      out.push({ id: crypto.randomUUID(), title, category, date, amount: Math.round(base * growth) });
    });
  }
  return out;
}