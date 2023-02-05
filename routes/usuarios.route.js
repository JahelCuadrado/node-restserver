// Importaciones
const { Router               } = require('express');
const { check                } = require('express-validator');
const { validarCamposUsuario } = require('../middlewares/validar-campos-usuario');
const { esRolValido          } = require('../helpers/db-validators');
const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch        } = require('../controllers/usuarios.controller');
const router = Router();



//Endpoints
router.get('/', usuariosGet);  

router.put('/:id', usuariosPut); //TODO parametros de URL 1

router.post('/',[ //TODO usuarios 5
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password deber tener mas de 6 caracteres').isLength({min:6}) ,
    check('correo', 'El correo no es válido').isEmail(),
    //check('rol', 'Ese no es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']) ,

    check('rol').custom(esRolValido),
    
    validarCamposUsuario
], usuariosPost);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;
// router.get('/', (req, res) => {
    
// });
