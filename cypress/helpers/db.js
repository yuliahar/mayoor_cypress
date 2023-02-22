const { PrismaClient } = require('@prisma/client');

// module.exports = new PrismaClient({ log: ['query', 'info'] });
module.exports = new PrismaClient({ log: ['error'] });
