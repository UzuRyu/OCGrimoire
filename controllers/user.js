const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.signup = (req, res, next) => {

    /*if (!isStrong(req.body.password)) {
        return res.status(400).json({ message: 'Le mot de passe doit être fort.' });
    }*/

    if (!isValidEmail(req.body.email)) {
        return res.status(400).json({ message: 'Email invalide' });
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email.toLowerCase(),
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Lecteur enregistré !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Paire Identifiant/Mot de Passe incorrect' })
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Paire Identifiant/Mot de Passe incorrect' })
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.SECRET,
                                    { expiresIn: '24h' }
                                )
                            })
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    })
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
};

function isStrong(password) {
    const minLength = 8;
    const nombre = /\d/.test(password);
    const majuscule = /[A-Z]/.test(password);
    const minuscule = /[a-z]/.test(password);
    const special = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

    return (password.length >= minLength && nombre && majuscule && minuscule && special);
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}