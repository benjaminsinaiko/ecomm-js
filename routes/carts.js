const express = require('express');
const cartsRepo = require('../repositories/carts');

const router = express.Router();

// ################
// POST - Add item
// ################
router.post('/cart/products', async (req, res) => {
  // Find cart or create
  let cart;
  if (!req.session.cartId) {
    // No cart - create one, add to session
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // We have a cart, get it from repo
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  console.log(cart);
  res.send('Product added to cart');
});

// ################
// GET - Show cart
// ################

// ################
// POST - Delete item
// ################
module.exports = router;
