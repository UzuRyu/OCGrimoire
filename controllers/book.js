const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
    /* Il faudra que je réduise l'image et que je remplace imageUrl par le bon URL averageRating devra probablement être vérifié ainsi */
    const book = new Book({
        userId: req.book.userId,
        title: req.book.title,
        author: req.book.author,
        imageUrl: 'https://via.placeholder.com/206x260',
        year: req.book.year,
        genre: req.book.genre,
        ratings: {
            type: [
                {
                    userId: req.book.userId,
                    grade: req.book.grade,
                },
            ],
        },
        averageRating: req.book.averageRating,
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getBook = (req, res, next) => {
    const books = [
        {
            userId: '01',
            title: 'Brockton Bay',
            author: 'Skitter',
            imageUrl: 'https://via.placeholder.com/206x260',
            year: 1998,
            genre: 'Thriller',
            ratings: [
                {
                    userId: '03',
                    grade: 5
                }
            ],
            averageRating: 4,
        },
        {
            userId: '02',
            title: 'Parahuman Threat Response',
            author: 'Weaver',
            imageUrl: 'https://via.placeholder.com/206x260',
            year: 1999,
            genre: 'Policier',
            ratings: [
                {
                    userId: '04',
                    grade: 3
                }
            ],
            averageRating: 2,
        },
        {
            userId: '05',
            title: 'Golden Morning',
            author: 'Khepri',
            imageUrl: 'https://via.placeholder.com/206x260',
            year: 2000,
            genre: 'Drame',
            ratings: [
                {
                    userId: '06',
                    grade: 5
                }
            ],
            averageRating: 5,
        },
    ];
    res.status(200).json(books);
};