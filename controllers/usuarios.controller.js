const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcriptjs = require('bcryptjs');
const { emailExiste } = require('../helpers/db-validators');



const usuariosGet = async(req=request, res=response) => { 

    // const query = req.query;
    // const { q, nombre='pepe', apikey } = req.query;
    const {limite=5, desde=0} = req.query;
    const query = {estado:true};

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite))

    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.count(query),
        Usuario.find( query)
            .skip(  Number(desde)  )
            .limit( Number(limite) )
    ])

    res.json({
        total,
        usuarios
        // msg: 'get api - controlador',
        // q,
        // nombre,
        // apikey
    });
}


const usuariosPost = async(req, res=response) => { //TODO usuarios 1 registrar un usuario

    // const body = req.body; //Capturo lo que el usuario me está mandando
    // const {nombre, edad} = req.body; //Capturo lo que el usuario me está mandando desestructurando los datos



    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});


    //encriptar la contraseña
    const salt = bcriptjs.genSaltSync();
    usuario.password = bcriptjs.hashSync(password, salt);

    //guardar en bbdd
    await usuario.save(); //TODO usuarios 2 guardar un usuario en la BBDD


    res.json({
        usuario
    });
}


const usuariosPut = async(req, res=response) => { 

    const id = req.params.id;
    const { _id, password, google, correo, ...resto} = req.body;
    console.log(resto.password);

    //TODO validar con BBDD
    if(password){
        //encriptar la contraseña
        const salt = bcriptjs.genSaltSync();
        resto.password = bcriptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        msg: 'put api - controlador',
        usuario
    });
}


const usuariosPatch = (req, res=response) => {
    res.json({
        msg: 'patch api - controlador'
    });
}


const usuariosDelete = async(req, res=response) => {

    const {id} = req.params;

    //Fisicamente lo borramos
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false})

    res.json({
        usuario
    });
}


module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}