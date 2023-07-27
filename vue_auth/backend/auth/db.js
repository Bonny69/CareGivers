const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const uri = "mongodb+srv://user:user@caregivers.rgfjqts.mongodb.net/?retryWrites=true&w=majority";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
};

module.exports = { connectToMongoDB };
