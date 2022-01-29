const { Router } = require('express');
const { getAllUnpaidJobs, payJob } = require('../controllers/jobs');
const { hasNecessaryBalance } = require('../middleware/hasNecessaryBalance');

const jobsRouter = Router();

jobsRouter.get('/unpaid', getAllUnpaidJobs);
jobsRouter.post('/:job_id/pay', hasNecessaryBalance, payJob);

module.exports = jobsRouter;