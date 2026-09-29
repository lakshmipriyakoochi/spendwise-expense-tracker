const EXPENSES_KEY = 'set:expenses';
const BUDGET_KEY = 'set:budget';

const isExpense = (e) =>
  e && typeof e.id === 'string' && typeof e.title === 'string' &&
  Number.isFinite(e.amount) && typeof e.date === 'string' && typeof e.category === 'string';

export function load() {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.filter(isExpense) : [];
  } catch {
    return []; // corrupted JSON or storage disabled: start clean instead of crashing
  }
}

export function save(list) {
  try { localStorage.setItem(EXPENSES_KEY, JSON.stringify(list)); return true; }
  catch { return false; } // storage full or blocked
}

export function loadBudget() {
  try { return Number(localStorage.getItem(BUDGET_KEY)) || 0; } catch { return 0; }
}
export function saveBudget(n) {
  try { localStorage.setItem(BUDGET_KEY, String(n)); } catch { /* ignore */ }
}

export function exportJSON(list) {
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'expenses.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importJSON(file) {
  const data = JSON.parse(await file.text());
  if (!Array.isArray(data)) throw new Error('File must contain a list of expenses.');
  const valid = data.filter(isExpense);
  if (!valid.length) throw new Error('No valid expenses found in this file.');
  return valid;
}