// Display copy only. Original IDs, answers, option values and calculations stay unchanged.
export type QuestionCopy = [prompt: string, explanation: string, options?: string[]];
export type LessonCopy = [
  title: string,
  concept: string,
  formula: string,
  example: string,
  mistake: string,
  questions: QuestionCopy[],
  scenario: QuestionCopy,
];
export const lessonCopy: Record<string, LessonCopy> = {
  inventory: [
    'Piensa en habitaciones-noche',
    'Una habitación-noche es perecedera: una habitación que no se vende hoy no se puede guardar para mañana. Un resort de 900 habitaciones tiene capacidad fija por noche, mientras la demanda cambia según las fechas, los eventos y las necesidades del huésped. Revenue Management ajusta precio y disponibilidad a la demanda esperada. Tu experiencia operativa ayuda a detectar si un aparente problema de demanda es en realidad una tarifa cerrada, una habitación fuera de servicio o un error de reservación.',
    'Habitaciones-noche disponibles = habitaciones disponibles × noches',
    'Con las 900 habitaciones disponibles durante 3 noches, la capacidad es de 2,700 habitaciones-noche. Vender 700 el lunes deja 200 habitaciones-noche sin vender ese lunes; no crea 1,100 habitaciones disponibles el martes.',
    'No confundas reservaciones, huéspedes y habitaciones-noche. Una reservación de dos habitaciones por tres noches ocupa seis habitaciones-noche.',
    [
      [
        'Hay 900 habitaciones disponibles durante 7 noches. ¿Cuántas habitaciones-noche están disponibles?',
        '900 × 7 = 6,300 habitaciones-noche.',
      ],
      [
        '¿Qué oportunidad vence cada noche?',
        'La habitación permanece, pero la oportunidad de generar ingresos esa noche se pierde.',
        [
          'La oportunidad de vender esa habitación-noche',
          'La habitación física',
          'El edificio del hotel',
        ],
      ],
      [
        'Una reservación incluye 2 habitaciones por 3 noches. ¿Qué se vende?',
        'Multiplica habitaciones por noches; el número de huéspedes es otra medida.',
        ['6 habitaciones-noche', '2 habitaciones-noche', '3 habitaciones-noche'],
      ],
      [
        '¿Qué suele cambiar más rápido?',
        'La demanda puede cambiar rápidamente; la capacidad del hotel es relativamente fija.',
        ['La demanda de una fecha', 'El número de habitaciones físicas', 'El número de pisos'],
      ],
    ],
    [
      'El sábado está casi lleno y el domingo tiene baja demanda. ¿Qué conviene investigar?',
      'La demanda se analiza por fecha. Revisa llegadas, salidas, Pickup y oportunidades para extender estancias.',
      [
        'La demanda y los patrones de estancia de cada fecha antes de cambiar tarifas',
        'Bajar todas las tarifas del fin de semana',
        'Suponer que el domingo se llenará solo',
      ],
    ],
  ],
  commercial: [
    'Ingresos, utilidad y ciclo de decisión',
    'Los ingresos provienen de las ventas; la utilidad también considera los costos. En un resort todo incluido, vender más habitaciones puede aumentar los costos de alimentos, bebidas, lavandería y adquisición. El analista valida datos, explica cambios, mantiene pronósticos y recomienda acciones. El Revenue Manager suele definir la estrategia tarifaria y aprobar decisiones; las responsabilidades varían por hotel. El ciclo consiste en observar, diagnosticar, pronosticar, decidir, implementar y evaluar.',
    'Contribución ilustrativa = ingresos − costo de adquisición − costo incremental de servicio',
    'Una asignación de $260 a alojamiento, con $40 de adquisición y $90 de servicio incremental, aporta $130 antes de costos fijos. Una reservación directa de $250, con $10 de adquisición y el mismo costo de servicio, aporta $150.',
    'La contribución no es la utilidad final. También cuentan la nómina fija, los gastos generales y otros costos.',
    [
      [
        'Los ingresos son $300, el costo de adquisición $45 y el costo incremental de servicio $95. ¿Cuál es la contribución?',
        '300 − 45 − 95 = $160 antes de costos fijos.',
      ],
      [
        '¿Cuál es un entregable útil de un analista?',
        'El analista transforma datos confiables en una decisión sustentada.',
        [
          'Una observación validada con una recomendación razonada',
          'Un cambio de tarifa sin explicación',
          'Prometer que todo pronóstico es exacto',
        ],
      ],
      [
        'Un mayor ingreso de habitaciones garantiza una mayor utilidad.',
        'Los costos y la mezcla de reservaciones pueden cambiar.',
        ['Falso', 'Verdadero'],
      ],
      [
        '¿Qué sigue después de implementar una decisión?',
        'Compara los resultados con lo esperado y revisa los supuestos.',
        ['Evaluar el resultado', 'Olvidar la decisión', 'Copiar a un competidor'],
      ],
    ],
    [
      'La ocupación subió, pero la contribución cayó. ¿Qué revisas primero?',
      'Diagnostica la mezcla y los costos antes de elegir una respuesta.',
      [
        'Tarifa, costos por canal y costos incrementales de servicio',
        'Celebrar únicamente la ocupación',
        'Subir todos los precios de inmediato',
      ],
    ],
  ],
  occupancy: [
    'Mide capacidad y ocupación',
    'Las habitaciones disponibles representan la oferta de habitaciones-noche del periodo. Las habitaciones vendidas representan la demanda pagada según la convención del reporte. La ocupación mide qué proporción de la oferta se vendió. Estos ejercicios usan 900 habitaciones disponibles por día, excluyen cortesías de las habitaciones vendidas y mantienen fechas consistentes. El tratamiento real de habitaciones fuera de servicio y cortesías debe seguir el estándar de reporte del hotel.',
    'Ocupación (%) = habitaciones vendidas ÷ habitaciones disponibles × 100',
    '720 habitaciones vendidas ÷ 900 disponibles = 80% de ocupación. En dos noches: 720 + 810 = 1,530 habitaciones-noche vendidas de 1,800 disponibles, es decir, 85%.',
    'Usa habitaciones-noche del mismo periodo. No dividas las ventas de una semana entre la oferta de un solo día.',
    [
      [
        'El resort vende 756 de 900 habitaciones disponibles esta noche. Calcula la ocupación.',
        '756 ÷ 900 × 100 = 84%.',
      ],
      [
        '¿Qué debe ir en el denominador?',
        'El denominador representa la oferta del periodo exacto que se reporta.',
        [
          'Habitaciones-noche disponibles en el mismo periodo',
          'Huéspedes alojados',
          'Reservaciones creadas hoy',
        ],
      ],
      [
        'La ocupación sube de 70% a 80%. El cambio en puntos porcentuales es:',
        'Resta los porcentajes. El crecimiento relativo sería 14.3%.',
        ['10 puntos porcentuales', '14.3 puntos porcentuales', '80 puntos porcentuales'],
      ],
      [
        'Una habitación vendida con 3 huéspedes cuenta como:',
        'Habitaciones y huéspedes son unidades diferentes.',
        [
          '1 habitación-noche por una noche',
          '3 habitaciones vendidas',
          '3 habitaciones disponibles',
        ],
      ],
    ],
    [
      'Un reporte indica 105% de ocupación pagada. ¿Cuál es tu primera acción?',
      'Con la definición de este ejercicio, las habitaciones ocupadas no pueden superar las disponibles físicamente. Valida los datos antes de interpretarlos.',
      [
        'Validar habitaciones, fechas y definiciones del reporte',
        'Recomendar descuentos de inmediato',
        'Suponer que la demanda es exactamente 105%',
      ],
    ],
  ],
  adr: [
    'Distingue tarifa y volumen',
    'El ingreso de habitaciones es la parte asignada al alojamiento, sin impuestos ni componentes ajenos a habitaciones según la convención indicada. El ADR es el ingreso promedio por habitación-noche pagada y vendida. Mide la tarifa obtenida, no la anunciada. En un paquete todo incluido, no uses el precio completo como ingreso de habitaciones salvo que esa sea la base de reporte definida explícitamente.',
    'ADR = ingreso de habitaciones ÷ habitaciones vendidas',
    '720 habitaciones-noche vendidas generan $180,000 asignados al alojamiento. El ADR es $250. Un paquete todo incluido de $400 puede asignar solo $250 a habitaciones; el resto corresponde a otras categorías de ingresos.',
    'El ADR excluye habitaciones sin vender. Puede subir porque se vendieron menos habitaciones con descuento, aunque el ingreso total disminuya.',
    [
      [
        '810 habitaciones-noche vendidas generan $218,700 de ingreso de habitaciones. Calcula el ADR.',
        '218,700 ÷ 810 = $270 por habitación-noche vendida.',
      ],
      [
        '¿Qué denominador usa el ADR?',
        'El ADR mide ingresos por habitación-noche vendida.',
        ['Habitaciones vendidas', 'Habitaciones disponibles', 'Huéspedes'],
      ],
      [
        '¿Un paquete anunciado en $400 demuestra un ADR de $400?',
        'Las inclusiones, los descuentos y la asignación contable afectan el ingreso de habitaciones.',
        ['No; importan la asignación y la mezcla real de ventas', 'Sí, siempre'],
      ],
      [
        'El ADR sube y las habitaciones vendidas bajan. ¿Qué pasa con los ingresos?',
        'Ingresos = tarifa × volumen; evalúa ambos cambios.',
        [
          'Depende de ambos cambios',
          'Los ingresos necesariamente suben',
          'Los ingresos necesariamente bajan',
        ],
      ],
    ],
    [
      'El ADR sube 10%, pero las habitaciones-noche vendidas bajan 20%. ¿Cómo lo reportas?',
      '1.10 × 0.80 = 0.88: los ingresos quedan 12% por debajo del nivel inicial.',
      [
        'El ingreso de habitaciones baja 12%; hay que investigar mezcla y demanda',
        'Los ingresos suben 10%',
        'La ocupación no importa',
      ],
    ],
  ],
  revpar: [
    'Relaciona ocupación, ADR e ingresos totales',
    'El RevPAR mide el ingreso de habitaciones entre todas las habitaciones-noche disponibles y combina tarifa y ocupación. El TRevPAR usa el ingreso operativo total, incluidos alimentos, bebidas y otros departamentos aplicables. Ninguno mide utilidad. Compara periodos y bases equivalentes; no cuentes dos veces los componentes de un paquete.',
    'RevPAR = ingreso de habitaciones ÷ habitaciones disponibles = ADR × ocupación en decimal\nTRevPAR = ingreso operativo total ÷ habitaciones disponibles',
    'Con 80% de ocupación y ADR de $250, el RevPAR es $200. Si el ingreso operativo total es $288,000 con 900 habitaciones disponibles, el TRevPAR es $320. La diferencia de $120 representa ingresos ajenos a habitaciones por habitación disponible.',
    'Usa 0.80, no 80, al multiplicar el ADR por una ocupación de 80%. No presentes el TRevPAR como utilidad.',
    [
      [
        'La ocupación es 90% y el ADR $260. Calcula el RevPAR.',
        '0.90 × 260 = $234 por habitación disponible.',
      ],
      [
        'El ingreso operativo total es $315,000 con 900 habitaciones-noche disponibles. Calcula el TRevPAR.',
        '315,000 ÷ 900 = $350.',
      ],
      [
        '¿Dos combinaciones diferentes de tarifa y ocupación pueden tener el mismo RevPAR?',
        '80% × $250 y 100% × $200 dan $200.',
        ['Sí', 'No'],
      ],
      [
        '¿Cuál mide utilidad?',
        'Ambos miden ingresos antes de costos.',
        ['Ni RevPAR ni TRevPAR', 'RevPAR', 'TRevPAR'],
      ],
    ],
    [
      'Opción A: 900 habitaciones a $200. Opción B: 750 a $260. ¿Cuál genera más ingreso de habitaciones?',
      'B genera $15,000 más y requiere atender menos habitaciones. Revisa también la contribución total y otros efectos.',
      ['B: $195,000 frente a $180,000', 'A porque llena el hotel', 'Son iguales'],
    ],
  ],
  pickup: [
    'Lee OTB y Pickup entre cortes',
    'On the Books (OTB) es la posición de habitaciones-noche reservadas para una fecha o periodo de estancia en un momento de corte. El Pickup es el cambio entre cortes del mismo periodo de estancia. El Pickup neto incluye nuevas reservaciones, cancelaciones y modificaciones. La fecha de reservación indica cuándo se creó; la fecha de estancia indica cuándo se consume el inventario.',
    'Pickup neto = OTB actual − OTB anterior para las mismas fechas de estancia',
    'Para el 14 de noviembre, el corte del 1 de noviembre tiene 540 habitaciones y el del 8 de noviembre, 612. El Pickup neto de siete días es +72. Lo explican 90 habitaciones nuevas y 18 canceladas, si no hubo otras modificaciones.',
    'No restes OTB de fechas de estancia distintas ni confundas el Pickup neto con nuevas reservaciones brutas.',
    [
      [
        'Para la misma fecha de estancia, el OTB pasa de 630 el 1 de noviembre a 702 el 8. Calcula el Pickup neto.',
        '702 − 630 = +72 habitaciones en siete días.',
      ],
      [
        'Una reservación creada el 2 de octubre para el 14 de noviembre: ¿a qué fecha de estancia corresponde?',
        'La fecha de reservación y la de consumo del inventario sirven para análisis diferentes.',
        ['14 de noviembre', '2 de octubre', '1 de noviembre'],
      ],
      [
        'Hay 80 habitaciones nuevas, 25 canceladas y ninguna modificación. ¿Cuál es el Pickup neto?',
        '80 − 25 = 55 habitaciones.',
      ],
      [
        'Un Pickup negativo significa:',
        'Las cancelaciones o modificaciones pueden superar las nuevas reservaciones.',
        [
          'La posición reservada disminuyó',
          'No se creó ninguna reservación nueva',
          'El hotel tiene demanda negativa',
        ],
      ],
    ],
    [
      'Una fecha pierde 100 habitaciones de un día a otro. ¿Qué revisas antes de bajar tarifas?',
      'La cancelación de un grupo o un error de reporte requieren una respuesta distinta a una debilidad general de demanda.',
      [
        'La reducción de grupos, las cancelaciones y la integridad de la actualización de datos',
        'Reducir BAR 30%',
        'Ignorarlo hasta la llegada',
      ],
    ],
  ],
  pace: [
    'Compara Pace con la misma anticipación',
    'El Pace describe cómo se acumulan las reservaciones hacia una fecha de estancia. Compara la misma anticipación, días de la semana equivalentes y ajusta por eventos o cambios de calendario. Comparar el OTB futuro de hoy con las ventas finales del año pasado exagera la debilidad. El Pickup es el cambio de un intervalo; el Pace es la trayectoria o comparación de posiciones reservadas.',
    'Diferencia de Pace = OTB actual − OTB comparable con los mismos días antes de la llegada',
    'A 30 días de la llegada, este año hay 600 habitaciones OTB y la fecha comparable del año anterior tenía 550. El Pace es +50 habitaciones, o +9.1%. La ocupación final del año anterior de 850 habitaciones es otra comparación.',
    'La misma fecha de calendario no siempre representa demanda comparable si cambian los fines de semana o los eventos.',
    [
      [
        'A 14 días de la llegada, el OTB actual es 720 y el comparable del año anterior era 675. Calcula la diferencia de Pace en habitaciones.',
        '720 − 675 = +45 habitaciones con la misma anticipación.',
      ],
      [
        '¿Cuál es la comparación más sólida?',
        'La misma anticipación permite comparar el desarrollo de las reservaciones de forma consistente.',
        [
          'OTB con los mismos días antes de la llegada y contexto de calendario',
          'OTB actual contra ventas finales del año pasado',
          'Periodos de estancia distintos sin ajustes',
        ],
      ],
      [
        'Pickup y Pace significan exactamente lo mismo.',
        'El Pickup mide el cambio en un intervalo; el Pace analiza la acumulación respecto al tiempo o una referencia.',
        ['Falso', 'Verdadero'],
      ],
      [
        'Un evento se movió una semana. ¿Qué ajustas?',
        'Compara periodos tomando en cuenta el evento.',
        [
          'El periodo de comparación',
          'El número de habitaciones físicas',
          'Todas las fechas históricas de reservación',
        ],
      ],
    ],
    [
      'Vas adelante en habitaciones, pero atrás en ingresos con la misma anticipación. ¿Cuál es la posible preocupación?',
      'Revisa ADR y mezcla de segmentos antes de considerar el adelanto en habitaciones como un éxito comercial.',
      [
        'Una menor tarifa obtenida o una mezcla de reservaciones de menor tarifa',
        'La capacidad aumentó automáticamente',
        'La tarifa definitivamente aumentó',
      ],
    ],
  ],
  'stay-patterns': [
    'Anticipación, duración de estancia y pérdidas de reservaciones',
    'La anticipación o lead time es el tiempo entre la reservación y la llegada; la ventana de reservación suele describir la distribución de esas anticipaciones. La duración de estancia (LOS) es la fecha de salida menos la de llegada. Una cancelación elimina una reservación antes de la llegada; un no-show es un huésped esperado que no llega. Sus tasas necesitan un conjunto de referencia y un denominador claramente definidos.',
    'Anticipación = fecha de llegada − fecha de reservación\nLOS = fecha de salida − fecha de llegada',
    'Reservación el 1 de noviembre, llegada el 21 y salida el 25: anticipación de 20 días y LOS de 4 noches. Una reservación de dos habitaciones ocupa 8 habitaciones-noche. Si se esperan 100 reservaciones de llegada y hay 3 no-shows, la tasa es 3% para ese conjunto definido.',
    'El día de salida no agrega una noche ocupada. No restes dos veces las cancelaciones esperadas si el Pickup ya es neto.',
    [
      [
        'Un huésped llega el 21 de noviembre y sale el 26. Calcula el LOS.',
        'Las noches ocupadas son del 21 al 25 de noviembre: cinco noches.',
      ],
      [
        'Una reservación creada el 1 de noviembre llega el 21. Calcula la anticipación.',
        'Hay 20 días entre ambas fechas.',
      ],
      [
        '¿Cuál es un no-show?',
        'La cancelación y el no-show ocurren en etapas diferentes.',
        [
          'Un huésped esperado que no llega',
          'Un huésped que cancela una semana antes',
          'Un huésped que sale antes de lo previsto',
        ],
      ],
      [
        '¿Por qué analizar ventanas de reservación por segmento?',
        'Los patrones por segmento mejoran la interpretación y el pronóstico.',
        [
          'Los distintos grupos de huéspedes reservan con diferente anticipación',
          'Todos los canales se comportan igual',
          'Elimina la incertidumbre',
        ],
      ],
    ],
    [
      'El OTB de OTA es fuerte, pero las reservaciones reembolsables se cancelan con frecuencia. Tu pronóstico debe:',
      'Estima las cancelaciones y los no-shows probables sin considerar todas las reservaciones como seguras o sin valor.',
      [
        'Considerar las pérdidas esperadas con patrones de reservación comparables',
        'Suponer que todo el OTB se hospedará',
        'Eliminar todas las reservaciones de OTA',
      ],
    ],
  ],
  'forecast-rooms': [
    'Construye un pronóstico de habitaciones transparente',
    'Un pronóstico de corto plazo combina el OTB actual con el Pickup restante esperado. Sustenta los supuestos con historia, tendencias recientes, estacionalidad, día de la semana y eventos. El pronóstico es una estimación, no una meta. Un modelo aditivo sencillo es útil si aclaras si el Pickup ya contempla cancelaciones y no-shows.',
    'Pronóstico de habitaciones vendidas = min(capacidad, OTB + Pickup neto restante esperado)',
    'Con OTB de 600 y Pickup neto restante esperado de 180, el pronóstico es 780 habitaciones, o 86.7% de 900. Si el supuesto de Pickup baja a 120, da 720 habitaciones, u 80%. El rango ayuda al equipo a entender el riesgo.',
    'Un día de Pickup fuerte no justifica repetir el mismo Pickup por cada día restante.',
    [
      [
        'El OTB es 630 y el Pickup neto restante esperado es 135. Pronostica las habitaciones vendidas.',
        '630 + 135 = 765 habitaciones, por debajo del límite de 900.',
      ],
      [
        '¿Qué sustenta un supuesto de Pickup?',
        'Usa evidencia y documenta por qué el periodo es comparable.',
        [
          'Anticipaciones comparables, tendencias y contexto de eventos',
          'Solo la meta del presupuesto',
          'Repetir el Pickup de ayer sin contexto',
        ],
      ],
      [
        'Si el Pickup restante ya es neto, ¿restas otra vez las cancelaciones?',
        'Eso contaría dos veces las mismas pérdidas esperadas.',
        ['No', 'Sí'],
      ],
      [
        '¿Por qué usar un rango de pronóstico?',
        'Quienes deciden necesitan entender la sensibilidad a los supuestos.',
        [
          'Para comunicar incertidumbre',
          'Para evitar tomar decisiones',
          'Para garantizar el resultado',
        ],
      ],
    ],
    [
      'Se cancela un festival después de preparar el pronóstico. ¿Qué sigue?',
      'El pronóstico debe responder a nueva evidencia; explica el ajuste.',
      [
        'Revisar los supuestos de demanda y cuantificar el escenario desfavorable',
        'Mantener el pronóstico porque ya fue aprobado',
        'Cambiar las ventas históricas reales',
      ],
    ],
  ],
  'forecast-value': [
    'Pronostica ingresos, además de habitaciones',
    'Pronostica el ingreso de habitaciones combinando el ingreso reservado con el esperado de las reservaciones restantes y considerando las pérdidas. El ADR resultante es un promedio ponderado. El presupuesto es el plan financiero aprobado; el pronóstico es el resultado esperado más reciente; el resultado real es lo registrado. Compara los tres sin cambiar sus definiciones.',
    'Ingreso pronosticado = ingreso OTB retenido + ingreso incremental esperado de habitaciones\nADR pronosticado = ingreso pronosticado de habitaciones ÷ habitaciones vendidas pronosticadas',
    '600 habitaciones retenidas a $240 más 180 esperadas a $280 generan $194,400. El ADR pronosticado es $249.23 entre 780 habitaciones. Promediar $240 y $280 sin ponderar daría incorrectamente $260.',
    'No multipliques todas las habitaciones pronosticadas por la tarifa de las últimas ventas, salvo que sea un ADR combinado justificado.',
    [
      [
        '600 habitaciones retenidas a $250 más 150 nuevas a $300. Pronostica el ingreso de habitaciones.',
        '600 × 250 + 150 × 300 = $195,000.',
      ],
      [
        'Con 750 habitaciones pronosticadas y $195,000 de ingresos, calcula el ADR pronosticado.',
        '195,000 ÷ 750 = $260.',
      ],
      [
        'El plan financiero anual aprobado es el:',
        'El presupuesto expresa el plan; el pronóstico actualiza las expectativas.',
        ['Presupuesto', 'Resultado real', 'Pronóstico más reciente'],
      ],
      [
        'Los resultados registrados de ayer son:',
        'Los resultados reales reflejan el desempeño registrado, sujeto a ajustes de auditoría.',
        ['Resultado real', 'Presupuesto', 'Demanda no restringida'],
      ],
    ],
    [
      'El presupuesto de ingreso de habitaciones es $220,000 y el pronóstico más reciente $195,000. ¿Qué reportas?',
      'Un pronóstico honesto muestra la brecha a tiempo para actuar.',
      [
        'Una brecha de $25,000 con causas de volumen y tarifa, y acciones',
        'Cambiar el pronóstico a $220,000',
        'Ocultar la variación hasta el cierre del mes',
      ],
    ],
  ],
  unconstrained: [
    'Reconoce la demanda por encima de la capacidad',
    'Las ventas observadas pueden estar restringidas por capacidad, canales cerrados, restricciones o precios. La demanda no restringida estima lo que podría venderse sin límites de capacidad o disponibilidad, bajo supuestos de mercado y precio definidos. Puede superar 900 habitaciones aunque la ocupación física no pueda hacerlo. Llenar el hotel no revela si la demanda era de 901 o 1,200.',
    'Pronóstico restringido de habitaciones vendidas ≤ capacidad disponible\nLa demanda no restringida puede superar la capacidad',
    'La demanda estimada es de 1,050 habitaciones-noche para una fecha con 900 habitaciones. El excedente es 150. Eso no autoriza ocupar 150 habitaciones adicionales; sugiere evaluar precio, tipos de habitación, patrones de estancia y desplazamiento.',
    'La demanda no restringida no indica que debas sobrevender. La sobreventa requiere una política de riesgo y controles operativos independientes.',
    [
      [
        'La demanda estimada es de 1,080 habitaciones y la capacidad 900. ¿Cuánta demanda excede la capacidad?',
        '1,080 − 900 = 180 habitaciones-noche de demanda excedente estimada.',
      ],
      [
        'Llenar el hotel demuestra que la demanda total era exactamente igual a la capacidad.',
        'Las ventas tienen un límite; la demanda pudo ser mayor.',
        ['Falso', 'Verdadero'],
      ],
      [
        '¿Qué puede restringir la demanda observada?',
        'Los controles pueden impedir que se acepten reservaciones.',
        [
          'Una tarifa cerrada o una restricción de estancia',
          'Solo un ADR bien calculado',
          'El nombre de un reporte',
        ],
      ],
      [
        '¿El pronóstico de habitaciones ocupadas debe superar aquí la capacidad física?',
        'La demanda estimada y las habitaciones que realmente se pueden ocupar son medidas distintas.',
        ['No', 'Sí'],
      ],
    ],
    [
      'La demanda del sábado supera la capacidad y el viernes está débil. ¿Qué conviene probar?',
      'Evalúa si las estancias de varias noches mejoran la contribución total entre fechas.',
      [
        'Controles de estancia y precio con análisis de desplazamiento',
        'Aceptar todas las reservaciones baratas de una noche para el sábado',
        'Suponer que el viernes se llenará',
      ],
    ],
  ],
  pricing: [
    'Fija precios y protege el inventario',
    'BAR es una tarifa pública de referencia con condiciones definidas; su implementación varía. La tarifa dinámica cambia con la evidencia de demanda. Las condiciones tarifarias distinguen ofertas por compra anticipada o reembolsabilidad. La elasticidad describe la sensibilidad de la demanda al precio. El yield asigna inventario limitado a negocio de mayor valor. Los suplementos por tipo de habitación deben reflejar su demanda. Descontar fechas débiles ayuda solo si la contribución incremental supera la dilución.',
    'Prueba de desplazamiento: contribución propuesta − contribución del negocio desplazado',
    'Un grupo de tres noches aporta $45,000, pero desplazaría $50,000 de contribución de huéspedes individuales. Su valor neto por desplazamiento es −$5,000 antes de otros beneficios estratégicos. MinLOS exige una estancia mínima; Closed to Arrival suele bloquear nuevas llegadas en una fecha, no estancias existentes. Las reglas del sistema varían.',
    'Una ocupación alta no justifica cualquier restricción. Los controles pueden bloquear estancias largas valiosas o desviar demanda a competidores.',
    [
      [
        'La contribución del grupo es $60,000 y la desplazada $52,000. Calcula la contribución incremental.',
        '60,000 − 52,000 = $8,000 antes de otros beneficios o costos.',
      ],
      [
        '¿Cuál es una condición tarifaria o rate fence?',
        'Las condiciones diferencian el valor y los requisitos de las ofertas.',
        [
          'Compra anticipada no reembolsable',
          'Cambiar al azar el nombre del huésped',
          'Un error en el número de habitaciones',
        ],
      ],
      [
        'MinLOS 3 suele exigir:',
        'Verifica si el sistema aplica la regla a la llegada o a todas las fechas de la estancia.',
        ['Al menos tres noches', 'Exactamente tres huéspedes', 'Tres habitaciones'],
      ],
      [
        'La elasticidad de precio se refiere a:',
        'La sensibilidad varía según segmento, fechas y alternativas.',
        [
          'Cómo responde la demanda a cambios de precio',
          'Qué tan rápido trabaja ama de llaves',
          'Un descuento universal fijo',
        ],
      ],
    ],
    [
      'Una noche de compresión vende rápido con BAR bajo. Elige una acción sustentada.',
      'Protege el inventario escaso, pero monitorea conversión, competidores y valor de la estancia completa.',
      [
        'Probar tarifas más altas y restringir ofertas de bajo valor mientras se monitorea el Pickup',
        'Descontar todos los canales',
        'Cerrar todos los tipos de habitación sin considerar la demanda',
      ],
    ],
  ],
  distribution: [
    'Sigue la reservación hasta su valor neto',
    'Un segmento de mercado describe el motivo o categoría comercial de la demanda; el canal describe la vía de distribución. Corporativo es un segmento; directo, OTA y GDS son canales. Los grupos pueden reservar directo y los viajeros de ocio por OTA. El mayorista suele usar tarifas netas contratadas para reventa. Los paquetes combinan componentes. GDS conecta vendedores de viajes con inventario. Compara costos por canal, cancelaciones y demanda incremental antes de cambiar la distribución.',
    'Ingreso neto de habitaciones tras adquisición = ingreso bruto de habitaciones − costos de adquisición',
    'Una asignación de $300 a habitaciones por OTA, con 18% de comisión, deja $246 antes del servicio. Una reservación directa de $285 que cuesta $15 adquirir deja $270. Directo no significa gratis. La paridad tarifaria compara precios y condiciones entre canales; las obligaciones varían por contrato y jurisdicción.',
    'La base contractual de comisión puede ser distinta. En estos ejercicios se aplica únicamente al ingreso asignado a habitaciones.',
    [
      [
        'La tarifa OTA es $300 con 20% de comisión. Calcula el ingreso neto de habitaciones después de comisión.',
        '300 × (1 − 0.20) = $240 antes de costos de servicio.',
      ],
      [
        'Corporativo suele ser un:',
        'Identifica un tipo o motivo de demanda.',
        ['Segmento de mercado', 'Canal de distribución'],
      ],
      [
        'Las reservaciones directas no tienen costo.',
        'Publicidad, procesamiento de pagos y sistemas de reservación pueden generar costos.',
        ['Falso', 'Verdadero'],
      ],
      [
        'Las comparaciones tarifarias deben igualar:',
        'La comparación debe ser equivalente para interpretar la paridad.',
        [
          'Tipo de habitación, inclusiones y condiciones de reservación',
          'Solo el primer precio mostrado',
          'Solo el logotipo del canal',
        ],
      ],
    ],
    [
      'Hay habitaciones sin vender en una fecha débil y una OTA puede aportar demanda incremental rentable. ¿Qué es razonable?',
      'Un canal costoso puede ser útil si aporta demanda rentable en vez de desplazar mejor negocio.',
      [
        'Evaluar contribución neta y riesgo de cancelación antes de asignar inventario',
        'Cerrar la OTA porque cobra comisión',
        'Dar inventario ilimitado a todos los canales',
      ],
    ],
  ],
  benchmarking: [
    'Interpreta índices de desempeño de mercado',
    'El conjunto competitivo es un grupo relevante de hoteles para comparación. MPI compara ocupación, ARI compara ADR y RGI compara RevPAR. Un índice de 100 indica paridad con la métrica agregada del conjunto; superar 100 indica una métrica mayor, no necesariamente más utilidad. Usa periodos y definiciones de ingreso consistentes y un conjunto confiable. El análisis de participación evalúa si la proporción de habitaciones-noche o ingresos supera la participación de oferta.',
    'MPI = ocupación del hotel ÷ ocupación del conjunto competitivo × 100\nARI = ADR del hotel ÷ ADR del conjunto competitivo × 100\nRGI = RevPAR del hotel ÷ RevPAR del conjunto competitivo × 100',
    'Ocupación del hotel de 80% frente a 75% del conjunto da MPI de 106.7. ADR de $240 frente a $250 da ARI de 96. RevPAR del hotel de $192 frente a $187.50 da RGI de 102.4. El volumen compensa la menor tarifa, pero los costos siguen importando.',
    'RGI de 110 no significa 110% de ocupación ni 10% de crecimiento de utilidad. Cambiar el conjunto competitivo puede distorsionar las tendencias.',
    [
      [
        'El RevPAR del hotel es $220 y el del conjunto competitivo $200. Calcula el RGI.',
        '220 ÷ 200 × 100 = 110.',
      ],
      [
        'Un ARI menor de 100 indica:',
        'ARI aísla la tarifa obtenida respecto al conjunto.',
        [
          'ADR menor que el del conjunto competitivo',
          'Una ocupación menor con certeza',
          'Ingresos negativos',
        ],
      ],
      [
        'MPI compara:',
        'La razón de ocupaciones × 100 es el índice de penetración de mercado.',
        ['Ocupación', 'Ingreso de habitaciones directamente', 'Utilidad'],
      ],
      [
        'Un RGI alto garantiza utilidad alta.',
        'RevPAR no contempla costos de adquisición ni operativos.',
        ['Falso', 'Verdadero'],
      ],
    ],
    [
      'MPI sube, ARI baja y RGI no cambia. ¿Qué conviene investigar?',
      'Descompón la tendencia y revisa la mezcla de segmentos antes de actuar.',
      [
        'Si el volumen con descuento diluye tarifa y contribución',
        'Celebrar que todos los índices mejoran',
        'Subir tarifas solo porque aumentó MPI',
      ],
    ],
  ],
  excel: [
    'Construye una tabla de análisis repetible',
    'Usa una fila por unidad definida, encabezados claros y tipos de datos consistentes. Filtra el periodo de estancia y el estado, y agrega habitaciones-noche e ingresos. Ordena para encontrar prioridades sin borrar registros. Las tablas amplían referencias estructuradas. SUMIFS suma valores que cumplen condiciones; COUNTIFS cuenta filas, que no siempre equivalen a habitaciones-noche. XLOOKUP relaciona una clave con un valor. IF clasifica una condición; IFERROR maneja un error conocido sin ocultar datos incorrectos.',
    '=SUMIFS(Revenue,Channel,"Direct",Status,"Confirmed")\n=IF(Occupancy<0.6,"Need date","Monitor")\n=IFERROR(Revenue/Rooms,"Check denominator")\n=XLOOKUP(Code,MappingCode,MappingSegment,"Unmapped")',
    'Una tabla dinámica con Channel en filas y sumas de RoomNights y Revenue en valores produce un reporte por canal. Calcula ADR con ingreso total / habitaciones-noche totales, no con el promedio de ADR de cada fila. Power Query registra pasos repetibles de importación, tipos, limpieza y combinación; al actualizar, ejecuta esas transformaciones.',
    'Elimina claves realmente duplicadas después de revisarlas, no todos los huéspedes con el mismo nombre. Interpreta las fechas de forma consistente y conserva una trazabilidad de auditoría.',
    [
      [
        'Los ingresos suben de $180,000 a $198,000. Calcula el cambio porcentual.',
        '(198,000 − 180,000) ÷ 180,000 × 100 = 10%.',
      ],
      [
        '¿Qué calcula ingresos del canal directo con condiciones?',
        'SUMIFS suma los valores numéricos coincidentes; COUNTIFS cuenta filas.',
        ['SUMIFS', 'COUNTIFS', 'Ordenar texto'],
      ],
      [
        '¿Qué permite repetir la importación y limpieza?',
        'Una secuencia guardada de transformaciones se puede actualizar.',
        ['Power Query', 'Cambiar colores de celdas manualmente', 'Tomar una captura'],
      ],
      [
        'El formato condicional debe:',
        'El formato ayuda a detectar excepciones, pero no corrige los datos.',
        [
          'Resaltar valores que cumplen una regla',
          'Cambiar los ingresos de origen',
          'Sustituir la validación',
        ],
      ],
    ],
    [
      'Una fila tiene ingresos de habitaciones y cero habitaciones-noche. ¿Cómo debe manejar el reporte su ADR?',
      'Usa IFERROR con intención; no ocultes un problema de conciliación de ingresos y volumen.',
      [
        'Señalar el denominador e investigar el origen',
        'Mostrar cero sin advertencia usando IFERROR',
        'Eliminar automáticamente todas las filas con cero',
      ],
    ],
  ],
  workflow: [
    'Realiza la revisión matutina de ingresos',
    'Empieza con la fecha operativa y la actualización de datos. Revisa habitaciones vendidas, ingresos y ajustes de auditoría de ayer. Después analiza OTB futuro, Pickup, Pace con anticipación equivalente, tarifas y producción por canal. Prioriza fechas inusuales y concilia anomalías. La observación describe evidencia; la interpretación propone una explicación; la recomendación define acción, responsable y medida de seguimiento.',
    'Observación → interpretación → recomendación → responsable / fecha de revisión',
    'Observación: el 18 de noviembre tiene 410 OTB, 40 menos en siete días. Interpretación: la reducción de un grupo podría explicar la caída. Recomendación: reservaciones debe verificar hoy los bloques cancelados; Revenue Management debe revisar los supuestos de Pickup y las ofertas dirigidas después de validar.',
    'No presentes una causa sin verificar como si fuera un hecho observado.',
    [
      [
        'El ingreso de habitaciones de ayer fue $210,000 frente a un pronóstico de $225,000. Calcula la variación en dólares.',
        '210,000 − 225,000 = −$15,000.',
      ],
      [
        '¿Cuál es una observación?',
        'La observación está respaldada directamente por los datos.',
        [
          'El Pickup neto de siete días es −40 habitaciones',
          'La demanda es débil por mala publicidad',
          'Debemos bajar BAR',
        ],
      ],
      [
        '¿Qué va antes de recomendar tarifas?',
        'Una anomalía de datos puede parecer un problema comercial.',
        [
          'Validar los datos y diagnosticar la fecha',
          'Enviar una alerta sin verificar',
          'Cambiar todas las fechas por igual',
        ],
      ],
      [
        'Una recomendación útil incluye:',
        'Alguien debe poder implementar y evaluar la acción.',
        ['Acción, responsable y medida de seguimiento', 'Solo una queja', 'Solo una captura'],
      ],
    ],
    [
      'Los totales por canal no concilian con el ingreso total de habitaciones. ¿Qué haces primero?',
      'Concilia definiciones y registros de origen antes de distribuir conclusiones.',
      [
        'Revisar filtros, estados, impuestos y alcance de fechas del reporte',
        'Publicar el reporte inconsistente',
        'Inventar un ajuste para cuadrarlo',
      ],
    ],
  ],
  meeting: [
    'Convierte el reporte de reunión en decisiones',
    'La reunión semanal de ingresos debe enfocarse en excepciones y decisiones. Las fechas de necesidad tienen demanda esperada débil respecto a objetivos. Las fechas de compresión tienen disponibilidad particularmente limitada. Identifica riesgos, oportunidades, problemas de precio y distribución, y cambios de pronóstico. Presenta evidencia y supuestos y define qué decisión se requiere. Usa la tabla sintética de fechas futuras del Laboratorio de práctica como paquete de reunión.',
    'Problema → evidencia cuantificada → opciones → acción recomendada → plan de seguimiento',
    '15 de noviembre: 850 OTB, +60 Pickup, +80 Pace, BAR de $340 y Pickup neto esperado de 90. La capacidad permite solo 50 habitaciones ocupadas adicionales. Evalúa proteger tarifa y limitar ofertas que diluyan valor. El 18 de noviembre, con 410 OTB y Pickup negativo, requiere validar pérdidas y generar demanda dirigida.',
    'No apliques un cambio tarifario general a fechas de necesidad y de compresión.',
    [
      [
        'Hay 850 habitaciones OTB y capacidad de 900. ¿Cuántas quedan antes de alcanzar el límite?',
        '900 − 850 = 50 habitaciones.',
      ],
      [
        'Una fecha de necesidad suele requerir:',
        'Elige la intervención según la brecha real y su causa.',
        [
          'Investigar brechas de demanda y opciones dirigidas',
          'Descontar automáticamente todas las tarifas',
          'Ignorar los costos',
        ],
      ],
      [
        '¿Qué debe incluir un cambio de pronóstico?',
        'El equipo necesita entender qué impulsa la revisión.',
        [
          'La expectativa anterior y la nueva, con los supuestos que cambiaron',
          'Solo el número nuevo',
          'Una garantía sin sustento',
        ],
      ],
      [
        'Un problema de distribución puede ser:',
        'La configuración del canal puede frenar demanda.',
        [
          'Inventario rentable cerrado en una fecha débil',
          'Cualquier reservación OTA',
          'Un reporte bien conciliado',
        ],
      ],
    ],
    [
      'Ventas propone un grupo con descuento para una fecha de compresión. ¿Qué evidencia necesitas?',
      'Evalúa el desplazamiento de cada noche de estancia e incluye la contribución complementaria relevante.',
      [
        'Contribución de la estancia completa y negocio desplazado',
        'Solo el número de habitaciones del grupo',
        'Solo la ocupación del año pasado',
      ],
    ],
  ],
};
