import { es } from '../../i18n/es';
export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="section-title">
      <div className="eyebrow">{es(eyebrow)}</div>
      <h1>{es(title)}</h1>
      {es(description && <p>{es(description)}</p>)}
    </header>
  );
}
