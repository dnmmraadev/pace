export function csv(rows: Record<string, unknown>[]) {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]);
  const cell = (v: unknown) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  return [keys.map(cell).join(','), ...rows.map((r) => keys.map((k) => cell(r[k])).join(','))].join(
    '\r\n',
  );
}
