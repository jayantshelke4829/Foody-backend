// routes/cartRoutes.js
const express = require('express');
const Cart = require('../models/Cart.js');
const router = express.Router();

// Get cart items
router.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add item to cart
router.post('/cart', async (req, res) => {
  const { idMeal, name, price, strMeal, quantity, strMealThumb } = req.body;

  try {
    let cartItem = await Cart.findOne({ idMeal });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ idMeal, name, price, strMeal, quantity, strMealThumb });
    }

    await cartItem.save();
    const updatedCart = await Cart.find();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
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
        // Decrease quantity
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        // Remove item if quantity is 0 or less
        await Cart.deleteOne({ idMeal });
      }
      const updatedCart = await Cart.find();
      return res.status(200).json(updatedCart);
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the cart' });
  }
});

// Save the cart (optional)
router.post('/save-cart', async (req, res) => {
  const { cart } = req.body;

  try {
    // Optionally process the cart data (e.g., save to another collection)
    res.json({ message: 'Cart saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save cart' });
  }
});

module.exports = router;
