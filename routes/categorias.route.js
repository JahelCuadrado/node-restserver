const { Router               } = require('express');
const { check                } = require('express-validator');
const { validarJWT
        validarCampos } = require('../middlewares');

const router = Router();


//Endpoints
//--------------------------------------------------------

//Obtener todas las categorias
router.get('/',(req, res) => {
    res.json('get');
});


//Obtener una categoria
router.get('/:id', (req, res) => {
    res.json('get - id');
});


//Crear categoria, privado, requiere token válido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,(req, res) => {
    res.json('post');
});


//Actualizar una categoria, privado, requiere token válido
router.put('/:id', (req, res) => {
    res.json('put');
});


//Borrar una categoria, admin
router.delete('/:id', (req, res) => {
    res.json('delete');
});




module.exports = router;