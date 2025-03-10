const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
  paziente: String,
  evento: String,
  data: Date,
  orario: String,
});

memoSchema.index({ paziente: 1 });


const Memo = mongoose.model('schedules', memoSchema);
module.exports = { Memo };