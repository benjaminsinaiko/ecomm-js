const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidUserPassword
} = require('./validators');

const router = express.Router();

// ################
// GET - Signup
// ################
router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

// ################
// POST - Signup
// ################
router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    // Create user in user repo to represent new person
    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });

    // Store id of user inside the user's cookie
    req.session.userId = user.id;

    res.redirect('/admin/products');
  }
);

// ################
// GET - Signout
// ################
router.get('/signout', (req, res) => {
  req.session = null;
  res.send('Your are logged out');
});

// ################
// GET - Signin
// ################
router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

// ################
// POST - Signin
// ################
router.post(
  '/signin',
  [requireEmailExists, requireValidUserPassword],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;

    res.redirect('/admin/products');
  }
);

module.exports = router;
