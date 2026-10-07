import { Check, ChevronDown, ChevronRight, Lock, Search, UserRound } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { lessons, modules } from '../../data/curriculum';
import type { Lesson } from '../../domain/content';
import type { Review } from '../../domain/learning';
import { demonstrated, state, type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';
import { type Profile } from '../../shared/storage/profile';
import { BrandMark } from '../../shared/ui/BrandMark';

import { nav } from '../navigation';

type Props = {
  view: string;
  l: Lesson;
  p: Progress;
  due: Review[];
  tree: boolean;
  saved: boolean;
  profile: Profile | null;
  profileSaved: boolean;
  interviewUnlocked: boolean;
  setModal: Dispatch<SetStateAction<string>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setTree: Dispatch<SetStateAction<boolean>>;
  navigate: (name: string) => void;
  openLesson: (id: string) => void;
};
export function NavigationRail({
  view,
  l,
  p,
  due,
  tree,
  saved,
  profile,
  profileSaved,
  interviewUnlocked,
  setModal,
  setSearch,
  setTree,
  navigate,
  openLesson,
}: Props) {
  return (
    <aside className="left-rail">
      <div className="brand">
        <BrandMark className="brand-logo" />
        <span>{es('REVENUE ANALYST WORKSPACE')}</span>
      </div>
      <button
        className="search-launch"
        onClick={() => {
          setModal('Search');
          setSearch('');
        }}
      >
        <Search size={15} />
        {es(' Search workspace ')}
        <kbd>{es('⌘ K')}</kbd>
      </button>
      <nav aria-label={es('Primary navigation')}>
        {es(
          nav.map(([name, Icon]) => (
            <button
              key={name}
              aria-label={es(name)}
              className={view === name ? 'nav-item active' : 'nav-item'}
              onClick={() => navigate(name)}
            >
              <Icon size={17} />
              <span>{es(name)}</span>
              {es(
                name === 'Review Queue' && due.length > 0 && (
                  <span className="count">{es(due.length)}</span>
                ),
              )}
              {es(name === 'Interview Lab' && !interviewUnlocked && <Lock size={12} />)}
            </button>
          )),
        )}
      </nav>
      <button className="tree-toggle" onClick={() => setTree(!tree)} aria-expanded={tree}>
        {es(tree ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        {es(' LEARNING PATH ')}
        <span>{es('13 modules')}</span>
      </button>
      {es(
        tree && (
          <div className="module-tree">
            {es(
              modules.map((m, i) => (
                <details key={m} open={i === l.module && view === 'Lesson'}>
                  <summary
                    onClick={
                      i === 0 || i === 11 || i === 12
                        ? (e) => {
                            e.preventDefault();
                            navigate(
                              i === 0 ? 'Diagnostic' : i === 11 ? 'Capstone' : 'Interview Lab',
                            );
                          }
                        : undefined
                    }
                  >
                    <span className="module-number">{es(String(i).padStart(2, '0'))}</span>
                    <span>{es(m)}</span>
                    {es(
                      i > 0 &&
                        i < 11 &&
                        lessons
                          .filter((x) => x.module === i)
                          .every((x) => demonstrated(p, x.id)) ? (
                        <Check size={13} />
                      ) : (
                        <span className="tree-dot" />
                      ),
                    )}
                  </summary>
                  {es(
                    lessons
                      .filter((x) => x.module === i)
                      .map((x) => (
                        <button
                          key={x.id}
                          className={
                            x.id === l.id && view === 'Lesson'
                              ? 'tree-lesson current'
                              : 'tree-lesson'
                          }
                          onClick={() => openLesson(x.id)}
                        >
                          {es(x.title)}
                          <small>{es(state(p, x.id))}</small>
                        </button>
                      )),
                  )}
                </details>
              )),
            )}
          </div>
        ),
      )}
      <div className="rail-footer">
        <button
          className="profile-launch"
          onClick={() => setModal('Onboarding')}
          aria-label={es('Edit profile')}
        >
          <UserRound size={16} />
          <span>{profile?.name || es('Your profile')}</span>
        </button>
        {!profileSaved && (
          <small role="status">
            {es('Your profile could not be saved. It is available for this session only.')}
          </small>
        )}
        <span className="local-dot" />
        {es(' Local learning profile')}
        <small>
          {es(
            saved ? 'Progress saved on this browser' : 'Storage unavailable — keep this tab open',
          )}
        </small>
      </div>
    </aside>
  );
}
