const { Op } = require('sequelize');
const { Contract } = require('../model');

const getAllContracts = async (req, res) => {
  const { profile } = req;
  try {
    const contracts = await Contract.findAll({
      where: {
        status: {
          [Op.not]: 'terminated'
        },
        [Op.or]: [
          { ContractorId: profile.id },
          { ClientId: profile.id }
        ]
      }
    });
    if(!contracts.length) return res.status(201).json({message: 'No assigned contracts found'}).end();
    res.status(200).json({data: { contracts }});
  } catch(error) {
    res.status(501).json({error});
  }
};

const getContractById = async (req, res) => {
  const { id } = req.params;
  const { profile } = req;
  try {
    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: [
          { ContractorId: profile.id },
          { ClientId: profile.id }
        ]
      }
    });
    if(!contract) return res.status(401).json({message: 'Unathorized. Contact the administrator.'}).end();
    res.json({data: contract});
  } catch(error) {
    res.status(501).json({error});
  }
};

module.exports = {
  getAllContracts,
  getContractById
};
