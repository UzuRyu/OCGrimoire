const { unlink } = require('fs');
const Book = require('../models/Book');
const fs = require('fs').promises;

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;
    const book = new Book({
        userId: req.auth.userId,
        title: bookObject.title,
        author: bookObject.author,
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`,
        year: bookObject.year,
        genre: bookObject.genre,
        ratings: (bookObject.averageRating > 0) ? bookObject.ratings : [],
        averageRating: bookObject.averageRating,
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch(error => {
            // Détruit l'image uploadée si la création échoue
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink("images/" + filename);
            res.status(400).json({ error })
        });
};

exports.getBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.getBestBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ error }));
};

exports.rateBook = (req, res, next) => {
    const updatedRating = {
        userId: req.auth.userId,
        grade: req.body.rating
    };
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.ratings.find(r => r.userId === req.auth.userId)) {
                return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
            } else {
                book.ratings.push(updatedRating);
                book.averageRating = parseFloat(((book.averageRating * (book.ratings.length - 1) + updatedRating.grade) / book.ratings.length).toFixed(2));
                return book.save();
            }
        })
        .then((updatedBook) => res.status(201).json(updatedBook))
        .catch(error => res.status(400).json({ error }));
}

exports.destroyBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink("images/" + filename);
        })
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre détruit !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    // Vérifier si nouvelle image
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`,}
      : { ...req.body }; 
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Vérifier que l'utilsateur est bel et bien le créateur initial de l'entrée
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Modification refusée' });
            } else {
                // Supprimer ancienne image si besoin et mettre à jour
                const filename = book.imageUrl.split('/images/')[1];
                req.file && fs.unlink("images/" + filename);
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Entrée du livre modifiée' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));

}