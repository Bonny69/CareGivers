const mongoose = require('mongoose');

const schema = mongoose.Schema;
const userSchema = new schema({
    email: String,
    otp: String,
    createdAt: {type: Date, default: Date.now, expires: 120}
});

const otp = mongoose.model('otp',userSchema);
module.exports = { otp };