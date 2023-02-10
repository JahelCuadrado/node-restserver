const { response } = require("express");
const Usuario = require("../models/usuario");
const bcriptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async(req=request, res=response) => { //TODO JWT 2

    const {correo, password} = req.body

    try {
        //Verificar si email existe
        const usuario = await Usuario.findOne({correo})
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario o la contraseña no son correctos, usuario'
            })
        }

        //Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario o la contraseña no son correctos, estado false'
            })
        }

        //Verificar contraseña
        const validPassword = bcriptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'El usuario o la contraseña no son correctos, password'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
           usuario,
           token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}


module.exports = {
    login
}