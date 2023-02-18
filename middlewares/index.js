const validarCampos        = require('../middlewares/validar-campos-usuario');
const validarJWT           = require('../middlewares/validar-jwt');
const validaRoles          = require('../middlewares/validar-roles');
const validarArchivoSubido = require('../middlewares/validar-roles');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivoSubido
}