const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required:  [true, "Email requis"],
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Email invalide']
    },
    password: { 
        type: String, 
        required: [true, "Mot de passe requis"]
    }
});

userSchema.plugin(uniqueValidator,  { message: 'L\'{PATH} doit être unique.' });

module.exports = mongoose.model('User', userSchema);