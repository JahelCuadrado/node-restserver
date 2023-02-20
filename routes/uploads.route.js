const { Router } = require('express');
const { check  } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos-usuario');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubido } = require('../middlewares/validar-archivo');



const router = Router();




//Endpoints


router.post('/', validarArchivoSubido, cargarArchivo);


router.put('/:coleccion/:id', [
    validarArchivoSubido,
    check('id', 'El id debe ser un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);


router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);




module.exports = router;