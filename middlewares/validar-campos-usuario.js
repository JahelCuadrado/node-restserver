const { validationResult } = require("express-validator");




const validarCamposUsuario = (req, res, next) => {

    const errors = validationResult(req); //TODO usuarios 4
    if (!errors.isEmpty()) {
        return res.status(400).json(errors)
    }

    next();

}

module.exports = {
    validarCamposUsuario
}