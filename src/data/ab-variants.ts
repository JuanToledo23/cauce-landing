export type ABVariant = 'A' | 'B' | 'C';

export const heroVariants: Record<ABVariant, {
  statement: string[];
  subStatement: string;
}> = {
  A: {
    statement: ['Investigamos el problema real.', 'Construimos lo que funciona.'],
    subStatement: 'Donde la tecnología se encuentra con el pensamiento estratégico humano.',
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
