const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
// Function to connect to 'Users' collection
const connectToUsersCollection = async () => {
 try {
    await mongoose.connect('mongodb+srv://user:user@caregivers.rgfjqts.mongodb.net/Users?retryWrites=true&w=majority');
    console.log('Connected to Users collection');
  } catch (error) {
    console.log(error);
  }
};

// Function to connect to 'associazioni' collection
const connectToAlertsCollection = async () => {
  try {
   await mongoose.connect('mongodb+srv://user:user@caregivers.rgfjqts.mongodb.net/alerts?retryWrites=true&w=majority');
    console.log('Connected to alerts collection');
  } catch (error) {
    console.log(error);
  }
};

const connectToAssociazioniCollection = async () => {
  try {
   await mongoose.connect('mongodb+srv://user:user@caregivers.rgfjqts.mongodb.net/associazioni?retryWrites=true&w=majority');
    console.log('Connected to associazioni collection');
  } catch (error) {
    console.log(error);
  }
};

const connectToSchedulingCollection = async () => {
  try {
   await mongoose.connect('mongodb+srv://user:user@caregivers.rgfjqts.mongodb.net/scheduling?retryWrites=true&w=majority');
    console.log('Connected to scheduling collection');
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  connectToUsersCollection,
  connectToAlertsCollection,
  connectToAssociazioniCollection,
  connectToSchedulingCollection
};
