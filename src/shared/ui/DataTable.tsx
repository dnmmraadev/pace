import { es } from '../../i18n/es';
export function DataTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="table-scroll" tabIndex={0} aria-label={es('Scrollable data table')}>
      <table>
        <thead>
          <tr>
            {es(
              headers.map((h, j) => (
                <th
                  key={h}
                  className={
                    rows.length > 0 &&
                    rows.every(
                      (r) => typeof r[j] === 'number' || /^[-+]?\d[\d,.%]*$/.test(String(r[j])),
                    )
                      ? 'numeric'
                      : undefined
                  }
                >
                  {es(h)}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody>
          {es(
            rows.map((r, i) => (
              <tr key={i}>
                {es(
                  r.map((c, j) => (
                    <td
                      key={j}
                      className={
                        typeof c === 'number' || /^[-+]?\d[\d,.%]*$/.test(String(c))
                          ? 'numeric'
                          : /^\d{4}-\d{2}-\d{2}$/.test(String(c))
                            ? 'date-value'
                            : undefined
                      }
                    >
                      {es(c)}
                    </td>
                  )),
                )}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
