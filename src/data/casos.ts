export interface CasoEstudio {
  id: string;
  cliente: string;
  sector: string;
  track: 'A' | 'B' | 'ambos';
  resultado: string;
  descripcion: string;
  testimonio?: {
    texto: string;
    nombre: string;
    cargo: string;
    empresa: string;
  };
  imagen?: string;
  publicado: boolean;
}

export const casos: CasoEstudio[] = [];
// Al agregar el primer caso: cambiar publicado: true y hacer deploy.
// El componente PruebaSocial.astro lo consume sin cambios en el componente.
