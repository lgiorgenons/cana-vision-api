
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const atmosAgroClientId = '1a5845b7-3622-4eaa-9ed3-cec2b25f4aa7';

async function main() {
  console.log('Iniciando a atribuição de cliente padrão para usuários existentes...');

  const result = await prisma.usuario.updateMany({
    where: {
      clienteId: null,
    },
    data: {
      clienteId: atmosAgroClientId,
    },
  });

  console.log(`${result.count} usuários foram atualizados com o clienteId da AtmosAgro.`);
  
  // Also update the metadata in Supabase for existing users
  const usersToUpdate = await prisma.usuario.findMany({
    where: {
      clienteId: atmosAgroClientId,
    }
  });

  // This part requires Supabase Admin SDK if you want to update user_metadata
  // For now, we are only updating the local database.
  // The JWT will contain the correct clienteId if it's in our local DB and we use it from there.
  // The auth middleware fetches from the local DB, so this should be fine.
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro ao executar o script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Script finalizado.');
  });
