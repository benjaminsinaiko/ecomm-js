const express = require('express');

const router = express.Router();

// ################
// POST - Add item
// ################
router.post('/cart/products', (req, res) => {
  console.log(req.body.productId);

  res.send('Product added to cart');
});

// ################
// GET - Show cart
// ################

// ################
// POST - Delete item
// ################
module.exports = router;
