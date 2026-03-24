/**
 * Seed script — imports CSV dataset under admin account
 * Run: npx tsx src/seed.ts
 */
import { prisma } from '@gigforge/db';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

interface CsvRow {
  job_id: string;
  job_title: string;
  job_type: string;
  required_skills: string;
  location: string;
  experience_level: string;
  pay_type: string;
  pay_amount: string;
  category: string;
  underserved_focus: string;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split('\n');
  const headers = lines[0]!.split(',');
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] ?? '').trim();
    });
    rows.push(row as unknown as CsvRow);
  }
  return rows;
}

function buildDescription(row: CsvRow): string {
  const skills = row.required_skills.split('|').join(', ');
  return `${row.job_title} (${row.job_type}) — ${row.category}\n\nRequired Skills: ${skills}\nExperience Level: ${row.experience_level}\nPay: ${row.pay_type} — ₹${Number(row.pay_amount).toLocaleString('en-IN')}\n${row.underserved_focus === 'Yes' ? '🎯 Underserved community focus' : ''}`;
}

async function seed() {
  console.log('🌱 Starting seed...\n');

  // 1. Create admin user (vedantkhanna1711@gmail.com / 123vk123 / vkool)
  const adminEmail = 'vedantkhanna1711@gmail.com';
  const adminPassword = '123vk123';
  const adminName = 'Vedant Khanna';
  const companyName = 'vkool';

  let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!adminUser) {
    const hash = await bcrypt.hash(adminPassword, 12);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hash,
        name: adminName,
        role: 'CLIENT',
        clientProfile: {
          create: { companyName, location: 'India', bio: 'vkool — Tech gig platform admin' },
        },
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: adminUser.id },
  });
  if (!clientProfile) {
    throw new Error('Admin client profile not found');
  }

  // 2. Read and parse CSV
  const csvPath = path.resolve(__dirname, '../../../tech_gig_jobs_dataset_CLEAN_FINAL_INR.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV not found at: ${csvPath}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCsv(csvContent);
  console.log(`📊 Parsed ${rows.length} jobs from CSV\n`);

  // 3. Delete existing gigs from admin (re-seed)
  const deleted = await prisma.gig.deleteMany({
    where: { clientId: clientProfile.id },
  });
  console.log(`🗑️  Cleared ${deleted.count} existing admin gigs\n`);

  // 4. Seed gigs
  let created = 0;
  for (const row of rows) {
    const skills = row.required_skills.split('|').map((s) => s.trim().toLowerCase());
    const payAmount = parseInt(row.pay_amount) || 0;
    const isRemote = row.location.toLowerCase() === 'remote';

    await prisma.gig.create({
      data: {
        title: row.job_title,
        description: buildDescription(row),
        skills: JSON.stringify(skills),
        location: row.location,
        isRemote,
        budgetMin: payAmount,
        budgetMax: payAmount,
        status: 'OPEN',
        category: row.category,
        experienceLevel: row.experience_level,
        jobType: row.job_type,
        payType: row.pay_type,
        clientId: clientProfile.id,
      },
    });
    created++;
  }

  console.log(`✅ Created ${created} gigs under ${companyName} (${adminEmail})\n`);

  // 5. Also create a test freelancer if not exists
  const freelancerEmail = 'alice@test.com';
  let freelancer = await prisma.user.findUnique({ where: { email: freelancerEmail } });
  if (!freelancer) {
    const hash = await bcrypt.hash('Test12345', 12);
    freelancer = await prisma.user.create({
      data: {
        email: freelancerEmail,
        passwordHash: hash,
        name: 'Alice Developer',
        role: 'FREELANCER',
        freelancerProfile: {
          create: {
            skills: JSON.stringify(['react', 'typescript', 'python', 'node.js', 'sql']),
            location: 'Bangalore',
            hourlyRate: 2500,
            bio: 'Full-stack developer with 3+ years experience',
          },
        },
      },
    });
    console.log(`✅ Test freelancer created: ${freelancerEmail} / Test12345`);
  } else {
    console.log(`ℹ️  Test freelancer already exists: ${freelancerEmail}`);
  }

  console.log('\n🎉 Seed complete!');
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
