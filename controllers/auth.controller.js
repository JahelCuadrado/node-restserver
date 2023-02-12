const { response } = require("express");
const Usuario = require("../models/usuario");
const bcriptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req=request, res=response) => {

    //Obtenemos el correo y contraseña que nos mandan
    const {correo, password} = req.body

    try {
        //Verificar si existe un usuario con ese email, si no es asi se manda un estatus 400
        const usuario = await Usuario.findOne({correo})
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario o la contraseña no son correctos, usuario'
            })
        }

        //Verificar si el usuario tiene el estado en true, si no es asi se manda un estatus 400
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario o la contraseña no son correctos, estado false'
            })
        }

        //Verificamos si la contraseña es correcta, para ello utlizamos el método comparesync de bcrypst, pasandole la contraseña que nos han mandado y la contraseña del usuario que coincide en la bbdd, si  estas dos no coinciden, se manda un status 400
        const validPassword = bcriptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'El usuario o la contraseña no son correctos, password'
            })
        }

        //Generamos un JWT con el metodo que creamos anteriormente
        const token = await generarJWT(usuario.id);

        //Devolvemos los datos del usuario y el token
        res.json({
           usuario,
           token
        })
        
        //En caso de un error inesperado devolvemos un estatus 500
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}



const googleSignIn = async(req, res=response) => {  //TODO: iniciar sesion con google 4

    //obtenemos el token del body
    const {id_token} = req.body;

    //Usamos trycatch porque vamos a trabajar con await
    try {

        //Llamamos a la funcion de los helpers pasandole el token, nos devolverá los datos del usuario.
        const {name, picture, email} = await googleVerify(id_token)

        //Comprobamos si ya existe un usuario con ese correo
        let usuario = await Usuario.findOne({correo:email});


        //Si no existe ningun usuario con dicho correo lo creamos y guardamos en nuestra BBDD
        if (!usuario) {
            const data = {
                nombre: name, 
                correo: email,
                password: ':p',
                rol: 'USER_ROL',
                img: picture,
                google: true
            };

            usuario = new Usuario(data);
            const save = await usuario.save();
        }

        //si el usuario tiene el estado en false no se le deja pasar 
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado',
            })
        }

        //generamos uno de nuestros tokens
        const token = await generarJWT(usuario.id)

        //devovemos el usuario y el token
        res.json({
            msg: 'Todo bien! google signin',
            usuario,
            token
        })
        
    //en caso de un error inesperado, deolvemos un estatus 400
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'El token no se pudo verificar',
        })
    }


}


module.exports = {
    login,
    googleSignIn
}