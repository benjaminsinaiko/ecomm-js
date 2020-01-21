const express = require('express');
const { validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation } = require('./validators');

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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }

    // Create user in user repo to represent new person
    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });

    // Store id of user inside the user's cookie
    req.session.userId = user.id;
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
  res.send(signinTemplate());
});

// ################
// POST - Signup
// ################

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }

  const validPassword = await usersRepo.comparePasswords(user.password, password);

  if (!validPassword) {
    return res.send('Invalid password');
  }

  req.session.userId = user.id;

  res.send(`You are signed in as ${user.email}`);
});

module.exports = router;
