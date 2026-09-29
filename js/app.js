import * as state from './state.js';
import * as ui from './ui.js';
import { validateExpense } from './validation.js';
import { filterExpenses, totalsByCategory, monthlyTotals, seriesByCategory, nextMonth, round } from './summary.js';
import { forecastByCategory } from './forecast.js';
import { drawBarChart } from './chart.js';
import { exportJSON, importJSON, loadBudget, saveBudget } from './storage.js';
import { sampleExpenses } from './sample.js';

const $ = (sel) => document.querySelector(sel);
const filters = { category: 'all', month: 'all' };
let budget = loadBudget();

function render() {
  const all = state.getExpenses();
  const months = monthlyTotals(all);
  ui.refreshMonthFilter(months.map((m) => m.month));
  filters.month = $('#filter-month').value;

  const shown = filterExpenses(all, filters);
  ui.renderList(shown);
  ui.renderTotals(round(shown.reduce((s, e) => s + e.amount, 0)), totalsByCategory(shown));

  // Forecast = sum of per-category forecasts, so each category follows its own trend.
  const byCategory = forecastByCategory(seriesByCategory(all));
  const total = round(Object.values(byCategory).reduce((a, b) => a + b, 0));
  const next = months.length ? nextMonth(months[months.length - 1].month) : null;
  ui.renderForecast(next, byCategory, total, budget);

  const bars = months.map((m) => ({ label: m.month.slice(2), value: m.total }));
  if (next) bars.push({ label: next.slice(2), value: total, forecast: true });
  drawBarChart($('#chart'), bars);
}

$('#expense-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const result = validateExpense(Object.fromEntries(new FormData(event.target)));
  ui.showErrors(result.errors);
  if (!result.valid) return;
  const id = $('#edit-id').value;
  if (id) state.updateExpense(id, result.value);
  else state.addExpense(result.value);
  ui.resetForm();
});

$('#cancel-btn').addEventListener('click', ui.resetForm);

// One listener on the table body handles every row's buttons.
$('#expense-body').addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.closest('tr').dataset.id;
  if (btn.dataset.action === 'delete') state.deleteExpense(id);
  else ui.fillForm(state.getExpenses().find((e) => e.id === id));
});

$('#filter-category').addEventListener('change', (e) => { filters.category = e.target.value; render(); });
$('#filter-month').addEventListener('change', (e) => { filters.month = e.target.value; render(); });

$('#budget').value = budget || '';
$('#budget').addEventListener('input', (e) => { budget = Math.max(0, Number(e.target.value) || 0); saveBudget(budget); render(); });

$('#export-btn').addEventListener('click', () => exportJSON(state.getExpenses()));
$('#sample-btn').addEventListener('click', () => state.replaceAll(sampleExpenses()));
$('#import-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try { state.replaceAll(await importJSON(file)); }
  catch (err) { alert(`Could not import: ${err.message}`); }
  e.target.value = '';
});

window.addEventListener('resize', render);
state.subscribe(render);
ui.initSelects();
ui.resetForm();
render();