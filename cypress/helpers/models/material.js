const prisma = require('../db');

module.exports.deleteMany = prisma.material.deleteMany;
