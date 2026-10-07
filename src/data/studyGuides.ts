/** Original bilingual study notes. IDs belong to the existing curriculum, not progress. */
export type StudyCopy = { es: string; en: string };
export type StudyGuide = {
  objective: StudyCopy;
  sections: { title: StudyCopy; body: StudyCopy }[];
  steps: StudyCopy[];
  interpretation: StudyCopy;
  action: StudyCopy;
  reflection: StudyCopy;
  sources: (keyof typeof studySources)[];
};
const c = (es: string, en: string): StudyCopy => ({ es, en });
const s = (titleEs: string, titleEn: string, bodyEs: string, bodyEn: string) => ({
  title: c(titleEs, titleEn),
  body: c(bodyEs, bodyEn),
});
export const studySources = {
  hsmai: { name: 'HSMAI Academy', url: 'https://academy.hsmai.org/revenue/' },
  pricing: { name: 'SiteMinder', url: 'https://www.siteminder.com/r/hotel-revenue-management/' },
  forecast: { name: 'IDeaS', url: 'https://ideas.com/revenue-science-101-forecasting/' },
  indices: { name: 'STR', url: 'https://str.com/es/resourcesglossary/index-indice' },
  learning: { name: 'IES', url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/1' },
} as const;
export const studyGuides: Record<string, StudyGuide> = {
  inventory: {
    objective: c(
      'Distinguir habitaciones, reservas y habitaciones-noche para medir correctamente la capacidad que puedes vender.',
      'Distinguish rooms, reservations and room nights to measure sellable capacity correctly.',
    ),
    sections: [
      s(
        'La fecha es parte del producto',
        'The date is part of the product',
        'Una habitación del lunes y la misma habitación del martes son oportunidades de venta distintas. Tener demanda para una fecha no compensa automáticamente otra fecha vacía. Por eso el analista organiza el inventario por fecha de estancia y, cuando corresponde, por tipo de habitación. La reserva es el registro comercial; las habitaciones-noche son las unidades de capacidad utilizadas.',
        'Monday and Tuesday are separate selling opportunities, even for the same physical room. Demand on one date does not automatically offset an empty date. Organize inventory by stay date and, where relevant, room type. A reservation is the commercial record; room nights are the capacity units it consumes.',
      ),
      s(
        'Capacidad física y disponibilidad comercial',
        'Physical capacity and commercial availability',
        'El resort tiene aproximadamente 900 habitaciones, pero un cierre por mantenimiento puede reducir la capacidad disponible de una fecha. Una tarifa o canal cerrado también puede impedir ventas sin reducir la capacidad física. Antes de recomendar un descuento, confirma qué está disponible, qué se está ofreciendo y qué demanda existe. Mantén consistente el denominador de los reportes.',
        'The resort has about 900 rooms, but maintenance may reduce availability on a date. A closed rate or channel can suppress sales without reducing physical capacity. Before recommending a discount, confirm available supply, offered inventory and demand. Keep reporting denominators consistent.',
      ),
    ],
    steps: [
      c(
        'Define el periodo: tres noches de estancia, con las 900 habitaciones disponibles cada noche.',
        'Define the period: three stay nights with all 900 rooms available each night.',
      ),
      c(
        'Calcula capacidad: 900 × 3 = 2,700 habitaciones-noche.',
        'Calculate capacity: 900 × 3 = 2,700 room nights.',
      ),
      c(
        'Revisa el lunes por separado: 900 − 700 = 200 oportunidades sin vender. No se trasladan al martes.',
        'Review Monday separately: 900 − 700 = 200 unsold opportunities. They do not carry into Tuesday.',
      ),
    ],
    interpretation: c(
      'El total del periodo resume capacidad, pero la decisión comercial depende de las fechas concretas que necesitan demanda.',
      'The period total summarizes capacity, but commercial decisions depend on the specific dates needing demand.',
    ),
    action: c(
      'Revisa llegadas, salidas y disponibilidad del lunes antes de elegir una oferta que genere noches incrementales.',
      'Review Monday arrivals, departures and availability before choosing an offer that generates incremental nights.',
    ),
    reflection: c(
      'Explica por qué vender dos habitaciones por tres noches no equivale a dos habitaciones-noche.',
      'Explain why two rooms for three nights are not two room nights.',
    ),
    sources: ['hsmai'],
  },
  commercial: {
    objective: c(
      'Comparar ingresos y contribución, y convertir un dato validado en una recomendación verificable.',
      'Compare revenue and contribution, and turn validated data into a testable recommendation.',
    ),
    sections: [
      s(
        'El ingreso necesita contexto de costos',
        'Revenue needs cost context',
        'En un todo incluido, una habitación adicional puede generar costos de alimentos, bebidas, lavandería y adquisición. Separa el ingreso asignado a alojamiento de los demás componentes del paquete. Una comparación de contribución utiliza costos incrementales y una base consistente; no pretende sustituir el estado de resultados ni calcular la utilidad completa.',
        'At an all-inclusive resort an additional occupied room may generate food, beverage, laundry and acquisition costs. Separate accommodation revenue from other package components. A contribution comparison uses incremental costs on a consistent basis; it does not replace the income statement or calculate total profit.',
      ),
      s(
        'Tu papel como analista',
        'Your role as an analyst',
        'Observa el cambio, valida su origen y plantea una explicación. Después actualiza el pronóstico, recomienda una acción y define qué resultado revisarás. El Revenue Manager suele aprobar la estrategia y los controles comerciales; la distribución de responsabilidades depende del hotel. Una buena recomendación distingue hechos, supuestos y límites de autorización.',
        'Observe a change, validate its origin and propose an explanation. Then update the forecast, recommend an action and identify what result to monitor. The Revenue Manager usually approves strategy and commercial controls; responsibilities vary by hotel. Separate facts, assumptions and authorization limits.',
      ),
    ],
    steps: [
      c(
        'Compara la misma asignación de ingreso de habitaciones y el mismo costo de servicio.',
        'Compare the same room-revenue allocation and service-cost basis.',
      ),
      c(
        'Primera reserva: 260 − 40 − 90 = $130 de contribución. Reserva directa: 250 − 10 − 90 = $150.',
        'First booking: 260 − 40 − 90 = $130 contribution. Direct booking: 250 − 10 − 90 = $150.',
      ),
      c(
        'La reserva directa aporta $20 más aunque su ingreso bruto sea $10 menor.',
        'The direct booking contributes $20 more despite $10 less gross revenue.',
      ),
    ],
    interpretation: c(
      'La tarifa más alta no garantiza la mejor contribución. Todavía faltan los costos fijos y el efecto de desplazar otras ventas.',
      'A higher rate does not guarantee better contribution. Fixed costs and displacement of other bookings still matter.',
    ),
    action: c(
      'Presenta la comparación y confirma si la venta directa realmente añade demanda o sustituye una reserva que ya llegaría.',
      'Present the comparison and check whether direct demand is incremental or replaces a booking that would already arrive.',
    ),
    reflection: c(
      '¿Qué costo o supuesto podría cambiar tu recomendación?',
      'Which cost or assumption could change your recommendation?',
    ),
    sources: ['hsmai', 'pricing'],
  },
  occupancy: {
    objective: c(
      'Calcular la ocupación de un periodo y explicar sus cambios sin confundir volumen, capacidad y rentabilidad.',
      'Calculate period occupancy and explain changes without confusing volume, capacity and profitability.',
    ),
    sections: [
      s(
        'Define numerador y denominador',
        'Define numerator and denominator',
        'Usa habitaciones-noche vendidas y disponibles del mismo periodo. No mezcles huéspedes con habitaciones ni reservas de varias noches con producción de un solo día. En estos ejercicios se utilizan noches pagadas y una capacidad declarada de 900 habitaciones por día; en un reporte real debes reconciliar habitaciones fuera de servicio y la convención aplicada.',
        'Use sold and available room nights for the same period. Do not mix guests with rooms or multi-night reservations with a single day of production. Exercises use paid room nights and a stated 900-room daily capacity; real reports require reconciliation of out-of-service rooms and the reporting convention.',
      ),
      s(
        'Porcentaje, puntos y agregación',
        'Percentages, points and aggregation',
        'Al comparar dos porcentajes, la resta produce puntos porcentuales. El crecimiento relativo divide el cambio entre la base original. Para varios días, divide el total vendido entre el total disponible; no promedies porcentajes diarios si las capacidades difieren. Una ocupación mayor puede deberse a más ventas o a un denominador menor.',
        'Subtracting two percentages gives percentage points. Relative growth divides the change by the original base. For multiple days, divide total sold by total available; do not average daily percentages when capacities differ. Higher occupancy can reflect more sales or a smaller denominator.',
      ),
    ],
    steps: [
      c(
        'Identifica 720 habitaciones-noche vendidas y 900 disponibles en la misma fecha.',
        'Identify 720 sold and 900 available room nights for the same date.',
      ),
      c(
        'Divide 720 ÷ 900 = 0.80; multiplica por 100 para obtener 80%.',
        'Divide 720 ÷ 900 = 0.80; multiply by 100 to obtain 80%.',
      ),
      c(
        'Las 180 habitaciones restantes representan capacidad sin vender, no necesariamente demanda perdida.',
        'The remaining 180 rooms represent unsold capacity, not necessarily lost demand.',
      ),
    ],
    interpretation: c(
      '80% describe utilización de capacidad. No revela por sí solo la tarifa lograda ni los costos de servir esas habitaciones.',
      '80% describes capacity utilization. It does not by itself reveal achieved rate or service costs.',
    ),
    action: c(
      'Cruza ocupación con ADR, RevPAR y mezcla de canales antes de concluir que el resultado comercial mejoró.',
      'Compare occupancy with ADR, RevPAR and channel mix before concluding commercial performance improved.',
    ),
    reflection: c(
      'Si baja la capacidad disponible y las ventas no cambian, ¿por qué puede subir la ocupación?',
      'If availability falls while sales stay unchanged, why can occupancy rise?',
    ),
    sources: ['hsmai'],
  },
  adr: {
    objective: c(
      'Separar la tarifa ofrecida de la tarifa lograda y usar una asignación consistente del ingreso de habitaciones.',
      'Separate offered from achieved rate and use a consistent room-revenue allocation.',
    ),
    sections: [
      s(
        'Lo que ADR sí mide',
        'What ADR measures',
        'ADR responde cuánto ingreso de alojamiento obtuvo, en promedio, cada habitación-noche vendida. No es BAR, la tarifa de la última reserva ni el precio completo de un paquete. El promedio cambia por descuentos, tipos de habitación, segmentos y duración de estancia. Comprueba impuestos, asignaciones y cargos antes de comparar fechas o canales.',
        'ADR measures average accommodation revenue per sold room night. It is not BAR, the latest booking rate or the full package price. Discounts, room types, segments and stay lengths affect the average. Check taxes, allocations and charges before comparing dates or channels.',
      ),
      s(
        'El promedio puede ocultar una mezcla distinta',
        'An average can conceal a different mix',
        'Un ADR mayor puede aparecer cuando desaparecen ventas baratas, aun si cae el ingreso total. Para entenderlo, descompón habitaciones vendidas e ingreso por segmento o tipo de habitación. En periodos con distintas cantidades vendidas, calcula ADR con los totales; un promedio simple de tarifas diarias o de reservas puede dar un resultado incorrecto.',
        'ADR can increase when lower-rated sales disappear even if total revenue falls. Break down rooms and revenue by segment or room type. For periods with different sales volumes, calculate ADR from totals; a simple average of daily or reservation rates may be wrong.',
      ),
    ],
    steps: [
      c(
        'Toma solo el ingreso asignado a alojamiento: $180,000. Excluye los componentes ajenos a habitaciones.',
        'Use only accommodation revenue: $180,000. Exclude non-room components.',
      ),
      c(
        'Divide entre 720 habitaciones-noche pagadas: 180,000 ÷ 720 = $250.',
        'Divide by 720 paid room nights: 180,000 ÷ 720 = $250.',
      ),
      c(
        'Comprueba: 720 × 250 = $180,000. La conciliación confirma el cálculo, no la calidad de la estrategia.',
        'Check: 720 × 250 = $180,000. Reconciliation confirms the calculation, not the strategy.',
      ),
    ],
    interpretation: c(
      'Un paquete anunciado a $400 puede tener ADR de $250 si esa es su asignación de alojamiento; no son métricas contradictorias.',
      'A $400 advertised package can yield $250 ADR if that is its accommodation allocation; the metrics do not contradict each other.',
    ),
    action: c(
      'Revisa la mezcla y las habitaciones vendidas cuando cambie ADR; evita recomendar precios a partir del promedio aislado.',
      'Review mix and sold rooms when ADR changes; avoid pricing recommendations based on the average alone.',
    ),
    reflection: c(
      '¿Qué datos necesitas para saber si un ADR mayor produjo más ingreso?',
      'What information establishes whether a higher ADR produced more revenue?',
    ),
    sources: ['hsmai'],
  },
  revpar: {
    objective: c(
      'Relacionar tarifa y ocupación, distinguir RevPAR de TRevPAR y reconocer sus límites para evaluar utilidad.',
      'Connect rate and occupancy, distinguish RevPAR from TRevPAR and recognize their profitability limits.',
    ),
    sections: [
      s(
        'Una medida de toda la capacidad',
        'A measure of all capacity',
        'RevPAR distribuye el ingreso de habitaciones entre las habitaciones-noche disponibles, incluidas las no vendidas. Permite evaluar la combinación de tarifa y volumen. Al usar ADR por ocupación, expresa la ocupación como decimal. Los periodos y la base de ingreso deben coincidir para que ambas formas de cálculo sean equivalentes.',
        'RevPAR spreads room revenue across all available room nights, including unsold nights. It evaluates the combination of rate and volume. When multiplying ADR by occupancy, use a decimal occupancy. Periods and revenue definitions must match for the two calculations to agree.',
      ),
      s(
        'Ingreso total no significa utilidad',
        'Total revenue does not mean profit',
        'TRevPAR añade otros ingresos operativos elegibles. En un resort todo incluido, las asignaciones del paquete deben sumar sin duplicar el mismo ingreso en alojamiento y alimentos. Ni RevPAR ni TRevPAR descuentan comisiones o costos de servicio. Dos estrategias con el mismo RevPAR pueden tener contribuciones diferentes.',
        'TRevPAR includes eligible non-room operating revenue. All-inclusive package allocations must avoid counting the same revenue in both rooms and food. Neither RevPAR nor TRevPAR deducts commissions or service costs. Strategies with identical RevPAR can have different contribution.',
      ),
    ],
    steps: [
      c(
        'Convierte 80% a 0.80 y calcula 250 × 0.80 = $200 de RevPAR.',
        'Convert 80% to 0.80 and calculate 250 × 0.80 = $200 RevPAR.',
      ),
      c(
        'Comprueba con ingreso de habitaciones: 720 × 250 ÷ 900 = $200.',
        'Check with room revenue: 720 × 250 ÷ 900 = $200.',
      ),
      c(
        'Para TRevPAR, divide el ingreso operativo total de $288,000 entre 900: $320.',
        'For TRevPAR, divide $288,000 total operating revenue by 900: $320.',
      ),
    ],
    interpretation: c(
      'La diferencia de $120 por habitación disponible corresponde a ingreso ajeno a alojamiento bajo esta convención, no a utilidad adicional.',
      'The $120 difference per available room is non-room revenue under this convention, not additional profit.',
    ),
    action: c(
      'Compara estrategias con RevPAR y después revisa adquisición, servicio y contribución total de la estancia.',
      'Compare strategies using RevPAR, then review acquisition, service costs and total-stay contribution.',
    ),
    reflection: c(
      '¿Por qué dos hoteles con igual RevPAR podrían tener resultados de utilidad distintos?',
      'Why could two hotels with equal RevPAR have different profit outcomes?',
    ),
    sources: ['hsmai'],
  },
  pickup: {
    objective: c(
      'Comparar cortes OTB de la misma fecha de estancia y explicar el cambio neto antes de modificar tarifas.',
      'Compare OTB snapshots for the same stay date and explain net changes before changing rates.',
    ),
    sections: [
      s(
        'Dos fechas distintas en cada análisis',
        'Two different dates in every analysis',
        'La fecha de estancia identifica cuándo se utiliza la habitación. La fecha del corte indica cuándo se observó la reserva. OTB es una fotografía de lo reservado a ese momento, no el resultado final. Guarda cortes comparables con el mismo periodo de estancia, estados de reserva y hora de actualización.',
        'The stay date identifies when the room is used. The snapshot date identifies when the booking position was observed. OTB is booked business at that moment, not the final result. Keep comparable snapshots with matching stay periods, booking statuses and refresh times.',
      ),
      s(
        'Un cambio neto tiene varios componentes',
        'Net change has several components',
        'El Pickup neto combina altas, cancelaciones y modificaciones. Una reserva extendida añade noches; una salida anticipada las elimina. En bloques de grupos, distingue inventario retenido de reservas contabilizadas en el corte. Si el cambio parece extraordinario, revisa el origen y los filtros antes de atribuirlo a demanda nueva.',
        'Net pickup combines new bookings, cancellations and modifications. An extended stay adds nights; an earlier departure removes them. For groups, distinguish held inventory from reservations included in the snapshot. Investigate unusual changes and filters before attributing them to new demand.',
      ),
    ],
    steps: [
      c(
        'Selecciona una sola fecha de estancia y sus dos cortes: 600 habitaciones OTB y después 650.',
        'Select one stay date and two snapshots: 600 OTB rooms, then 650.',
      ),
      c(
        'Resta posición anterior a posición actual: 650 − 600 = +50 habitaciones.',
        'Subtract previous from current position: 650 − 600 = +50 rooms.',
      ),
      c(
        'Si hubo 70 altas y 20 cancelaciones, el mismo cambio neto es 70 − 20 = +50.',
        'With 70 new bookings and 20 cancellations, the same net change is 70 − 20 = +50.',
      ),
    ],
    interpretation: c(
      'El corte creció 50 habitaciones; no puedes afirmar que solo entraron 50 reservas ni que todas permanecerán hasta la llegada.',
      'The position grew by 50 rooms; this does not prove only 50 reservations arrived or that every booking will stay.',
    ),
    action: c(
      'Separa altas y bajas por segmento para verificar si el crecimiento es sostenible antes de revisar BAR.',
      'Separate additions and losses by segment to assess sustainability before reviewing BAR.',
    ),
    reflection: c(
      '¿Cómo puede existir Pickup negativo aunque se hayan creado reservas nuevas?',
      'How can net pickup be negative despite new reservations?',
    ),
    sources: ['forecast'],
  },
  pace: {
    objective: c(
      'Construir una comparación de Pace justa y distinguir ventaja de volumen de ventaja de ingreso.',
      'Build a fair pace comparison and distinguish a volume advantage from a revenue advantage.',
    ),
    sections: [
      s(
        'Compara el mismo punto de la curva',
        'Compare the same point on the curve',
        'Un corte a 30 días de la llegada debe compararse con otro a 30 días, no con la ocupación final del año anterior. El objetivo es saber cómo se desarrolla la reserva respecto a una referencia útil. Verifica día de semana, eventos, vacaciones y disponibilidad: la misma fecha del calendario puede pertenecer a un patrón de demanda distinto.',
        'A snapshot 30 days before arrival should be compared with another at 30 days, not prior-year final occupancy. Assess booking development against a useful reference. Check weekdays, events, holidays and availability: matching calendar dates can have different demand patterns.',
      ),
      s(
        'Lee volumen e ingreso juntos',
        'Read volume and revenue together',
        'Una ventaja en habitaciones OTB puede coexistir con un ingreso menor si la tarifa lograda o la mezcla se debilitó. Compara habitaciones, ingreso y ADR con bases equivalentes. Un Pace desfavorable también puede reflejar un segmento que reserva más tarde; examina su ventana y Pickup antes de asumir que el resultado final será malo.',
        'A room lead can coexist with lower revenue if achieved rate or mix weakened. Compare rooms, revenue and ADR on equivalent bases. Behind-pace rooms can reflect a segment booking later; examine booking windows and pickup before assuming a poor final result.',
      ),
    ],
    steps: [
      c(
        'Alinea los cortes a 30 días de la llegada y confirma que los eventos sean comparables.',
        'Align snapshots at 30 days before arrival and check event comparability.',
      ),
      c(
        'Calcula diferencia: 600 − 550 = +50 habitaciones.',
        'Calculate the difference: 600 − 550 = +50 rooms.',
      ),
      c(
        'Calcula ventaja relativa: 50 ÷ 550 × 100 = 9.1%. Usa 550 como base.',
        'Calculate relative lead: 50 ÷ 550 × 100 = 9.1%. Use 550 as the base.',
      ),
    ],
    interpretation: c(
      'La ventaja es respecto al corte comparable, no respecto a las 850 habitaciones finales del año anterior. Todavía existe incertidumbre sobre el Pickup restante.',
      'The lead is against the comparable snapshot, not the prior-year final 850 rooms. Remaining pickup is still uncertain.',
    ),
    action: c(
      'Revisa ingreso OTB y mezcla para determinar si conviene proteger precio o investigar ventas de menor valor.',
      'Review OTB revenue and mix to decide whether to protect price or investigate lower-value sales.',
    ),
    reflection: c(
      '¿Qué ajustarías si el festival del año anterior cambió de semana?',
      'What would you adjust if last year’s festival moved to another week?',
    ),
    sources: ['forecast'],
  },
  'stay-patterns': {
    objective: c(
      'Interpretar anticipación, duración de estancia y pérdidas de reservas con fechas y cohortes consistentes.',
      'Interpret lead time, stay length and booking losses using consistent dates and cohorts.',
    ),
    sections: [
      s(
        'De la reserva a las noches de estancia',
        'From a reservation to stay nights',
        'Lead time mide días entre reserva y llegada; LOS mide noches entre llegada y salida. La fecha de salida no añade una noche ocupada. Una reserva puede incluir varias habitaciones, por lo que habitaciones-noche exige multiplicar LOS por habitaciones. Si cambian las fechas, recalcula la estancia; no uses ciegamente la duración original.',
        'Lead time measures days from booking to arrival; LOS measures nights from arrival to departure. Departure day adds no occupied night. A reservation may include multiple rooms, so room nights require LOS times rooms. Recalculate modified stays rather than blindly using the original duration.',
      ),
      s(
        'Las pérdidas necesitan una base definida',
        'Losses need a defined base',
        'Una cancelación ocurre antes de la llegada; un no-show es una llegada esperada que no se presenta. Compara tasas de cohortes y políticas equivalentes: tarifa flexible y prepago pueden tener comportamientos distintos. Un supuesto de pérdidas debe corresponder al inventario pendiente; no descuentes cancelaciones otra vez si el Pickup esperado ya es neto.',
        'Cancellation happens before arrival; a no-show is an expected arrival that does not occur. Compare cohorts with equivalent policies: flexible and prepaid rates may behave differently. Loss assumptions should match pending business; do not subtract cancellations again when expected pickup is already net.',
      ),
    ],
    steps: [
      c(
        'Del 1 al 21 de noviembre hay 20 días de anticipación.',
        'November 1 to November 21 gives 20 days of lead time.',
      ),
      c(
        'Una llegada el 21 y salida el 25 ocupa las noches 21, 22, 23 y 24: LOS de 4.',
        'Arrival on the 21st and departure on the 25th occupy nights 21–24: LOS 4.',
      ),
      c(
        'Con dos habitaciones: 2 × 4 = 8 habitaciones-noche. Tres no-shows entre 100 reservas de llegada son 3% de esa cohorte.',
        'With two rooms: 2 × 4 = 8 room nights. Three no-shows among 100 arrival reservations are 3% of that cohort.',
      ),
    ],
    interpretation: c(
      'Una ventana larga permite observar demanda temprano, pero las reservas flexibles pueden perderse antes de la estancia.',
      'A long booking window reveals demand early, but flexible bookings can be lost before the stay.',
    ),
    action: c(
      'Revisa patrones por segmento y política, y documenta qué pérdidas contempla tu pronóstico.',
      'Review patterns by segment and policy, and document which losses the forecast includes.',
    ),
    reflection: c(
      '¿Por qué no aplicarías la tasa de cancelación de una cohorte a todas las reservas del resort?',
      'Why would you avoid applying one cohort’s cancellation rate to all resort bookings?',
    ),
    sources: ['pricing', 'forecast'],
  },
  'forecast-rooms': {
    objective: c(
      'Construir un pronóstico de habitaciones con supuestos transparentes y escenarios de riesgo.',
      'Build a rooms forecast with transparent assumptions and risk scenarios.',
    ),
    sections: [
      s(
        'De OTB a una expectativa final',
        'From OTB to a final expectation',
        'OTB aporta la posición actual; el Pickup neto restante representa lo que esperas añadir después de pérdidas. Estima ese Pickup usando periodos con anticipación comparable, tendencia reciente, día de semana y eventos. Una fecha débil no necesita el mismo supuesto que una noche de festival. Registra el corte y la evidencia que respalda cada supuesto.',
        'OTB supplies the current position; remaining net pickup represents expected additions after losses. Use comparable lead times, recent trends, weekdays and events to estimate it. A weak date needs different assumptions from a festival night. Record the snapshot and evidence behind each assumption.',
      ),
      s(
        'Escenarios y actualización',
        'Scenarios and updates',
        'Un escenario base es una expectativa, no una certeza. Un escenario menor o mayor cambia supuestos identificables para mostrar riesgo. Actualiza el pronóstico cuando cambie la evidencia y compara después con el resultado real. La diferencia con presupuesto no justifica forzar el pronóstico para que alcance la meta.',
        'A base scenario is an expectation, not certainty. Lower and higher scenarios change explicit assumptions to show risk. Update the forecast when evidence changes and compare it with actual results later. A budget gap does not justify forcing the forecast to meet the target.',
      ),
    ],
    steps: [
      c(
        'Parte de 600 habitaciones OTB y un supuesto de +180 habitaciones netas restantes.',
        'Start with 600 OTB rooms and an assumption of +180 remaining net rooms.',
      ),
      c(
        'Suma 600 + 180 = 780; no supera la capacidad de 900. Ocupación: 780 ÷ 900 × 100 = 86.7%.',
        'Add 600 + 180 = 780, below 900-room capacity. Occupancy: 780 ÷ 900 × 100 = 86.7%.',
      ),
      c(
        'Prueba +120 netas: 720 habitaciones y 80%. La diferencia entre escenarios es 60 habitaciones.',
        'Test +120 net rooms: 720 rooms and 80%. The scenarios differ by 60 rooms.',
      ),
    ],
    interpretation: c(
      'El rango hace visible la sensibilidad al Pickup; no es un intervalo de confianza estadístico.',
      'The range shows sensitivity to pickup; it is not a statistical confidence interval.',
    ),
    action: c(
      'Documenta por qué usarías +180, qué señal haría bajar ese supuesto y cuándo volverás a revisar.',
      'Document why +180 is plausible, which signal would reduce it and when to review again.',
    ),
    reflection: c(
      '¿Qué evidencia necesitarías antes de repetir el Pickup de ayer en todos los días restantes?',
      'What evidence would you need before repeating yesterday’s pickup on every remaining day?',
    ),
    sources: ['forecast', 'hsmai'],
  },
  'forecast-value': {
    objective: c(
      'Pronosticar ingreso y ADR con ponderaciones correctas y separar pronóstico, presupuesto y resultado real.',
      'Forecast revenue and ADR with correct weights and distinguish forecast, budget and actual.',
    ),
    sections: [
      s(
        'Pronostica cada parte del ingreso',
        'Forecast each part of revenue',
        'Separa el ingreso OTB que esperas retener del ingreso de las nuevas habitaciones que esperas vender. Cada parte puede tener una tarifa distinta. Si ajustas el volumen por cancelaciones, ajusta también el ingreso relacionado. BAR no sustituye automáticamente el ADR esperado: la mezcla futura puede incluir contratos, descuentos y diferentes tipos de habitación.',
        'Separate retained OTB revenue from revenue on expected new room sales. Each part can have a different rate. If cancellations change volume, adjust related revenue too. BAR does not automatically equal expected ADR: future mix can include contracts, discounts and different room types.',
      ),
      s(
        'Tres cifras con funciones diferentes',
        'Three numbers with different purposes',
        'El presupuesto es el plan aprobado; el pronóstico es la expectativa actual; el real es el resultado registrado. Usa la misma base de impuestos y asignación para compararlos. Explica una variación con volumen y tarifa, en lugar de cambiar la definición para ocultarla. Comunica riesgos con tiempo suficiente para actuar.',
        'Budget is the approved plan; forecast is the current expectation; actual is the recorded result. Compare them with consistent tax and allocation bases. Explain variance through volume and rate rather than changing definitions to hide it. Communicate risk early enough to act.',
      ),
    ],
    steps: [
      c(
        'Ingreso retenido: 600 × $240 = $144,000. Ingreso nuevo esperado: 180 × $280 = $50,400.',
        'Retained revenue: 600 × $240 = $144,000. Expected new revenue: 180 × $280 = $50,400.',
      ),
      c(
        'Suma: $194,400 en 780 habitaciones. Divide 194,400 ÷ 780 = $249.23 de ADR pronosticado.',
        'Add: $194,400 across 780 rooms. Divide 194,400 ÷ 780 = $249.23 forecast ADR.',
      ),
      c(
        'El promedio simple de 240 y 280 sería 260, pero ponderaría ambas partes como si tuvieran igual volumen.',
        'The simple average of 240 and 280 is 260, but would incorrectly give both groups equal volume.',
      ),
    ],
    interpretation: c(
      'La tarifa de las ventas futuras mejora el promedio, pero no cambia la tarifa ya contratada del bloque retenido.',
      'The new-business rate improves the average without changing the contracted rate of retained business.',
    ),
    action: c(
      'Presenta supuestos de habitaciones y tarifa por separado y explica el impacto de cambios en la mezcla.',
      'Present rooms and rate assumptions separately and explain the impact of mix changes.',
    ),
    reflection: c(
      'Si cancelan reservas de tarifa alta, ¿por qué puede cambiar ADR además del volumen?',
      'If higher-rated bookings cancel, why can ADR change as well as volume?',
    ),
    sources: ['forecast'],
  },
  unconstrained: {
    objective: c(
      'Distinguir demanda estimada de ventas posibles y reconocer cuándo los controles limitan lo observado.',
      'Distinguish estimated demand from achievable sales and recognize when controls limit observations.',
    ),
    sections: [
      s(
        'Vendido no equivale a solicitado',
        'Sold is not the same as requested',
        'Las ventas observadas dependen de disponibilidad, precio y restricciones. Una fecha agotada deja de aceptar reservas, por lo que el total vendido no muestra toda la demanda potencial. La demanda sin restricciones se estima bajo condiciones declaradas; no es el conteo exacto de personas que necesariamente reservarían a cualquier precio.',
        'Observed sales depend on availability, price and restrictions. A sold-out date stops accepting bookings, so sold rooms do not reveal all potential demand. Unconstrained demand is estimated under stated conditions; it is not an exact count of customers who would book at any price.',
      ),
      s(
        'Convierte compresión en una decisión',
        'Turn compression into a decision',
        'Cuando la demanda supera capacidad, una venta de bajo valor puede desplazar otra mejor. Revisa toda la estancia: llenar el sábado con reservas de una noche podría limitar ventas que también aportan viernes y domingo. La estimación de demanda sirve para evaluar precio y controles; el sobrebooking requiere una política de riesgo independiente.',
        'When demand exceeds capacity, a low-value booking can displace a better one. Review the full stay: one-night Saturday bookings may restrict business that also fills Friday and Sunday. Demand estimates inform price and controls; overbooking needs a separate risk policy.',
      ),
    ],
    steps: [
      c(
        'Usa una demanda estimada de 1,050 habitaciones y una capacidad de 900.',
        'Use estimated demand of 1,050 rooms and capacity of 900.',
      ),
      c(
        'Calcula exceso: 1,050 − 900 = 150 habitaciones de demanda estimada.',
        'Calculate excess: 1,050 − 900 = 150 rooms of estimated demand.',
      ),
      c(
        'El pronóstico de habitaciones ocupadas queda limitado a 900 bajo este modelo; 1,050 no es una ocupación físicamente posible.',
        'The occupied-room forecast is capped at 900 in this model; 1,050 is not physically achievable occupancy.',
      ),
    ],
    interpretation: c(
      'La presión de demanda permite evaluar protección de inventario, pero la magnitud depende de supuestos y de la calidad del pronóstico.',
      'Demand pressure supports inventory protection, but its size depends on assumptions and forecast quality.',
    ),
    action: c(
      'Compara valor de estancias y disponibilidad por tipo antes de restringir ofertas. Monitorea las fechas adyacentes.',
      'Compare stay value and room-type availability before restricting offers. Monitor adjacent dates.',
    ),
    reflection: c(
      '¿Por qué un lleno total no revela si la demanda era de 901 o de 1,200 habitaciones?',
      'Why does a sellout not reveal whether demand was 901 or 1,200 rooms?',
    ),
    sources: ['forecast'],
  },
  pricing: {
    objective: c(
      'Elegir un control de precio o inventario a partir de demanda, contribución y valor de toda la estancia.',
      'Choose a pricing or inventory control based on demand, contribution and full-stay value.',
    ),
    sections: [
      s(
        'Precio y condiciones forman una oferta',
        'Price and conditions form an offer',
        'BAR es una referencia pública con condiciones definidas, no una promesa del ADR final. Un rate fence diferencia ofertas por anticipación, flexibilidad o elegibilidad. Compara tipos de habitación e inclusiones equivalentes. La sensibilidad al precio cambia con fecha, segmento y alternativas; no existe un descuento que funcione siempre.',
        'BAR is a public reference with defined conditions, not a promise of final ADR. A rate fence differentiates offers by lead time, flexibility or eligibility. Match room types and inclusions when comparing. Price sensitivity varies by date, segment and alternatives; no discount works universally.',
      ),
      s(
        'Controles que afectan la estancia',
        'Controls that affect the stay',
        'MinLOS exige una estancia mínima y Closed to Arrival restringe llegadas; sus implementaciones dependen del sistema. Evalúa qué noches y tipos de habitación ayudan a llenar, qué negocio podrían desplazar y si existen alternativas. En demanda baja, una restricción mal aplicada puede bloquear ventas valiosas. Verifica la configuración con reservaciones después de aprobar un cambio.',
        'MinLOS requires a minimum stay and Closed to Arrival restricts arrivals; implementations vary by system. Evaluate nights and room types filled, business displaced and alternatives. On weak dates, a poorly applied restriction can block valuable sales. Verify configuration with reservations after approval.',
      ),
    ],
    steps: [
      c(
        'Caso adicional sintético: propuesta de grupo de 100 habitaciones por dos noches a $220; costo incremental de $80 por habitación-noche.',
        'Additional synthetic case: a group requests 100 rooms for two nights at $220; incremental cost is $80 per room night.',
      ),
      c(
        'Contribución del grupo: 100 × 2 × (220 − 80) = $28,000. La primera noche tiene capacidad libre.',
        'Group contribution: 100 × 2 × (220 − 80) = $28,000. The first night has spare capacity.',
      ),
      c(
        'En la segunda noche desplazaría 100 ventas de $280 con costo de $80: $20,000. Diferencia estimada: 28,000 − 20,000 = +$8,000.',
        'On night two it would displace 100 sales at $280 with $80 costs: $20,000. Estimated difference: 28,000 − 20,000 = +$8,000.',
      ),
    ],
    interpretation: c(
      'El grupo podría aportar más en toda la estancia aunque su tarifa sea menor. La conclusión cambia si desplaza ventas adicionales, tiene otros costos o la demanda prevista no llega.',
      'The group may add more over the full stay despite a lower rate. The conclusion changes with additional displacement, costs or demand outcomes.',
    ),
    action: c(
      'Valida la probabilidad de desplazamiento y otros componentes de contribución antes de pedir aprobación.',
      'Validate displacement likelihood and other contribution components before seeking approval.',
    ),
    reflection: c(
      '¿Por qué una restricción útil para una fecha de compresión podría perjudicar una fecha débil?',
      'Why could a restriction useful on a compression date hurt a weak date?',
    ),
    sources: ['pricing'],
  },
  distribution: {
    objective: c(
      'Separar segmento de canal y comparar valor neto sin asumir que directo es gratis o que una OTA siempre perjudica.',
      'Separate segment from channel and compare net value without assuming direct is free or OTAs always hurt.',
    ),
    sections: [
      s(
        'Quién compra y por dónde compra',
        'Who buys and how they book',
        'Segmento describe el tipo de demanda; canal describe la vía de distribución. Un grupo puede reservar directo y un viajero corporativo puede llegar por GDS. Wholesale puede operar con tarifas netas contratadas; paquetes combinan componentes. Usa una clasificación consistente para no mezclar propósito del viaje con intermediario.',
        'Segment describes demand type; channel describes distribution route. Groups can book direct and corporate travelers can arrive through GDS. Wholesale may use contracted net rates; packages combine components. Keep classification consistent rather than mixing travel purpose with intermediary.',
      ),
      s(
        'Costo, incrementalidad y condiciones',
        'Cost, incrementality and conditions',
        'Compara ingreso neto de adquisición y después costo de servicio. Revisa comisión, marketing, pagos, cancelaciones y base contractual. Una OTA puede ser valiosa en una fecha débil si añade demanda rentable; en compresión puede desplazar mejor negocio. La paridad compara ofertas equivalentes y depende de contratos y normas locales, no de una regla universal.',
        'Compare revenue after acquisition costs and then service costs. Review commissions, marketing, payments, cancellations and contract bases. OTAs can add profitable weak-date demand but displace better business during compression. Parity requires like-for-like offers and depends on contracts and local rules.',
      ),
    ],
    steps: [
      c(
        'OTA: $300 × 18% = $54 de comisión; 300 − 54 = $246 netos de adquisición.',
        'OTA: $300 × 18% = $54 commission; 300 − 54 = $246 after acquisition.',
      ),
      c(
        'Directo: $285 − $15 de adquisición = $270. Diferencia: 270 − 246 = $24.',
        'Direct: $285 − $15 acquisition = $270. Difference: 270 − 246 = $24.',
      ),
      c(
        'Comprueba que habitación, estancia, asignación e inclusiones sean comparables; aún faltan costos de servicio.',
        'Check matching room, stay, allocation and inclusions; service costs remain to be considered.',
      ),
    ],
    interpretation: c(
      'Directo aporta mayor neto en este caso, pero no demuestra que cerrar la OTA cree esa misma venta directa.',
      'Direct yields higher net revenue here, but closing the OTA does not prove an equivalent direct booking will replace it.',
    ),
    action: c(
      'Revisa cancelaciones e incrementalidad por fecha antes de redistribuir inventario entre canales.',
      'Review cancellations and incrementality by date before redistributing inventory.',
    ),
    reflection: c(
      '¿Qué cambia en tu recomendación si la OTA trae una reserva que el hotel no obtendría de otra forma?',
      'How would your recommendation change if the OTA adds a booking the hotel would not otherwise receive?',
    ),
    sources: ['pricing'],
  },
  benchmarking: {
    objective: c(
      'Descomponer el desempeño relativo en ocupación, tarifa e ingreso, sin interpretar índices como utilidad.',
      'Decompose relative performance into occupancy, rate and revenue without interpreting indices as profit.',
    ),
    sections: [
      s(
        'Una comparación necesita un set relevante',
        'A comparison needs a relevant set',
        'Un set competitivo representa hoteles comparables por mercado, producto y demanda. Usa el agregado del set reportado; no reconstruyas un promedio simple de hoteles con capacidades distintas. Mantén periodo, moneda y base de ingreso consistentes. Cambiar integrantes o eventos de referencia puede alterar un índice sin que haya mejorado tu estrategia.',
        'A competitive set represents comparable market, product and demand. Use the reported set aggregate, not a simple hotel average when capacities differ. Match period, currency and revenue bases. Changes in membership or reference events can move an index without improving strategy.',
      ),
      s(
        'Lee los tres índices como una historia',
        'Read the three indices together',
        '100 significa igualdad de la métrica con el set. MPI aísla ocupación, ARI tarifa y RGI RevPAR. Un MPI alto con ARI bajo puede sugerir volumen conseguido con tarifas menores; no prueba por sí solo un problema. Revisa tendencia, mezcla y costos antes de actuar, y evita copiar el precio de un competidor sin entender su producto.',
        '100 means metric parity with the set. MPI isolates occupancy, ARI rate and RGI RevPAR. High MPI with low ARI may suggest volume earned at lower rates; it does not prove a problem. Review trends, mix and costs before acting, and avoid copying a competitor without understanding its product.',
      ),
    ],
    steps: [
      c(
        'MPI: 80 ÷ 75 × 100 = 106.7. ARI: 240 ÷ 250 × 100 = 96.',
        'MPI: 80 ÷ 75 × 100 = 106.7. ARI: 240 ÷ 250 × 100 = 96.',
      ),
      c(
        'RevPAR del hotel: 0.80 × 240 = $192. Del set: 0.75 × 250 = $187.50.',
        'Hotel RevPAR: 0.80 × 240 = $192. Set RevPAR: 0.75 × 250 = $187.50.',
      ),
      c(
        'RGI: 192 ÷ 187.50 × 100 = 102.4. Comprobación: 106.6667 × 96 ÷ 100 ≈ 102.4.',
        'RGI: 192 ÷ 187.50 × 100 = 102.4. Check: 106.6667 × 96 ÷ 100 ≈ 102.4.',
      ),
    ],
    interpretation: c(
      'El hotel supera el RevPAR del set por 2.4% en ese periodo; no implica 2.4% más utilidad ni crecimiento contra el año anterior.',
      'Hotel RevPAR exceeds the set by 2.4% for this period; that does not mean 2.4% more profit or prior-year growth.',
    ),
    action: c(
      'Investiga qué segmentos explican el déficit de tarifa y si el volumen adicional compensa sus costos.',
      'Investigate which segments explain the rate deficit and whether extra volume compensates for costs.',
    ),
    reflection: c(
      '¿Cómo podría mejorar RGI mientras cae tu propio RevPAR?',
      'How could RGI improve while your own RevPAR falls?',
    ),
    sources: ['indices', 'hsmai'],
  },
  excel: {
    objective: c(
      'Transformar reservas en un reporte conciliado y repetible, con tipos, claves y agregaciones correctas.',
      'Transform reservations into a reconciled, repeatable report using correct types, keys and aggregations.',
    ),
    sections: [
      s(
        'Define la unidad antes de agregar',
        'Define the row unit before aggregating',
        'Una fila puede representar reserva, habitación o noche: declara cuál. Convertir reservas de varias noches a producción diaria requiere distribuir sus noches por fecha de estancia. Conserva una copia del origen, valida fechas y estados y separa errores para revisión. Filtrar no elimina registros; ordenar debe mover filas completas para no separar valores de su reserva.',
        'A row may represent a reservation, room or night: declare which. Daily production from multi-night reservations requires allocating nights to stay dates. Keep the source, validate dates and statuses and isolate errors. Filtering does not delete records; sorting must move complete rows to preserve associations.',
      ),
      s(
        'Elige la operación por la pregunta',
        'Choose the operation from the question',
        'SUMIFS suma valores con criterios; COUNTIFS cuenta filas, no necesariamente noches. XLOOKUP necesita una clave y un mapa confiable. IF clasifica condiciones; IFERROR debe mostrar una excepción útil, no ocultar datos inválidos. Una tabla dinámica resume; Power Query registra transformaciones. El formato condicional resalta reglas sin modificar cifras.',
        'SUMIFS sums values with criteria; COUNTIFS counts rows, not necessarily nights. XLOOKUP needs a key and reliable mapping. IF classifies conditions; IFERROR should expose useful exceptions rather than hide invalid data. Pivots summarize; Power Query records transformations. Conditional formatting highlights rules without changing values.',
      ),
    ],
    steps: [
      c(
        'Caso sintético: dos filas directas confirmadas, una con 2 noches y $400, otra con 8 noches y $2,000.',
        'Synthetic case: two confirmed direct rows, one with 2 nights and $400, another with 8 nights and $2,000.',
      ),
      c(
        'Agrupa por canal y suma: 10 habitaciones-noche y $2,400. COUNTIFS devolvería 2 registros, no 10 noches.',
        'Group by channel and sum: 10 room nights and $2,400. COUNTIFS would return 2 records, not 10 nights.',
      ),
      c(
        'ADR agregado: 2,400 ÷ 10 = $240. Promediar los ADR de $200 y $250 daría $225 incorrectamente.',
        'Aggregate ADR: 2,400 ÷ 10 = $240. Averaging row ADRs of $200 and $250 would incorrectly give $225.',
      ),
    ],
    interpretation: c(
      'El reporte responde ingreso y noches por canal. Su validez depende de qué estados y periodos incluiste, no solo de que la fórmula funcione.',
      'The report answers revenue and nights by channel. Validity depends on included statuses and periods, not merely a working formula.',
    ),
    action: c(
      'Concilia totales con el origen y documenta filtros; repite el flujo con el CSV del laboratorio antes de automatizarlo.',
      'Reconcile source totals and document filters; repeat the workflow with the lab CSV before automating it.',
    ),
    reflection: c(
      '¿Qué perderías al convertir un error de denominador en cero sin investigarlo?',
      'What would you lose by converting a denominator error to zero without investigation?',
    ),
    sources: ['hsmai'],
  },
  workflow: {
    objective: c(
      'Priorizar excepciones y separar observación, interpretación y recomendación en una revisión matutina.',
      'Prioritize exceptions and separate observation, interpretation and recommendation in a morning review.',
    ),
    sections: [
      s(
        'Primero verifica que el reporte esté listo',
        'First verify the report is ready',
        'Confirma fecha de negocio, actualización del PMS y ajustes de auditoría. Concilia producción de ayer antes de interpretarla. Después revisa OTB, Pickup, Pace, tarifas y canales por fecha futura. Ordena excepciones por posible impacto y urgencia; no dediques el mismo tiempo a cada celda del reporte.',
        'Confirm business date, PMS refresh and audit adjustments. Reconcile yesterday’s production before interpretation. Then review future-date OTB, pickup, pace, rates and channels. Rank exceptions by potential impact and urgency rather than spending equal time on every cell.',
      ),
      s(
        'Una hipótesis no es un hecho',
        'A hypothesis is not a fact',
        'Una observación contiene un dato y periodo verificables. La interpretación propone una causa y reconoce alternativas. La recomendación define acción, responsable, plazo y señal de seguimiento. Reservaciones puede validar cambios de bloques; ventas aporta contexto de grupos; Revenue revisa pronóstico y controles. La colaboración evita decisiones comerciales basadas en errores operativos.',
        'An observation includes a verifiable number and period. Interpretation proposes a cause and acknowledges alternatives. A recommendation names action, owner, deadline and monitoring signal. Reservations validates block changes, sales supplies group context and revenue reviews forecasts and controls. Collaboration prevents decisions based on operational errors.',
      ),
    ],
    steps: [
      c(
        'Observa: el 18 de noviembre tiene 410 OTB y cayó 40 habitaciones en siete días.',
        'Observe: November 18 has 410 OTB and lost 40 rooms in seven days.',
      ),
      c(
        'Interpreta como hipótesis: pudo reducirse un bloque; también pudo cambiar el corte o aumentar cancelaciones individuales.',
        'Interpret as a hypothesis: a block may have washed; snapshot differences or individual cancellations are alternatives.',
      ),
      c(
        'Recomienda validar el bloque hoy con reservaciones y después actualizar el supuesto de Pickup.',
        'Recommend validating the block with reservations today, then updating the pickup assumption.',
      ),
    ],
    interpretation: c(
      'El dato confirma una caída de reservas; todavía no identifica su causa ni prueba que un descuento sea la solución.',
      'The data confirms booking loss; it does not yet identify the cause or prove a discount is the solution.',
    ),
    action: c(
      'Asigna responsable y hora de seguimiento. Si se confirma pérdida real, compara opciones para estimular demanda rentable.',
      'Assign an owner and review time. If real loss is confirmed, compare options to stimulate profitable demand.',
    ),
    reflection: c(
      '¿Qué parte de tu reporte debe llevar palabras como “posible” o “por validar”?',
      'Which part of your report should use words such as “possible” or “to validate”?',
    ),
    sources: ['hsmai', 'forecast'],
  },
  meeting: {
    objective: c(
      'Preparar una reunión con decisiones por fecha, riesgos cuantificados y responsables claros.',
      'Prepare a meeting around date-specific decisions, quantified risks and clear owners.',
    ),
    sections: [
      s(
        'Un paquete de reunión debe conducir a decisiones',
        'A meeting pack should lead to decisions',
        'Resume cambios relevantes desde el último corte: fechas débiles, compresión, pronóstico, tarifas y distribución. Para cada excepción presenta evidencia, supuesto y decisión requerida. Un dato sin periodo o comparación no ayuda a priorizar. Muestra qué parte del riesgo está validada y qué información falta; no conviertas la reunión en lectura de todas las filas.',
        'Summarize material changes since the last snapshot: need dates, compression, forecasts, rates and distribution. For each exception present evidence, assumption and decision required. Numbers without periods or references do not help prioritization. Distinguish validated risk from missing information rather than reading every row.',
      ),
      s(
        'Cierra con un acuerdo verificable',
        'Close with a verifiable agreement',
        'Una recomendación útil indica fecha afectada, control propuesto, responsable y momento de revisión. Un aumento de precio en compresión y una oferta dirigida para una fecha débil pueden coexistir. Antes de aceptar un grupo, considera contribución de toda la estancia y negocio desplazado. Registra el acuerdo para comparar después el resultado con la expectativa.',
        'A useful recommendation identifies affected dates, proposed controls, owner and review time. Higher compression-date prices can coexist with targeted weak-date offers. Before accepting a group, consider full-stay contribution and displaced business. Record agreements to compare outcomes with expectations later.',
      ),
    ],
    steps: [
      c(
        '15 de noviembre: 850 OTB y capacidad de 900 dejan 50 habitaciones; +90 netas previstas implican 940 de demanda en el modelo.',
        'November 15: 850 OTB and 900 capacity leave 50 rooms; expected +90 net rooms imply model demand of 940.',
      ),
      c(
        'El exceso estimado es 40, mientras el 18 de noviembre tiene 410 OTB y pérdidas de reservas. Son problemas distintos.',
        'Estimated excess is 40, while November 18 has 410 OTB and booking losses. These are different problems.',
      ),
      c(
        'Lleva dos decisiones: proteger inventario del 15 y validar pérdidas del 18 antes de estimular demanda.',
        'Bring two decisions: protect November 15 inventory and validate November 18 losses before stimulating demand.',
      ),
    ],
    interpretation: c(
      'Una sola política para ambas fechas ignoraría sus diferencias de demanda y podría diluir ingreso donde el inventario es escaso.',
      'A single policy would ignore demand differences and dilute revenue where inventory is scarce.',
    ),
    action: c(
      'Acuerda quién revisará tarifas y bloques, qué fechas cambiarán y cuándo se evaluará Pickup y contribución.',
      'Agree who will review rates and blocks, which dates will change and when pickup and contribution will be evaluated.',
    ),
    reflection: c(
      '¿Qué dato y qué supuesto defenderías primero si cuestionan tu pronóstico en la reunión?',
      'Which fact and assumption would you defend first if your forecast is challenged in the meeting?',
    ),
    sources: ['hsmai', 'forecast'],
  },
};
