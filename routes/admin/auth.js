const express = require('express');
const usersRepo = require('../../repositories/users');

const router = express.Router();

// ################
// GET - Signup
// ################

router.get('/signup', (req, res) => {
  res.send(`
    <div>
    Your id is: ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

// ################
// POST - Signup
// ################

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send('Email already used');
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords must match');
  }

  // Create user in user repo to represent new person
  const user = await usersRepo.create({ email, password });

  // Store id of user inside the user's cookie
  req.session.userId = user.id;

  res.send('Account created!!!');
});

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
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `);
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
