const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/db_learn', {
  useCreateIndex: true,
});

// Make contact object instance
// const contact1 = new Contact(
//   {
//     nama: 'Messi',
//     nohp: '08982921811',
//     email: 'messi@gmail.com',
//   },
// );

// Add contact data
// contact1.save().then((contact) => console.log(contact));
