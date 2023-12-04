const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000;

require('./utils/db');
const Contact = require('./model/contact');

// Setup method-override
app.use(methodOverride('_method'));

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

// Add contact data
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Form tambah data',
    layout: 'layouts/main-layout',
  });
});

// Process the data input
app.post('/contact', [
  body('nama').custom(async (value) => {
    const duplikat = await Contact.findOne({ nama: value });
    if (duplikat) {
      throw new Error('Nama sudah ada');
    }
    return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('nohp', 'nohp tidak valid!').isMobilePhone('id-ID'),

], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('add-contact', {
      title: 'Add Contacts',
      layout: 'layouts/main-layout',
      errors: errors.array(),
    });
  } else {
    Contact.insertMany(req.body, (error, result) => {
    // Send Flash Message
      req.flash('msg', 'Data berhasil ditambahkan!');
      res.redirect('/contact');
    });
  }
});

// Delete contact
// app.get('/contact/:nama', async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });

//   if (!contact) {
//     res.status(404);
//     res.send('<h1>404</h1>');
//   } else {
//     Contact.deleteOne({ _id: contact._id }).then((result) => {
//       // Send Flash Message
//       req.flash('msg', 'Data berhasil dihapus!');
//       res.redirect('/contact');
//     });
//   }
// });

// Delete Contact with delete method
app.delete('/contact', (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    // Send Flash Message
    req.flash('msg', 'Data berhasil dihapus!');
    res.redirect('/contact');
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
