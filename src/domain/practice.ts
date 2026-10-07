import type { Question } from './content';

export const competencies = {
  'available-room-nights': ['Available room nights', 'Habitaciones-noche disponibles'],
  occupancy: ['Occupancy', 'Ocupación'],
  adr: ['ADR', 'ADR'],
  revpar: ['RevPAR', 'RevPAR'],
  pickup: ['Pickup', 'Pickup'],
  pace: ['Pace difference', 'Diferencia de Pace'],
  'lead-time': ['Lead time', 'Booking Window / anticipación'],
  los: ['LOS', 'LOS'],
  'forecast-rooms': ['Forecast rooms', 'Forecast de habitaciones'],
  'forecast-revenue': ['Forecast room revenue', 'Forecast de ingreso de habitaciones'],
  'unconstrained-demand': ['Unconstrained demand', 'Demanda no restringida'],
  'channel-net-revenue': ['Channel net revenue', 'Ingreso neto por canal'],
  'percent-change': ['Percent change', 'Variación porcentual'],
  mpi: ['MPI', 'MPI'],
  ari: ['ARI', 'ARI'],
  rgi: ['RGI', 'RGI'],
  'contribution-decision': ['Contribution comparison', 'Comparación de contribución'],
  reconciliation: ['Report reconciliation', 'Conciliación de reportes'],
  'recommendation-evidence': ['Evidence and hypotheses', 'Evidencia e hipótesis'],
} as const;
export type Competency = keyof typeof competencies;
export const topicCompetencies: Record<string, readonly Competency[]> = {
  inventory: ['available-room-nights'],
  commercial: ['channel-net-revenue'],
  occupancy: ['occupancy'],
  adr: ['adr'],
  revpar: ['revpar'],
  pickup: ['pickup'],
  pace: ['pace'],
  'stay-patterns': ['lead-time', 'los'],
  'forecast-rooms': ['forecast-rooms'],
  'forecast-value': ['forecast-revenue'],
  unconstrained: ['unconstrained-demand'],
  pricing: ['contribution-decision'],
  distribution: ['channel-net-revenue'],
  benchmarking: ['mpi', 'ari', 'rgi'],
  excel: ['percent-change'],
  workflow: ['reconciliation'],
  meeting: ['recommendation-evidence'],
};
export function competencyTopic(concept: Competency): string {
  return (
    Object.keys(topicCompetencies).find((topic) => topicCompetencies[topic].includes(concept)) ??
    'inventory'
  );
}
export function isCompetency(value: string): value is Competency {
  return value in competencies;
}
export function competencyName(concept: string, language: 'es' | 'en') {
  return isCompetency(concept) ? competencies[concept][language === 'es' ? 1 : 0] : concept;
}
export function seedNumber(seed: number): number {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff)
    throw new Error('Seed must be a uint32 integer');
  return seed >>> 0;
}
const round = (v: number) => Math.round(v * 100) / 100;

