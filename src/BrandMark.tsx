/** Use the canonical asset's alpha geometry; keep its analytical bars in original color. */
export function BrandMark({className}: {className: string}) {
  return <span className={`pace-mark ${className}`} role="img" aria-label="PACE">
    <span className="pace-mark-lettering" aria-hidden="true" />
    <img className="pace-mark-bars" src="/brand/pace-logo.png" alt="" aria-hidden="true" width="2203" height="714" />
  </span>;
}
