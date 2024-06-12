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

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, 10);

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
      if (err) {
        console.error('Erro ao criar usuário:', err);
        return res.status(500).send('Erro ao criar usuário');
      }
      res.redirect('/login');
    });
  } catch (error) {
    console.error('Erro ao processar cadastro:', error);
    res.status(500).send('Erro ao processar cadastro');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    try {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).send('Erro ao buscar usuário');
      }
      if (!row) {
        return res.status(401).send('Usuário ou senha incorretos');
      }
      const match = await bcrypt.compare(password, row.password);
      if (match) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/dashboard');
      } else {
        res.status(401).send('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro ao processar login:', error);
      res.status(500).send('Erro ao processar login');
    }
  });
});

app.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.send(`Bem-vindo, ${req.session.username}! <a href='/logout'>Logout</a>`);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.use((err, req, res, next) => {
  console.error('Erro no middleware:', err.stack);
  res.status(500).send('Algo deu errado!');
});

app.listen(3000, () => {
  console.log('Servidor iniciado em http://localhost:3000');
});
