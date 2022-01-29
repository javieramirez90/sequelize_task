const { Sequelize, Op } = require('sequelize');
const { Job, Contract, Profile } = require('../model');
const { handleBalanceOperations } = require('../utils/balances');

const getAllUnpaidJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: {
        model: Contract,
        attributes: ['status'],
        where: {
          status: {
            [Op.ne]: 'terminated'
          }
        }
      },
      where: {
        paid: {
          [Op.not]: true
        }
      }
    });
    if(!jobs.length) return res.status(201).json({message: 'No jobs found'}).end();
    res.status(200).json({data: { jobs }});
  } catch(error) {
    res.status(501).json({ error });
  }
};

const payJob = async (req, res) => {
  const sequelize = new Sequelize('sqlite::memory:');
  const { client, job } = req;

  const relatedContract = await Contract.findOne({
    where: {
      id: job.ContractId
    },
    include: {
      model: Profile,
      as: 'Contractor',
      attributes: ['id', 'balance'],
      where: {
        type: {
          [Op.eq]: 'contractor'
        }
      }
    }
  });

  const clientNewBalance = handleBalanceOperations(
    client.balance,
    job.price,
    'pay'
  );
  const contractorNewBalance = handleBalanceOperations(
    relatedContract.Contractor.balance,
    job.price,
    'toBePayed'
  );
  try {
    return await sequelize.transaction(async (t) => {
      await Profile.update(
        { balance: clientNewBalance },
        { where: { id: client.id} },
        { transaction: t }
      )
      await Profile.update(
        { balance: contractorNewBalance },
        { where: { id: relatedContract.Contractor.id} },
        { transaction: t }
      )
      await Job.update(
        { paid: true, paymentDate: new Date() },
        { where: { id: job.id} },
        { transaction: t }
      )
      res.status(200).json({
        message : `Payment was made for the job id ${job.id}`,
        updated: true,
        error: null
      });
    })
  } catch(error) {
    res.status(501).json({
      error,
      message : 'The operation was not performed',
      updated: false,
      data: null
    });
  }
};

module.exports = {
  getAllUnpaidJobs,
  payJob
};
