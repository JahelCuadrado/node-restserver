const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcriptjs = require('bcryptjs');



const usuariosGet = (req=request, res=response) => { 

    const query = req.query;
    const { q, nombre='pepe', apikey } = req.query;

    res.json({
        msg: 'get api - controlador',
        q,
        nombre,
        apikey
    });
}


const usuariosPost = async(req, res=response) => { //TODO usuarios 1

    // const body = req.body; //Capturo lo que el usuario me está mandando
    // const {nombre, edad} = req.body; //Capturo lo que el usuario me está mandando desestructurando los datos



    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //verificar correo
    const existeEmail = await Usuario.findOne({correo}); //TODO usuarios 3
    if (existeEmail) {
        return res.status(400).json({
            msg: 'El correo ya está registrado'
        })
    }

    //encriptar la contraseña
    const salt = bcriptjs.genSaltSync();
    usuario.password = bcriptjs.hashSync(password, salt);

    //guardar en bbdd
    await usuario.save(); //TODO usuarios 2


    res.json({
        usuario
    });
}


const usuariosPut = (req, res=response) => { 

    const id = req.params.id; 

    res.json({
        msg: 'put api - controlador',
        id
    });
}


const usuariosPatch = (req, res=response) => {
    res.json({
        msg: 'patch api - controlador'
    });
}


const usuariosDelete = (req, res=response) => {
    res.json({
        msg: 'delete api - controlador'
    });
}


module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}