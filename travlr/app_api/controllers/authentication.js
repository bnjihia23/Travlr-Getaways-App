const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

// POST /register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = new User({ name, email });
    user.setPassword(password);
    await user.save();

    const token = user.generateJWT();
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(400).json(err);
  }
};

// POST /login
const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err)  return res.status(404).json(err);
    if (user) {
      const token = user.generateJWT();
      return res.status(200).json({ token });
    } else {
      return res.status(401).json(info);
    }
  })(req, res);
};

module.exports = { register, login };
