import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Create ADMIN user
    await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        password: await bcrypt.hash('admin123', 10),
        role: Role.ADMIN
      }
    });

    // Create MANAGER user
    await prisma.user.upsert({
      where: { email: 'manager@test.com' },
      update: {},
      create: {
        email: 'manager@test.com',
        firstName: 'Manager',
        lastName: 'User',
        password: await bcrypt.hash('manager123', 10),
        role: Role.MANAGER
      }
    });

    // Create regular USER
    await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        email: 'user@test.com',
        firstName: 'Regular',
        lastName: 'User',
        password: await bcrypt.hash('user123', 10),
        role: Role.USER
      }
    });

    console.log('Test users created successfully!');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers(); 