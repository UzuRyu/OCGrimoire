const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();  // Stocke l'image en mémoire pour la manipuler avec Sharp

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Seuls les fichiers image sont autorisés.'));
        }
        callback(null, true);
    }
}).single('image');

const opti = async (req, res, next) => {
    if (req.file) {
        try {
            const optiBuffer = await sharp(req.file.buffer)
                .webp({ quality: 30 })  // Vous pouvez ajuster la qualité selon vos besoins
                .toBuffer();

            // Stocker le fichier optimisé dans le dossier "./images"
            const bookObject = JSON.parse(req.body.book);
            const optiFileName = bookObject.title + Date.now() + '.webp';
            const optiFilePath = 'images/' + optiFileName;
            
            // Écrire le fichier optimisé sur le disque
            await sharp(optiBuffer).toFile(optiFilePath);

            req.file.path = optiFilePath;

            next();
        } catch (sharpError) {
            return res.status(500).json({ error: 'Erreur lors de l\'optimisation de l\'image.' });
        }
    } else {
        return next();
    }
};

module.exports = (req, res, next) => {
    upload(req, res, (error) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        opti(req, res, next);
    });
};
