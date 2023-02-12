const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

//Creamos una funcion middleware y como todos los middleware recibe como parámetro el request, el response y el next.
const validarJWT = async(req, res= response, next) =>{

    //Guardamos el token que nos están mandando en la cabecera en una variable.
    const token = req.header('x-token');

    //Si no nos han mandado el token delvovemos un estatus 401
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    //Urilizamos un trycatch porque vamos a utilizar await
    try {

        /* Comprobamos con la funcion verify del paquete jsonwebtoken si dicho dicho token lo hemos
        firmado nosotros y si aún sigue vigente o a expirado. Esto nos devolverá un objeto con el 
        id que utilizamos para crear el token (en el objeto llamado uid), la fecha de emisión y la 
        fecha de expiración, utilizamos la desestructuración para obtener solo el uid.*/
        const {uid} = jwt.verify(token, process.env.SECRET_KEY);

        //Usamos el id para buscar el usuario que corresponde al mismo.
        const usuario = await Usuario.findById(uid)

        //Si el usuario no existe en la bbdd mandamos un status 401
        if (!usuario) {
            res.status(401).json({
                msg: 'Token no válido, false'
            });
        }
        //Si el usuario tiene el estado el false mandamos un status 401
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Token no válido, false'
            });
        }

        /* Dentro de la request creamos el valor "usuario" y dentro guardamos el usuario, hacemos 
        lo mismo con el uid. Esto se hace para poder acceder a estos valores desde cualquier 
        función que reciba la request, ya que esta se pasa por referencia y es siempre la misma.*/
        req.usuario = usuario;
        req.uid = uid;

        next();

        //En caso de cualquier error inesperado mandamos un estatus 500
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