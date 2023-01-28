const { Router } = require('express');
const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch 
    } = require('../controllers/usuarios.controller');

const router = Router();


router.get('/', usuariosGet);  
router.put('/:id', usuariosPut); //TODO parametros de URL 1
router.post('/', usuariosPost);
router.delete('/', usuariosDelete);
router.patch('/', usuariosPatch);



module.exports = router;
// router.get('/', (req, res) => {
    
// });
