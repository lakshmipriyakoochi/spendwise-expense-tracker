import { test } from 'node:test';
import assert from 'node:assert/strict';
import { forecastNext, movingAverage, linearRegression } from '../js/forecast.js';

test('returns 0 for empty data', () => assert.equal(forecastNext([]), 0));
test('uses average when fewer than 3 months', () => assert.equal(forecastNext([100, 300]), 200));
test('continues an upward linear trend', () => assert.equal(forecastNext([100, 200, 300]), 400));
test('never predicts a negative amount', () => assert.equal(forecastNext([300, 200, 100]), 0));
test('flat data gives a flat forecast', () => assert.equal(forecastNext([50, 50, 50, 50]), 50));
test('movingAverage uses only the last window', () => assert.equal(movingAverage([1, 100, 200, 300], 3), 200));
test('regression slope is correct', () => assert.equal(linearRegression([0, 10, 20]).slope, 10));