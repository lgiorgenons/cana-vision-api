import { z } from 'zod';

export const createTalhaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  propriedadeId: z.string().uuid('ID de propriedade inválido'),
  geojson: z.any().optional(),
  areaHectares: z.number().optional(),
  cultura: z.string().optional(),
  safra: z.string().optional(),
  variedade: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateTalhaoSchema = createTalhaoSchema.partial();

export type CreateTalhaoDto = z.infer<typeof createTalhaoSchema>;
export type UpdateTalhaoDto = z.infer<typeof updateTalhaoSchema>;
