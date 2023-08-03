const mongoose = require('mongoose');

const schema = mongoose.Schema;
const userSchema = new schema({
    patient: { type: String, unique: true},
    fc: String,
    spO2: String,
    systolic: String,
    diastolic: String
});

userSchema.index({ patient: 1 });

const alerts = mongoose.model('alert',userSchema,);
module.exports = { alerts };