const express = require('express');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsIndexTemplate = require('../../views/admin/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ################
// GET - All products
// ################
router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

// ################
// GET - Add new product
// ################
router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

// ################
// POST - Add new Product
// ################
router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString('base64') || '';
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.redirect('/admin/products');
  }
);

module.exports = router;
