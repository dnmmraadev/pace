import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createProfile,
  loadProfile,
  PROFILE_KEY,
  saveProfile,
} from '../../src/shared/storage/profile';

test('profile persists separately from existing learning progress', () => {
  const values = new Map([['revenue-desk.progress.v1', '{"version":1,"completed":["inventory"]}']]);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  const profile = createProfile('  María  ', 'reservations', 'analyst');
  assert.equal(saveProfile(profile), true);
  assert.deepEqual(loadProfile(), { ...profile, name: 'María' });
  assert.equal(values.get('revenue-desk.progress.v1'), '{"version":1,"completed":["inventory"]}');
  values.set(PROFILE_KEY, '{broken');
  assert.equal(loadProfile(), null);
  values.set(PROFILE_KEY, JSON.stringify({ ...profile, role: 'invalid' }));
  assert.equal(loadProfile(), null);
  assert.equal(saveProfile(createProfile()), true);
  assert.equal(loadProfile()?.onboardingComplete, true);
});

test('unavailable storage reports failure without blocking learning', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => {
      throw new Error('unavailable');
    },
  });
  assert.equal(loadProfile(), null);
  assert.equal(saveProfile(createProfile('Ana')), false);
});
