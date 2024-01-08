const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://Lou:password0258456@biblio.vjhewcg.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.post('/api/books', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Grimoire ajouté'
    });
});

app.get('/api/books', (req, res, next) => {
    const books = [
        {
            userId: '01',
            title : 'Brockton Bay',
            author : 'Skitter',
            imageUrl : 'https://via.placeholder.com/206x260',
            year: 1998,
            genre: 'Thriller',
            ratings : [
            {
            userId : '03',
            grade : 5
            }
            ],
            averageRating : 4,
        },
        {
            userId : '02',
            title : 'Parahuman Threat Response',
            author : 'Weaver',
            imageUrl : 'https://via.placeholder.com/206x260',
            year: 1999,
            genre: 'Policier',
            ratings : [
            {
            userId : '04',
            grade : 3
            }
            ],
            averageRating : 2,
        },
        {
            userId : '05',
            title : 'Golden Morning',
            author : 'Khepri',
            imageUrl : 'https://via.placeholder.com/206x260',
            year: 2000,
            genre: 'Drame',
            ratings : [
            {
            userId : '06',
            grade : 5
            }
            ],
            averageRating : 5,
        },
    ];
    res.status(200).json(books);
});

module.exports = app; 