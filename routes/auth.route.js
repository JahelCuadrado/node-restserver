const { Router } = require('express');
const { check  } = require('express-validator');

const { login, googleSignIn  } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos-usuario');



const router = Router();




//Endpoints

router.post('/login', [

    check('correo',   'El correo es obligatorio'     ).isEmail(),
    check('password', 'La contraseña es obligatorio' ).not().isEmpty(),

    validarCampos
] ,login);  


router.post('/google', [ //TODO: iniciar sesion con google 2, endpoint que recibe un token llamado id_token en el body.

    check('id_token','Token de google (id_token) es necesario.').not().isEmpty(),

    validarCampos
] ,googleSignIn);  


module.exports = router;