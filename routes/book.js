const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multur-config');
const router = express.Router();
const bookCtrl = require('../controllers/book');

router.post('/', auth, multer, bookCtrl.createBook);
router.get('/', bookCtrl.getBooks);
router.get('/bestrating', bookCtrl.getBestBooks);
router.delete('/:id', auth, bookCtrl.destroyBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.get('/:id', bookCtrl.getOneBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);


module.exports = router;