const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcriptjs = require('bcryptjs');
const { emailExiste } = require('../helpers/db-validators');



const usuariosGet = async(req=request, res=response) => { 

    //Obtengo de los parámetros el valor de limite y desde , dandole unos valores por defecto, estos valores me sirve para hacer una paginación
    const {limite=5, desde=0} = req.query;

    //Creo una variable con la condicion de busqueda de los usuarios.
    const query = {estado:true};

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite))

    // const total = await Usuario.countDocuments(query);

    //Creo un await para obtener los usuarios en base a la query anterior y otro await para contar los usuarios que hay en la bbdd, al meterlo los dos dentro de Promise all hace que tengan que estar los dos para continuar.
    const [total, usuarios] = await Promise.all([
        Usuario.count(query),
        Usuario.find( query)
            .skip(  Number(desde)  )
            .limit( Number(limite) )
    ])

    res.json({
        total,
        usuarios
    });
}



const usuariosPost = async(req, res=response) => {

    //Obtengo de la respuesta del usuario solo los datos que quiero, por si acaso manda mas
    const {nombre, correo, password, rol} = req.body;

    //Creo el usuario con los datos mandados
    const usuario = new Usuario({nombre, correo, password, rol});

    //encripto la contraseña antes de guardar el usuario en la base de datos
    const salt = bcriptjs.genSaltSync();
    usuario.password = bcriptjs.hashSync(password, salt);

    //guardo el usuario en la base de datos
    await usuario.save();

    //Doy una respuesta con el usuario creado
    res.json({
        usuario
    });
}



const usuariosPut = async(req, res=response) => { 

    //Capturo el id que viene en la url
    const id = req.params.id;

    //Hago una desestructuracioón para separar el id, password, google y correo del resto
    const { _id, password, google, correo, ...resto} = req.body;
    
    //Compruebo si realmente me ha mandado una contraseña, si es asi la encriptamos.
    if(password){
        const salt = bcriptjs.genSaltSync();
        resto.password = bcriptjs.hashSync(password, salt);
    }

    //Actualizo el usuario con la funcion findByIdAndUpdate con el id y el resto
    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    //Despues doy una respuesta con el usuario actualizado
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



const usuariosDelete = async(req, res=response) => { //TODO

    //Capturo el id de la url
    const {id} = req.params;

    //Podemos borrar el usuario con el metodo findOneAndDelete, pero en este caso obtamos porque el usuario tenga un estado y este ponerlo a false
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    //console.log(req);

    //Despues doy una respuesta con el usuario borrado
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