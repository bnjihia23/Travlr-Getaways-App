// app_server/models/seed.js
require('./db');                  // initialize DB connection
const Trip = require('./travlr'); // your model
const fs = require('fs');

const trips = JSON.parse(fs.readFileSync('./app_server/data/trips.json', 'utf8'));

const seedDB = async () => {
  try {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
    console.log(`Seeded ${trips.length} trip(s).`);
  } catch (err) {
    console.error(err);
  } finally {
    const mongoose = require('mongoose');
    mongoose.connection.close();
  }
};

seedDB();
