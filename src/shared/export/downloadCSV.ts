import { csv } from './csv';
export function downloadCSV(name: string, rows: Record<string, unknown>[]) {
  const url = URL.createObjectURL(new Blob([csv(rows)], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
