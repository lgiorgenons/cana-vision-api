import type { Decimal } from '@prisma/client/runtime/library';

export interface Propriedade {
  id: string;
  clienteId: string | null;
  nome: string;
  codigoInterno: string;
  codigoSicar: string | null;
  // geojson: unknown | null;
  areaHectares: Decimal | null;
  culturaPrincipal: string | null;
  safraAtual: string | null;
  // metadata: unknown | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}