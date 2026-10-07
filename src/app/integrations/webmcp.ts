export function registerLearningTools(read: () => unknown) {
  const context = (
    document as Document & {
      modelContext?: {
        registerTool: (tool: unknown, options: { signal: AbortSignal }) => void | Promise<void>;
      };
    }
  ).modelContext;
  if (!context?.registerTool) return () => {};
  const lifecycle = new AbortController();
  try {
    void Promise.resolve(
      context.registerTool(
        {
          name: 'read_learning_progress',
          title: 'Consultar progreso de aprendizaje',
          description:
            'Consulta el dominio por tema y las lecciones completadas del perfil local. No envía respuestas ni modifica el progreso.',
          inputSchema: { type: 'object', properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          execute(input: unknown) {
            if (
              input === null ||
              typeof input !== 'object' ||
              Array.isArray(input) ||
              Object.keys(input).length
            )
              throw new Error('Se esperaba un objeto vacío.');
            return read();
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
  } catch {
    /* Optional browser integration must not block learning. */
  }
  return () => lifecycle.abort();
}
