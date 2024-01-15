const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'POENIX_STUDIO_LOU_PESCHET_MAGIC_LIBRAIRIE');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId 
        };
    } catch (error) {
        res.status(401).json({ error });
    }
}