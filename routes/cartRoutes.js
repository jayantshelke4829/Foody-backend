const express = require('express');
const Cart = require('../models/Cart.js');
const router = express.Router();

// Get cart items
router.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add item to cart
router.post('/cart', async (req, res) => {
  const { idMeal, strMeal, price, quantity, strMealThumb } = req.body;

  console.log("Received Request Body:", req.body); // Log the request body for debugging

  try {
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
    console.error("Error adding item to cart:", error); // Log the full error object
    res.status(500).json({ error: 'Failed to add item to cart', details: error.message });
  }
});

// Remove item from cart
router.delete('/cart/:idMeal', async (req, res) => {
  const { idMeal } = req.params;

  try {
    await Cart.deleteOne({ idMeal });
    const updatedCart = await Cart.find();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Update cart item quantity
router.patch('/cart/:idMeal', async (req, res) => {
  const { idMeal } = req.params;
  const { quantity } = req.body;

  try {
    const cartItem = await Cart.findOne({ idMeal });

    if (cartItem) {
      if (cartItem.quantity > 1 && quantity < 0) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        await Cart.deleteOne({ idMeal });
      }
      const updatedCart = await Cart.find();
      return res.status(200).json(updatedCart);
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update the cart' });
  }
});

module.exports = router;
