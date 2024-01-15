const express = require('express');
const auth = require('../middleware/auth')
const router = express.Router();
const bookCtrl = require('../controllers/book');

router.post('/', auth, bookCtrl.createBook);
router.get('/', auth, bookCtrl.getBook);

module.exports = router;