const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const contractsRouter = require('./routes/contracts');
const jobsRouter = require('./routes/jobs');
const balancesRouter = require('./routes/balances');
const adminRouter = require('./routes/admin');

const apiRoutes = {
  contracts: '/contracts',
  jobs: '/jobs',
  balances: '/balances',
  admin: '/admin'
};

app.use(apiRoutes.contracts, contractsRouter);
app.use(apiRoutes.jobs, jobsRouter);
app.use(apiRoutes.balances, balancesRouter);
app.use(apiRoutes.admin, adminRouter);

module.exports = app;
