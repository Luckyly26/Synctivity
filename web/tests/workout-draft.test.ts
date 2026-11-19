import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSet, repsError, weightError } from '../src/workout-draft.ts';

test('new sets have independent UUIDs and default to 8 reps and zero weight', () => {
  const first = createSet();
  const second = createSet();
  assert.match(
    first.id,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  assert.notEqual(first.id, second.id);
  assert.equal(first.weightKg, '0.00');
  assert.equal(first.reps, '8');
});

test('weights allow unfinished drafts, bodyweight, decimal commas and the configured limit', () => {
  for (const value of ['', '0', '0.00', '2.5', '2,5', '999.99']) {
    assert.equal(weightError(value), undefined, value);
  }
  for (const value of [
    '-1',
    '1000',
    '1.234',
    'NaN',
    'Infinity',
    '1e3',
    'abc',
  ]) {
    assert.ok(weightError(value), value);
  }
});

test('repetitions allow unfinished drafts but otherwise require positive integers up to the configured limit', () => {
  for (const value of ['', '1', '12', '1000']) {
    assert.equal(repsError(value), undefined, value);
  }
  for (const value of ['0', '-1', '2.5', '2,5', '1001', '1e2', 'abc']) {
    assert.ok(repsError(value), value);
  }
});
