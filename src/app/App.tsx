import { Modal } from '../shared/ui/Modal';
import { useWorkspaceController } from './useWorkspaceController';

import {
  ChevronRight,
  Menu,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Terminal,
  X,
} from 'lucide-react';
import { findLesson, lessons } from '../data/curriculum';
import { formulas } from '../data/formulas';
import { glossary, sources } from '../data/glossary';
import { diagnostic } from '../data/diagnostic';
import { demonstrated, emptyProgress, mastery } from '../domain/learning';
import { Capstone } from '../features/capstone/Capstone';
import { CurriculumPage } from '../features/lessons/CurriculumPage';
import { DiagnosticPage } from '../features/lessons/DiagnosticPage';
import { LessonPage } from '../features/lessons/LessonPage';
import { InterviewPage } from '../features/practice/InterviewPage';
import { PracticeLab } from '../features/practice/PracticeLab';
import { VariablePractice } from '../features/practice/VariablePractice';
import { AnalystAssignments } from '../features/practice/AnalystAssignments';
import { Onboarding } from '../features/profile/Onboarding';
import { PreferencesControls } from '../features/profile/PreferencesControls';
import { ProgressPage } from '../features/progress/ProgressPage';
import { ReviewPage } from '../features/progress/ReviewPage';
import { TodayPage } from '../features/progress/TodayPage';
import { es, fold } from '../i18n/es';
import { BrandMark } from '../shared/ui/BrandMark';
import { ContextRail } from './layout/ContextRail';
import { NavigationRail } from './layout/NavigationRail';
import { nav } from './navigation';

