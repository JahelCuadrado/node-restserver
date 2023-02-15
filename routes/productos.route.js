const { Router         } = require('express');
const { check          } = require('express-validator');
const { validarJWT,
        validarCampos,  
        esAdminRole} = require('../middlewares');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller');
const { existeCategoria, existeCategoriaPorNombre, existeProducto } = require('../helpers/db-validators');


//Instancia Router
const router = Router();


//Endpoints
//--------------------------------------------------------

//Obtener todas las categorias
router.get('/', obtenerProductos);


//Obtener una categoria, validar ID con middleware
router.get('/:id', [
    check('id', 'Eso no es un ID de mongo válido').isMongoId(),
    //check('id').custom(existeCategoria),
    validarCampos
], obtenerProducto);


//Crear categoria, privado, requiere token válido
router.post('/', [
    validarJWT,
    check('nombre','Falta el nombre o está en el formato incorrecto').not().isEmpty().isString(),
    check('precio','Falta el precio o está en el formato incorrecto').optional().not().isEmpty().isNumeric(),
    check('categoria','Falta ID o eso no es un ID de mongo válido').not().isEmpty().isMongoId(),
    check('descripcion','Falta la descripción o está en el formato incorrecto').optional().not().isEmpty().isString(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto );


//Actualizar una categoria, privado, requiere token válido, validar ID con middleware
router.put('/:id', [
    validarJWT,
    check('id', 'Eso no es un ID de mongo válido').isMongoId(),
    check('id').custom(existeProducto),
    check('nombre','Falta el nombre o está en el formato incorrecto').optional().isString(),
    check('precio','Falta el precio o está en el formato incorrecto').optional().isNumeric(),
    check('categoria','Falta la categoria o está en el formato incorrecto').optional().isMongoId(),
    check('descripcion','Falta la descripcion o está en el formato incorrecto').optional().isString(),
    validarCampos
], actualizarProducto);


//Borrar una categoria, admin, validar ID con middleware
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'Eso no es un ID de mongo válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);




module.exports = router;