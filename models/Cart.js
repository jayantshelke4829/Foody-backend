// models/Cart.js
const mongoose = require('mongoose');

// Cart Schema
const cartSchema = new mongoose.Schema({
  idMeal: String,
  name: String,
  price: Number,
  quantity: Number,
  strMealThumb: String,
  strMeal: String,
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
