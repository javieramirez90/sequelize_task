const { Sequelize, Op } = require('sequelize');
const { Job, Contract, Profile } = require('../model');

const depositToClient = async (req, res) => {
  const sequelize = new Sequelize('sqlite::memory:');

  const { userId } = req.params;
  const { amountToPay } = req.body;

  const clientContracts = await Contract.findAll({
    where: {
      ClientId: userId,
      status: {
        [Op.ne]: 'terminated'
      }
    }
  });
  const contractsIdList = [];
  clientContracts.forEach(element => {
    contractsIdList.push(element.id)
  });

  const maxAmountAllowed = await Job.sum('price', { where: { ContractId: contractsIdList } })
    .then(sum => {
      return sum * .25
    })

    if(maxAmountAllowed < amountToPay) {
      res.status(401).json({
        message : 'The operation was not performed because you are not allowed to pay more than 25% of your jobs',
        updated: false,
      });
    }

  try {
    return await sequelize.transaction(async (t) => {
      await Profile.increment(
        { balance: amountToPay },
        { where: { id: userId} },
        {transaction: t}
      )

      res.status(200).json({
        message : `Deposit to id: ${userId} client was made`,
        updated: true,
        error: null
      });
    });
  } catch (error) {
    res.status(501).json({
      error,
      message : 'The operation was not performed',
      updated: false,
    });
  }

};

module.exports = {
  depositToClient
};
