const prisma = require('../db');

module.exports.deleteMany = prisma.order.deleteMany;
