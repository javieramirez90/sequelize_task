const { Op } = require('sequelize');

const hasNecessaryBalance = async (req, res, next) => {
  const { Profile, Job } = req.app.get('models');
  const { job_id } = req.params;

  const client = await Profile.findOne({where: {id: req.get('profile_id') || 0}})
  const jobToPay =  await Job.findOne({ where: { id: job_id } });
  if(!client) return res.status(401).json({message: 'Unathorized. Contact the administrator.'}).end();
  if(!jobToPay) return res.status(404).json({message: 'Job not found'}).end();
  if(client.balance < jobToPay.price) return res.status(400).json({message: 'insufficient balance'}).end();
  req.client = client;
  req.job = jobToPay;
  next()
}

module.exports = {
  hasNecessaryBalance
};
