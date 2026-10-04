import { Languages, Moon, Sun } from 'lucide-react';
import { es } from './i18n/es';
import { preferencesSaved, updatePreferences, usePreferences } from './lib/preferences';

export function PreferencesControls() {
  const { theme, language } = usePreferences();
  return <div className="preferences-controls" aria-label={es('Display preferences')}>
    <button className="theme-switch" onClick={() => updatePreferences({ theme: theme === 'light' ? 'dark' : 'light' })} aria-label={es(theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')} title={es(theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')}>
      {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}<span>{es(theme === 'light' ? 'Dark mode' : 'Light mode')}</span>
    </button>
    <label className="language-switch"><Languages size={15}/><span className="sr-only">{es('Language')}</span><select aria-label={es('Language')} value={language} onChange={event => updatePreferences({ language: event.target.value as 'es' | 'en' })}><option value="es">Español</option><option value="en">English</option></select></label>
    {!preferencesSaved() && <span className="preferences-warning" role="status">{es('Preferences could not be saved. They apply to this session only.')}</span>}
  </div>;
}
