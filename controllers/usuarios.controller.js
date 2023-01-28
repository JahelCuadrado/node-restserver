const {response, request} = require('express');



const usuariosGet = (req=request, res=response) => { //TODO params 1

    const query = req.query;
    const { q, nombre='pepe', apikey } = req.query;

    res.json({
        msg: 'get api - controlador',
        q,
        nombre,
        apikey
    });
}


const usuariosPost = (req, res=response) => { //TODO datos de un POST 2

    const body = req.body; //Capturo lo que el usuario me está mandando
    const {nombre, edad} = req.body; //Capturo lo que el usuario me está mandando desestructurando los datos

    res.json({
        msg: 'post api - controlador',
        nombre, 
        edad
    });
}


const usuariosPut = (req, res=response) => { //TODO parametros de URL 2

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