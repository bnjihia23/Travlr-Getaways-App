const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const ctrlTrips = require('../controllers/trips');
const authController = require('../controllers/authentication');

// JWT middleware to protect mutating routes
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
    if (err) return res.status(401).json('Token Validation Error!');
    req.auth = verified;
    next();
  });
}

// Trips
router
  .route('/trips')
  .get(ctrlTrips.tripsList)
  .post(authenticateJWT, ctrlTrips.tripsAdd);

router
  .route('/trips/:tripCode')
  .get(ctrlTrips.tripsFindByCode)
  .put(authenticateJWT, ctrlTrips.tripsUpdate)
  .delete(authenticateJWT, ctrlTrips.tripsDelete);

// Auth
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
