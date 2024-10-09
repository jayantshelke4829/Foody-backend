// routes/cartRoutes.js
const express = require('express');
const Cart = require('../models/Cart.js');
const router = express.Router();

// Add item to cart
router.post('/cart', async (req, res) => {
  const { idMeal, strMeal, price, quantity, strMealThumb } = req.body;

  try {
    // Ensure all required fields are provided
    if (!idMeal || !strMeal || !price || !quantity || !strMealThumb) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let cartItem = await Cart.findOne({ idMeal });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ idMeal, strMeal, price, quantity, strMealThumb });
    }

    await cartItem.save();
    const updatedCart = await Cart.find();
    res.json(updatedCart);
  } catch (error) {
    console.error("Error adding item to cart:", error.message); // Log the error message
    res.status(500).json({ error: 'Failed to add item to cart', details: error.message });
  }
});

// Save the cart (optional)
router.post('/save-cart', async (req, res) => {
  const { cart } = req.body;

  try {
    // Ensure the cart data is valid
    if (!cart || !Array.isArray(cart)) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    // Clear existing cart items (optional)
    await Cart.deleteMany(); // Clear existing items if required
    await Cart.insertMany(cart); // Save the new cart

    res.json({ message: 'Cart saved successfully' });
  } catch (error) {
    console.error("Error saving cart:", error.message); // Log the error message
    res.status(500).json({ error: 'Failed to save cart', details: error.message });
  }
});
