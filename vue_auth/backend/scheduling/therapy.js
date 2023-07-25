
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  paziente: String,
  farmaco: String,
  dosaggio: Number,
  orario: String
});

schema.index({ paziente: 1 });


const terapia = mongoose.model('therapy', schema);
module.exports = { terapia };