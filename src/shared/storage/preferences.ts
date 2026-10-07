import { useSyncExternalStore } from 'react';

export type Preferences = { version: 1; theme: 'light' | 'dark'; language: 'es' | 'en' };
export const PREFERENCES_KEY = 'pace.preferences.v1';
const defaults: Preferences = { version: 1, theme: 'light', language: 'es' };
export function loadPreferences(): Preferences {
  try {
    const value = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || 'null');
    if (
      value?.version === 1 &&
      ['light', 'dark'].includes(value.theme) &&
      ['es', 'en'].includes(value.language)
    )
      return value;
  } catch {
    /* Storage may be disabled. Keep preferences in memory. */
  }
  return { ...defaults };
}
let current = loadPreferences();
let saved = true;
const listeners = new Set<() => void>();
export const getPreferences = () => current;
export const preferencesSaved = () => saved;
export function applyPreferences() {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = current.theme;
  document.documentElement.lang = current.language === 'es' ? 'es-MX' : 'en';
}
export function updatePreferences(value: Partial<Pick<Preferences, 'theme' | 'language'>>) {
  current = { ...current, ...value };
  applyPreferences();
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(current));
    saved = true;
  } catch {
    saved = false;
  }
  listeners.forEach((listener) => listener());
}
export function usePreferences() {
  return useSyncExternalStore((listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, getPreferences);
}
applyPreferences();
