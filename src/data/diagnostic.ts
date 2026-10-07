import type { Question } from '../domain/content';
type Pair = [en: string, es: string];
function check(
  id: string,
  topic: string,
  prompt: Pair,
  options: Pair[],
  explanation: Pair,
): Question {
  return {
    id,
    topic,
    concept: topic,
    prompt: prompt[0],
    answer: options[0][0],
    options: options.map((o) => o[0]),
    explanation: explanation[0],
    copy: {
      es: { prompt: prompt[1], options: options.map((o) => o[1]), explanation: explanation[1] },
    },
  };
}
// Synthetic routing questions. Diagnostic success does not establish mastery.
export const diagnostic: Question[] = [
  check(
    'diag-030-occ',
    'occupancy',
    [
      '120 sold room nights, 160 available, USD 24,000 room revenue. Correct pair?',
      '120 room nights vendidos, 160 disponibles, USD 24,000 de ingreso de habitaciones. ¿Par correcto?',
    ],
    [
      ['Occupancy 75%; ADR USD 200', 'Ocupación 75%; ADR USD 200'],
      ['Occupancy 75%; ADR USD 150', 'Ocupación 75%; ADR USD 150'],
      ['Occupancy 80%; ADR USD 200', 'Ocupación 80%; ADR USD 200'],
    ],
    [
      'Occupancy = 120 / 160 × 100; ADR = 24,000 / 120. Available nights are the RevPAR denominator.',
      'Ocupación = 120 / 160 × 100; ADR = 24,000 / 120. Noches disponibles son denominador de RevPAR.',
    ],
  ),
  check(
    'diag-030-pickup',
    'pickup',
    [
      'Same stay date: OTB rises from 100 to 115 between snapshots. What is known?',
      'Misma estancia: OTB sube de 100 a 115 entre snapshots. ¿Qué sabemos?',
    ],
    [
      [
        'Net pickup +15; gross new bookings may be higher if cancellations occurred',
        'Pickup neto +15; reservas brutas nuevas podrían ser mayores si hubo cancelaciones',
      ],
      ['Pace is +15 versus last year', 'Pace es +15 contra el año pasado'],
      [
        'Exactly 15 new bookings and no cancellations',
        'Exactamente 15 reservas nuevas y ninguna cancelación',
      ],
    ],
    [
      'Pickup is net change for one stay date. Pace needs a historical snapshot at equivalent lead time.',
      'Pickup es cambio neto para una estancia. Pace necesita snapshot histórico con igual anticipación.',
    ],
  ),
  check(
    'diag-030-pricing',
    'pricing',
    [
      'Occupancy below budget at D−21. Defensible first response?',
      'Ocupación debajo del presupuesto a D−21. ¿Primera respuesta defendible?',
    ],
    [
      [
        'Check demand, segments, restrictions and contribution before changing rates',
        'Revisar demanda, segmentos, restricciones y contribución antes de cambiar tarifas',
      ],
      ['Discount all dates immediately', 'Descontar todas las fechas de inmediato'],
      ['Close every low-priced channel', 'Cerrar todo canal de tarifa baja'],
    ],
    [
      'Low occupancy is an observation, not proof of price resistance. Match action to evidence and booking window.',
      'Baja ocupación es observación, no prueba de resistencia al precio. Ajusta acción a evidencia y ventana de reservas.',
    ],
  ),
  check(
    'diag-030-distribution',
    'distribution',
    [
      'OTA: USD 200 less 36 commission. Direct: USD 190 less 30 acquisition. Which net amount is higher?',
      'OTA: USD 200 menos 36 comisión. Directo: USD 190 menos 30 adquisición. ¿Qué neto es mayor?',
    ],
    [
      ['OTA 164 versus direct 160', 'OTA 164 contra directo 160'],
      ['Direct always wins', 'Directo siempre gana'],
      ['OTA 200 versus direct 190', 'OTA 200 contra directo 190'],
    ],
    [
      'Subtract stated costs. This is not full profit: operating costs and incremental demand still matter.',
      'Resta costos indicados. No es utilidad completa: aún importan costos operativos y demanda incremental.',
    ],
  ),
  check(
    'diag-030-forecast',
    'forecast-rooms',
    [
      'OTB 100, expected net remaining pickup 30, capacity 160. Teaching forecast?',
      'OTB 100, Pickup neto restante esperado 30, capacidad 160. ¿Forecast didáctico?',
    ],
    [
      ['130 rooms; do not subtract wash again', '130 habitaciones; no descontar wash otra vez'],
      ['160 rooms because capacity is 160', '160 habitaciones porque capacidad es 160'],
      [
        '100 rooms because future demand is uncertain',
        '100 habitaciones porque demanda futura es incierta',
      ],
    ],
    [
      'OTB + net remaining pickup, constrained by capacity. Visible assumptions support a teaching model, not an RMS prediction.',
      'OTB + Pickup neto restante, limitado por capacidad. Supuestos visibles apoyan un modelo didáctico, no predicción de RMS.',
    ],
  ),
  check(
    'diag-030-quality',
    'excel',
    [
      'PMS and Finance room revenue disagree. First investigation?',
      'Ingreso de habitaciones de PMS y Finanzas difiere. ¿Primera investigación?',
    ],
    [
      [
        'Align dates, refresh times, statuses, taxes and revenue scope',
        'Alinear fechas, actualización, estados, impuestos y alcance de ingreso',
      ],
      ['Use the higher total', 'Usar el total mayor'],
      ['Average both totals', 'Promediar ambos totales'],
    ],
    [
      'Comparable scope precedes reconciliation. Trace exceptions to rows before modifying records.',
      'Alcance comparable precede conciliación. Rastrea excepciones a filas antes de modificar registros.',
    ],
  ),
  check(
    'diag-030-excel',
    'excel',
    [
      'Sum confirmed OTA room revenue using two conditions. Which Excel function?',
      'Sumar ingreso de habitaciones OTA confirmado con dos condiciones. ¿Qué función de Excel?',
    ],
    [
      ['SUMIFS', 'SUMIFS'],
      ['COUNTIFS', 'COUNTIFS'],
      ['XLOOKUP', 'XLOOKUP'],
    ],
    [
      'SUMIFS sums matching values; COUNTIFS counts rows; XLOOKUP retrieves a match. Validate row grain first.',
      'SUMIFS suma valores coincidentes; COUNTIFS cuenta filas; XLOOKUP recupera coincidencia. Primero valida granularidad.',
    ],
  ),
  check(
    'diag-030-interpretation',
    'revpar',
    [
      'Same capacity: ADR 200 → 220, occupancy 80% → 60%. Supported conclusion?',
      'Igual capacidad: ADR 200 → 220, ocupación 80% → 60%. ¿Conclusión respaldada?',
    ],
    [
      [
        'RevPAR falls 160 → 132; cause needs investigation',
        'RevPAR baja 160 → 132; falta investigar causa',
      ],
      ['Performance improved because ADR rose', 'Desempeño mejoró porque subió ADR'],
      ['Price is proven too high', 'Está demostrado que precio es demasiado alto'],
    ],
    [
      'RevPAR = ADR × occupancy as a fraction. A metric describes a result; segment mix and demand help explain it.',
      'RevPAR = ADR × ocupación como fracción. Una métrica describe resultado; mezcla y demanda ayudan a explicarlo.',
    ],
  ),
];
export const diagnosticTopics = diagnostic.map((q) => q.topic!);
