const jwt = require('jsonwebtoken')


//Creamos una funcion que va a recibir el id del usuario.
const generarJWT = ( uid = '') => {

    //Lo metemos todo de una promesa por que puede tardar un tiempo en completarse
    return new Promise((resolve, reject) => {

        //Creamos un objeto que contiene el id, creamos un objeto porque la funcion sign pide como parámetro un objeto
        const payload = {uid};

        //Utilizamos la funcion sign del paquete jsonwebtoken  para crear el token, mandadole el id y utilizando nuestra clave secrete de los .env para firmar el token. Tambien mandamos en forma de objeto el parámetro expireIn con el que indicamos el tiempo en horas de caducidad del token.
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn:'4h'

            //La funcion sign devuelve el token y un posible error si lo hubiera
        }, (err, token) => {

            //Si existe un error ejecutamos el reject de la promesa, si no existe error devovemos el token con el resolve de la promesa.
            if (err) {
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve(token)
            }

        })

    });

}

module.exports = {
    generarJWT
}