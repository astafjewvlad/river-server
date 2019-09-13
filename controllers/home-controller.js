class HomeController {
  constructor(repositories) {
    this.repositories = repositories;
  }

  getIndex(req, res) {
    (async (repositories) => {
      const about = await repositories.pageInfo.getAboutOr({});
      const socialLinks = await repositories.pageInfo.getSocialLinksOr({});
      const tracks = await repositories.tracks.getAllOr({});
      res.render('index', {
        tracks,
        about,
        socialLinks,
      });
    })(this.repositories);
  }
}

module.exports = (repositories) => {
  const homeController = new HomeController(repositories);
  return {
    getIndex: homeController.getIndex.bind(homeController),
  };
};
