import { load, save } from './storage.js';

let expenses = load();
const listeners = new Set();

export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getExpenses = () => [...expenses];

function commit() {
  save(expenses);
  listeners.forEach((fn) => fn(getExpenses()));
}

export function addExpense(data) { expenses.push({ id: crypto.randomUUID(), ...data }); commit(); }
export function updateExpense(id, changes) { expenses = expenses.map((e) => (e.id === id ? { ...e, ...changes } : e)); commit(); }
export function deleteExpense(id) { expenses = expenses.filter((e) => e.id !== id); commit(); }
export function replaceAll(list) { expenses = [...list]; commit(); }