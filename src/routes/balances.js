const { Router } = require('express');
const { depositToClient } = require('../controllers/balances');
const { getProfile } = require('../middleware/getProfile');

const balancesRouter = Router();

balancesRouter.post('/deposit/:userId', getProfile, depositToClient);

module.exports = balancesRouter;
