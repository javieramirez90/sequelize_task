const { Router } = require('express');
const { getAllContracts, getContractById } = require('../controllers/contracts');
const { getProfile } = require('../middleware/getProfile');

const contractsRouter = Router();

contractsRouter.get('/', getProfile, getAllContracts);
contractsRouter.get('/:id', getProfile, getContractById);

module.exports = contractsRouter;