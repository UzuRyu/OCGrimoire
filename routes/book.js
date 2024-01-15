const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multur-config');
const router = express.Router();
const bookCtrl = require('../controllers/book');

router.post('/', auth, multer, bookCtrl.createBook);
router.get('/', bookCtrl.getBook);

module.exports = router;