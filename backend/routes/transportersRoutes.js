const express = require('express');
const router = express.Router();
const Transporter = require('../models/Transporter');

router.post('/register', async (req, res) => {
  try {
    const transporter = new Transporter(req.body);
    await transporter.save();
    res.json({ success: true, transporter });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { route } = req.query;
    const query = route ? { route } : {};
    const transporters = await Transporter.find(query);
    res.json(transporters);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;