// Importaciones
const { Router                  } = require('express');
const { check, validationResult } = require('express-validator');

const {
    validarCamposUsuario,
    validarJWT,
    esAdminRole,
    tieneRol
                                } = require('../middlewares')

const { esRolValido, 
        emailExiste, 
        existeUsuarioPorId      } = require('../helpers/db-validators');
const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch           } = require('../controllers/usuarios.controller');
const router = Router();



//Endpoints
router.get('/', usuariosGet);  



router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCamposUsuario
] ,usuariosPut); 



router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password deber tener mas de 6 caracteres').isLength({min:6}) ,
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRolValido),
    validarCamposUsuario
], usuariosPost);



router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCamposUsuario
] ,usuariosDelete);



router.patch('/', usuariosPatch);



module.exports = router;