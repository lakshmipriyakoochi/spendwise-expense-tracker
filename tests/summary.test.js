import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthlyTotals, filterExpenses, totalsByCategory, nextMonth, seriesByCategory } from '../js/summary.js';

const data = [
  { id: '1', title: 'a', amount: 100, date: '2026-01-10', category: 'Food' },
  { id: '2', title: 'b', amount: 50, date: '2026-03-02', category: 'Food' },
  { id: '3', title: 'c', amount: 20, date: '2026-03-15', category: 'Fun' },
];

test('monthlyTotals fills months with no spending', () => {
  assert.deepEqual(monthlyTotals(data).map((m) => m.total), [100, 0, 70]);
});
test('nextMonth rolls over the year', () => assert.equal(nextMonth('2026-12'), '2027-01'));
test('filterExpenses by category and month', () => {
  assert.equal(filterExpenses(data, { category: 'Food', month: '2026-03' }).length, 1);
});
test('totalsByCategory sums correctly', () => assert.deepEqual(totalsByCategory(data), { Food: 150, Fun: 20 }));
test('seriesByCategory shares one month range', () => {
  assert.deepEqual(seriesByCategory(data).Fun, [0, 0, 20]);
});
test('empty list gives empty totals', () => assert.deepEqual(monthlyTotals([]), []));