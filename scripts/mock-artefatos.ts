import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PROPRIEDADE_ID = '8cc63dfa-42c9-4b84-a950-72077b283435';

async function main() {
  console.log('--- Iniciando Mock de Artefatos Diretos para Propriedade 8cc63dfa ---');

  // 1. Criar os artefatos vinculados DIRETAMENTE à propriedade
  const artefatos = [
    {
      tipo: 'geotiff' as const,
      indice: 'NDVI_TOTAL',
      caminho: 'sentinel2/fazenda_toda_ndvi.tif',
      propriedadeId: PROPRIEDADE_ID,
      metadata: { sensor: 'Sentinel-2', escala: 'fazenda_completa', data: new Date().toISOString() }
    },
    {
      tipo: 'geotiff' as const,
      indice: 'RGB_TOTAL',
      caminho: 'sentinel2/fazenda_toda_rgb.tif',
      propriedadeId: PROPRIEDADE_ID,
      metadata: { sensor: 'Sentinel-2', escala: 'fazenda_completa' }
    }
  ];

  for (const art of artefatos) {
    await prisma.artefato.create({
      data: art
    });
    console.log(`Artefato ${art.indice} (Fazenda Toda) criado.`);
  }

  console.log('--- Mock concluído com sucesso! ---');
}

main()
  .catch((e) => {
    console.error('Erro ao criar mocks:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
