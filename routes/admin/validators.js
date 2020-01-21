const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async email => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 }),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .custom((value, { req }) => {
      if (value !== req) {
        throw new Error('Passwords must match');
      }
    })
};
