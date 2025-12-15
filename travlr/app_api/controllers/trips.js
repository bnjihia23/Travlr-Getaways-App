const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

// GET all trips
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({});
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving trips', error: err });
  }
};

// GET trip by code
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.findOne({ code: req.params.tripCode });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Error finding trip', error: err });
  }
};

// POST create trip
const tripsAdd = async (req, res) => {
  try {
    const body = req.body || {};
    const created = await Trip.create({
      code: body.code,
      name: body.name,
      length: body.length,        
      start: body.start,          
      resort: body.resort,
      perPerson: body.perPerson, 
      image: body.image,
      description: body.description || []
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: 'Error creating trip', error: err?.message });
  }
};

// PUT update trip
const tripsUpdate = async (req, res) => {
  try {
    const updated = await Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        $set: {
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description || []
        }
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating trip', error: err?.message });
  }
};

// DELETE trip
const tripsDelete = async (req, res) => {
  try {
    const deleted = await Trip.findOneAndDelete({ code: req.params.tripCode });
    if (!deleted) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(deleted);
  } catch (err) {
    res.status(400).json({ message: 'Error deleting trip', error: err?.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAdd,
  tripsUpdate,
  tripsDelete
};
