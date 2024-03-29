const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost:27017/doctor')
  .then(() => app.listen(port, () => console.log(`Server running at http://localhost:${port}/`)))
  .catch(err => {
    console.error('Unable to connect to the database', err);
    process.exit(1);
  });

module.exports = mongoose;
