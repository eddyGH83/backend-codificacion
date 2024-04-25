const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verificaToken } = require('../middlewares/autenticacion');

const { login } = require('../controllers/login.controller');


router.post('/login', login)

module.exports = router;