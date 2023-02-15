const { Router         } = require('express');
const { check          } = require('express-validator');
const { crearCategoria, obtenerCategoria, actualizarCategoria, borrarCategoria, obtenerCategorias } = require('../controllers/categorias.controller');
const { validarJWT,
        validarCampos,  
        esAdminRole} = require('../middlewares');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();


//Endpoints
//--------------------------------------------------------

//Obtener todas las categorias
router.get('/', obtenerCategorias);


//Obtener una categoria, validar ID con middleware
router.get('/:id', [
    check('id', 'Eso no es un ID de mongo válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);


//Crear categoria, privado, requiere token válido
router.post('/', [
    validarJWT,
    check('nombre','Falta el nombre o está en el formato incorrecto').not().isEmpty().isString(),
    validarCampos
], crearCategoria );


//Actualizar una categoria, privado, requiere token válido, validar ID con middleware
router.put('/:id', [
    validarJWT,
    check('id', 'Eso no es un ID de mongo válido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre','Falta el nombre o está en el formato incorrecto').not().isEmpty().isString(),
    validarCampos
], actualizarCategoria);


//Borrar una categoria, admin, validar ID con middleware
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'Eso no es un ID de mongo válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);




module.exports = router;