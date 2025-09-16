const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Test counting brokers
    const brokerCount = await prisma.broker.count();
    console.log(`📊 Current broker count: ${brokerCount}`);

    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('Ready to run import pipeline');
  } else {
    console.log('Check database configuration');
  }
});