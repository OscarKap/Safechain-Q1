import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles: RoleName[] = [
    RoleName.super_admin,
    RoleName.admin,
    RoleName.responder,
    RoleName.gbv_officer,
    RoleName.counsellor,
    RoleName.developer,
  ];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `${roleName} role`,
      },
    });
  }

  console.log('✅ Default roles seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });