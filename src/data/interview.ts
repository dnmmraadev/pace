import type { Question } from '../domain/content';

// Original screening exercises. All properties, dates and amounts are synthetic.
export const interviewCategories = [
  ['fundamentals', 'Terminology and fundamentals', 'Terminología y fundamentos'],
  ['metrics', 'Metric calculations', 'Cálculo de métricas'],
  ['booking', 'OTB, Pickup and Pace', 'OTB, Pickup y Pace'],
  ['budget', 'Occupancy below budget', 'Ocupación debajo del presupuesto'],
  ['adr', 'ADR up, revenue down', 'ADR sube, ingresos bajan'],
  ['dates', 'Need and compression dates', 'Fechas de necesidad y compresión'],
  ['pricing', 'Pricing decisions', 'Decisiones de pricing'],
  ['competitors', 'Competitor positioning', 'Posicionamiento competitivo'],
  ['distribution', 'Distribution and channels', 'Distribución y canales'],
  ['reconciliation', 'PMS reconciliation', 'Conciliación del PMS'],
  ['forecast', 'Forecast assumptions', 'Supuestos del Forecast'],
  ['excel', 'Excel and data reasoning', 'Excel y razonamiento con datos'],
  ['collaboration', 'Cross-team collaboration', 'Colaboración entre equipos'],
  ['recommendation', 'Explain a recommendation', 'Explicar una recomendación'],
  ['measurement', 'Measure the result', 'Medir el resultado'],
] as const;

type Pair = [en: string, es: string];
function objective(
  id: string,
  category: string,
  topic: string,
  prompt: Pair,
  options: Pair[],
  explanation: Pair,
): Question {
  return {
    id,
    category,
    topic,
    concept: topic,
    evidence: 'application',
    prompt: prompt[0],
    answer: options[0][0],
    options: options.map((o) => o[0]),
    explanation: explanation[0],
    copy: {
      es: { prompt: prompt[1], options: options.map((o) => o[1]), explanation: explanation[1] },
    },
  };
}
function discussion(
  id: string,
  category: string,
  topic: string,
  prompt: Pair,
  rubric: Pair[],
  model: Pair,
): Question {
  return {
    id,
    category,
    topic,
    concept: topic,
    evidence: 'reflection',
    kind: 'open',
    prompt: prompt[0],
    answer: '',
    explanation:
      'Compare your reasoning with the checklist. This is self-review, not an automatically graded commercial decision.',
    rubric: rubric.map((r) => r[0]),
    modelAnswer: model[0],
    copy: {
      es: {
        prompt: prompt[1],
        explanation:
          'Compara tu razonamiento con la lista. Es una autoevaluación, no una calificación automática de tu decisión comercial.',
        rubric: rubric.map((r) => r[1]),
        modelAnswer: model[1],
      },
    },
  };
}
const evidence: Pair = [
  'Separate an observed fact from a hypothesis; name missing evidence.',
  'Separa un hecho observado de una hipótesis; identifica la evidencia faltante.',
];
const action: Pair = [
  'Propose a feasible action and explain its tradeoff.',
  'Propón una acción viable y explica su contrapartida.',
];
const monitor: Pair = [
  'Name a metric, comparison period and review date.',
  'Indica una métrica, un período comparable y una fecha de revisión.',
];
export const interview: Question[] = [
  objective(
    'interview-fundamentals',
    'fundamentals',
    'inventory',
    [
      'What does Revenue Management help a hotel decide?',
      '¿Qué ayuda a decidir Revenue Management en un hotel?',
    ],
    [
      [
        'Which demand to accept at which price and conditions over time',
        'Qué demanda aceptar, a qué precio y con qué condiciones en el tiempo',
      ],
      [
        'How to fill every room regardless of cost',
        'Cómo llenar todas las habitaciones sin considerar costos',
      ],
      ['How to guarantee demand from last year', 'Cómo garantizar la demanda del año pasado'],
    ],
    [
      'Rooms are perishable inventory. Demand, capacity, contribution and uncertainty matter; full occupancy alone is not the goal.',
      'Las habitaciones son inventario perecedero. Importan demanda, capacidad, contribución e incertidumbre; llenar por sí solo no es el objetivo.',
    ],
  ),
  discussion(
    'interview-fundamentals-open',
    'fundamentals',
    'inventory',
    [
      'Explain ADR and RevPAR to a Front Office colleague. What can neither tell you about profit?',
      'Explica ADR y RevPAR a alguien de Front Office. ¿Qué no te dice ninguna sobre la utilidad?',
    ],
    [
      [
        'Define ADR using sold room nights and RevPAR using available room nights.',
        'Define ADR con room nights vendidos y RevPAR con room nights disponibles.',
      ],
      [
        'Explain that distribution and operating costs are absent.',
        'Explica que no incluyen costos de distribución ni operación.',
      ],
    ],
    [
      'ADR is room revenue per sold night; RevPAR is room revenue per available night and combines rate with occupancy. Neither measures profit; I would add costs and contribution.',
      'ADR es ingreso de habitaciones por noche vendida; RevPAR es ingreso de habitaciones por noche disponible y combina tarifa con ocupación. Ninguna mide utilidad; agregaría costos y contribución.',
    ],
  ),
  objective(
    'interview-metrics',
    'metrics',
    'revpar',
    [
      'A synthetic hotel has 200 available rooms, 150 sold and USD 24,000 room revenue for one night. RevPAR?',
      'Un hotel sintético tiene 200 habitaciones disponibles, 150 vendidas y USD 24,000 de ingreso de habitaciones en una noche. ¿RevPAR?',
    ],
    [
      ['USD 120', 'USD 120'],
      ['USD 160', 'USD 160'],
      ['USD 180', 'USD 180'],
    ],
    [
      'Divide room revenue by available rooms: 24,000 / 200 = 120. Dividing by 150 produces ADR, not RevPAR.',
      'Divide ingreso de habitaciones entre disponibles: 24,000 / 200 = 120. Dividir entre 150 produce ADR, no RevPAR.',
    ],
  ),
  discussion(
    'interview-metrics-open',
    'metrics',
    'adr',
    [
      'Two segments sell 20 nights at USD 300 and 80 at USD 150. Explain the hotel ADR without averaging the two rates equally.',
      'Dos segmentos venden 20 noches a USD 300 y 80 a USD 150. Explica el ADR del hotel sin promediar las tarifas con igual peso.',
    ],
    [
      [
        'Calculate revenue for each segment, then divide total revenue by total sold nights.',
        'Calcula ingreso por segmento y divide ingreso total entre noches vendidas.',
      ],
      [
        'Interpret the effect of the segment mix.',
        'Interpreta el efecto de la mezcla de segmentos.',
      ],
    ],
    [
      'Revenue is 6,000 + 12,000; ADR = 18,000 / 100 = USD 180. The USD 225 simple average gives the small segment too much weight.',
      'El ingreso es 6,000 + 12,000; ADR = 18,000 / 100 = USD 180. El promedio simple de USD 225 da demasiado peso al segmento pequeño.',
    ],
  ),
  objective(
    'interview-booking',
    'booking',
    'pace',
    [
      'At 14 days before comparable stay dates, current OTB is 120 versus 150 last year. Current weekly net pickup is +20. What is justified?',
      'A 14 días de fechas de estancia comparables, OTB actual es 120 contra 150 del año pasado. Pickup neto semanal actual es +20. ¿Qué se puede afirmar?',
    ],
    [
      [
        'Pace is −30 rooms; positive pickup does not erase the gap',
        'Pace es −30 habitaciones; el Pickup positivo no elimina la brecha',
      ],
      ['Pace is +20 rooms', 'Pace es +20 habitaciones'],
      ['Final demand must be below last year', 'La demanda final debe ser menor que el año pasado'],
    ],
    [
      'Pace compares OTB at equivalent lead times; Pickup compares snapshots of the same stay date. Neither alone determines final demand.',
      'Pace compara OTB con igual anticipación; Pickup compara snapshots de la misma estancia. Ninguno determina por sí solo la demanda final.',
    ],
  ),
  discussion(
    'interview-booking-open',
    'booking',
    'pickup',
    [
      'A manager says: “Pickup is strong, so no action is needed,” although room Pace is behind. How would you investigate?',
      'Un gerente dice: “El Pickup está fuerte, no hace falta actuar”, aunque Pace de habitaciones está atrasado. ¿Cómo investigarías?',
    ],
    [
      evidence,
      [
        'Check comparable lead time, segment mix, cancellation rates and event calendars.',
        'Revisa anticipación comparable, mezcla de segmentos, cancelaciones y calendario de eventos.',
      ],
      action,
      monitor,
    ],
    [
      'I would confirm like-for-like snapshots, then compare remaining booking curves by segment. Recent pickup might be a delayed group block, not broad demand. I could target uncovered need dates and review net pickup and forecast in three days.',
      'Confirmaría snapshots comparables y curvas de reservas restantes por segmento. El Pickup reciente podría ser un bloque tardío, no demanda general. Podría dirigir acciones a fechas de necesidad y revisar Pickup neto y Forecast en tres días.',
    ],
  ),
  objective(
    'interview-budget',
    'budget',
    'forecast-rooms',
    [
      'A 200-room hotel forecasts 140 sold rooms versus budget 170. What should you check before discounting?',
      'Un hotel de 200 habitaciones pronostica 140 vendidas contra presupuesto de 170. ¿Qué revisarías antes de descontar?',
    ],
    [
      [
        'Remaining demand, segments, rate response and contribution',
        'Demanda restante, segmentos, respuesta a tarifa y contribución',
      ],
      ['Only the occupancy gap', 'Solo la brecha de ocupación'],
      ['Only last year’s BAR', 'Solo BAR del año pasado'],
    ],
    [
      'Budget is a target, forecast an expectation. A gap does not establish price as the cause or prove a discount will produce profitable incremental demand.',
      'Presupuesto es una meta, Forecast una expectativa. Una brecha no demuestra que el precio sea la causa ni que un descuento genere demanda incremental rentable.',
    ],
  ),
  discussion(
    'interview-budget-open',
    'budget',
    'forecast-rooms',
    [
      'Your resort is 15 occupancy points below budget for midweek in 21 days. Give the Revenue Manager a first investigation and one conditional action.',
      'Tu resort está 15 puntos de ocupación debajo del presupuesto entre semana a 21 días. Presenta una primera investigación y una acción condicional al Revenue Manager.',
    ],
    [evidence, action, monitor],
    [
      'I would separate cancelled groups, segment pace and lost availability from price resistance. If qualified local demand exists, test a fenced midweek package with contribution limits; review incremental net bookings versus baseline after one week.',
      'Separaría grupos cancelados, Pace por segmento y disponibilidad perdida de resistencia al precio. Si hay demanda local viable, probaría un paquete entre semana con condiciones y límites de contribución; revisaría reservas netas incrementales contra base tras una semana.',
    ],
  ),
  objective(
    'interview-adr',
    'adr',
    'revpar',
    [
      'ADR rises from 200 to 220 while occupancy falls from 80% to 60%, with capacity unchanged. What happens to RevPAR?',
      'ADR sube de 200 a 220 y ocupación baja de 80% a 60%, con igual capacidad. ¿Qué sucede con RevPAR?',
    ],
    [
      ['It falls from 160 to 132', 'Baja de 160 a 132'],
      ['It rises because ADR rises', 'Sube porque ADR sube'],
      ['It stays at 160', 'Se mantiene en 160'],
    ],
    [
      'RevPAR = ADR × occupancy as a fraction. Higher rate did not offset lost volume; the cause still needs investigation.',
      'RevPAR = ADR × ocupación como fracción. La tarifa mayor no compensó el volumen perdido; aún hay que investigar la causa.',
    ],
  ),
  discussion(
    'interview-adr-open',
    'adr',
    'revpar',
    [
      'ADR improved but room revenue fell. Explain two plausible causes and the data you would request before recommending a rate cut.',
      'ADR mejoró pero cayó el ingreso de habitaciones. Explica dos causas plausibles y qué datos pedirías antes de recomendar bajar tarifa.',
    ],
    [evidence, action, monitor],
    [
      'A low-rate group may have disappeared, or room availability/demand may have fallen. I would request sold/available nights, segment revenue, restrictions and demand indicators. I would change price only if evidence supports a volume response, then monitor net RevPAR and contribution.',
      'Pudo desaparecer un grupo de tarifa baja o reducirse disponibilidad/demanda. Pediría noches vendidas/disponibles, ingreso por segmento, restricciones e indicadores de demanda. Cambiaría tarifa si hay evidencia de respuesta del volumen y mediría RevPAR neto y contribución.',
    ],
  ),
  objective(
    'interview-dates',
    'dates',
    'pricing',
    [
      'Saturday is likely to sell out, Sunday is forecast at 45%. Which restriction assessment is defensible?',
      'El sábado probablemente se llene y el domingo tiene Forecast de 45%. ¿Qué evaluación de restricciones es defendible?',
    ],
    [
      [
        'Test whether MinLOS shifts profitable stays into Sunday without excessive lost demand',
        'Evaluar si MinLOS desplaza estancias rentables al domingo sin perder demasiada demanda',
      ],
      ['Set MinLOS on every date permanently', 'Aplicar MinLOS permanente a todas las fechas'],
      [
        'Close Sunday arrivals because occupancy is low',
        'Cerrar llegadas del domingo por baja ocupación',
      ],
    ],
    [
      'MinLOS requires a minimum stay; CTA closes arrivals on a date. Both can reject valuable demand, so inspect stay patterns and displacement.',
      'MinLOS exige estancia mínima; CTA cierra llegadas en una fecha. Ambas pueden rechazar demanda valiosa: revisa patrones de estancia y desplazamiento.',
    ],
  ),
  discussion(
    'interview-dates-open',
    'dates',
    'pricing',
    [
      'Recommend separate actions for a Tuesday need date and a Saturday compression date. What evidence could change your recommendation?',
      'Recomienda acciones separadas para un martes de necesidad y un sábado de compresión. ¿Qué evidencia cambiaría tu recomendación?',
    ],
    [evidence, action, monitor],
    [
      'For Tuesday I would test targeted incremental demand after checking costs. For Saturday I would protect scarce room types and evaluate rates or stay controls. Weak remaining demand or excessive wash could reverse that stance; review pickup, cancellations and contribution daily.',
      'Para martes probaría demanda incremental dirigida tras revisar costos. Para sábado protegería tipos escasos y evaluaría tarifas o controles de estancia. Demanda restante débil o wash alto podrían cambiar la postura; revisaría Pickup, cancelaciones y contribución cada día.',
    ],
  ),
  objective(
    'interview-pricing',
    'pricing',
    'pricing',
    [
      'Only 10 premium rooms remain and a group requests 8 at a low net rate on an event night. First analysis?',
      'Quedan 10 habitaciones premium y un grupo pide 8 a tarifa neta baja para una noche de evento. ¿Primer análisis?',
    ],
    [
      [
        'Compare group contribution with likely displaced transient contribution by room type',
        'Comparar contribución del grupo contra contribución individual probablemente desplazada por tipo',
      ],
      [
        'Accept because group occupancy is guaranteed',
        'Aceptar porque el grupo garantiza ocupación',
      ],
      ['Reject all groups regardless of rate', 'Rechazar todo grupo sin importar tarifa'],
    ],
    [
      'Displacement concerns business you may lose by accepting a block. Include probability, wash, room types and ancillary contribution rather than gross ADR alone.',
      'Desplazamiento es el negocio que podrías perder al aceptar un bloque. Incluye probabilidad, wash, tipos y contribución adicional, no solo ADR bruto.',
    ],
  ),
  discussion(
    'interview-pricing-open',
    'pricing',
    'pricing',
    [
      'A manager proposes overbooking by 12 rooms because “we always get cancellations.” How would a junior analyst respond?',
      'Un gerente propone overbooking de 12 habitaciones porque “siempre hay cancelaciones”. ¿Cómo respondería un analista junior?',
    ],
    [
      evidence,
      [
        'Discuss uncertainty, room-type availability, walk costs and escalation to authorized managers.',
        'Considera incertidumbre, disponibilidad por tipo, costos de reubicación y escalamiento a responsables autorizados.',
      ],
      monitor,
    ],
    [
      'I would request cancellation/no-show patterns by segment and arrival date, current room-type gaps and relocation capacity. Historical averages do not guarantee wash. I would present a range and costs to the authorized manager, then monitor arrivals and cancellations closely.',
      'Pediría cancelaciones/no-shows por segmento y llegada, faltantes por tipo y capacidad de reubicación. Los promedios históricos no garantizan wash. Presentaría rango y costos al responsable autorizado y monitorearía llegadas y cancelaciones.',
    ],
  ),
  objective(
    'interview-competitors',
    'competitors',
    'benchmarking',
    [
      'Hotel RevPAR is 135, comparable comp-set RevPAR 150. RGI and interpretation?',
      'RevPAR del hotel es 135 y del comp set comparable 150. ¿RGI e interpretación?',
    ],
    [
      [
        '90; relative RevPAR is below the aggregate, not proof of unprofitability',
        '90; RevPAR relativo inferior al agregado, no prueba de falta de utilidad',
      ],
      ['110; the hotel is above market', '110; el hotel supera al mercado'],
      ['90; cut BAR automatically', '90; bajar BAR automáticamente'],
    ],
    [
      'RGI = 135 / 150 × 100. Check MPI, ARI and comp-set relevance; an index is a relative performance signal, not a prescribed pricing action.',
      'RGI = 135 / 150 × 100. Revisa MPI, ARI y relevancia del comp set; el índice señala desempeño relativo, no prescribe pricing.',
    ],
  ),
  discussion(
    'interview-competitors-open',
    'competitors',
    'benchmarking',
    [
      'A competitor undercuts BAR by 20%. Explain why matching immediately may be weak, and when matching could be defensible.',
      'Un competidor ofrece BAR 20% menor. Explica por qué igualarlo de inmediato puede ser débil y cuándo podría ser defendible.',
    ],
    [evidence, action, monitor],
    [
      'I would compare dates, room types, inclusions and cancellation terms, plus our demand and value position. A targeted match could be reasonable for price-sensitive unmet demand if contribution improves. I would monitor conversion and net revenue, not rate rank alone.',
      'Compararía fechas, tipos, inclusiones y cancelación, además de demanda y propuesta de valor propias. Igualar selectivamente podría servir para demanda sensible al precio si mejora contribución. Mediría conversión e ingreso neto, no solo posición tarifaria.',
    ],
  ),
  objective(
    'interview-distribution',
    'distribution',
    'distribution',
    [
      'OTA sale: USD 250 with 18% commission. Direct sale: USD 235 with USD 35 acquisition cost. Which leaves more after these stated costs?',
      'Venta OTA: USD 250 con 18% comisión. Directa: USD 235 con USD 35 de adquisición. ¿Cuál deja más después de estos costos?',
    ],
    [
      ['OTA: 205 versus direct: 200', 'OTA: 205 contra directa: 200'],
      ['Direct always wins', 'Directa siempre gana'],
      ['OTA: 250 versus direct: 235', 'OTA: 250 contra directa: 235'],
    ],
    [
      '250 × 0.82 = 205; 235 − 35 = 200. These are net of stated acquisition costs only, not full operating profit.',
      '250 × 0.82 = 205; 235 − 35 = 200. Son ingresos netos de los costos indicados, no utilidad operativa completa.',
    ],
  ),
  discussion(
    'interview-distribution-open',
    'distribution',
    'distribution',
    [
      'Would you close an OTA on a low-demand date? Explain what information you need and a defensible decision.',
      '¿Cerrarías una OTA en una fecha de baja demanda? Explica qué información necesitas y una decisión defendible.',
    ],
    [evidence, action, monitor],
    [
      'If the OTA brings incremental profitable demand, closing may reduce contribution. I would check costs, cancellation behavior, demand overlap and direct conversion. I could keep selected rates open, then monitor incremental production and net contribution by stay date.',
      'Si la OTA trae demanda incremental rentable, cerrarla puede reducir contribución. Revisaría costos, cancelaciones, demanda compartida y conversión directa. Podría mantener tarifas seleccionadas y medir producción incremental y contribución neta por estancia.',
    ],
  ),
  objective(
    'interview-reconciliation',
    'reconciliation',
    'excel',
    [
      'PMS shows 155 sold rooms, Revenue report 150. What is the first step?',
      'PMS muestra 155 vendidas y reporte de Revenue 150. ¿Primer paso?',
    ],
    [
      [
        'Align business date, refresh time, status, complimentary and out-of-order conventions',
        'Alinear fecha de negocio, actualización, estado, cortesías y criterio de fuera de servicio',
      ],
      ['Average both reports', 'Promediar ambos reportes'],
      ['Delete five reservations', 'Eliminar cinco reservas'],
    ],
    [
      'Reconcile definitions and scope before changing records. Same labels can hide different report conventions.',
      'Concilia definiciones y alcance antes de modificar registros. Etiquetas iguales pueden ocultar criterios distintos.',
    ],
  ),
  discussion(
    'interview-reconciliation-open',
    'reconciliation',
    'excel',
    [
      'Finance revenue differs from your reservation export. Describe a reconciliation trail and who you involve.',
      'Ingreso de Finanzas difiere de tu exportación de reservas. Describe una ruta de conciliación y a quién involucras.',
    ],
    [
      [
        'Match business date, tax treatment, room allocation, status and posting timing.',
        'Alinea fecha de negocio, impuestos, asignación a habitaciones, estado y momento de registro.',
      ],
      [
        'Reconcile totals to rows; retain exceptions and an audit trail.',
        'Concilia totales contra filas; conserva excepciones y trazabilidad.',
      ],
      [
        'Validate conventions with Finance and operational corrections with Reservations/Front Office.',
        'Valida criterios con Finanzas y correcciones operativas con Reservas/Front Office.',
      ],
    ],
    [
      'I would compare like-for-like room revenue, trace variances to reservation IDs and postings, and document taxes, packages or late adjustments. Finance confirms accounting scope; Reservations and Front Office validate status and stay changes before approved correction.',
      'Compararía ingreso de habitaciones con igual alcance, rastrearía diferencias a IDs y cargos y documentaría impuestos, paquetes o ajustes tardíos. Finanzas confirma alcance contable; Reservas y Front Office validan estado y cambios antes de corregir con autorización.',
    ],
  ),
  objective(
    'interview-forecast',
    'forecast',
    'forecast-rooms',
    [
      'OTB 100, expected gross remaining bookings 40, expected losses 10, capacity 180. Teaching forecast?',
      'OTB 100, reservas brutas restantes esperadas 40, pérdidas esperadas 10, capacidad 180. ¿Forecast didáctico?',
    ],
    [
      ['130 rooms', '130 habitaciones'],
      ['150 rooms', '150 habitaciones'],
      ['140 rooms', '140 habitaciones'],
    ],
    [
      '100 + 40 − 10 = 130. Losses are deducted once; if remaining pickup were already net, no second wash deduction would apply.',
      '100 + 40 − 10 = 130. Pérdidas se deducen una vez; si Pickup restante ya fuera neto, no se descontaría wash nuevamente.',
    ],
  ),
  discussion(
    'interview-forecast-open',
    'forecast',
    'forecast-rooms',
    [
      'Build a forecast range for OTB 100, gross remaining bookings 20–50 and losses 5–15. What makes last year misleading?',
      'Construye un rango de Forecast con OTB 100, reservas brutas restantes 20–50 y pérdidas 5–15. ¿Qué puede hacer engañoso el año pasado?',
    ],
    [
      [
        'State low/high assumptions: 105 and 145 before capacity constraints.',
        'Declara supuestos bajo/alto: 105 y 145 antes del límite de capacidad.',
      ],
      [
        'Separate OTB, forecast, budget and final actual; consider segment windows and event shifts.',
        'Separa OTB, Forecast, presupuesto y actual final; considera ventanas por segmento y eventos desplazados.',
      ],
      monitor,
    ],
    [
      'Low = 100 + 20 − 15 = 105; high = 100 + 50 − 5 = 145. This transparent teaching range is not a production RMS. Event changes and new segment mix can invalidate old curves. I would compare dated forecasts with actuals for error and signed bias.',
      'Bajo = 100 + 20 − 15 = 105; alto = 100 + 50 − 5 = 145. Este rango didáctico transparente no es un RMS de producción. Eventos y nueva mezcla pueden invalidar curvas antiguas. Compararía Forecast fechado con actual para error y sesgo con signo.',
    ],
  ),
  objective(
    'interview-excel',
    'excel',
    'excel',
    [
      'A reservation export has mixed USD/EUR, repeated IDs and text dates. What comes before a channel pivot?',
      'Una exportación tiene USD/EUR mezclados, IDs repetidos y fechas como texto. ¿Qué va antes de una tabla dinámica por canal?',
    ],
    [
      [
        'Validate row grain, duplicates, currency and date types',
        'Validar granularidad, duplicados, moneda y tipos de fecha',
      ],
      ['Sum every revenue row as-is', 'Sumar todas las filas sin cambios'],
      ['Replace every error with zero', 'Reemplazar todo error con cero'],
    ],
    [
      'A pivot summarizes inputs; it does not repair invalid records. Identify whether repeated IDs are legitimate room-night lines before deduplicating.',
      'Una tabla dinámica resume entradas, no repara registros inválidos. Verifica si IDs repetidos son filas legítimas por room night antes de deduplicar.',
    ],
  ),
  discussion(
    'interview-excel-open',
    'excel',
    'excel',
    [
      'Explain how you would turn reservation rows into a channel production summary an RM can trust.',
      'Explica cómo transformarías filas de reservas en un resumen de producción por canal confiable para Revenue.',
    ],
    [
      [
        'Validate grain, dates, currency, duplicates and excluded statuses.',
        'Valida granularidad, fechas, moneda, duplicados y estados excluidos.',
      ],
      [
        'Use SUMIFS/pivot for nights and revenue, COUNTIFS for booking counts, XLOOKUP for mappings and weighted ADR.',
        'Usa SUMIFS/tabla dinámica para noches e ingreso, COUNTIFS para reservas, XLOOKUP para mapas y ADR ponderado.',
      ],
      [
        'Use IF/IFERROR with visible exception flags; reconcile totals and describe refresh steps or Power Query transformations.',
        'Usa IF/IFERROR con alertas visibles; concilia totales y describe actualización o transformaciones de Power Query.',
      ],
    ],
    [
      'I would preserve raw data, type dates, flag invalid rows, map channels and summarize confirmed room nights/revenue. ADR is total revenue / total sold nights. I would reconcile to the agreed PMS scope and publish exception counts with a repeatable refresh process.',
      'Conservaría datos crudos, tiparía fechas, marcaría inválidos, mapearía canales y resumiría noches/ingreso confirmados. ADR es ingreso total / noches vendidas totales. Conciliaría con alcance acordado del PMS y mostraría excepciones y actualización repetible.',
    ],
  ),
  objective(
    'interview-collaboration',
    'collaboration',
    'workflow',
    [
      'A campaign is live but pickup is flat. Which collaboration best investigates the funnel?',
      'Una campaña está activa pero Pickup no crece. ¿Qué colaboración investiga mejor el embudo?',
    ],
    [
      [
        'E-commerce checks traffic/conversion; Reservations checks inquiries; Sales checks accounts; Finance validates contribution; Front Office validates availability',
        'E-commerce revisa tráfico/conversión; Reservas consultas; Ventas cuentas; Finanzas contribución; Front Office disponibilidad',
      ],
      [
        'Revenue changes every rate without consulting anyone',
        'Revenue cambia todas las tarifas sin consultar',
      ],
      [
        'Front Office is responsible for creating all demand',
        'Front Office debe generar toda la demanda',
      ],
    ],
    [
      'Commercial decisions depend on coordinated evidence. Assign owners and confirm report definitions rather than blaming a team.',
      'Las decisiones comerciales requieren evidencia coordinada. Asigna responsables y confirma criterios de reporte en lugar de culpar a un equipo.',
    ],
  ),
  discussion(
    'interview-collaboration-open',
    'collaboration',
    'workflow',
    [
      'Sales wants a low-rate group; Front Office reports premium rooms out of order; Finance questions package margin. How do you prepare the meeting?',
      'Ventas quiere un grupo de tarifa baja; Front Office reporta premium fuera de servicio; Finanzas cuestiona margen del paquete. ¿Cómo preparas la reunión?',
    ],
    [
      [
        'Obtain group pattern/wash from Sales and Reservations; validated room-type capacity from Front Office.',
        'Obtén patrón/wash de Ventas y Reservas; capacidad por tipo validada de Front Office.',
      ],
      [
        'Ask Finance for contribution and E-commerce for realistic transient demand; present displacement alternatives.',
        'Pide contribución a Finanzas y demanda individual realista a E-commerce; presenta alternativas de desplazamiento.',
      ],
      [
        'Document assumptions, decision owner and monitoring.',
        'Documenta supuestos, responsable y seguimiento.',
      ],
    ],
    [
      'I would build a dated room-type view, group terms and contribution comparison with transient alternatives. Each team validates its input. I would present acceptance, counteroffer or refusal with uncertainty, then record the authorized decision and follow pickup/wash.',
      'Prepararía disponibilidad por fecha/tipo, condiciones del grupo y contribución contra alternativas individuales. Cada equipo valida su dato. Presentaría aceptar, contraofertar o rechazar con incertidumbre; registraría decisión autorizada y seguimiento de Pickup/wash.',
    ],
  ),
  objective(
    'interview-recommendation',
    'recommendation',
    'meeting',
    [
      'Which statement correctly separates observation, hypothesis and recommendation?',
      '¿Qué afirmación separa observación, hipótesis y recomendación?',
    ],
    [
      [
        'OTB is −30; a lost group may explain it; verify the block before targeted outreach',
        'OTB está −30; podría explicarlo un grupo perdido; verificar el bloque antes de contactar demanda dirigida',
      ],
      [
        'OTB is −30, therefore guests reject our price',
        'OTB está −30, por tanto huéspedes rechazan el precio',
      ],
      ['A price cut always fixes negative pace', 'Bajar tarifa siempre corrige Pace negativo'],
    ],
    [
      'A fact is measured, a hypothesis needs evidence, and an action should be conditional and measurable.',
      'Un hecho se mide, una hipótesis requiere evidencia y una acción debe ser condicional y medible.',
    ],
  ),
  discussion(
    'interview-recommendation-open',
    'recommendation',
    'meeting',
    [
      'Give a 60-second recommendation: 180-room urban hotel, next Wednesday OTB 90 at D−10 versus comparable 110, ADR USD 160 versus budget 150; an event was cancelled. More than one decision can be defensible.',
      'Da una recomendación de 60 segundos: hotel urbano de 180 habitaciones, próximo miércoles OTB 90 a D−10 contra comparable 110, ADR USD 160 contra presupuesto 150; un evento se canceló. Puede haber más de una decisión defendible.',
    ],
    [evidence, action, monitor],
    [
      'Observed: room pace is −20 while booked ADR exceeds budget. The cancelled event may explain demand loss; it does not prove a rate problem. I would refresh remaining corporate demand and test targeted outreach at a contribution floor. Review net pickup and forecast in three days, retaining rate if no evidence supports discount response.',
      'Observado: Pace de habitaciones −20 y ADR reservado supera presupuesto. El evento cancelado puede explicar menor demanda, no demuestra problema de tarifa. Actualizaría demanda corporativa restante y probaría contacto dirigido con piso de contribución. Revisaría Pickup neto y Forecast en tres días, conservando tarifa sin evidencia de respuesta al descuento.',
    ],
  ),
  objective(
    'interview-measurement',
    'measurement',
    'meeting',
    [
      'After a discount campaign occupancy rises. What supports an evaluation of commercial success?',
      'Tras una campaña de descuento sube ocupación. ¿Qué permite evaluar éxito comercial?',
    ],
    [
      [
        'Compare incremental net contribution, displacement and comparable baseline demand',
        'Comparar contribución neta incremental, desplazamiento y demanda base comparable',
      ],
      ['Occupancy alone', 'Solo ocupación'],
      ['Number of promotional emails', 'Cantidad de correos promocionales'],
    ],
    [
      'Higher occupancy can accompany lower contribution. Compare against a credible baseline and account for costs, cancellations and displaced full-rate sales.',
      'Mayor ocupación puede acompañar menor contribución. Compara con base creíble y considera costos, cancelaciones y ventas de tarifa completa desplazadas.',
    ],
  ),
  discussion(
    'interview-measurement-open',
    'measurement',
    'meeting',
    [
      'How would you decide whether a two-week OTA promotion worked, without claiming it caused every extra booking?',
      '¿Cómo decidirías si funcionó una promoción OTA de dos semanas sin afirmar que causó toda reserva adicional?',
    ],
    [evidence, action, monitor],
    [
      'I would define baseline and stay-date scope before launch, monitor net bookings, cancellations, net revenue and displacement, and compare similar dates/segments. Event shifts and marketing overlap limit causal claims. Retain, revise or stop based on contribution and observed uncertainty.',
      'Definiría base y fechas de estancia antes del lanzamiento; mediría reservas netas, cancelaciones, ingreso neto y desplazamiento contra fechas/segmentos similares. Eventos y marketing simultáneo limitan causalidad. Mantendría, ajustaría o detendría según contribución e incertidumbre.',
    ],
  ),
];
