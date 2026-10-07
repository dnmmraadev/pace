import { useEffect, useRef, useState } from 'react';
import { findLesson, lessons, type Question } from '../data/curriculum';
import { demonstrated, mastery, record, state, type Progress } from '../domain/learning';
import { es, fold } from '../i18n/es';
import { usePreferences } from '../shared/storage/preferences';
import { createProfile, loadProfile, saveProfile, type Profile } from '../shared/storage/profile';
import { loadProgress, saveProgress } from '../shared/storage/progress';
import { registerLearningTools } from './integrations/webmcp';
export function useWorkspaceController() {
  usePreferences();
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width:1000px)').matches);
  const [profile, setProfile] = useState<Profile | null>(loadProfile);
  const [profileSaved, setProfileSaved] = useState(true);
  const [p, setP] = useState<Progress>(loadProgress);
  const [view, setView] = useState('Today');
  const [lessonId, setLessonId] = useState(p.lastLesson);
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [context, setContext] = useState(true);
  const [tree, setTree] = useState(true);
  const [modal, setModal] = useState(() => (profile ? '' : 'Onboarding'));
  const [search, setSearch] = useState('');
  const [cmd, setCmd] = useState('');
  const [notice, setNotice] = useState('');
  const [saved, setSaved] = useState(true);
  const [reviewId, setReviewId] = useState('');
  const [sessionKey, setSessionKey] = useState(0);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const query = window.matchMedia('(max-width:1000px)');
    const resize = () => {
      setCompact(query.matches);
      if (!query.matches)
        setModal((value) => (['Navigation', 'Context'].includes(value) ? '' : value));
    };
    query.addEventListener('change', resize);
    return () => query.removeEventListener('change', resize);
  }, []);
  const l = findLesson(lessonId) || lessons[0];
  const mastered = lessons.filter((x) => demonstrated(p, x.id)).length;
  const due = p.reviews.filter((r) => r.due <= Date.now());
  const coreComplete = lessons.every((x) => p.completed.includes(x.id)) && !!p.capstone;
  const interviewUnlocked = coreComplete;
  const nextLesson = lessons.find((x) => !p.completed.includes(x.id)) || l;
  useEffect(() => {
    setSaved(saveProgress(p));
  }, [p]);
  const liveProgress = useRef(p);
  liveProgress.current = p;
  useEffect(
    () =>
      registerLearningTools(() => ({
        completed: liveProgress.current.completed,
        topics: lessons.map((x) => ({
          title: es(x.title),
          mastery: mastery(liveProgress.current, x.id),
          state: es(state(liveProgress.current, x.id)),
        })),
        capstoneSubmitted: !!liveProgress.current.capstone,
      })),
    [],
  );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal === 'Onboarding') return;
        setModal('Search');
        setSearch('');
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [modal]);
  useEffect(() => {
    main.current?.scrollTo(0, 0);
  }, [view, lessonId, step]);
  const openLesson = (id: string) => {
    setModal('');
    setLessonId(id);
    setStep(0);
    setAnswered(false);
    setSessionKey((k) => k + 1);
    setView('Lesson');
    setP((p) => ({ ...p, lastLesson: id }));
  };
  const navigate = (name: string) => {
    setSearch('');
    if (['Formula Sheet', 'Glossary'].includes(name)) setModal(name);
    else {
      setView(name);
      setModal('');
    }
  };
  const submit = (q: Question, answer: string, topic = l.id, rationale?: string) => {
    setP((p) => record(p, topic, q, answer, Date.now(), rationale));
    setAnswered(true);
  };
  const mixed =
    p.reviews.map((r) => findLesson(r.topic)).filter((x) => x && x.id !== l.id)[0] ||
    lessons.filter((x) => p.completed.includes(x.id) && x.id !== l.id).slice(-1)[0];
  const lessonQs = [...l.questions, l.scenario, ...(mixed ? [mixed.questions[1]] : [])];
  const currentQ = lessonQs[step - 1];
  const finish = () => {
    setP((p) => ({ ...p, completed: [...new Set([...p.completed, l.id])] }));
    setModal('Session summary');
  };
  const runCommand = (value: string) => {
    const c = value.trim().toLowerCase();
    setCmd('');
    if (c === '/next') {
      if (view === 'Lesson') {
        if (step === 0 || answered) {
          if (step >= lessonQs.length) finish();
          else {
            setStep((s) => s + 1);
            setAnswered(false);
          }
        } else setNotice('Commit to an answer before moving on.');
      } else openLesson(nextLesson.id);
    } else if (c === '/review') navigate('Review Queue');
    else if (c === '/formula') navigate('Formula Sheet');
    else if (c === '/glossary') navigate('Glossary');
    else if (c === '/progress') navigate('Progress');
    else if (c === '/practice') navigate('Practice Lab');
    else if (c === '/reset') setModal('Reset progress');
    else setNotice('Available: /next /review /formula /glossary /progress /practice /reset');
  };
  const filter = fold(search);
  const finishProfile = (value: Profile, start: boolean) => {
    setProfile(value);
    setProfileSaved(saveProfile(value));
    setModal('');
    if (start) setView('Today');
  };
  const closeModal = () => {
    if (modal === 'Onboarding' && !profile) finishProfile(createProfile(), false);
    else setModal('');
  };

  return {
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
  };
}
