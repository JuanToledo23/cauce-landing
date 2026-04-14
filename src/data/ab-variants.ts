export type ABVariant = 'A' | 'B' | 'C';

export const heroVariants: Record<ABVariant, {
  statement: string[];
  subStatement: string;
}> = {
  A: {
    statement: ['Desde tu primer sitio web hasta tu producto digital.', 'Lo que necesitas, cuando lo necesitas.'],
    subStatement: 'Trabajamos con negocios de todos los tamaños. Un sitio profesional en 2 semanas o un MVP en 6. El proceso es siempre el mismo: primero entender, luego construir.',
  },
  B: {
    // H04 (Var B): ajustada para incluir Track B — sin mencionar "agencia"
    statement: ['Menos promesas.', 'Más resultado para tu negocio.'],
    subStatement: 'Research profundo. Diseño y desarrollo en un equipo. Entregas en semanas.',
  },
  C: {
    statement: ['Estrategia, diseño y código.', 'Un solo equipo. Sin intermediarios.'],
    subStatement: 'Llevamos tu proyecto del diagnóstico al resultado. En semanas.',
  },
};
