import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateExpense } from '../js/validation.js';

const today = new Date('2026-06-15T12:00:00Z');
const ok = { title: 'Lunch', amount: '120.5', date: '2026-06-10', category: 'Food' };

test('accepts a valid expense', () => assert.equal(validateExpense(ok, today).valid, true));
test('rejects empty title', () => assert.ok(validateExpense({ ...ok, title: '  ' }, today).errors.title));
test('rejects negative amount', () => assert.ok(validateExpense({ ...ok, amount: '-5' }, today).errors.amount));
test('rejects zero and blank amount', () => {
  assert.ok(validateExpense({ ...ok, amount: '0' }, today).errors.amount);
  assert.ok(validateExpense({ ...ok, amount: '' }, today).errors.amount);
});
test('rejects absurdly large amount', () => assert.ok(validateExpense({ ...ok, amount: '99999999999' }, today).errors.amount));
test('rejects future date', () => assert.ok(validateExpense({ ...ok, date: '2026-07-01' }, today).errors.date));
test('rejects unknown category', () => assert.ok(validateExpense({ ...ok, category: 'Nope' }, today).errors.category));
test('trims title and rounds amount', () => {
  const r = validateExpense({ ...ok, title: ' Tea ', amount: '10.456' }, today);
  assert.equal(r.value.title, 'Tea');
  assert.equal(r.value.amount, 10.46);
});