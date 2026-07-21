const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
  const orgs = await prisma.organization.findMany({ select: { id: true, name: true } });
  const branches = await prisma.branch.findMany({ select: { id: true, name: true, organizationId: true } });
  console.log('=== DATABASE DUMP ===');
  console.log('USERS:', users);
  console.log('ORGS:', orgs);
  console.log('BRANCHES:', branches);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
