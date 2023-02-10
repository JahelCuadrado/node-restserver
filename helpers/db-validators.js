const Role = require("../models/role");
const Usuario = require('../models/usuario');


//Ejemplo de validacion custom quie comprueba si existe un determinado ROl en la BBDD
const esRolValido = async(rol='') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe`);
    }
}

//Ejemplo de validacion custom quie comprueba si existe un determinado email en la BBDD
const emailExiste = async(correo) => {
    const existeEmail = await Usuario.findOne({correo}); //TODO usuarios 6
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

//Ejemplo de validacion custom quie comprueba si existe un determinado usuario en la BBDD
const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id); //TODO usuarios 6
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}