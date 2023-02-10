const { Router } = require('express');
const { check  } = require('express-validator');

const { login  } = require('../controllers/auth.controller');
const { validarCamposUsuario } = require('../middlewares/validar-campos-usuario');



const router = Router();




//Endpoints

router.post('/login', [ //TODO JWT 1

    check('correo',   'El correo es obligatorio'     ).isEmail(),
    check('password', 'La contraseña es obligatorio' ).not().isEmpty(),

    validarCamposUsuario
] ,login);  


module.exports = router;