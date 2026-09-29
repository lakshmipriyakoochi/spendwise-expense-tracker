import { CATEGORIES } from './summary.js';

export function validateExpense(input, today = new Date()) {
  const errors = {};
  const title = String(input.title ?? '').trim();
  const amount = Number(input.amount);
  const todayStr = today.toISOString().slice(0, 10);

  if (!title) errors.title = 'Enter what you spent on.';
  else if (title.length > 60) errors.title = 'Keep it under 60 characters.';

  if (input.amount === '' || input.amount == null || !Number.isFinite(amount)) errors.amount = 'Enter an amount.';
  else if (amount <= 0) errors.amount = 'Amount must be more than 0.';
  else if (amount > 10_000_000) errors.amount = 'Amount is too large.';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date ?? '')) errors.date = 'Pick a date.';
  else if (input.date > todayStr) errors.date = 'Date cannot be in the future.';

  if (!CATEGORIES.includes(input.category)) errors.category = 'Choose a category.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: { title, amount: Math.round(amount * 100) / 100, date: input.date, category: input.category },
  };
}