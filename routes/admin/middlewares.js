const { validationResult } = require('express-validator');

module.exports = {
  handleErrors(templateFunc, getProduct) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let product = {};
        if (getProduct) product = await getProduct(req);
        return res.send(templateFunc({ errors, ...product }));
      }

      next();
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin');
    }

    next();
  }
};
