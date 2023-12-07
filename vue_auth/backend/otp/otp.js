const mongoose = require('mongoose');

const schema = mongoose.Schema;
const userSchema = new schema({
    email: String,
    otp: String,
    createdAt: {type: Date, default: Date.now, expires: 30}
});

userSchema.index({ email: 1 });

const otp = mongoose.model('otp',userSchema);
module.exports = { otp };
