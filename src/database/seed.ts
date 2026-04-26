import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { Employee, EmployeeRole } from '../entities/employee.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3307),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASS ?? 'root1234',
  database: process.env.DB_NAME ?? 'employee_db',
  entities: [Employee],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();

  const repo = dataSource.getRepository(Employee);

  const existing = await repo.findOne({ where: { email: 'admin@clockin.com' } });
  if (existing) {
    console.log('HRD Admin already exists, skipping.');
    await dataSource.destroy();
    return;
  }

  const password = await bcrypt.hash('admin123', 10);

  const admin = repo.create({
    id: uuidv4(),
    nik: 'HRD001',
    full_name: 'HRD Admin',
    email: 'admin@clockin.com',
    password,
    department: 'HR',
    position: 'HRD Manager',
    role: EmployeeRole.HRD_ADMIN,
    is_active: true,
  });

  await repo.save(admin);
  console.log('✅ Default HRD Admin created:');
  console.log('   email   : admin@clockin.com');
  console.log('   password: admin123');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
