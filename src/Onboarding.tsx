import {es} from './i18n/es';
import {PreferencesControls} from './PreferencesControls';
import { useState } from 'react';
import { createProfile, goals, roles, type Profile } from './lib/profile';

export function Onboarding({ profile, onSave, onSkip }: { profile: Profile | null; onSave: (profile: Profile, start: boolean) => void; onSkip: () => void }) {
  const [name, setName] = useState(profile?.name || '');
  const [role, setRole] = useState<Profile['role']>(profile?.role || '');
  const [goal, setGoal] = useState<Profile['goal']>(profile?.goal || '');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const editing = !!profile?.name;
  const next = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) { setError("Enter the name you would like us to use."); return; }
    setError('');
    if (editing) onSave(createProfile(name, role, goal), false);
    else setStep(1);
  };
  return <div className="onboarding"><PreferencesControls/>
    <p className="eyebrow">{editing ? es("LOCAL PROFILE") : `${es('FIRST STEPS')} · ${step + 1} ${es('OF')} 2`}</p>
    {step === 0 ? <form onSubmit={next} noValidate>
      <h3>{editing ? es("Your learning context") : es("Make PACE your workspace.")}</h3>
      <p>{es("Learn revenue by doing revenue. Tell us what to call you and what you want to learn.")}</p>
      <label htmlFor="profile-name">{es("Name or preferred name")}</label>
      <input id="profile-name" autoFocus autoComplete="given-name" maxLength={60} value={name} onChange={event => { setName(event.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'profile-error' : undefined} required />
      {error && <p id="profile-error" className="profile-error" role="alert">{es(error)}</p>}
      <div className="profile-fields">
        <div><label htmlFor="profile-role">{es("Current area")} <span>{es("(optional)")}</span></label><select id="profile-role" value={role} onChange={event => setRole(event.target.value as Profile['role'])}><option value="">{es("Choose an area")}</option>{Object.entries(roles).map(([id, label]) => <option value={id} key={id}>{es(label)}</option>)}</select></div>
        <div><label htmlFor="profile-goal">{es("Goal")} <span>{es("(optional)")}</span></label><select id="profile-goal" value={goal} onChange={event => setGoal(event.target.value as Profile['goal'])}><option value="">{es("Choose a goal")}</option>{Object.entries(goals).map(([id, label]) => <option value={id} key={id}>{es(label)}</option>)}</select></div>
      </div>
      <p className="profile-privacy">{es("Your profile stays on this device. No account is required. These details do not change your path or progress, and you can edit them from the sidebar.")}</p>
      <div className="onboarding-actions"><button className="primary" type="submit">{editing ? es("Save profile") : es("Continue")}</button><button className="text-button" type="button" onClick={onSkip}>{editing ? es("Cancel") : es("Not now")}</button></div>
    </form> : <>
      <h3>{es('All set')}, {name.trim()}.</h3>
      <p>{es("You will work with synthetic data from a resort with approximately 900 rooms.")}</p>
      <ol className="onboarding-loop">
        <li><strong>{es("Learn and retrieve from memory.")}</strong><span>{es("Read a brief explanation and answer low-stakes questions.")}</span></li>
        <li><strong>{es("Calculate, interpret and decide.")}</strong><span>{es("Practice with tables and scenarios; receive immediate feedback.")}</span></li>
        <li><strong>{es("Revisit what you still need to master.")}</strong><span>{es("Weak concepts return to the review queue. Completing a lesson and mastering it are different things.")}</span></li>
      </ol>
      <p className="profile-privacy">{es("From Today, continue your session or take the optional diagnostic. Use")} <kbd>Ctrl / ⌘ + K</kbd> {es("to search, and the bottom bar for commands such as")} <code>/review</code>.</p>
      <div className="onboarding-actions"><button className="primary" onClick={() => onSave(createProfile(name, role, goal), true)}>{es("Enter PACE")}</button><button className="text-button" onClick={() => setStep(0)}>{es("Back")}</button></div>
    </>}
  </div>;
}
