export const PROFILE_KEY = 'pace.profile.v1';
export const roles = { reservations: 'Reservations', operations: 'Hotel operations', revenue: 'Revenue Management', other: 'Another area / exploring' } as const;
export const goals = { foundations: 'Master the foundations', analyst: 'Prepare for a Revenue Analyst role', practice: 'Strengthen my daily analysis' } as const;
export type Profile = { version: 1; name: string; role: keyof typeof roles | ''; goal: keyof typeof goals | ''; onboardingComplete: true };
export function createProfile(name = '', role: Profile['role'] = '', goal: Profile['goal'] = ''): Profile {
  return { version: 1, name: name.trim().slice(0, 60), role, goal, onboardingComplete: true };
}
export function loadProfile(): Profile | null {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
    if (value?.version !== 1 || value.onboardingComplete !== true || typeof value.name !== 'string' || value.name.length > 60 || !(value.role === '' || Object.hasOwn(roles, value.role)) || !(value.goal === '' || Object.hasOwn(goals, value.goal))) return null;
    return createProfile(value.name, value.role, value.goal);
  } catch { return null; }
}
export function saveProfile(profile: Profile): boolean {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); return true; } catch { return false; }
}
