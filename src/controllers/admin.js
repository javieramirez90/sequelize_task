const { Sequelize, Op } = require('sequelize');
const { Job, Contract, Profile } = require('../model');
const { handleBalanceOperations } = require('../utils/balances');
const sequelize = new Sequelize('sqlite::memory:');

const getBestProfessions = async (req, res) => {
  const { start, end } = req.query;
  let professionsList = [];
  try {
    professionsList = await Profile.findAll(
      {
        group: ['profession'],
        attributes: [
          ['profession', 'balance'],
          [sequelize.literal('sum (balance)'), 'balanceSum']
        ],
        where: {
          [Op.and]: [
            {
              createdAt: {
                [Op.gte]: start ? start : new Date()
              },
            },
            {
              createdAt: {
                [Op.lte]: end ? end : new Date()
              },
            }
          ]
        }
      }
    )
  } catch(error) {
    res.status(501).json({
      error,
      message : 'The operation was not performed',
      data: null
    });
  }

  const normalizedProfessionsList = JSON.parse(JSON.stringify(professionsList));
  if(!normalizedProfessionsList.length) return res.status(401).json({message: 'No professions were found with the search criteria provided'}).end();

  const bestProfession = normalizedProfessionsList.reduce(
    (previousProfession,  profession) => {
      return previousProfession.balanceSum > profession.balanceSum ?
      previousProfession :
      profession
  });

  res.status(200).json({
    data: bestProfession
  });
};

const getBestClients = async (req, res) => {
  const { start, end, limit } = req.query;

  try {
    const bestClientsList = await Job.findAll(
      {
        limit: limit ? limit : 2,
        group: ['ContractId'],
        where: {
          paid: true,
          [Op.and]: [
            {
              createdAt: {
                [Op.gte]: start ? start : new Date()
              },
            },
            {
              createdAt: {
                [Op.lte]: end ? end : new Date()
              },
            }
          ]
        },
        include: [{
          model: Contract,
          attributes: ['status'],
          include: [{
            model: Profile,
            as: 'Client',
            where: {
              type: 'client'
            }
          }]
        }],
        attributes: [
          'ContractId',
          [sequelize.literal('sum (price)'), 'priceSum']
        ],
        order: sequelize.literal('sum (price) DESC')
      }
    )

    if(!bestClientsList.length) return res.status(401).json({message: 'No clients were found with the search criteria provided'}).end();
    res.status(200).json({
      data: bestClientsList
    });
  } catch(error) {
    res.status(501).json({
      error,
      message : 'The operation was not performed',
      data: null
    });
  }

};

module.exports = {
  getBestProfessions,
  getBestClients
};