export default function App() {
  const {
    compact,
    profile,
    profileSaved,
    p,
    setP,
    view,
    setView,
    setLessonId,
    step,
    setStep,
    answered,
    setAnswered,
    context,
    setContext,
    tree,
    setTree,
    modal,
    setModal,
    search,
    setSearch,
    cmd,
    setCmd,
    notice,
    setNotice,
    saved,
    reviewId,
    setReviewId,
    sessionKey,
    setSessionKey,
    main,
    l,
    mastered,
    due,
    interviewUnlocked,
    nextLesson,
    openLesson,
    navigate,
    submit,
    mixed,
    lessonQs,
    currentQ,
    finish,
    runCommand,
    filter,
    finishProfile,
    closeModal,
  } = useWorkspaceController();
  const navigationRail = (
    <NavigationRail
      view={view}
      l={l}
      p={p}
      due={due}
      tree={tree}
      saved={saved}
      profile={profile}
      profileSaved={profileSaved}
      interviewUnlocked={interviewUnlocked}
      setModal={setModal}
      setSearch={setSearch}
      setTree={setTree}
      navigate={navigate}
      openLesson={openLesson}
    />
  );
  const contextRail = (
    <ContextRail setModal={setModal} view={view} l={l} p={p} step={step} openLesson={openLesson} />
  );
  return (
    <div className={'app ' + (!context ? 'context-hidden' : '')}>
      <a className="skip" href="#workspace">
        {es('Skip to workspace')}
      </a>
      {navigationRail}
      <div className="work-area">
        <header className="topbar">
          <div>
            <button
              className="mobile-only"
              aria-label={es('Open navigation')}
              aria-haspopup="dialog"
              onClick={() => setModal('Navigation')}
            >
              <Menu size={20} />
            </button>
            <BrandMark className="mobile-only mobile-brand-logo" />
            <span className="muted">{es('Workspace')}</span>
            <ChevronRight size={14} />
            <span>
              {es(view === 'Lesson' ? `Module ${String(l.module).padStart(2, '0')}` : view)}
            </span>
          </div>
          <div>
            <button
              className="mobile-only mobile-search"
              aria-label={es('Open search')}
              aria-haspopup="dialog"
              onClick={() => {
                setModal('Search');
                setSearch('');
              }}
            >
              <Search size={18} />
            </button>
            <PreferencesControls />
            <span className="synthetic-tag">{es('SYNTHETIC RESORT · 900 ROOMS')}</span>
            <button
              aria-label={es(
                compact
                  ? 'Open context panel'
                  : context
                    ? 'Collapse context rail'
                    : 'Expand context rail',
              )}
              onClick={() => (compact ? setModal('Context') : setContext(!context))}
            >
              {es(context ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />)}
            </button>
          </div>
        </header>
        <main ref={main} id="workspace" tabIndex={-1}>
          {es(
            view === 'Today' && (
              <TodayPage
                profile={profile}
                nextLesson={nextLesson}
                due={due}
                p={p}
                mastered={mastered}
                openLesson={openLesson}
                navigate={navigate}
              />
            ),
          )}
          {es(
            view === 'Lesson' && (
              <LessonPage
                l={l}
                step={step}
                lessonQs={lessonQs}
                mixed={mixed}
                currentQ={currentQ}
                sessionKey={sessionKey}
                answered={answered}
                setStep={setStep}
                setAnswered={setAnswered}
                submit={submit}
                finish={finish}
                navigate={navigate}
              />
            ),
          )}
          {es(
            view === 'Curriculum' && (
              <CurriculumPage
                p={p}
                interviewUnlocked={interviewUnlocked}
                navigate={navigate}
                openLesson={openLesson}
              />
            ),
          )}
          {es(
            view === 'Diagnostic' && (
              <DiagnosticPage
                submit={submit}
                setP={setP}
                setModal={setModal}
                openLesson={openLesson}
              />
            ),
          )}
          {es(
            view === 'Review Queue' && (
              <ReviewPage
                p={p}
                reviewId={reviewId}
                sessionKey={sessionKey}
                setReviewId={setReviewId}
                setSessionKey={setSessionKey}
                submit={submit}
                navigate={navigate}
              />
            ),
          )}
          {es(
            view === 'Practice Lab' && (
              <>
                <PracticeLab
                  learningTools={
                    <>
                      <VariablePractice progress={p} onAnswer={submit} />
                      <AnalystAssignments progress={p} onAnswer={submit} />
                    </>
                  }
                  onAttempt={(q, v) =>
                    submit(
                      q,
                      v,
                      q.id === 'lab-pickup'
                        ? 'pickup'
                        : q.id === 'lab-fc'
                          ? 'forecast-rooms'
                          : 'excel',
                    )
                  }
                />
              </>
            ),
          )}
          {es(
            view === 'Capstone' && (
              <Capstone progress={p} onSubmit={(capstone) => setP((p) => ({ ...p, capstone }))} />
            ),
          )}
          {es(
            view === 'Interview Lab' && (
              <InterviewPage
                p={p}
                interviewUnlocked={interviewUnlocked}
                nextLesson={nextLesson}
                openLesson={openLesson}
                submit={submit}
              />
            ),
          )}
          {es(
            view === 'Progress' && (
              <ProgressPage p={p} mastered={mastered} openLesson={openLesson} navigate={navigate} />
            ),
          )}
        </main>
        <footer className="composer">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runCommand(cmd);
            }}
          >
            <Terminal size={18} />
            <label className="sr-only" htmlFor="command-input">
              {es('Local command')}
            </label>
            <input
              id="command-input"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              placeholder={es('Type a command… /next, /review, /formula')}
            />
            <button aria-label={es('Run command')}>
              <span className="mono">{es('Enter ↵')}</span>
            </button>
          </form>
          <div>
            <span>{es('LOCAL COMMANDS · NO AI CHAT')}</span>
            <span>{es('Ctrl / ⌘ K to navigate')}</span>
          </div>
          {es(
            notice && (
              <div role="status" className="command-notice">
                {es(notice)}
                <button aria-label={es('Dismiss message')} onClick={() => setNotice('')}>
                  <X size={13} />
                </button>
              </div>
            ),
          )}
        </footer>
      </div>
      {es(context && contextRail)}
      {es(
        modal && (
          <Modal
            title={
              modal === 'Onboarding'
                ? es(profile?.name ? 'Your profile' : 'Welcome to PACE')
                : es(modal)
            }
            onClose={closeModal}
            className={
              modal === 'Navigation'
                ? 'navigation-dialog'
                : modal === 'Context'
                  ? 'context-dialog'
                  : undefined
            }
          >
            {modal === 'Navigation' && navigationRail}
            {modal === 'Context' && contextRail}
            {modal === 'Onboarding' && (
              <Onboarding profile={profile} onSave={finishProfile} onSkip={closeModal} />
            )}
            {es(
              ['Search', 'Glossary', 'Formula Sheet'].includes(modal) && (
                <div className="modal-search">
                  <Search size={18} />
                  <input
                    autoFocus
                    aria-label={es(`Search ${modal}`)}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={es(
                      modal === 'Search'
                        ? 'Find a lesson, formula, or workspace…'
                        : 'Filter reference…',
                    )}
                  />
                </div>
              ),
            )}
            {es(
              modal === 'Search' && (
                <div className="search-results">
                  {es(
                    [
                      ...nav.map(([n]) => ({ name: n, id: n, kind: 'Workspace' })),
                      ...lessons.map((x) => ({
                        name: x.title,
                        id: x.id,
                        kind: `Module ${x.module}`,
                      })),
                      { name: 'Independent capstone', id: 'Capstone', kind: 'Workspace' },
                      { name: 'Diagnostic', id: 'Diagnostic', kind: 'Workspace' },
                    ]
                      .filter((x) => fold(es(x.name)).includes(filter))
                      .map((x) => (
                        <button
                          key={x.id}
                          onClick={() => {
                            setModal('');
                            if (x.kind === 'Workspace') navigate(x.id);
                            else openLesson(x.id);
                          }}
                        >
                          <span>{es(x.name)}</span>
                          <small>{es(x.kind)}</small>
                        </button>
                      )),
                  )}
                </div>
              ),
            )}
            {es(
              modal === 'Glossary' &&
                Object.entries(glossary)
                  .filter(([k, v]) => fold(es(k) + ' ' + es(v)).includes(filter))
                  .map(([k, v]) => (
                    <div className="reference-row" key={k}>
                      <h3>{es(k)}</h3>
                      <p>{es(v)}</p>
                    </div>
                  )),
            )}
            {es(
              modal === 'Formula Sheet' &&
                formulas
                  .filter((f) => fold(f.map(es).join(' ')).includes(filter))
                  .map(([name, formula, note]) => (
                    <div className="reference-row" key={name}>
                      <h3>{es(name)}</h3>
                      <pre>{es(formula)}</pre>
                      <p>{es(note)}</p>
                    </div>
                  )),
            )}
            {es(
              modal === 'Session summary' && (
                <>
                  <div className="summary-score">
                    <span className="eyebrow">{es('LESSON COMPLETED')}</span>
                    <h2>{es(l.title)}</h2>
                    <strong>
                      {es(mastery(p, l.id))}
                      {es('%')}
                    </strong>
                    <p>
                      {es(
                        demonstrated(p, l.id)
                          ? 'Mastery demonstrated. Keep applying this concept in later lessons.'
                          : 'Keep practicing. Completion is recorded; mastery needs more evidence.',
                      )}
                    </p>
                  </div>
                  <p>
                    {es(
                      p.reviews.some((r) => r.topic === l.id)
                        ? 'This concept is in your Review Queue. You may continue and revisit it later.'
                        : 'Related concepts will be mixed into later lessons.',
                    )}
                  </p>
                  <button
                    className="primary"
                    onClick={() => {
                      setModal('');
                      const next = lessons[lessons.indexOf(l) + 1];
                      if (next) openLesson(next.id);
                      else navigate('Capstone');
                    }}
                  >
                    {es('Continue learning')}
                  </button>
                  <button className="text-button" onClick={() => navigate('Today')}>
                    {es('Return to Today')}
                  </button>
                </>
              ),
            )}
            {es(
              modal === 'Diagnostic results' && (
                <>
                  <p>
                    {es(
                      'A correct diagnostic response suggests you can go directly to practice. It is not sufficient evidence of mastery.',
                    )}
                  </p>
                  {es(
                    diagnostic.map((q) => {
                      const a = p.attempts.filter((a) => a.questionId === q.id).at(-1);
                      const topic = q.topic!;
                      return (
                        <button
                          className="lesson-row"
                          key={q.id}
                          onClick={() => {
                            setModal('');
                            openLesson(topic);
                            if (a?.correct) setStep(1);
                          }}
                        >
                          <span>{es(findLesson(topic).title)}</span>
                          <span>
                            {es(a?.correct ? 'Accelerate to practice' : 'Full instruction')}
                          </span>
                        </button>
                      );
                    }),
                  )}
                  <button className="text-button" onClick={() => navigate('Today')}>
                    {es('Return to Today')}
                  </button>
                </>
              ),
            )}
            {es(
              modal === 'Reset progress' && (
                <>
                  <p>
                    {es(
                      'This removes lesson completion, attempts, review dates and your capstone from this browser. It cannot be undone.',
                    )}
                  </p>
                  <button
                    className="danger"
                    onClick={() => {
                      setP(emptyProgress());
                      setLessonId('inventory');
                      setView('Today');
                      setStep(0);
                      setReviewId('');
                      setModal('');
                    }}
                  >
                    {es('Delete local progress')}
                  </button>
                  <button className="subtle" onClick={() => setModal('')}>
                    {es('Keep my progress')}
                  </button>
                </>
              ),
            )}
            {es(
              modal === 'Sources and conventions' && (
                <>
                  <p>
                    {es(
                      'Original instructional content validated against these industry references. No endorsement or certification is implied.',
                    )}
                  </p>
                  {es(
                    sources.map(([n, u]) => (
                      <p key={u}>
                        <a href={u} target="_blank" rel="noreferrer">
                          {es(n)}
                        </a>
                      </p>
                    )),
                  )}
                  <p>
                    {es(
                      'The STR guide was unavailable during validation. Benchmarking definitions were cross-checked against the EHL guide to hotel STAR reports. Local reporting and contract definitions may differ; always reconcile them.',
                    )}
                  </p>
                  <p>
                    {es(
                      'All examples use synthetic data, USD and an explicit accommodation allocation. Forecasts are simplified training models. Readiness is evidence of practice, not a guarantee of employment.',
                    )}
                  </p>
                </>
              ),
            )}
          </Modal>
        ),
      )}
    </div>
  );
}
