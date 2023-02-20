const prisma = require('../db');

module.exports.deleteMany = prisma.orderItem.deleteMany;
