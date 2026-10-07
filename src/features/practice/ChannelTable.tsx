import { Download } from 'lucide-react';
import { channelMix } from '../../data/scenarios';
import { es } from '../../i18n/es';
import { downloadCSV } from '../../shared/export/downloadCSV';
import { getPreferences } from '../../shared/storage/preferences';
import { DataTable } from '../../shared/ui/DataTable';
const number = (n: number) =>
  n.toLocaleString(getPreferences().language === 'es' ? 'es-MX' : 'en-US', {
    maximumFractionDigits: 2,
  });

export function ChannelTable() {
  return (
    <>
      <div className="table-caption">
        <span>{es('Yesterday’s full production · 900 available rooms')}</span>
        <button
          className="subtle"
          onClick={() => downloadCSV('synthetic-channel-production.csv', channelMix)}
        >
          <Download size={14} />
          {es(' Export CSV')}
        </button>
      </div>
      <DataTable
        headers={['Channel', 'Room nights', 'Room revenue $', 'Acquisition cost $']}
        rows={channelMix.map((d) => [d.channel, d.rooms, number(d.revenue), number(d.cost)])}
      />
      <p className="table-note">
        {es(
          'Wholesale revenue is a contracted net amount; zero commission does not mean no distribution economics. Non-room operating revenue yesterday was $108,000.',
        )}
      </p>
    </>
  );
}
