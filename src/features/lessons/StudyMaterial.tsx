import { studyGuides, studySources, type StudyCopy } from '../../data/studyGuides';
import type { Lesson } from '../../domain/content';
import { es } from '../../i18n/es';
import { usePreferences } from '../../shared/storage/preferences';

export function StudyNotes({ lesson }: { lesson: Lesson }) {
  const { language } = usePreferences();
  const guide = studyGuides[lesson.id];
  const text = (copy: StudyCopy) => copy[language];
  return (
    <>
      <section className="study-objective" aria-label={es('Learning objective')}>
        <span className="eyebrow">{es('Learning objective')}</span>
        <p>{text(guide.objective)}</p>
      </section>
      <div className="prose">
        <p>{es(lesson.concept)}</p>
      </div>
      <section className="study-material" aria-label={es('Study guide')}>
        <h2>{es('Study guide')}</h2>
        {guide.sections.map((section, i) => (
          <section key={i}>
            <h3>{text(section.title)}</h3>
            <p>{text(section.body)}</p>
          </section>
        ))}
      </section>
    </>
  );
}

export function WorkedExample({ lesson }: { lesson: Lesson }) {
  const { language } = usePreferences();
  const guide = studyGuides[lesson.id];
  const text = (copy: StudyCopy) => copy[language];
  return (
    <section className="worked expanded-example" aria-label={es('Worked example')}>
      <h3>{es('At the resort')}</h3>
      <p className="study-data-note">{es('Synthetic training example · 900-room resort · USD')}</p>
      <p>{es(lesson.example)}</p>
      <h4>{es('Reasoning step by step')}</h4>
      <ol className="worked-steps">
        {guide.steps.map((step, i) => (
          <li key={i}>{text(step)}</li>
        ))}
      </ol>
      <dl className="worked-reading">
        <div>
          <dt>{es('Interpret the result')}</dt>
          <dd>{text(guide.interpretation)}</dd>
        </div>
        <div>
          <dt>{es('A reasoned action')}</dt>
          <dd>{text(guide.action)}</dd>
        </div>
      </dl>
    </section>
  );
}

export function StudyReflection({ lessonId }: { lessonId: string }) {
  const { language } = usePreferences();
  const guide = studyGuides[lessonId];
  return (
    <section className="study-reflection" aria-label={es('Before practice')}>
      <h3>{es('Before practice')}</h3>
      <p>{guide.reflection[language]}</p>
      <small>
        {es(
          'Explain it in your own words. This reflection is not graded. Reading does not count as demonstrated mastery.',
        )}
      </small>
      <div className="study-references">
        <span>{es('Study references')}</span>
        {guide.sources.map((id) => {
          const source = studySources[id as keyof typeof studySources];
          return (
            <a key={id} href={source.url} target="_blank" rel="noopener noreferrer">
              {source.name}
            </a>
          );
        })}
      </div>
    </section>
  );
}
