const { request } = require("express");
const Categoria = require("../models/categoria");
const Role = require("../models/role");
const Usuario = require('../models/usuario');
const Producto = require("../models/producto");


//Ejemplo de validacion custom quie comprueba si existe un determinado ROl en la BBDD
const esRolValido = async(rol='') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe`);
    }
}

//Ejemplo de validacion custom quie comprueba si existe un determinado email en la BBDD
const emailExiste = async(correo) => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

//Ejemplo de validacion custom quie comprueba si existe un determinado usuario en la BBDD
const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

//Ejemplo de validacion custom que comprueba si existe una determinada categoria
const existeCategoria = async(id) => {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
        throw new Error(`La categoria con ID ${id} no existe`);
    }
    if(!categoria.estado){
        throw new Error(`La categoria con ID ${id} no existe, false`);
    }
}

//Ejemplo de validacion custom que comprueba si existe una determinada categoria
const existeProducto = async(id) => {
    const producto = await Producto.findById(id);
    if (!producto) {
        throw new Error(`El producto con ID ${id} no existe`);
    }
    if(!producto.estado){
        throw new Error(`El producto con ID ${id} no existe, false`);
    }
}

//TODO uploads Actualiza imagen 3
const coleccionesPermitidas = (coleccion='', colecciones =[]) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La colección ${coleccion} no está permitida, solo: ${colecciones}`);
    }

    return true;
}


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}