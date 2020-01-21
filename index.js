const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password confirmation" />
        <input name="passwordConfirmation" placeholder="password" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post('/', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send('Email already used');
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords must match');
  }

  console.log(req.body);
  res.send('Account created!!!');
});

app.listen(port, () => {
  console.log(`Listening on :${port}`);
});
