import type { Decimal } from '@prisma/client/runtime/library';

import type { Geojson } from '@domain/value-objects/geojson.vo';

export type TalhaoStatus = 'ativo' | 'inativo';

export interface Talhao {
  id: string;
  propriedadeId: string | null;
  codigo: string;
  nome: string | null;
  geojson: Geojson | null;
  areaHectares: Decimal | null;
  variedade: string | null;
  safra: string | null;
  status: TalhaoStatus | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}