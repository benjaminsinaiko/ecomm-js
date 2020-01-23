const express = require('express');

const router = express();

// ################
// GET - Products
// ################
router.get('/', async (req, res) => {
  res.send('Products page');
});

module.exports = router;
