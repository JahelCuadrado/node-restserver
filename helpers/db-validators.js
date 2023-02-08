const Role = require("../models/role");
const Usuario = require('../models/usuario');



const esRolValido = async(rol='') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe`);
    }
}

const emailExiste = async(correo) => {
    const existeEmail = await Usuario.findOne({correo}); //TODO usuarios 6
    console.log(existeEmail);
    console.log(correo);
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

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