/** Versioned deterministic teaching instances; no global RNG or current dates. */
export function generatePractice(
  concept: Competency,
  seed: number,
  topic = competencyTopic(concept),
): Question {
  let state = seedNumber(seed) ^ 0xa5a5a5a5;
  const integer = (min: number, max: number) => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return min + (state % (max - min + 1));
  };
  const capacity = integer(850, 950),
    nights = integer(1, 7);
  const available = capacity * nights,
    sold = integer(Math.ceil(available * 0.35), Math.floor(available * 0.95));
  const rate = integer(130, 340),
    revenue = sold * rate;
  const p: Record<string, number | string> = {};
  let prompt = '',
    spanish = '',
    explanation = '',
    esExplanation = '',
    answer: number | string = 0;
  let unit = '',
    options: string[] | undefined,
    esOptions: string[] | undefined;
  const set = (
    en: string,
    es: string,
    result: number | string,
    method: string,
    methodEs: string,
  ) => {
    prompt = en;
    spanish = es;
    answer = typeof result === 'number' ? round(result) : result;
    explanation = method;
    esExplanation = methodEs;
  };
  switch (concept) {
    case 'available-room-nights': {
      const closed = integer(1, 30);
      Object.assign(p, { capacity, nights, closed });
      set(
        `Synthetic resort: ${capacity} rooms, ${closed} unavailable for maintenance each night over ${nights} nights. How many available room nights?`,
        `Resort sintético: ${capacity} habitaciones, ${closed} fuera de servicio cada noche durante ${nights} noches. ¿Cuántas habitaciones-noche están disponibles?`,
        (capacity - closed) * nights,
        `Subtract unavailable rooms first, then multiply by stay nights: (${capacity} − ${closed}) × ${nights}. Count room nights, not reservations.`,
        `Primero resta las habitaciones fuera de servicio y multiplica por noches de estancia: (${capacity} − ${closed}) × ${nights}. Cuenta habitaciones-noche, no reservas.`,
      );
      break;
    }
    case 'occupancy':
      Object.assign(p, { available, sold });
      unit = '%';
      set(
        `Synthetic resort, same reporting period: ${sold} paid room nights sold out of ${available} available. Calculate occupancy (%).`,
        `Resort sintético, mismo periodo: ${sold} habitaciones-noche pagadas vendidas de ${available} disponibles. Calcula la ocupación (%).`,
        (sold / available) * 100,
        `Match sold and available room nights for the same period. Divide ${sold} by ${available}, then multiply by 100. Occupancy measures capacity use, not profit.`,
        `Compara habitaciones-noche vendidas y disponibles del mismo periodo. Divide ${sold} entre ${available} y multiplica por 100. La ocupación mide uso de capacidad, no utilidad.`,
      );
      break;
    case 'adr':
      Object.assign(p, { sold, revenue });
      unit = 'USD';
      set(
        `Synthetic resort: accommodation-only room revenue $${revenue}, ${sold} paid room nights sold. Calculate ADR. Taxes and non-room revenue are excluded.`,
        `Resort sintético: ingreso de alojamiento $${revenue} y ${sold} habitaciones-noche pagadas vendidas. Calcula ADR. Se excluyen impuestos e ingresos ajenos a habitaciones.`,
        revenue / sold,
        `Divide room revenue ${revenue} by sold room nights ${sold}, not available inventory. ADR describes achieved room rate, not total revenue or profitability.`,
        `Divide ingreso de habitaciones ${revenue} entre habitaciones-noche vendidas ${sold}, no inventario disponible. ADR mide tarifa lograda, no ingreso total ni rentabilidad.`,
      );
      break;
    case 'revpar':
      Object.assign(p, { available, sold, revenue });
      unit = 'USD';
      set(
        `Synthetic resort: ${available} available room nights, ${sold} sold, $${revenue} room revenue excluding tax. Calculate RevPAR.`,
        `Resort sintético: ${available} habitaciones-noche disponibles, ${sold} vendidas e ingreso de habitaciones $${revenue} sin impuestos. Calcula RevPAR.`,
        revenue / available,
        `Divide room revenue ${revenue} by available room nights ${available}. The denominator includes unsold capacity. RevPAR combines rate and volume but excludes costs.`,
        `Divide ingreso de habitaciones ${revenue} entre habitaciones-noche disponibles ${available}. El denominador incluye capacidad no vendida. RevPAR combina tarifa y volumen, pero excluye costos.`,
      );
      break;
    case 'pickup':
    case 'pace': {
      const previous = integer(100, Math.floor(capacity * 0.85)),
        current = integer(100, Math.floor(capacity * 0.95));
      Object.assign(p, { capacity, previous, current });
      unit = '';
      if (concept === 'pickup')
        set(
          `Synthetic resort, stay date 2026-11-20 (${capacity} rooms). OTB on Nov 1: ${previous} rooms; OTB on Nov 8: ${current}. Net Pickup in rooms?`,
          `Resort sintético, estancia 2026-11-20 (${capacity} habitaciones). OTB al 1 de noviembre: ${previous}; OTB al 8 de noviembre: ${current}. ¿Pickup neto en habitaciones?`,
          current - previous,
          `Keep the stay date fixed; subtract earlier snapshot ${previous} from later snapshot ${current}. A negative result is possible when cancellations exceed new bookings.`,
          `Mantén fija la fecha de estancia; resta el corte anterior ${previous} del posterior ${current}. El resultado puede ser negativo si las cancelaciones superan las reservas nuevas.`,
        );
      else
        set(
          `Synthetic resort (${capacity} rooms), comparable weekdays and no event shift: current OTB ${current}, prior-year OTB ${previous}, both 21 days before the stay date. Pace difference in rooms?`,
          `Resort sintético (${capacity} habitaciones), días de semana comparables y sin cambio de evento: OTB actual ${current}, OTB del año anterior ${previous}, ambos a 21 días de la estancia. ¿Diferencia de Pace en habitaciones?`,
          current - previous,
          `Compare equivalent booking windows: ${current} − ${previous}. The difference is a signal to investigate, not a forecast of final occupancy or automatic reason to discount.`,
          `Compara la misma anticipación: ${current} − ${previous}. La diferencia es una señal para investigar, no un Forecast de ocupación final ni una razón automática para descontar.`,
        );
      break;
    }
    case 'lead-time':
    case 'los': {
      const lead = integer(1, 85),
        stay = integer(1, 12),
        arrivalOffset = integer(90, 180);
      const date = (offset: number) =>
        new Date(Date.UTC(2027, 0, 1) + offset * 86400000).toISOString().slice(0, 10);
      const booking = date(arrivalOffset - lead),
        arrival = date(arrivalOffset),
        departure = date(arrivalOffset + stay);
      Object.assign(p, { booking, arrival, departure });
      set(
        `Synthetic reservation booked ${booking}, arrival ${arrival}, departure ${departure}. Calculate ${concept === 'los' ? 'LOS in nights (exclude departure day)' : 'lead time in elapsed days'}.`,
        `Reserva sintética creada ${booking}, llegada ${arrival}, salida ${departure}. Calcula ${concept === 'los' ? 'LOS en noches (excluye el día de salida)' : 'anticipación en días transcurridos'}.`,
        concept === 'los' ? stay : lead,
        concept === 'los'
          ? `Subtract arrival from departure, not booking date. The checkout day does not consume a stay night.`
          : `Subtract booking date from arrival date, not departure. Use calendar days; a longer booking window does not necessarily mean a longer stay.`,
        concept === 'los'
          ? `Resta llegada de salida, no fecha de reserva. El día de salida no consume una noche de estancia.`
          : `Resta fecha de reserva de llegada, no de salida. Usa días de calendario; más anticipación no implica una estancia más larga.`,
      );
      break;
    }
    case 'forecast-rooms': {
      const otb = integer(300, 750),
        gross = integer(100, 350),
        wash = integer(10, 80);
      Object.assign(p, { capacity, otb, gross, wash });
      set(
        `Synthetic resort, one stay night: capacity ${capacity}, OTB ${otb}, expected new pickup ${gross}, expected losses ${wash} from existing OTB. Forecast sold rooms, capped at capacity.`,
        `Resort sintético, una noche: capacidad ${capacity}, OTB ${otb}, Pickup nuevo esperado ${gross}, pérdidas esperadas ${wash} del OTB actual. Calcula habitaciones vendidas del Forecast, limitadas a capacidad.`,
        Math.min(capacity, otb + gross - wash),
        `Expected net change = new pickup ${gross} − OTB losses ${wash}; add to ${otb}, then cap at ${capacity}. This transparent assumption model is not an RMS; do not subtract wash again.`,
        `Cambio neto esperado = Pickup nuevo ${gross} − pérdidas del OTB ${wash}; suma a ${otb} y limita a ${capacity}. Este modelo de supuestos no es un RMS; no restes wash otra vez.`,
      );
      break;
    }
    case 'forecast-revenue': {
      const otb = integer(200, 500),
        wash = integer(5, 40),
        pickup = integer(30, 100),
        otbADR = integer(140, 300),
        newADR = integer(160, 320);
      Object.assign(p, { otb, wash, pickup, otbADR, newADR });
      unit = 'USD';
      set(
        `Synthetic resort: OTB ${otb} rooms at ADR $${otbADR}; ${wash} OTB rooms expected to cancel at that ADR. New pickup: ${pickup} rooms at $${newADR}. Capacity is ${capacity}, not binding. Forecast accommodation revenue?`,
        `Resort sintético: OTB ${otb} habitaciones a ADR $${otbADR}; se espera cancelar ${wash} a ese ADR. Pickup nuevo: ${pickup} habitaciones a $${newADR}. Capacidad ${capacity}, sin límite activo. ¿Ingreso de alojamiento del Forecast?`,
        (otb - wash) * otbADR + pickup * newADR,
        `Retained OTB revenue = (${otb} − ${wash}) × ${otbADR}; add ${pickup} × ${newADR}. Do not apply the new rate to all retained bookings. Wash is deducted once.`,
        `Ingreso OTB retenido = (${otb} − ${wash}) × ${otbADR}; suma ${pickup} × ${newADR}. No apliques la tarifa nueva a todas las reservas retenidas. Resta wash una sola vez.`,
      );
      break;
    }
    case 'unconstrained-demand': {
      const observed = capacity,
        denied = integer(40, 160),
        duplicate = integer(5, 30);
      Object.assign(p, { capacity, observed, denied, duplicate });
      set(
        `Synthetic teaching model: ${observed} rooms sold at capacity, ${denied} logged qualified denied room requests, of which ${duplicate} are duplicates. Assume all remaining requests are incremental and willing to pay the stated rate. Estimate unconstrained demand.`,
        `Modelo didáctico sintético: ${observed} habitaciones vendidas al límite, ${denied} solicitudes calificadas rechazadas, de las cuales ${duplicate} están duplicadas. Supón que el resto es incremental y acepta la tarifa indicada. Estima demanda no restringida.`,
        observed + denied - duplicate,
        `Under the stated assumptions only, add unique denied demand (${denied} − ${duplicate}) to observed sales ${observed}. Demand can exceed capacity; sold occupancy cannot. Denial logs alone are not a reliable production demand model.`,
        `Solo bajo estos supuestos, suma demanda rechazada única (${denied} − ${duplicate}) a ventas observadas ${observed}. La demanda puede superar capacidad; la ocupación vendida no. Los rechazos por sí solos no son un modelo fiable de demanda para producción.`,
      );
      break;
    }
    case 'channel-net-revenue': {
      const rooms = integer(20, 150),
        adr = integer(140, 320),
        commission = integer(10, 22),
        acquisition = integer(50, 450);
      Object.assign(p, { rooms, adr, commission, acquisition });
      unit = 'USD';
      set(
        `Synthetic channel: ${rooms} paid room nights at ADR $${adr}, commission ${commission}% of room revenue plus a separate campaign cost $${acquisition}. Calculate revenue after these acquisition costs; exclude operating costs.`,
        `Canal sintético: ${rooms} habitaciones-noche pagadas a ADR $${adr}, comisión ${commission}% del ingreso y costo separado de campaña $${acquisition}. Calcula ingreso después de estos costos de adquisición; excluye costos operativos.`,
        rooms * adr * (1 - commission / 100) - acquisition,
        `First calculate room revenue ${rooms} × ${adr}, retain ${100 - commission}%, then subtract campaign cost ${acquisition}. This is not profit: service costs and other costs remain.`,
        `Calcula ingreso ${rooms} × ${adr}, conserva ${100 - commission}% y resta campaña ${acquisition}. No es utilidad: faltan costos de servicio y otros costos.`,
      );
      break;
    }
    case 'percent-change': {
      const previous = integer(80000, 150000),
        current = integer(60000, 190000);
      Object.assign(p, { previous, current });
      unit = '%';
      set(
        `Synthetic report, same period and revenue definition: previous $${previous}, current $${current}. Percent change?`,
        `Reporte sintético, mismo periodo y definición de ingreso: anterior $${previous}, actual $${current}. ¿Variación porcentual?`,
        ((current - previous) / previous) * 100,
        `Subtract previous from current, divide by the nonzero previous baseline ${previous}, then multiply by 100. Do not divide by current or confuse percent with percentage points.`,
        `Resta anterior de actual, divide entre la base anterior no nula ${previous} y multiplica por 100. No dividas entre actual ni confundas porcentaje con puntos porcentuales.`,
      );
      break;
    }
    case 'mpi':
    case 'ari':
    case 'rgi': {
      const hotelOccupancy = integer(40, 95),
        setOccupancy = integer(45, 90),
        hotelADR = integer(140, 300),
        setADR = integer(150, 310);
      const hotel =
        concept === 'mpi'
          ? hotelOccupancy
          : concept === 'ari'
            ? hotelADR
            : (hotelADR * hotelOccupancy) / 100;
      const comparison =
        concept === 'mpi'
          ? setOccupancy
          : concept === 'ari'
            ? setADR
            : (setADR * setOccupancy) / 100;
      Object.assign(p, { hotelOccupancy, setOccupancy, hotelADR, setADR, hotel, comparison });
      const metric =
        concept === 'mpi' ? 'occupancy (%)' : concept === 'ari' ? 'ADR (USD)' : 'RevPAR (USD)';
      set(
        `Synthetic comparable set, same date and definitions: hotel ${metric} ${round(hotel)}, set ${round(comparison)}. Calculate ${concept.toUpperCase()} (100 = parity).`,
        `Set competitivo sintético, misma fecha y definiciones: hotel ${concept === 'mpi' ? 'ocupación (%)' : concept === 'ari' ? 'ADR (USD)' : 'RevPAR (USD)'} ${round(hotel)}, set ${round(comparison)}. Calcula ${concept.toUpperCase()} (100 = paridad).`,
        (hotel / comparison) * 100,
        `Divide hotel ${round(hotel)} by the set metric ${round(comparison)}, then multiply by 100. An index above 100 indicates relative performance on this metric, not profit or occupancy above 100%.`,
        `Divide hotel ${round(hotel)} entre la métrica del set ${round(comparison)} y multiplica por 100. Un índice mayor que 100 muestra desempeño relativo en esa métrica, no utilidad ni ocupación superior a 100%.`,
      );
      break;
    }
    case 'contribution-decision': {
      const rooms = integer(10, 60),
        otaADR = integer(220, 320),
        commission = integer(15, 22),
        directCost = integer(8, 35),
        service = integer(35, 65);
      let directADR = integer(210, 310);
      if (Math.abs(otaADR * (1 - commission / 100) - (directADR - directCost)) < 0.001) directADR++;
      Object.assign(p, { rooms, otaADR, directADR, commission, directCost, service });
      const ota = rooms * (otaADR * (1 - commission / 100) - service),
        direct = rooms * (directADR - directCost - service);
      options = ['OTA', 'Direct'];
      esOptions = ['OTA', 'Directo'];
      set(
        `Synthetic need date: ${rooms} incremental room nights offered by either OTA at $${otaADR} with ${commission}% commission, or direct at $${directADR} with $${directCost} acquisition cost per room night. Both have $${service} service cost, identical cancellation risk, no displacement and sufficient room-type capacity. Which produces more contribution?`,
        `Fecha sintética con necesidad: ${rooms} habitaciones-noche incrementales vía OTA a $${otaADR} con ${commission}% de comisión, o directo a $${directADR} con adquisición $${directCost} por noche. Ambos tienen servicio $${service}, mismo riesgo de cancelación, sin desplazamiento y suficiente capacidad por tipo. ¿Cuál produce más contribución?`,
        ota >= direct ? 'OTA' : 'Direct',
        `Compare net rate minus service cost, multiplied by room nights: OTA = ${round(ota)}, direct = ${round(direct)}. The preferred channel depends on costs and incremental demand, not its label. In a tie both are equally defensible; this item uses OTA as the tie convention.`,
        `Compara tarifa neta menos servicio y multiplica por habitaciones-noche: OTA = ${round(ota)}, directo = ${round(direct)}. El canal depende de costos y demanda incremental, no de su nombre. En empate ambos son defendibles; este ejercicio usa OTA como convención de empate.`,
      );
      break;
    }
    case 'reconciliation': {
      const accommodation = integer(70000, 150000),
        tax = integer(7000, 15000),
        packageValue = integer(10000, 30000);
      Object.assign(p, { accommodation, tax, packageValue });
      unit = 'USD';
      set(
        `Synthetic PMS gross receipts $${accommodation + tax + packageValue} include $${tax} tax and $${packageValue} non-room package allocation. Revenue report excludes both and covers the same closed business date/statuses. What accommodation revenue should reconcile?`,
        `PMS sintético: cobro bruto $${accommodation + tax + packageValue} incluye impuestos $${tax} y asignación de paquete no habitacional $${packageValue}. El reporte de Revenue excluye ambos y usa la misma fecha cerrada y estados. ¿Qué ingreso de alojamiento debe conciliar?`,
        accommodation,
        `Align business date/statuses, then subtract tax ${tax} and non-room allocation ${packageValue} from gross receipts. Document differences before changing a price or declaring missing revenue.`,
        `Alinea fecha de negocio y estados; después resta impuestos ${tax} y asignación no habitacional ${packageValue} del cobro bruto. Documenta diferencias antes de cambiar precio o declarar ingreso faltante.`,
      );
      break;
    }
    case 'recommendation-evidence': {
      const previous = integer(400, 600),
        current = integer(200, 390),
        days = integer(10, 30),
        type = integer(0, 1);
      Object.assign(p, { previous, current, days, type });
      options = ['Observation', 'Hypothesis'];
      esOptions = ['Observación', 'Hipótesis'];
      set(
        `Synthetic resort, equivalent ${days}-day lead time: OTB ${current} versus ${previous} last year. Classify: ${type === 0 ? `"OTB is ${previous - current} rooms lower."` : '"A competing promotion may explain the gap."'}`,
        `Resort sintético, misma anticipación de ${days} días: OTB ${current} frente a ${previous} el año pasado. Clasifica: ${type === 0 ? `"OTB es ${previous - current} habitaciones menor."` : '"Una promoción competidora podría explicar la brecha."'}`,
        type === 0 ? 'Observation' : 'Hypothesis',
        `A subtraction is an observation; a possible cause is a hypothesis requiring evidence. A recommendation additionally needs an action, owner and monitoring plan. These numbers alone cannot establish the cause.`,
        `Una resta es observación; una posible causa es hipótesis que requiere evidencia. Una recomendación también necesita acción, responsable y seguimiento. Estos números por sí solos no prueban la causa.`,
      );
      break;
    }
  }
  const signature = JSON.stringify([concept, p]);
  return {
    id: `practice-v1-${concept}-${seed}`,
    topic,
    concept,
    evidence: 'generated',
    prompt,
    answer,
    explanation,
    options,
    unit,
    tolerance: 0.02,
    instance: { generatorVersion: 1, concept, seed, signature, parameters: p },
    copy: { es: { prompt: spanish, explanation: esExplanation, options: esOptions } },
  };
}
