const { Router } = require('express');

module.exports = (controller) => {
  const router = Router();
  router.get('/', controller.getIndex);
  return router;
};
