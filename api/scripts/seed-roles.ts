import { prisma } from '../src/config/prisma';

const roles = [
  { codigo: 'admin', descricao: 'Administrador', nivel: 100 },
  { codigo: 'gestor', descricao: 'Gestor', nivel: 80 },
  { codigo: 'analista', descricao: 'Analista', nivel: 60 },
  { codigo: 'cliente', descricao: 'Cliente', nivel: 10 },
];

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { codigo: role.codigo },
      update: { descricao: role.descricao, nivel: role.nivel },
      create: role,
    });
  }
  console.log(`Seeded ${roles.length} roles.`);
}

main()
  .catch((err) => {
    console.error('Seed error', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
