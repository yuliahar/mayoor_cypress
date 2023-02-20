const prisma = require('../db');

module.exports.deleteMany = prisma.customer.deleteMany;
