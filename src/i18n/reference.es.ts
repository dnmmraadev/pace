export const glossaryCopy: [string, string][] = [
  [
    'Habitación-noche',
    'Una habitación ocupada o disponible durante una noche; no representa un número de huéspedes.',
  ],
  ['Capacidad', 'Oferta física de habitaciones-noche para un periodo de reporte.'],
  ['Demanda', 'Disposición y capacidad para reservar bajo precios y condiciones específicos.'],
  [
    'Habitaciones disponibles',
    'Oferta de habitaciones-noche según el estándar de reporte indicado.',
  ],
  [
    'Habitaciones vendidas',
    'Habitaciones-noche pagadas y vendidas según la convención de reporte indicada.',
  ],
  [
    'Ingreso de habitaciones',
    'Ingreso asignado al alojamiento, sin componentes ajenos a habitaciones ni impuestos en estos datos.',
  ],
  ['Ingresos', 'Ingreso por ventas antes de gastos.'],
  [
    'Contribución',
    'Ingresos menos los costos variables y de adquisición especificados; no es utilidad final.',
  ],
  [
    'Ocupación',
    'Habitaciones vendidas entre habitaciones-noche disponibles, expresado como porcentaje.',
  ],
  ['ADR', 'Tarifa diaria promedio: ingreso de habitaciones entre habitaciones vendidas.'],
  ['RevPAR', 'Ingreso de habitaciones por habitación-noche disponible.'],
  ['TRevPAR', 'Ingreso operativo total por habitación-noche disponible.'],
  ['OTB', 'On the Books: posición reservada de un periodo de estancia en un momento de corte.'],
  [
    'Pickup',
    'Cambio entre dos posiciones reservadas del mismo periodo de estancia. Indica si es bruto o neto.',
  ],
  [
    'Pace',
    'Evolución de la posición reservada hacia la llegada, habitualmente comparada con la misma anticipación.',
  ],
  ['Fecha de reservación', 'Fecha en que se creó la reservación.'],
  ['Fecha de estancia', 'Fecha en que se consume una habitación-noche.'],
  ['Anticipación (lead time)', 'Días entre la creación de la reservación y la llegada.'],
  [
    'Ventana de reservación',
    'Distribución de la anticipación con que se reserva; el uso del término puede variar.',
  ],
  ['LOS', 'Duración de estancia: fecha de salida menos fecha de llegada.'],
  ['Cancelación', 'Reservación retirada antes de la llegada programada.'],
  ['No-show', 'Llegada esperada de un huésped que no se presenta.'],
  [
    'Wash (reducción de OTB)',
    'Disminución de la posición reservada por cancelaciones, reducciones u otras pérdidas.',
  ],
  [
    'Pronóstico',
    'Estimación más reciente de un resultado, basada en evidencia y con incertidumbre.',
  ],
  ['Presupuesto', 'Plan o meta financiera aprobada.'],
  ['Resultado real', 'Desempeño registrado de un periodo transcurrido.'],
  ['Estacionalidad', 'Patrones recurrentes de demanda asociados con la época del año.'],
  [
    'Demanda no restringida',
    'Demanda estimada sin restricciones de capacidad o disponibilidad, bajo supuestos explícitos.',
  ],
  [
    'BAR',
    'Best Available Rate: tarifa pública de referencia con condiciones definidas; la implementación varía.',
  ],
  [
    'Condición tarifaria (rate fence)',
    'Requisitos o condiciones de reservación que distinguen ofertas.',
  ],
  ['MinLOS', 'Restricción de duración mínima de estancia; su aplicación varía por sistema.'],
  [
    'Closed to Arrival (CTA)',
    'Control que generalmente bloquea llegadas en una fecha, no todas las estancias existentes.',
  ],
  [
    'Desplazamiento',
    'Negocio que se deja de aceptar cuando otro negocio consume capacidad escasa.',
  ],
  ['Segmento', 'Categoría comercial de demanda, como corporativo, grupos u ocio.'],
  ['Canal', 'Vía por la que una reservación llega al hotel.'],
  ['OTA', 'Agencia de viajes en línea: canal de distribución intermediario.'],
  ['GDS', 'Sistema global de distribución que conecta vendedores de viajes con inventario.'],
  ['Mayorista', 'Distribución contratada que suele usar tarifas netas para reventa.'],
  ['Paquete', 'Oferta que combina alojamiento con otras inclusiones.'],
  [
    'Ingreso neto',
    'Ingreso después de las deducciones especificadas; indica siempre qué costos se restan.',
  ],
  [
    'Paridad tarifaria',
    'Precios y condiciones comparables entre canales; los requisitos dependen de contratos y normas aplicables.',
  ],
  ['Conjunto competitivo', 'Grupo relevante de hoteles que se usa para comparar desempeño.'],
  ['MPI', 'Índice de penetración de mercado: ocupación del hotel / ocupación comparable × 100.'],
  ['ARI', 'Índice de tarifa promedio: ADR del hotel / ADR comparable × 100.'],
  ['RGI', 'Índice de generación de ingresos: RevPAR del hotel / RevPAR comparable × 100.'],
  [
    'Fecha de necesidad',
    'Fecha que requiere demanda rentable adicional respecto a las expectativas u objetivos.',
  ],
  ['Compresión', 'Periodo con disponibilidad especialmente limitada en el mercado o en el hotel.'],
  [
    'SUMIFS',
    'Función de Excel que suma valores que cumplen varios criterios (SUMAR.SI.CONJUNTO en Excel en español).',
  ],
  [
    'COUNTIFS',
    'Función de Excel que cuenta filas que cumplen varios criterios (CONTAR.SI.CONJUNTO en español).',
  ],
  [
    'XLOOKUP',
    'Función de Excel que busca una clave y devuelve su valor asociado (BUSCARX en español).',
  ],
  ['Power Query', 'Flujo repetible de importación, transformación y combinación de datos.'],
  ['Observación', 'Afirmación respaldada directamente por los datos.'],
  ['Interpretación', 'Explicación razonada o hipótesis sobre una observación.'],
  ['Recomendación', 'Acción propuesta con sustento, responsable y seguimiento.'],
];
export const formulaCopy: [string, string, string][] = [
  [
    'Habitaciones-noche disponibles',
    'Habitaciones disponibles × noches',
    'Usa el mismo periodo de reporte; estos datos contemplan 900 habitaciones por día.',
  ],
  [
    'Ocupación',
    'Habitaciones vendidas / habitaciones disponibles × 100',
    'Exprésala como porcentaje.',
  ],
  [
    'ADR',
    'Ingreso de habitaciones / habitaciones vendidas',
    'No está definido si no hay habitaciones vendidas.',
  ],
  [
    'RevPAR',
    'Ingreso de habitaciones / habitaciones disponibles',
    'También equivale a ADR × ocupación en decimal.',
  ],
  [
    'TRevPAR',
    'Ingreso operativo total / habitaciones disponibles',
    'Incluye ingreso operativo ajeno a habitaciones; no mide utilidad.',
  ],
  [
    'Pickup',
    'OTB actual − OTB anterior',
    'Usa el mismo periodo de estancia y momentos de corte definidos.',
  ],
  [
    'Diferencia de Pace',
    'OTB actual − OTB comparable',
    'Compara la misma anticipación, días de la semana y contexto de eventos.',
  ],
  [
    'Anticipación (lead time)',
    'Fecha de llegada − fecha de reservación',
    'Días transcurridos antes de la llegada.',
  ],
  ['LOS', 'Fecha de salida − fecha de llegada', 'Se excluye el día de salida.'],
  [
    'Pronóstico de habitaciones',
    'min(capacidad, OTB + Pickup neto esperado)',
    'El Pickup neto ya contempla las pérdidas esperadas de reservaciones.',
  ],
  [
    'Pronóstico de ingreso de habitaciones',
    'Ingreso OTB retenido + ingreso incremental',
    'Usa el ingreso retenido después de las pérdidas esperadas.',
  ],
  [
    'Ingreso neto después de comisión',
    'Ingreso de habitaciones × (1 − tasa de comisión)',
    'Aún faltan otros costos de adquisición y operación.',
  ],
  [
    'MPI',
    'Ocupación del hotel / ocupación del conjunto competitivo × 100',
    '100 indica paridad con la métrica de comparación.',
  ],
  [
    'ARI',
    'ADR del hotel / ADR del conjunto competitivo × 100',
    'Menos de 100 indica una tarifa obtenida menor.',
  ],
  [
    'RGI',
    'RevPAR del hotel / RevPAR del conjunto competitivo × 100',
    'Equivale a MPI × ARI / 100.',
  ],
  [
    'Cambio porcentual',
    '(Actual − anterior) / anterior × 100',
    'No está definido si la base es cero.',
  ],
  [
    'ADR ponderado',
    'Suma de ingreso de habitaciones / suma de habitaciones vendidas',
    'No promedies ADR por fila sin ponderar.',
  ],
  [
    'SUMIFS',
    '=SUMIFS(Revenue,Channel,"Direct",Status,"Confirmed")',
    'Suma los valores que cumplen todas las condiciones. Las fórmulas de práctica conservan identificadores y funciones en inglés.',
  ],
  [
    'COUNTIFS',
    '=COUNTIFS(Channel,"OTA",Status,"Confirmed")',
    'Cuenta filas coincidentes, no necesariamente habitaciones-noche.',
  ],
  [
    'XLOOKUP',
    '=XLOOKUP(Code,MappingCode,MappingSegment,"Unmapped")',
    'Relaciona una clave; investiga los valores sin correspondencia.',
  ],
  [
    'IF',
    '=IF(Occupancy<0.6,"Need date","Monitor")',
    'Devuelve un valor según una condición (SI en Excel en español).',
  ],
  [
    'IFERROR',
    '=IFERROR(Revenue/Rooms,"Check denominator")',
    'Usa un diagnóstico explícito en lugar de ocultar el error con cero (SI.ERROR en español).',
  ],
];
export const moduleCopy = [
  'Diagnóstico',
  'Modelo mental de Revenue Management',
  'Métricas hoteleras esenciales',
  'Comportamiento de reservación',
  'Demanda y pronóstico',
  'Precios, yield e inventario',
  'Segmentación y distribución',
  'Benchmarking y desempeño de mercado',
  'Excel para Revenue Analyst',
  'Rutina diaria del Revenue Analyst',
  'Reunión de ingresos',
  'Caso integrador',
  'Laboratorio de entrevistas',
];
export const diagnosticCopy: [string, string][] = [
  ['720 habitaciones vendidas de 900 disponibles: ¿ocupación (%)?', '720 / 900 × 100 = 80%.'],
  [
    '$180,000 de ingreso de habitaciones entre 720 habitaciones-noche vendidas: ¿ADR?',
    '180,000 / 720 = $250.',
  ],
  ['80% de ocupación y ADR de $250: ¿RevPAR?', '0.80 × 250 = $200.'],
  [
    'Misma fecha de estancia: el OTB pasa de 600 a 650. ¿Pickup neto?',
    '650 − 600 = +50 habitaciones.',
  ],
  [
    'OTB de 600 + Pickup neto restante esperado de 150. ¿Pronóstico de habitaciones vendidas?',
    '600 + 150 = 750 habitaciones.',
  ],
];
export const interviewCopy: [string, string, string[]][] = [
  [
    'Debes agrupar ingresos por canal y estado. ¿Qué función corresponde?',
    'SUMIFS suma valores que cumplen varias condiciones; COUNTIFS cuenta registros coincidentes.',
    ['XLOOKUP', 'SUMIFS', 'COUNTIFS'],
  ],
  [
    'El PMS y el reporte de ingresos no coinciden. ¿Cuál es tu primer paso?',
    'Tu experiencia operativa ayuda a validar entradas antes de tomar decisiones comerciales.',
    [
      'Cambiar BAR',
      'Conciliar fecha operativa, estado, asignación a alojamiento y hora de actualización',
      'Ignorar el PMS',
    ],
  ],
  [
    'Una fecha casi llena tiene Pickup en aceleración. ¿Qué harías?',
    'Protege el inventario escaso y considera incertidumbre, mezcla y desplazamiento.',
    [
      'Descontar para llegar al 100%',
      'Revisar valor neto y demanda restante, y evaluar tarifas más altas',
      'Cerrar todas las ventas de inmediato',
    ],
  ],
];
export const capstoneCopy: [string, string][] = [
  ['Ocupación de ayer (%)', '720 / 900 × 100 = 80%.'],
  [
    'ADR de ayer según la producción por canal',
    'Ingreso de habitaciones de $192,000 / 720 habitaciones-noche = $266.67.',
  ],
  ['RevPAR de ayer', '$192,000 / 900 = $213.33.'],
  [
    'Pronóstico restringido de habitaciones vendidas para el 15 de noviembre',
    '850 + 90 = 940 sin restricción, pero la capacidad es 900.',
  ],
  [
    'Diferencia de Pace en habitaciones del 18 de noviembre contra el año anterior con la misma anticipación',
    '410 − 530 = −120 habitaciones; el Pickup actual también es −40.',
  ],
  [
    'Ingreso neto de habitaciones OTA de ayer después del costo de adquisición',
    '$84,000 − $15,120 = $68,880; aún no se descuentan costos operativos.',
  ],
];
export const rubricCopy: [string, string][] = [
  [
    'Compresión',
    '15 de noviembre: 850 OTB, +60 Pickup, +80 Pace; la demanda estimada de 940 supera las 900 habitaciones. Evalúa tarifas más altas y restricciones a ofertas de bajo valor.',
  ],
  [
    'Fechas de necesidad',
    'Del 17 al 19 de noviembre hay menor demanda. El día 18 tiene 410 OTB, −40 Pickup y −120 Pace. Valida la reducción del grupo y considera acciones dirigidas para estimular demanda.',
  ],
  [
    'Valor por canal',
    'OTA aporta 300 habitaciones-noche, pero cuesta $15,120. Compara contribución neta y demanda incremental antes de reasignar disponibilidad. El canal directo también tiene costos.',
  ],
  [
    'Pronóstico',
    'Limita el 15 de noviembre a 900 habitaciones vendidas. Pronostica el 18 en 500 habitaciones / 55.6%, usando +90 de Pickup neto restante. Presenta un escenario desfavorable y justifica los supuestos.',
  ],
  [
    'Precios',
    'No apliques el mismo descuento al festival y a las fechas débiles. BAR es una oferta, no el ADR pronosticado. Evalúa demanda por tipo de habitación y contribución de la estancia completa.',
  ],
  [
    'Calidad de datos',
    'R007 tiene $240 de ingresos, cero habitaciones-noche y llegada y salida iguales. Sepáralo para conciliar; no sustituyas el ADR por cero sin advertencia. La muestra de reservaciones no es toda la producción.',
  ],
];
