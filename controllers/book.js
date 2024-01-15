const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;
    const book = new Book({
        userId: req.auth.userId,
        title: bookObject.title,
        author: bookObject.author,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        year: bookObject.year,
        genre: bookObject.genre,
        ratings: bookObject.ratings,
        averageRating: bookObject.averageRating,
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};