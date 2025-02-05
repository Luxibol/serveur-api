const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
    let token = req.session.token || req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json('token_not_valid');
            } else {
                req.decoded = decoded;
                req.session.user = decoded;  // Stocke l'utilisateur en session

                console.log("🟢 Utilisateur récupéré :", req.session.user);
                next();
            }
        });
    } else {
        console.log("🔴 Token manquant !");
        return res.status(401).json('token_required');
    }
};
