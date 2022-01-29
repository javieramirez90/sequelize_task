const { Router } = require('express');
const { getBestProfessions, getBestClients } = require('../controllers/admin');
const { getProfessionsList } = require('../middleware/getProfessionsList');

const adminRouter = Router();

adminRouter.get('/best-profession', getProfessionsList, getBestProfessions);
adminRouter.get('/best-clients', getBestClients);

module.exports = adminRouter;
