import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const role = await prisma.role.findUnique({
    where: { name: 'super_admin' },
  });

  const passwordHash = await bcrypt.hash('Yazzy&yanny09', 10);

  await prisma.user.upsert({
    where: { email: 'oscar@iscproject.org' },
    update: {},
    create: {
      first_name: 'Oscar',
      last_name: 'Admin',
      email: 'oscar@iscproject.org',
      password_hash: passwordHash,
      role_id: role!.id,
      is_active: true,
      email_verified: true,
    },
  });

  console.log('✅ Super Admin created');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });