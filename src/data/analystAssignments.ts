import type { Question } from '../domain/content';

export type AssignmentCopy = { es: string; en: string };
const c = (es: string, en: string): AssignmentCopy => ({ es, en });
export const analystSources = [
  { name: 'STR', url: 'https://str.com/sites/default/files/us_hotel_forecast_review_sample.pdf' },
  { name: 'IDeaS', url: 'https://ideas.com/exceptional-analytics/' },
  { name: 'HSMAI', url: 'https://academy.hsmai.org/revenue/' },
];
export const channelLookup = [
  { channel: 'DIRECT', acquisition: 0.04 },
  { channel: 'OTA', acquisition: 0.18 },
  { channel: 'CORPORATE', acquisition: 0.08 },
  { channel: 'GROUP', acquisition: 0.1 },
];
export type AnalystRow = {
  id: string;
  booked: string;
  arrival: string;
  departure: string;
  rooms: number;
  nightlyRate: number;
  channel: string;
  cancelled: string;
  roomType: string;
};
export const analystRows: AnalystRow[] = Array.from({ length: 18 }, (_, i) => ({
  id: `SYN-${i + 1}`,
  booked: i % 3 === 0 ? '2026-09-05' : '2026-08-20',
  arrival: i % 2 === 0 ? '2026-09-12' : '2026-09-13',
  departure: '2026-09-15',
  rooms: 12 + i * 2,
  nightlyRate: 180 + (i % 5) * 25,
  channel: channelLookup[i % 4].channel,
  cancelled: i === 4 || i === 11 ? '2026-09-06' : '',
  roomType: i % 4 === 0 ? 'SUITE' : 'STANDARD',
}));
analystRows.push(
  { ...analystRows[0] },
  { ...analystRows[1], id: 'SYN-BAD-ROOMS', rooms: -2 },
  { ...analystRows[2], id: 'SYN-BAD-DATES', departure: '2026-09-11' },
  { ...analystRows[3], id: 'SYN-BAD-CHANNEL', channel: 'UNKNOWN' },
);
const day = (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN;
  const timestamp = Date.parse(date + 'T00:00:00Z');
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === date
    ? timestamp / 86400000
    : NaN;
};
export function cleanAnalystRows(rows: AnalystRow[]) {
  const seen = new Set<string>();
  return rows.filter((r) => {
    const valid =
      !seen.has(r.id) &&
      Number.isInteger(r.rooms) &&
      r.rooms > 0 &&
      Number.isFinite(r.nightlyRate) &&
      r.nightlyRate >= 0 &&
      Number.isFinite(day(r.booked)) &&
      day(r.booked) <= day(r.arrival) &&
      day(r.departure) > day(r.arrival) &&
      (!r.cancelled || (Number.isFinite(day(r.cancelled)) && day(r.cancelled) >= day(r.booked))) &&
      channelLookup.some((ch) => ch.channel === r.channel);
    if (valid) seen.add(r.id);
    return valid;
  });
}
export function summarizeAnalystRows(rows: AnalystRow[], snapshot: string) {
  const live = cleanAnalystRows(rows).filter(
    (r) => r.booked <= snapshot && (!r.cancelled || r.cancelled > snapshot),
  );
  const production = live.map((r) => {
    const nights = Math.max(
      0,
      Math.min(day(r.departure), day('2026-09-15')) - Math.max(day(r.arrival), day('2026-09-12')),
    );
    const roomNights = r.rooms * nights;
    const revenue = roomNights * r.nightlyRate;
    return {
      ...r,
      roomNights,
      revenue,
      net: revenue * (1 - channelLookup.find((ch) => ch.channel === r.channel)!.acquisition),
    };
  });
  const rooms = production.reduce((n, r) => n + r.roomNights, 0);
  const revenue = production.reduce((n, r) => n + r.revenue, 0);
  return {
    production,
    rooms,
    revenue,
    adr: rooms ? revenue / rooms : 0,
    occupancy: (rooms / 2700) * 100,
    revpar: revenue / 2700,
    net: production.reduce((n, r) => n + r.net, 0),
    channels: channelLookup.map((ch) => ({
      channel: ch.channel,
      rooms: production
        .filter((r) => r.channel === ch.channel)
        .reduce((n, r) => n + r.roomNights, 0),
    })),
  };
}
function question(
  id: string,
  concept: string,
  prompt: AssignmentCopy,
  answer: number,
  explanation: AssignmentCopy,
  evidence: 'application' | 'transfer' = 'application',
): Question {
  const concepts: Record<string, string> = {
    inventory: 'available-room-nights',
    unconstrained: 'unconstrained-demand',
    'channel-net': 'channel-net-revenue',
  };
  const topics: Record<string, string> = {
    'channel-net': 'distribution',
    'forecast-revenue': 'forecast-value',
    'percent-change': 'excel',
    'data-quality': 'excel',
    'forecast-error': 'forecast-rooms',
    'forecast-bias': 'forecast-rooms',
  };
  return {
    id,
    concept: concepts[concept] ?? concept,
    topic: topics[concept] ?? concept,
    evidence,
    prompt: prompt.en,
    answer,
    tolerance: 0.05,
    explanation: explanation.en,
    copy: { es: { prompt: prompt.es, explanation: explanation.es } },
  };
}
function reflection(
  id: string,
  prompt: AssignmentCopy,
  rubric: AssignmentCopy[],
  model: AssignmentCopy,
): Question {
  return {
    id,
    concept: 'commercial-reasoning',
    topic: 'commercial-reasoning',
    evidence: 'reflection',
    kind: 'open',
    prompt: prompt.en,
    answer: '',
    explanation: '',
    rubric: rubric.map((r) => r.en),
    modelAnswer: model.en,
    copy: {
      es: {
        prompt: prompt.es,
        explanation: '',
        rubric: rubric.map((r) => r.es),
        modelAnswer: model.es,
      },
    },
  };
}
export const excelBrief = c(
  'Asignación sintética del resort de 900 habitaciones: presenta un resumen OTB para las noches del 12 al 14 de septiembre de 2026 al corte del 8 de septiembre (fin del día). El inventario es 2,700 room nights; este extracto contiene toda la producción OTB de esas fechas. No representa ocupación realizada. Cada fila puede agrupar varias habitaciones idénticas. Departure no cuenta como noche. La tarifa es por habitación y noche, en USD, sin impuestos ni ingresos adicionales. Una cancelación entra en vigor al final de su fecha. Conserva la primera fila válida de cada ID y excluye filas inválidas; no las corrijas sin evidencia.',
  'Synthetic assignment for the 900-room resort: present an OTB summary for September 12–14, 2026 at the September 8 end-of-day snapshot. Inventory is 2,700 room nights; this extract contains all OTB production for those dates. This is not realized occupancy. Each row may group identical rooms. Departure is excluded. Rate is per room per night in USD, excluding taxes and ancillary revenue. Cancellation takes effect at the end of its date. Keep the first valid row per ID and exclude invalid rows; do not repair them without evidence.',
);
export const excelSteps = [
  c(
    '1. Exporta ambos CSV y abre los archivos en Excel. Importa fechas como fechas y cantidades como números; conserva una hoja Raw sin cambios.',
    '1. Export both CSV files and open them in Excel. Import dates as dates and quantities as numbers; retain an unchanged Raw sheet.',
  ),
  c(
    '2. Convierte los datos en tabla; filtra duplicados, habitaciones negativas, fechas invertidas y canales desconocidos. Ordena por arrival y tarifa. IF marca válido/inválido; COUNTIFS ayuda a detectar IDs repetidos. Documenta cada exclusión.',
    '2. Create a table; filter duplicate IDs, negative rooms, reversed dates and unknown channels. Sort by arrival and rate. IF flags valid/invalid rows; COUNTIFS helps detect duplicate IDs. Document each exclusion.',
  ),
  c(
    '3. Usa XLOOKUP para traer acquisition de la tabla de canales. IFERROR debe marcar un canal sin correspondencia como “revisar”, nunca convertirlo silenciosamente en costo cero. Calcula nights = departure − arrival, room nights = nights × rooms y revenue = room nights × nightlyRate.',
    '3. Use XLOOKUP to retrieve acquisition from the channel table. IFERROR should flag unmatched channels for review, never silently assume zero cost. Calculate nights = departure − arrival, room nights = nights × rooms and revenue = room nights × nightlyRate.',
  ),
  c(
    '4. Al corte, incluye booked ≤ snapshot y cancelled vacía o > snapshot. SUMIFS suma producción por canal; COUNTIFS cuenta registros, no habitaciones. Una tabla dinámica por canal debe sumar room nights y revenue. ADR ponderado = SUM(revenue)/SUM(room nights), nunca el promedio simple de tarifas.',
    '4. At each snapshot include booked ≤ snapshot and cancelled blank or > snapshot. SUMIFS totals production by channel; COUNTIFS counts records, not rooms. A channel pivot should sum room nights and revenue. Weighted ADR = SUM(revenue)/SUM(room nights), never the simple average of rates.',
  ),
  c(
    '5. Compara cortes del 1 y 8 de septiembre para las mismas stay dates. Pickup neto incluye nuevas reservas menos cancelaciones; variación % = (actual − previo)/previo × 100. El control financiero incluye 16% de impuesto y USD 300 de otros ingresos: resta 300 y divide entre 1.16 antes de conciliar.',
    '5. Compare September 1 and 8 snapshots for the same stay dates. Net Pickup includes new bookings less cancellations; percent variance = (current − previous)/previous × 100. The Finance control includes 16% tax and USD 300 ancillary revenue: subtract 300 and divide by 1.16 before reconciling.',
  ),
  c(
    '6. Entrega un resumen por canal, KPIs OTB, exclusiones y una recomendación con seguimiento. Power Query permite conservar importación, tipos, unión con canales y pasos de validación para repetirlos al refrescar; revisa totales después de cada actualización. Introduce tus resultados abajo antes de consultar la solución.',
    '6. Deliver a channel summary, OTB KPIs, exclusions and a recommendation with monitoring. Power Query can retain import, types, channel merge and validation steps for refresh; check totals after every refresh. Enter your results below before consulting feedback.',
  ),
];
const current = summarizeAnalystRows(analystRows, '2026-09-08');
const previous = summarizeAnalystRows(analystRows, '2026-09-01');
export const financeControl = current.revenue * 1.16 + 300;
export const excelQuestions: Question[] = [
  question(
    'assignment-clean-1',
    'data-quality',
    c('¿Cuántas filas debes excluir?', 'How many rows must be excluded?'),
    4,
    c(
      'Hay un duplicado, una cantidad negativa, departure anterior a arrival y un canal sin lookup. No excluyas cancelaciones como errores: son registros válidos, aunque no estén activos al corte.',
      'There is one duplicate, a negative quantity, departure before arrival and an unmatched channel. Cancellations are valid records even when inactive at the snapshot.',
    ),
  ),
  question(
    'assignment-rooms-1',
    'inventory',
    c('Calcula room nights OTB al 8 de septiembre.', 'Calculate OTB room nights on September 8.'),
    current.rooms,
    c(
      'Filtra estado al corte y suma rooms × (departure − arrival); no cuentes registros como habitaciones.',
      'Filter snapshot status and sum rooms × (departure − arrival); records are not rooms.',
    ),
  ),
  question(
    'assignment-adr-1',
    'adr',
    c('Calcula ADR ponderado al corte, en USD.', 'Calculate weighted snapshot ADR in USD.'),
    current.adr,
    c(
      'Divide el ingreso de habitaciones entre room nights incluidos. Un promedio simple da igual peso a reservas de tamaños diferentes.',
      'Divide included room revenue by included room nights. A simple average gives unequal-size reservations equal weight.',
    ),
  ),
  question(
    'assignment-occ-1',
    'occupancy',
    c('Calcula ocupación OTB (%).', 'Calculate OTB occupancy (%).'),
    current.occupancy,
    c(
      'Usa room nights OTB / (900 × 3) × 100. No dividas entre 900 para un periodo de tres noches.',
      'Use OTB room nights / (900 × 3) × 100. Do not divide by 900 for a three-night period.',
    ),
  ),
  question(
    'assignment-revpar-1',
    'revpar',
    c('Calcula RevPAR OTB (USD).', 'Calculate OTB RevPAR (USD).'),
    current.revpar,
    c(
      'Ingreso de habitaciones / 2,700 room nights disponibles. RevPAR no mide utilidad.',
      'Room revenue / 2,700 available room nights. RevPAR does not measure profit.',
    ),
  ),
  question(
    'assignment-pickup-1',
    'pickup',
    c(
      'Calcula Pickup neto de room nights del 1 al 8 de septiembre.',
      'Calculate net room-night Pickup from September 1 to 8.',
    ),
    current.rooms - previous.rooms,
    c(
      'Reconstruye ambos cortes con booked y cancelled, luego resta OTB previo del actual para las mismas noches.',
      'Reconstruct both snapshots with booked and cancelled, then subtract previous OTB from current OTB for identical stay nights.',
    ),
  ),
  question(
    'assignment-net-1',
    'channel-net',
    c(
      'Calcula ingreso neto de adquisición (USD), antes de costos operativos.',
      'Calculate revenue net of acquisition (USD), before operating costs.',
    ),
    current.net,
    c(
      'Suma revenue × (1 − acquisition) por registro. Este resultado no es utilidad: faltan costos de operación.',
      'Sum revenue × (1 − acquisition) for each record. This is not profit: operating costs are missing.',
    ),
  ),
  question(
    'assignment-variance-1',
    'percent-change',
    c(
      'Calcula variación % de room nights frente al corte anterior.',
      'Calculate percent change in room nights against the prior snapshot.',
    ),
    ((current.rooms - previous.rooms) / previous.rooms) * 100,
    c(
      'La base del porcentaje es el OTB previo, no el actual. Distingue room nights absolutos de porcentaje.',
      'The denominator is previous OTB, not current OTB. Distinguish absolute room nights from percent change.',
    ),
  ),
  question(
    'assignment-reconcile-1',
    'data-quality',
    c(
      'Normaliza el control financiero mostrado: ¿cuál es su ingreso de habitaciones sin impuestos (USD)?',
      'Normalize the displayed Finance control: what is room revenue excluding taxes (USD)?',
    ),
    current.revenue,
    c(
      'Resta primero 300 de otros ingresos; divide el resto entre 1.16. Coincide con el resumen OTB; una diferencia no implica automáticamente un error del PMS.',
      'First subtract 300 ancillary revenue; divide the remainder by 1.16. This matches the OTB summary; a discrepancy does not automatically imply a PMS error.',
    ),
  ),
  reflection(
    'assignment-summary-1',
    c(
      'Entrega tu resumen gerencial: KPIs OTB y canales, exclusiones, conciliación, una hipótesis y una recomendación medible.',
      'Deliver your management summary: OTB KPIs and channels, exclusions, reconciliation, one hypothesis and a measurable recommendation.',
    ),
    [
      c(
        'Identifica stay dates, snapshots, inventario y que OTB no es Actual.',
        'Identify stay dates, snapshots, inventory and that OTB is not Actual.',
      ),
      c(
        'Incluye totales y ADR ponderado, exclusiones justificadas y puente al control financiero.',
        'Include totals and weighted ADR, justified exclusions and the Finance reconciliation bridge.',
      ),
      c(
        'Separa lo observado de lo que requiere investigar con Reservations, Finance o E-commerce.',
        'Separate observed evidence from questions for Reservations, Finance or E-commerce.',
      ),
      c(
        'Propón una acción con responsable, plazo y medida de éxito; no infieras sensibilidad de precio de este extracto.',
        'Propose an action with owner, deadline and success measure; do not infer price sensitivity from this extract.',
      ),
    ],
    c(
      `El corte actual suma ${current.rooms} room nights y USD ${current.revenue} de habitaciones sobre 2,700 disponibles. Compara distribución por canal y Pickup, sin confundir room nights con registros. Cuatro filas se excluyen por calidad; cancelaciones válidas se mantienen para reconstruir el corte previo. El control coincide al quitar otros ingresos e impuesto. Un siguiente paso defendible es validar con Reservations la causa de las pérdidas y con E-commerce el costo incremental por canal antes de cambiar BAR; monitorear Pickup, mix y contribución.`,
      `The current snapshot totals ${current.rooms} room nights and USD ${current.revenue} room revenue against 2,700 available. Compare channel production and Pickup without confusing room nights with records. Four rows are excluded for quality; valid cancellations remain to reconstruct the prior snapshot. The control reconciles after removing ancillary revenue and tax. A defensible next step is to validate booking losses with Reservations and incremental channel cost with E-commerce before changing BAR; monitor Pickup, mix and contribution.`,
    ),
  ),
];

export type ForecastSegment = {
  segment: string;
  otb: number;
  grossPickup: number;
  existingWash: number;
  pickupLoss: number;
  adr: number;
};
export const forecastSegments: ForecastSegment[] = [
  { segment: 'Corporate', otb: 62, grossPickup: 34, existingWash: 5, pickupLoss: 4, adr: 155 },
  { segment: 'Leisure', otb: 40, grossPickup: 20, existingWash: 4, pickupLoss: 3, adr: 175 },
  { segment: 'Group', otb: 25, grossPickup: 0, existingWash: 5, pickupLoss: 0, adr: 130 },
];
export function forecastSummary(segments: ForecastSegment[], capacity: number) {
  const demand = segments.reduce(
    (n, s) => n + Math.max(0, s.otb - s.existingWash + s.grossPickup - s.pickupLoss),
    0,
  );
  const unconstrainedRevenue = segments.reduce(
    (n, s) => n + Math.max(0, s.otb - s.existingWash + s.grossPickup - s.pickupLoss) * s.adr,
    0,
  );
  return {
    demand,
    rooms: Math.min(capacity, demand),
    revenue: demand <= capacity ? unconstrainedRevenue : null,
  };
}
export const bookingCurve = [
  { days: 28, corporate: 24, leisure: 38, group: 30 },
  { days: 14, corporate: 43, leisure: 46, group: 30 },
  { days: 7, corporate: 62, leisure: 40, group: 25 },
];
export const forecastBrief = c(
  'Hotel urbano de 180 habitaciones, una noche, D−7. La curva muestra habitaciones OTB en cortes D−28, D−14 y D−7 del mismo stay date: puede bajar por cancelaciones. Corporate reserva más cerca de llegada; Group ya tiene su bloque negociado. Base: OTB − wash de reservas actuales + Pickup bruto futuro − pérdidas de reservas futuras. Las dos pérdidas corresponden a poblaciones diferentes; no restes otra cancelación sobre el Pickup neto. ADR por segmento es un supuesto constante, no una tarifa recomendada. Si la demanda rebasa capacidad, hace falta asignar inventario por segmento para estimar revenue; no recortes ingresos proporcionalmente sin justificar el mix.',
  '180-room urban hotel, one stay night, D−7. The curve shows OTB at D−28, D−14 and D−7 for the same stay date: cancellations can lower it. Corporate books closer to arrival; Group has already negotiated its block. Base: OTB − existing-booking wash + future gross Pickup − future-booking losses. These losses concern different populations; do not deduct another cancellation allowance from net Pickup. Segment ADR is assumed constant, not a recommended rate. If demand exceeds capacity, inventory must be allocated by segment to forecast revenue; do not proportionally trim revenue without justifying mix.',
);
export const forecastContext = c(
  'Budget: 165 habitaciones / USD 26,400. Actual posterior: 158 / USD 25,000. Escenario bajo: Pickup bruto 40, pérdidas futuras 10 y wash actual 18; alto: 70, 7 y 10, respectivamente. Son escenarios elegidos por el analista, no intervalos estadísticos. Error = Forecast − Actual; bias es el promedio de errores firmados en varios periodos. Para tres noches anteriores: forecasts 150/160/170 y actuals 140/155/160. Un evento movido de fecha, obras, cambios de canal o diferente día de semana pueden invalidar una curva histórica. Compara snapshots al mismo lead time y revisa cambios de mix.',
  'Budget: 165 rooms / USD 26,400. Later actual: 158 / USD 25,000. Low scenario: gross Pickup 40, future losses 10 and existing wash 18; high: 70, 7 and 10, respectively. These are analyst-selected scenarios, not statistical intervals. Error = Forecast − Actual; bias is mean signed error across periods. For three earlier nights: forecasts 150/160/170 and actuals 140/155/160. A shifted event, renovation, channel changes or different weekday can invalidate a historical curve. Compare snapshots at equal lead time and check mix changes.',
);
const forecast = forecastSummary(forecastSegments, 180);
export const forecastQuestions = [
  question(
    'forecast-segments-1',
    'forecast-rooms',
    c(
      'Con los supuestos base, calcula habitaciones Forecast.',
      'Using base assumptions, calculate forecast rooms.',
    ),
    forecast.rooms,
    c(
      'Suma 62−5+34−4, 40−4+20−3 y 25−5. No sumes OTB al Budget; son referencias distintas.',
      'Sum 62−5+34−4, 40−4+20−3 and 25−5. Do not add OTB to Budget; they are different references.',
    ),
  ),
  question(
    'forecast-revenue-segments-1',
    'forecast-revenue',
    c('Calcula revenue Forecast base (USD).', 'Calculate base forecast revenue (USD).'),
    forecast.revenue!,
    c(
      'Multiplica las habitaciones previstas de cada segmento por su ADR y suma. No uses un promedio simple de los ADR.',
      'Multiply each segment forecast rooms by its ADR and sum. Do not use a simple average of segment ADRs.',
    ),
  ),
  question(
    'forecast-error-1',
    'forecast-error',
    c(
      'Calcula error firmado del Forecast base en habitaciones frente al Actual posterior.',
      'Calculate signed base forecast room error against later Actual.',
    ),
    forecast.rooms - 158,
    c(
      'Forecast − Actual. Positivo indica sobreestimación; una sola fecha no demuestra sesgo persistente.',
      'Forecast − Actual. Positive means overforecast; one date does not establish persistent bias.',
    ),
  ),
  question(
    'forecast-bias-1',
    'forecast-bias',
    c(
      'Calcula bias medio de las tres noches anteriores, en habitaciones.',
      'Calculate mean bias for the three earlier nights, in rooms.',
    ),
    25 / 3,
    c(
      'Promedio de (150−140), (160−155), (170−160). No uses valor absoluto para bias; los signos importan.',
      'Average (150−140), (160−155), (170−160). Do not use absolute error for bias; signs matter.',
    ),
  ),
  question(
    'forecast-low-1',
    'forecast-rooms',
    c('Calcula habitaciones del escenario bajo.', 'Calculate low-scenario rooms.'),
    139,
    c(
      '127 OTB − 18 wash + 40 bruto − 10 pérdidas futuras = 139.',
      '127 OTB − 18 wash + 40 gross − 10 future losses = 139.',
    ),
  ),
  question(
    'forecast-high-1',
    'unconstrained',
    c(
      'Calcula demanda del escenario alto antes de limitar capacidad.',
      'Calculate high-scenario demand before capacity constraint.',
    ),
    180,
    c(
      '127 − 10 + 70 − 7 = 180. Si la demanda superara 180, las ventas quedarían limitadas; demanda y ventas no son equivalentes.',
      '127 − 10 + 70 − 7 = 180. Demand above 180 would constrain sales; demand and sales are not equivalent.',
    ),
  ),
];
const commercialRubric = [
  c(
    'Separa observaciones de hipótesis; cita cifras y limita lo que se puede concluir.',
    'Separate observations from hypotheses; cite figures and limit conclusions.',
  ),
  c(
    'Compara contribución y desplazamiento en todas las noches, canales y room types relevantes.',
    'Compare contribution and displacement across relevant nights, channels and room types.',
  ),
  c(
    'Propón una acción defendible, su alternativa y qué evidencia cambiaría la decisión.',
    'Propose a defensible action, an alternative and evidence that would change the decision.',
  ),
  c(
    'Indica responsable, Pickup/mix/cancelaciones y resultado neto a monitorear.',
    'Name an owner and Pickup/mix/cancellations and net outcome to monitor.',
  ),
];
export const transferCases = [
  {
    id: 'urban',
    title: c('Transferencia: hotel urbano corporativo', 'Transfer: urban corporate hotel'),
    brief: c(
      'Hotel sintético de 180 habitaciones. Martes: OTB 108, corte previo 96, referencia comparable 120; ADR 160. Corporate representa 60% y reserva principalmente D−7 a D−1; OTA 25%, Direct 15%. Budget 150 habitaciones. Viernes es una need date (OTB 65); miércoles tiene congreso (OTB 172, 8 Standard libres, Suites agotadas). Un grupo solicita 12 habitaciones martes–miércoles a 130 por noche, acquisition 10%, costo variable 35. Desplazaría 4 reservas Standard de miércoles a 220 con acquisition 4%. Grupo wash estimado 10%, no garantía. OTA a 175 cuesta 18%; Direct a 160 cuesta 4%.',
      'Synthetic 180-room hotel. Tuesday: OTB 108, prior snapshot 96, comparable reference 120; ADR 160. Corporate is 60% and mostly books D−7 to D−1; OTA 25%, Direct 15%. Budget 150 rooms. Friday is a need date (OTB 65); Wednesday hosts a congress (OTB 172, 8 Standard free, Suites sold out). A group requests 12 rooms Tuesday–Wednesday at 130 per night, acquisition 10%, variable cost 35. It would displace 4 Wednesday Standard bookings at 220 with acquisition 4%. Estimated group wash is 10%, not guaranteed. OTA at 175 costs 18%; Direct at 160 costs 4%.',
    ),
    questions: [
      question(
        'transfer-urban-occ',
        'occupancy',
        c('Calcula ocupación OTB del martes (%).', 'Calculate Tuesday OTB occupancy (%).'),
        60,
        c(
          '108/180 × 100. No uses la capacidad de 900 del resort.',
          '108/180 × 100. Do not use the resort capacity of 900.',
        ),
        'transfer',
      ),
      question(
        'transfer-urban-pace',
        'pace',
        c(
          'Calcula diferencia de Pace en habitaciones frente a referencia comparable.',
          'Calculate room Pace difference against the comparable reference.',
        ),
        -12,
        c(
          '108−120 = −12. Pickup es 108−96 = +12: Pace negativo puede coexistir con Pickup positivo.',
          '108−120 = −12. Pickup is 108−96 = +12: negative Pace can coexist with positive Pickup.',
        ),
        'transfer',
      ),
      question(
        'transfer-urban-net',
        'channel-net',
        c(
          'Calcula ingreso neto por room night OTA a 175, antes del costo variable.',
          'Calculate OTA net revenue per room night at 175, before variable cost.',
        ),
        143.5,
        c(
          '175 × (1−0.18) = 143.50; Direct produce 160 × 0.96 = 153.60. Compara también demanda incremental, restricciones y cancelaciones.',
          '175 × (1−0.18) = 143.50; Direct produces 160 × 0.96 = 153.60. Also compare incremental demand, restrictions and cancellations.',
        ),
        'transfer',
      ),
      reflection(
        'transfer-urban-decision',
        c(
          'Defiende una decisión sobre el grupo y una acción distinta para viernes. Explica restricciones por room type, desplazamiento y cómo medirías el resultado.',
          'Defend a group decision and a separate Friday action. Explain room-type constraints, displacement and how you would measure the outcome.',
        ),
        commercialRubric,
        c(
          'Una opción es renegociar a 8 Standard o cambiar fechas: 12 habitaciones no caben el miércoles sin desplazamiento. Contribución grupo sin wash: 24 × (130×0.90−35)=1,968; desplazamiento: 4×(220×0.96−35)=704.80, pero confirma demanda martes, room type, contrato y riesgo de wash antes de decidir. Para viernes, prueba una oferta segmentada con Sales y monitorea Pickup y contribución incremental; bajar BAR general requiere evidencia de sensibilidad. Otra decisión puede ser razonable con supuestos explícitos.',
          'One option is to renegotiate to 8 Standard or shift dates: 12 rooms do not fit Wednesday without displacement. Group contribution before wash: 24 × (130×0.90−35)=1,968; displacement: 4×(220×0.96−35)=704.80, but confirm Tuesday demand, room type, contract and wash risk first. For Friday, test a targeted offer with Sales and monitor Pickup and incremental contribution; a general BAR cut needs price-sensitivity evidence. Other decisions can be reasonable with explicit assumptions.',
        ),
      ),
    ],
  },
  {
    id: 'leisure',
    title: c('Transferencia: pequeño resort de ocio', 'Transfer: small leisure resort'),
    brief: c(
      'Hotel sintético de 64 habitaciones: ocio 70%, grupos 20%, corporativo 10%; Booking Window típico 30–60 días, OTA 55%, Direct 45%. Sábado: OTB 60, ADR 240, referencia 56 a ADR 260. Domingo: OTB 28. Competidor anuncia BAR 210 pero desconoces sus inclusiones y ventas. Solo quedan 4 Standard el sábado. OTA 240 tiene comisión 18%; Direct 225 requiere acquisition 12% por campaña. Solicitud de 6 habitaciones sábado–domingo. Históricamente hubo 3 cancelaciones/no-shows el sábado, pero oscilan entre 0 y 7. No hay hotel alternativo confirmado.',
      'Synthetic 64-room hotel: leisure 70%, groups 20%, corporate 10%; typical Booking Window 30–60 days, OTA 55%, Direct 45%. Saturday: OTB 60, ADR 240, reference 56 at ADR 260. Sunday: OTB 28. A competitor advertises BAR 210 but inclusions and sales are unknown. Only 4 Standard remain Saturday. OTA 240 has 18% commission; Direct 225 needs 12% acquisition for a campaign. Request for 6 rooms Saturday–Sunday. Historical Saturday cancellations/no-shows average 3 but range from 0 to 7. No relocation hotel is confirmed.',
    ),
    questions: [
      question(
        'transfer-leisure-revpar',
        'revpar',
        c('Calcula RevPAR OTB del sábado (USD).', 'Calculate Saturday OTB RevPAR (USD).'),
        225,
        c(
          '60×240/64 = 225; la referencia es 56×260/64 = 227.50. Más ocupación no asegura mejor RevPAR.',
          '60×240/64 = 225; the reference is 56×260/64 = 227.50. Higher occupancy does not guarantee higher RevPAR.',
        ),
        'transfer',
      ),
      question(
        'transfer-leisure-direct',
        'channel-net',
        c(
          'Calcula ingreso neto por room night Direct de la campaña.',
          'Calculate campaign Direct net revenue per room night.',
        ),
        198,
        c(
          '225×(1−0.12)=198; OTA = 240×0.82=196.80. La pequeña ventaja no prueba que toda venta Direct sea mejor.',
          '225×(1−0.12)=198; OTA = 240×0.82=196.80. This small advantage does not prove every Direct booking is better.',
        ),
        'transfer',
      ),
      reflection(
        'transfer-leisure-decision',
        c(
          'Recomienda cómo vender sábado y domingo. Evalúa MinLOS, CTA, solicitud de 6 habitaciones, competidor y overbooking introductorio.',
          'Recommend how to sell Saturday and Sunday. Evaluate MinLOS, CTA, the 6-room request, competitor and introductory overbooking.',
        ),
        commercialRubric,
        c(
          'Puede probarse MinLOS 2 para las 4 Standard restantes si protege contribución del fin de semana sin bloquear demanda valiosa. CTA impide llegadas ese día, no elimina estancias continuas; aplicarlo indiscriminadamente puede perder negocio. Renegociar 4 habitaciones o fechas evita prometer 6 sobre inventario conocido. Tres pérdidas históricas no autorizan overbooking automático: requiere distribución de riesgo, room types, costos de reubicación y acuerdo con Front Office. Valida inclusiones del competidor; monitorea Pickup domingo, rechazos sábado, conversión, wash y contribución conjunta.',
          'A two-night MinLOS test for the remaining 4 Standard may protect weekend contribution without blocking valuable demand. CTA prevents arrivals that day, not continuing stays; indiscriminate use can lose business. Renegotiating to 4 rooms or changing dates avoids promising 6 against known inventory. Three historical losses do not justify automatic overbooking: assess risk distribution, room types, relocation costs and Front Office agreement. Check competitor inclusions; monitor Sunday Pickup, Saturday denials, conversion, wash and combined contribution.',
        ),
      ),
    ],
  },
];
