const       path     = require('path');
const { v4: uuidv4 } = require('uuid');


//TODO uploads 5
//En nuestro helper vamos a recibir los archivos, las extensiones permitidas y el nombre de la carpeta donde se guardarán los archivos
const subirArchivo = ( files, extensionesPermitidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {
    
    return new Promise((resolve, reject) => {

        //Extraemos el archivo de la request
        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1]

        //validar extension
        if (!extensionesPermitidas.includes(extension)) {
            reject(`La extension .${extension} no está permitida, solo: ${extensionesPermitidas}`)
        }
        
        //Creamos un nombre unico para el archivo gracias a la paquete uuid
        const nombreTemporal = uuidv4() + '.' + extension;
        //Esta línea de código se está utilizando para definir la ruta donde se guardará el archivo que se está subiendo al servidor compuesta, por la ruta actual + uploads yendo hacia atrás + la carpeta mandada + el nombre temporal creado.
        const uploadPath = path.join(__dirname, '../uploads/', carpeta,  nombreTemporal);
    
        // El método mv es proporcionado por el paquete express-fileupload, y toma dos argumentos: el primer argumento es la ruta donde se desea guardar el archivo, y el segundo argumento es una función de devolución de llamada que se ejecutará después de que se complete la operación de mover el archivo. Si hay un error ejecutamos el reject y si no devolvemos el nombre del archivo.
        archivo.mv(uploadPath, (err) => {
            if (err){
                reject(err);
            }
            resolve(nombreTemporal)
        });

    })


}


module.exports = {
    subirArchivo
}