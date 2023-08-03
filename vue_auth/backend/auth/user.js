
const mongoose = require('mongoose');

const schema = mongoose.Schema;
const userSchema = new schema({
    nome: String,
    cognome: String,
    dataDiNascita: Date,
    codiceFiscale: String,
    password: String,
    confermaPassword: String,
    ruolo: String,
    email: String,
});

userSchema.index({ email: 1 }, { unique: true });

const user = mongoose.model('users',userSchema);
module.exports = { user };