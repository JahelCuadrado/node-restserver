const { response } = require("express");

//Cuando instalamos el paquete de subida de archivos hace que en la reques se cree una propiedad files que es donde se guardarán los archivos de las peticiones, aqui comprobamos si existe esa propiedad, si está vacía y si existe el archivo que nos tiene que mandar llamado "archivo"
const validarArchivoSubido = (req, res=response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({msg: 'No hay archivos que subir. validarArchivoSubido'});
      }

      next();
}

module.exports = {
    validarArchivoSubido
}