const { urlencoded } = require('express');
const express = require('express');
const path = require('path');
const dbcon = require('./dbcon')
const cookieParser = require('cookie-parser')
const app = express();
const publicPath = path.join(__dirname, "public");

// middlewares
app.use(express.static(publicPath));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    res.render('logout');
  } else {
    res.render('login');
  }
});

app.post('/login', (req, res) => {

  
  const expiresInMs = 60 * 1000; // 1 minute
  const expirationDate = new Date(Date.now() + expiresInMs);
  
  res.cookie('token', 'iamhere', {
    httpOnly: true,
    expires: expirationDate,
  });
  
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.redirect('/');
});

app.get('/success', (req, res) => {
  res.render('success');
});

app.post('/submit', async (req, res) => {
  const { name, email, date, rollno } = req.body;
  const data = new dbcon({ name, email, date, rollno });
  const result = await data.save();
  res.redirect('/success');
});

app.listen(5500);
