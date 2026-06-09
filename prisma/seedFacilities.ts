import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.resolve(__dirname, 'data', 'facilities.json');
  const raw = readFileSync(filePath, 'utf-8');
  const facilities: Array<{
    name: string;
    type: 'clinic' | 'hospital' | 'shelter' | 'responder_hub';
    province: string;
    district: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    phone?: string | null;
    is_active?: boolean;
  }> = JSON.parse(raw);

  for (const f of facilities) {
    await prisma.facility.upsert({
      where: { name: f.name },
      update: {
        type: f.type as any,
        province: f.province,
        district: f.district,
        address: f.address ?? null,
        latitude: f.latitude ?? null,
        longitude: f.longitude ?? null,
        phone: f.phone ?? null,
        is_active: f.is_active ?? true,
      },
      create: {
        name: f.name,
        type: f.type as any,
        province: f.province,
        district: f.district,
        address: f.address ?? null,
        latitude: f.latitude ?? null,
        longitude: f.longitude ?? null,
        phone: f.phone ?? null,
        is_active: f.is_active ?? true,
      },
    });
  }
  console.log(`✅ Seeded ${facilities.length} facilities`);
}

main()
  .catch((e) => {
    console.error('❌ Facility seeding error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
