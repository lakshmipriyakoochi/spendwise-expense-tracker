import { CATEGORIES } from './summary.js';

const $ = (sel) => document.querySelector(sel);
const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const money = (n) => fmt.format(n);

function fillSelect(select, options) {
  select.replaceChildren(...options.map(([value, text]) => new Option(text, value)));
}

export function initSelects() {
  const cats = CATEGORIES.map((c) => [c, c]);
  fillSelect($('#category'), [['', 'Choose…'], ...cats]);
  fillSelect($('#filter-category'), [['all', 'All categories'], ...cats]);
}

export function refreshMonthFilter(months) {
  const select = $('#filter-month');
  const current = select.value || 'all';
  fillSelect(select, [['all', 'All months'], ...[...months].reverse().map((m) => [m, m])]);
  select.value = months.includes(current) ? current : 'all';
}

// textContent (never innerHTML) so user input can't inject markup.
export function renderList(list) {
  const body = $('#expense-body');
  body.replaceChildren();
  $('#empty').hidden = list.length > 0;
  [...list].sort((a, b) => b.date.localeCompare(a.date)).forEach((e) => {
    const tr = document.createElement('tr');
    tr.dataset.id = e.id;
    [e.date, e.title, e.category, money(e.amount)].forEach((text, i) => {
      const td = document.createElement('td');
      td.textContent = text;
      if (i === 3) td.className = 'num';
      tr.append(td);
    });
    const actions = document.createElement('td');
    actions.className = 'actions';
    for (const [action, label] of [['edit', 'Edit'], ['delete', 'Delete']]) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.action = action;
      b.textContent = label;
      b.setAttribute('aria-label', `${label} ${e.title}`);
      actions.append(b);
    }
    tr.append(actions);
    body.append(tr);
  });
}

export function renderTotals(total, byCategory) {
  $('#total').textContent = money(total);
  const ul = $('#by-category');
  ul.replaceChildren();
  Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, v]) => {
    const li = document.createElement('li');
    li.textContent = `${cat}: ${money(v)}`;
    ul.append(li);
  });
}

export function renderForecast(month, byCategory, total, budget) {
  $('#forecast-month').textContent = month ? `Forecast for ${month}` : 'Forecast';
  $('#forecast-total').textContent = month ? money(total) : '—';
  const ul = $('#forecast-list');
  ul.replaceChildren();
  Object.entries(byCategory).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).forEach(([cat, v]) => {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.textContent = cat;
    const val = document.createElement('span'); val.textContent = money(v);
    li.append(name, val);
    ul.append(li);
  });
  const alert = $('#alert');
  alert.className = '';
  alert.textContent = '';
  if (month && budget > 0) {
    const over = total > budget;
    alert.classList.add(over ? 'over' : 'ok');
    alert.textContent = over
      ? `On track to overspend by ${money(total - budget)}.`
      : `On track to stay within your ${money(budget)} budget.`;
  }
}

export function showErrors(errors = {}) {
  for (const f of ['title', 'amount', 'date', 'category']) {
    $(`#${f}-error`).textContent = errors[f] || '';
    $(`#${f}`).setAttribute('aria-invalid', errors[f] ? 'true' : 'false');
  }
}

export function fillForm(e) {
  $('#edit-id').value = e.id;
  $('#title').value = e.title;
  $('#amount').value = e.amount;
  $('#date').value = e.date;
  $('#category').value = e.category;
  $('#form-title').textContent = 'Edit expense';
  $('#submit-btn').textContent = 'Save changes';
  $('#cancel-btn').hidden = false;
  $('#title').focus();
}

export function resetForm() {
  $('#expense-form').reset();
  $('#edit-id').value = '';
  $('#date').value = new Date().toISOString().slice(0, 10);
  $('#form-title').textContent = 'Add an expense';
  $('#submit-btn').textContent = 'Add expense';
  $('#cancel-btn').hidden = true;
  showErrors();
}