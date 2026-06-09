import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: {
      name: 'super_admin',
      description: 'Full system access',
    },
  });

  console.log('✅ Roles seeded');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });