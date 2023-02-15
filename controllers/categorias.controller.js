const {response, request} = require('express');
const Categoria = require('../models/categoria');



//obtener categorias, paginado, total, populate
const obtenerCategorias = async(req, res) => {

    const {limite=5, desde=0} = req.query;
    
    const query = {estado:true}

    const [total, categorias] = await Promise.all([
        Categoria.count(query),
        Categoria.find( query)
            .skip(  Number(desde)  )
            .limit( Number(limite) )
            .populate('usuario', 'nombre')
    ]);

    res.status(200).json({
        total,
        categorias
    })
}

//obtener categoria, populate
const obtenerCategoria = async(req, res=response) => {

    const id = req.params.id;

    const categoria = await Categoria.findById(id).populate('usuario')

    res.status(200).json({
        categoria
    });
}


const crearCategoria = async(req, res=response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB} ya existe`
        });
    }

    //Generar datos a guardar
    const data = {
        nombre,
        usuario: req.uid
    }

    const categoria = new Categoria(data);

    // Guardar DB
    await categoria.save();

    res.status(201).json({
        categoria
    })
}

// actualizar categoria
const actualizarCategoria = async(req, res) => {
    
    const id = req.params.id;

    const nombre = req.body.nombre.toUpperCase();

    const categoria = await Categoria.findByIdAndUpdate(id, {nombre}, {new:true})

    res.status(201).json({
        categoria
    })
}

// borrarCategoria
const borrarCategoria = async(req, res) => {
        
    const id = req.params.id;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true})

    res.status(201).json({
        categoria
    })
}





module.exports = {
    crearCategoria,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
    obtenerCategorias
}