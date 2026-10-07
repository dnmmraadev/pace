import { Download } from 'lucide-react';
import { forwardDates } from '../../data/scenarios';
import { es } from '../../i18n/es';
import { downloadCSV } from '../../shared/export/downloadCSV';
import { DataTable } from '../../shared/ui/DataTable';

export function ForwardTable() {
  return (
    <>
      <div className="table-caption">
        <span>{es('Future stay dates · snapshots Nov 1 → Nov 8, 2026')}</span>
        <button
          className="subtle"
          onClick={() => downloadCSV('synthetic-forward-dates.csv', forwardDates)}
        >
          <Download size={14} />
          {es(' Export CSV')}
        </button>
      </div>
      <DataTable
        headers={[
          'Stay date',
          'Available',
          'Nov 1 OTB',
          'Nov 8 OTB',
          'LY same lead',
          'OTB ADR $',
          'BAR $',
          'Net to come',
          'Context',
        ]}
        rows={forwardDates.map((d) => [
          d.date,
          d.available,
          d.previous,
          d.otb,
          d.lastYear,
          d.adr,
          d.bar,
          d.netPickup,
          d.event,
        ])}
      />
      <p className="table-note">
        {es(
          'LY is the comparable prior-year position at equivalent lead time. “Net to come” is a training assumption, already net of booking losses. OTB ADR is accommodation-only.',
        )}
      </p>
    </>
  );
}
