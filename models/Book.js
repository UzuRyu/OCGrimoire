const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, "L'identifiant de l'utilisateur est requis"]
  },
  title: {
    type: String,
    required: [true, "Le titre du livre est requis"]
  },
  author: {
    type: String,
    required: [true, "L'auteur du livre est requis"]
  },
  imageUrl: {
    type: String,
    required: [true, "L'URL de l'image est requise"]
  },
  year: {
    type: Number,
    required: [true, "L'année de publication est requise"],
    validate: {
      validator: function (value) {
        const currentYear = new Date().getFullYear();
        return value >= 1500 && value <= currentYear;
      },
      message: "L'année doit être comprise entre 1500 et l'année actuelle"
    }
  },
  genre: {
    type: String,
    required: [true, "Le genre du livre est requis"]
  },
  ratings: {
    type: [
      {
        userId: {
          type: String,
          required: [true, "L'identifiant de l'utilisateur pour la note est requis"]
        },
        grade: {
          type: Number,
          required: [true, "La note du livre est requise"]
        },
      },
    ],
  },
  averageRating: {
    type: Number,
    required: [true, "La note moyenne du livre est requise"]
  },
});

module.exports = mongoose.model('Book', bookSchema);
