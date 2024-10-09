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
// Add item to cart
router.post('/cart', async (req, res) => {
  const { idMeal, strMeal, price, quantity, strMealThumb } = req.body; // Ensure these fields match your frontend

  try {
    let cartItem = await Cart.findOne({ idMeal });

    if (cartItem) {
      cartItem.quantity += quantity; // Update quantity if item already exists
    } else {
      // Create a new cart item
      cartItem = new Cart({ idMeal, strMeal, price, quantity, strMealThumb });
    }

    await cartItem.save();
    const updatedCart = await Cart.find(); // Fetch updated cart after saving
    res.json(updatedCart); // Respond with updated cart
  } catch (error) {
    console.error("Error adding item to cart:", error); // Log error for debugging
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
// Save the cart (optional)
router.post('/save-cart', async (req, res) => {
  const { cart } = req.body;

  try {
    // Optional: Save cart to a collection or process it as needed
    // For example, if you want to save it:
    await Cart.deleteMany(); // Clear existing cart (optional)
    await Cart.insertMany(cart); // Save the new cart

    res.json({ message: 'Cart saved successfully' });
  } catch (error) {
    console.error("Error saving cart:", error); // Log error for debugging
    res.status(500).json({ error: 'Failed to save cart' });
  }
});

module.exports = router;
