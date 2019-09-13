const tracksRepository = require('../repos/tracks-repository');
const pageInfoRepository = require('../repos/pageInfo-repository');

async function getOr(promise, orDefault = {}) {
  try {
    const value = await promise;
    return value;
  } catch (e) {
    return orDefault;
  }
}


async function getIndex(req, res) {
  const about = await getOr(pageInfoRepository.getAbout, {});
  const socialLinks = await getOr(pageInfoRepository.getSocialLinks, {});
  const tracks = await getOr(tracksRepository.getAll, {});
  res.render('index', {
    tracks,
    about,
    socialLinks,
  });
}

module.exports = {
  getIndex,
};
