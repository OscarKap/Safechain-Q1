import { PrismaClient, FacilityType } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * Expected file format (markdown):
 *   ### Province Name
 *   **District Name**
 *   *   Facility One
 *   *   Facility Two
 *   ...
 */
const prisma = new PrismaClient();

function parseFacilities(raw: string) {
  const lines = raw.split(/\r?\n/).map(l => l.trim());
  const facilities: Array<{
    name: string;
    type: FacilityType; // default to 'clinic' – you can adjust manually later
    province: string;
    district: string;
  }> = [];

  let currentProvince = '';
  let currentDistrict = '';

  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith('###')) {
      currentProvince = line.replace(/^###\s*/, '').trim();
    } else if (line.startsWith('**') && line.endsWith('**')) {
      // District heading, e.g. **Chibombo District**
      currentDistrict = line.replace(/^\*\*/, '').replace(/\*\*$/,'').trim();
    } else if (line.startsWith('*')) {
      const name = line.replace(/^\*\s*/, '').trim();
      if (name) {
        facilities.push({
          name,
          type: 'clinic', // default – you can change after import if needed
          province: currentProvince,
          district: currentDistrict,
        });
      }
    }
  }
  return facilities;
}

async function main() {
  const filePath = path.resolve(__dirname, 'facilities.txt');
  const raw = readFileSync(filePath, 'utf-8');
  const facilities = parseFacilities(raw);

  for (const f of facilities) {
    await prisma.facility.upsert({
      where: { name: f.name },
      update: {
        type: f.type as any,
        province: f.province,
        district: f.district,
      },
      create: {
        name: f.name,
        type: f.type as any,
        province: f.province,
        district: f.district,
      },
    });
  }

  console.log(`✅ Seeded ${facilities.length} facilities from text file`);
}

main()
  .catch(e => {
    console.error('❌ Error seeding facilities', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
