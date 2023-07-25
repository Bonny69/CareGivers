const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
     email:String,
     caregivers:{
        caregiver1: String,
        caregiver2: String,
        caregiver3: String
     }
})
userSchema.index({ email: 1 });
const patient_caregivers = mongoose.model('patient_caregivers',userSchema);
module.exports = { patient_caregivers };