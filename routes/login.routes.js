const { Router } = require('express');
const router = Router();

const { 
    login, devuelveMenu
}= require('../controllers/login.controller');

router.post('/login', login);
router.post('/devuelveMenu', devuelveMenu);

module.exports = router;