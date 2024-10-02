const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;
let cart = []; // Initialize cart as an empty array
// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://jayantshelke4829:X28OghFzxnZfiX3o@foody.50gxu.mongodb.net/?retryWrites=true&w=majority&appName=Foody', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Cart Schema
const cartSchema = new mongoose.Schema({
  idMeal: String,
  name: String,
  price: Number,
  quantity: Number,
  strMealThumb:String,
});

const Cart = mongoose.model('Cart', cartSchema);

// Routes

// Get cart items
app.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add item to cart
app.post('/cart', async (req, res) => {
  const { idMeal, name, price, quantity, strMealThumb } = req.body;

  try {
    let cartItem = await Cart.findOne({ idMeal });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ idMeal, name, price, quantity, strMealThumb });
    }

    await cartItem.save();
    const updatedCart = await Cart.find();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Remove item from cart
app.delete('/cart/:idMeal', async (req, res) => {
  const { idMeal } = req.params;

  try {
    await Cart.deleteOne({ idMeal });
    const updatedCart = await Cart.find();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Save the cart (optional)
app.post('/save-cart', async (req, res) => {
  const { cart } = req.body;

  try {
    // Optionally process the cart data (e.g., save to another collection)
    res.json({ message: 'Cart saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save cart' });
  }
});


app.patch('/cart/:idMeal', async (req, res) => {
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
});;


// X28OghFzxnZfiX3o

// jayantshelke4829



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
