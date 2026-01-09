import { z } from 'zod';

export const createPropriedadeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigoInterno: z.string().min(1, 'Código interno é obrigatório'),
  codigoSicar: z.string().optional(),
  geojson: z.any().optional(), // Adjust validation as needed for GeoJSON structure
  areaHectares: z.number().optional(),
  culturaPrincipal: z.string().optional(),
  safraAtual: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updatePropriedadeSchema = createPropriedadeSchema.partial();

export const paramsIdSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const paramsPropriedadeIdSchema = z.object({
  propriedadeId: z.string().uuid('ID da propriedade inválido'),
});

export type CreatePropriedadeDto = z.infer<typeof createPropriedadeSchema>;
export type UpdatePropriedadeDto = z.infer<typeof updatePropriedadeSchema>;