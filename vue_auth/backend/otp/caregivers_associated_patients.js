const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
     caregiver:String,
     patient: String
})
const caregivers_patient = mongoose.model('caregivers_patient',userSchema);
module.exports = { caregivers_patient }; 