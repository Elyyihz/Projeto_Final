const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./database');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Rota para a página de cadastro
app.get('/register', (req, res) => {
  res.render('register');
});

// Rota para processar o cadastro
app.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = await bcrypt.hash(req.body.password, 10);

  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
    if (err) {
      return res.send('Erro ao criar usuário');
    }
    res.redirect('/login');
  });
});

// Rota para a página de login
app.get('/login', (req, res) => {
  res.render('login');
});

// Rota para processar o login
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err || !row) {
      return res.send('Usuário ou senha incorretos');
    }
    const match = await bcrypt.compare(password, row.password);
    if (match) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/dashboard');
    } else {
      res.send('Usuário ou senha incorretos');
    }
  });
});

// Rota para a página de dashboard (após login)
app.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.send(`Bem-vindo, ${req.session.username}! <a href='/logout'>Logout</a>`);
  } else {
    res.redirect('/login');
  }
});

// Rota para logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(3000, () => {
  console.log('Servidor iniciado em http://localhost:3000');
});
