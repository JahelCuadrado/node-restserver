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



router.put('/:id', [ //TODO parametros de URL 1
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCamposUsuario
] ,usuariosPut); 



router.post('/',[ //TODO usuarios 4
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password deber tener mas de 6 caracteres').isLength({min:6}) ,
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRolValido),
    validarCamposUsuario
    //check('rol', 'Ese no es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']) ,
], usuariosPost);



router.delete('/:id', [ //TODO JWT 5
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCamposUsuario
] ,usuariosDelete);



router.patch('/', usuariosPatch);



module.exports = router;
// router.get('/', (req, res) => {
    
// });
