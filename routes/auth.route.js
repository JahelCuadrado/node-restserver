const { Router } = require('express');
const { check  } = require('express-validator');

const { login, googleSignIn  } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos-usuario');



const router = Router();




//Endpoints

router.post('/login', [

    check('correo',   'Falta el correo o está en el formato incorrecto'     ).isEmail(),
    check('password', 'Falta la contraseña o está en el formato incorrecto' ).not().isEmpty().isString(),

    validarCampos
] ,login);  


router.post('/google', [

    check('id_token','Token de google (id_token) es necesario.').not().isEmpty(),

    validarCampos
] ,googleSignIn);  


module.exports = router;