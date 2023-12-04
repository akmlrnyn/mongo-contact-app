const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000;

require('./utils/db');
const Contact = require('./model/contact');

// Setup EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded({
  extended: true,
}));

// Configure flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: {
    maxAge: 6000,
  },
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

// Home page
app.get('/', (req, res) => {
  const students = [{
    name: 'Akmal Faiq',
    email: 'akmalranyan@gmail.com',
  },
  {
    name: 'Faiq Akmal',
    email: 'faaiw@gmail.com',
  },
  {
    name: 'Ranyan',
    email: 'ranyan@gmail.com',
  },
  ];
  res.render('index', {
    layout: 'layouts/main-layout.ejs',
    students,
    nama: 'Akmal',
    header: 'ExpressJS',
  });
});

// About page
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout.ejs',
    nama: 'Akmal',
    header: 'ExpressJS - About Page',
  });
});

// Contact page
app.get('/contact', async (req, res) => {
  const contacts = await Contact.find();
  res.render('contact', {
    contacts,
    layout: 'layouts/main-layout.ejs',
    nama: 'Akmal',
    header: 'ExpressJS - Contact Page',
    msg: req.flash('msg'),
  });
});

// Detail contact
app.get('/contact/:nama', (req, res) => {
  const contact = Contact.findOne({ nama: req.params.nama });
  res.render('detail', {
    contact,
    layout: 'layouts/main-layout.ejs',
    header: 'ExpressJS - Contact Page',
  });
});

app.listen(port, () => {
  console.log(`Mongo Contact App | Listening at http://localhost:${port}`);
});
