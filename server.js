// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes'); // Import routes
require('dotenv').config()

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors({
  origin: 'https://your-live-frontend-url.com', // Replace with your live frontend URL
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use cart routes
app.use('/api', cartRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
