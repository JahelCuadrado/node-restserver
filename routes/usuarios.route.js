// Importaciones
const { Router                   } = require('express');
const { check                    } = require('express-validator');
const { validarCamposUsuario     } = require('../middlewares/validar-campos-usuario');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch            } = require('../controllers/usuarios.controller');
const router = Router();



//Endpoints
router.get('/', usuariosGet);  

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCamposUsuario
] ,usuariosPut); //TODO parametros de URL 1

router.post('/',[ //TODO usuarios 4
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password deber tener mas de 6 caracteres').isLength({min:6}) ,
    check('correo', 'El correo no es válido').isEmail(),
    //check('rol', 'Ese no es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']) ,
    check('correo').custom(emailExiste),
    check('rol').custom(esRolValido),
    
    validarCamposUsuario
], usuariosPost);

router.delete('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCamposUsuario
] ,usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;
// router.get('/', (req, res) => {
    
// });
