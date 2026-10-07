import { Moon, Sun } from 'lucide-react';
import { es } from '../../i18n/es';
import {
  preferencesSaved,
  updatePreferences,
  usePreferences,
} from '../../shared/storage/preferences';

export function PreferencesControls() {
  const { theme, language } = usePreferences();
  return (
    <div className="preferences-controls" aria-label={es('Display preferences')}>
      <button
        type="button"
        className="theme-switch"
        onClick={() => updatePreferences({ theme: theme === 'light' ? 'dark' : 'light' })}
        aria-label={es(theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')}
        title={es(theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')}
      >
        {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        <span>{es(theme === 'light' ? 'Dark mode' : 'Light mode')}</span>
      </button>
      <button
        type="button"
        className="language-switch"
        aria-label={es(language === 'es' ? 'Switch to English' : 'Switch to Spanish')}
        title={es(language === 'es' ? 'Switch to English' : 'Switch to Spanish')}
        onClick={() => updatePreferences({ language: language === 'es' ? 'en' : 'es' })}
      >
        {language === 'es' ? 'ES' : 'ENG'}
      </button>
      {!preferencesSaved() && (
        <span className="preferences-warning" role="status">
          {es('Preferences could not be saved. They apply to this session only.')}
        </span>
      )}
    </div>
  );
}
