const getProfessionsList = async (req, res, next) => {
  const { Profile } = req.app.get('models');
  const profiles = await Profile.findAll();
  const professionsRawList = profiles.map(profile => profile.profession);
  professionsUniqueList = new Set(professionsRawList);
  req.professionsList = professionsUniqueList;
  next()
};

module.exports = {
  getProfessionsList
}
