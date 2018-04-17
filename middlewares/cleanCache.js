const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // waits for the route to execute first
  await next();

  clearHash(req.user.id);
};
