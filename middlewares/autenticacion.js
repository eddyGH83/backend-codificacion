const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            req.authenticated = false;
            req.decoded = null;
            next();
        } else {
            req.decoded = decoded;
            req.authenticated = true;
            next();
        }
    });
};

module.exports = {
    verificaToken
}
