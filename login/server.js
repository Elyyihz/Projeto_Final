const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./database');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  if (req.session.loggedin) {
    res.send(`Welcome back, ${req.session.username}! <a href='/logout'>Logout</a>`);
  } else {
    res.sendFile(__dirname + '/login.html');
  }
});

app.post('/auth', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (row) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/');
      } else {
        res.send('Incorrect Username and/or Password!');
      }
      res.end();
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
