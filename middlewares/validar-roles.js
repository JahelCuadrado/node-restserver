const { response } = require("express")

//Creamos una función middleware
const esAdminRole = (req, res = response, next) => {

    //Comprobamos que existe el usuario en la request, esto lo hemos hecho en la función de validar el token en el punto anterior, por lo cual si esa validación no se ha ejecutado primero el usuario no existirá en la request y mandaremos un status 500 diciendo que se tiene que ejecutar primero el la validación del token
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    //obtenemos del usuario el nombre y el rol
    const { rol, nombre} = req.usuario;

    //comprobamos si su rol es de administrador, si no lo es,  mandamos un staus 401.
    if (rol != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        })
    }

    next();
}


//Como es un middleware que queremos que reciba otros datos, lo creamos como una funcion normal y despues retornamos un callback con el request, response y next propio de un middleware. El operador spread es utilizado en la función para convertir una lista de argumentos en un array.
const tieneRol = (...roles) => {
    return (req, res = response, next) => {

        //Comprobamos si existe usuario en el request, previamente hemos tenido que meter el usuario en la request en otra funcion de validation (JWT). Si no existe el usuario mandamos un status 500.
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        //Comprobamos si el rol del usuario coincide con algunos de los roles que contiene el array de roles, si no coincide mandamos un status 401.
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }

        next();
    }
}




module.exports = {
    esAdminRole,
    tieneRol
}