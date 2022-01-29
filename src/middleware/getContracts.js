const { Op } = require('sequelize');

const getActiveContracts = async (req, res, next) => {
  const { Contract } = req.app.get('models')
  const contracts = await Contract.findAll({
    where: {
      status: {
        [Op.ne]: 'terminated'
      }
    }
  });
  if(!contracts.length) return res.status(401).end()
  req.contracts = contracts
  next()
}

module.exports = {
  getActiveContracts
}
