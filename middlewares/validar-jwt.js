const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");


const validarJWT = async(req, res= response, next) =>{ //TODO JWT 4

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRET_KEY);

        //leer usuario que corresponde al uid
        const usuario = await Usuario.findById(uid)

        //comprobar si el usuario existe
        if (!usuario) {
            res.status(401).json({
                msg: 'Token no válido, false'
            });
        }

        //comprobar si no es un usuario false
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Token no válido, false'
            });
        }

        req.usuario = usuario;
        req.uid = uid;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });

    }   
}


module.exports = {
    validarJWT
}