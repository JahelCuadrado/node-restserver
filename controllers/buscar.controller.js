const { response}  = require('express');
const { ObjectId, isValidObjectId } = require('mongoose');
const { Usuario, Categoria, Producto, Role } = require('../models')


const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
]



const buscarUsuarios = async(termino='', res=response) => {

    //Comprobamos que es un id de monfo
    const esMongoID = isValidObjectId(termino);

    //Si lo es, buscamos el usuario y lo devolvemos, si no existe devolvemos un array vacio.
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    //Utilizamos regex para evitar la sensibilidad entre mayusculas y minusculas
    const regex = new RegExp(termino, 'i')

    //Buscamos usuarios que coincidan con los siguientes terminos de busqueda utilizando and y or.
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado:true}]
    })

    //Devolvemos los usuarios
    res.json({
        results: usuarios
    })
}


const buscarCategorias = async(termino='', res=response) => {

    const esMongoID = isValidObjectId(termino); //true

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const categorias = await Categoria.find({
        $or: [{nombre: regex}],
        $and: [{estado:true}]
    })

    res.json({
        results: categorias
    })
}


const buscarProductos = async(termino='', res=response) => {

    const esMongoID = isValidObjectId(termino); //true

    if (esMongoID) {
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const productos = await Producto.find({
        $or: [{_id:regex}, {nombre: regex}, {correo: regex}, {descripcion: regex}, {categoria: regex}],
        $and: [{estado:true}]
    })

    res.json({
        results: productos
    })
}


const buscarRoles = async(termino='', res=response) => {

    const esMongoID = isValidObjectId(termino); //true

    if (esMongoID) {
        const role = await Role.findById(termino);
        return res.json({
            results: (role) ? [role] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const roles = await Role.find({rol:regex})

    res.json({
        results: roles
    })
}



const buscar = ( req, res = response) =>{

    //Desestructuramos la colección y el termino de busqueda.
    const { coleccion, termino } = req.params;

    // Comprobamos si la colección enviada está dentro del array de las collecciones permitidas.
    if( !coleccionesPermitidas.includes(coleccion) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    //En base a la coleccion ejecutamos una busqueda u otra
    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res)
        break;
        case 'productos':
            buscarProductos(termino, res)
        break;
        case 'roles':
            buscarRoles(termino, res)
        break;
        case 'usuarios':
            buscarUsuarios(termino, res)
        break;
        default:
            res.status(500).json({
                msg: 'Hable con el administrador'
            })
    }
}


module.exports = {
    buscar,
    buscarUsuarios
}