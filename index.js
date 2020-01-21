const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['WAi7hwjj']
  })
);
app.use(authRouter);

app.listen(port, () => {
  console.log(`Listening on :${port}`);
});
