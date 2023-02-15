const {response, request} = require('express');
const Producto = require('../models/producto');



//obtener Productos, paginado, total, populate
const obtenerProductos = async(req, res) => {

    const {limite=5, desde=0} = req.query;
    
    const query = {estado:true}

    const [total, productos] = await Promise.all([
        Producto.count(query),
        Producto.find( query)
            .skip(  Number(desde)  )
            .limit( Number(limite) )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.status(200).json({
        total,
        productos
    })
}

//obtener categoria, populate
const obtenerProducto = async(req, res=response) => {

    const id = req.params.id;

    const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')

    res.status(200).json({
        producto
    });
}


const crearProducto = async(req=request, res=response) => {

    const nombre = req.body.nombre.toUpperCase();

    const {precio, descripcion, categoria} = req.body;

    const productoDB = await Producto.findOne({nombre});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe`
        });
    }


    //Generar datos a guardar
    const data = {
        nombre,
        precio,
        descripcion,
        categoria,
        usuario: req.uid
    }

    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    res.status(201).json({
        producto
    })
}

// actualizar Producto
const actualizarProducto = async(req, res) => {
    
    const id = req.params.id;

    const {nombre, precio, categoria, descripcion} = req.body;

    data = {
        nombre: nombre.toUpperCase(),
        precio,
        categoria,
        descripcion
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true})

    res.status(201).json({
        producto
    })
}

// borrarProducto
const borrarProducto = async(req, res) => {
        
    const id = req.params.id;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true})

    res.status(201).json({
        producto
    })
}





module.exports = {
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
    obtenerProductos
}