const path             = require('path'               );
const fs               = require('fs'                 );
const { response     } = require("express"            );
const { subirArchivo } = require("../helpers"         );
const Usuario          = require("../models/usuario"  );
const Producto         = require("../models/producto" );
const cloudinary       = require('cloudinary'         ).v2

cloudinary.config(process.env.CLOUDINARY_URL);




const cargarArchivo = async(req, res=response) => {
  
    // Utilizamos un trycatch porque estamos utilizando un await
    try {

      //Lamamos a nuestro helper y devolvemos el nombre del archivo
      const nombreTemporal = await subirArchivo(req.files, undefined, 'imgs');
      res.json({
        nombre: nombreTemporal
      })

      //En caso de que haya un error como que nos manden una extension no permitoda, se devolverá el error.
    } catch (error) {
      return res.json({error})
    }
}



const actualizarImagen = async(req, res=response) => {

    //Extraemos el id y coleccion de la URL
    const {id, coleccion} = req.params;

    //Creamos una variable modelo
    let modelo;

    //Comprobamos si la coleccion es un usuario o un producto, está buscando un usuario o un producto.
    switch (coleccion) {

      //Si resulta ser el usuario, lo buscamos en la base de datos por su ID, si no existe mandamos un mensaje de error
      case 'usuarios':
          modelo = await Usuario.findById(id);
          if (!modelo) {
            return res.status(400).json({
              msg: `No existe ningun usuario con el ID ${id}`
            });
          }
        break;
    
      //Hacemos lo mismo con los productos  
      case 'productos':
          modelo = await Producto.findById(id);
          if (!modelo) {
            return res.status(400).json({
              msg: `No existe ningun producto con el ID ${id}`
            });
          }
        break;

      default:
        return res.status(500).json({msg: 'Hable con el administrador'});

    }

    //Usamos un trycatch por el await
    try {

      //Si el modelo (usuario o usuario en base a la eleccion)
      if (modelo.img) {

        //Construimos una ruta absoluta con la funcion join, ya que la funcion existSync solo funciona con rutas absolutas, esta ruta absoluta está compuesra por la ruta actual + uploads yendo hacia atrás + coleccion que coincide con el nombre de la carpeta + el nombre guardado en el parámetro img.
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);

        //Si existe la imagen en esa ruta pasandosela y la borramos para poderla actualizar
        if (fs.existsSync(pathImagen)) {
          fs.unlinkSync(pathImagen)
        }
      }

      //Guardamos la imagen con nuestra funcion de subir archivo, esta funcion nos devuelve el nombre de la imagen, que es lo que se guardará en modelo.img, si modelo.img no existiese se crearia. 
      modelo.img = await subirArchivo(req.files, undefined, coleccion);

      //Guardamos el modelo y lo devolvemos
      await modelo.save();
      res.json({modelo})
      
    //En caso de cualquier error lo devolvemos
    } catch (error) {
      res.json({error})
    }

}



const actualizarImagenCloudinary = async(req, res=response) => {

  //Extraemos el id y coleccion de la URL
  const {id, coleccion} = req.params;

  //Creamos una variable modelo
  let modelo;

  //Comprobamos si la coleccion es un usuario o un producto, está buscando un usuario o un producto.
  switch (coleccion) {

    //Si resulta ser el usuario, lo buscamos en la base de datos por su ID, si no existe mandamos un mensaje de error
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe ningun usuario con el ID ${id}`
          });
        }
      break;
  
      //Hacemos lo mismo si resulta ser un producto.
      case 'productos':
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe ningun producto con el ID ${id}`
          });
        }
      break;

    default:
      return res.status(500).json({msg: 'Hable con el administrador'});

  }

  //Usamos un trycatch por el await
  try {

    //Comprobamos si existe una variable img en el modelo (usuario o producto)
    if (modelo.img) {
      
      //Si existe vamos a hacer lo siguiente, Con estas tres lineas a continuacion estamos, cogiengo la URL que se guarda en img, en está url se encuentra el nombre de la imagen el cual es tambien su ID en cloudinary, queremos extraer ese ID para poder borrarla  antes de subir la nueva imagen.
      const nombreArr = modelo.img.split('/');
      const nombre    = nombreArr[nombreArr.length - 1];
      const [ id ]    = nombre.split('.');

      //Usamos el ID para borrar la imagen de cloudinary.
      cloudinary.uploader.destroy(id);
    }

    // req.files.archivo, aqui dentro se encuentra el archivo que nos manda el usuario, pero dentro de req.files.archivo no está solo el archivo, req.files.archivo es un objeto con diferentes argumentos, uno de ellos es tempFilePath que guarda la ruta temporal donde se encuentra el archivo que nos manda el usuario.
    const {tempFilePath} = req.files.archivo

    // Utilizamos esa ruta temporal para decir donde se encuentra el archivo y subirlo a los servidores de cloudinary con la funcion upload. Esto nos devuelve un objeto con difetentes parámetros, uno de ellos es secure_url, que contiene la url donde se encuentra la imagen en los servidores de cloudinary.
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

    //Despues actualizamos nuestro modelo guardando esa URL en el parámetro img
    modelo.img = secure_url
    await modelo.save();
     res.json(modelo)
    
  } catch (error) {
    
    res.json({error})
  }

}



const mostrarImagen = async(req, res=response) =>{

  //Extraemos el id y coleccion de la URL
  const {id, coleccion} = req.params;

  //Creamos una variable modelo
  let modelo;

  //Comprobamos si la coleccion es un usuario o un producto, está buscando un usuario o un producto.
  switch (coleccion) {

    //Si resulta ser el usuario, lo buscamos en la base de datos por su ID y lo guardamos en la variable modelo, si no existe mandamos un mensaje de error
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe ningun usuario con el ID ${id}`
          });
        }
      break;
  
      //Hacemos lo mismo con los productos 
      case 'productos':
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe ningun producto con el ID ${id}`
          });
        }
      break;

    default:
      return res.status(500).json({msg: 'Hable con el administrador'});

  }

  //Usamos un trycatch por el await
  try {

    //Comprobamos si existe el parámetro img del el modelo (usuario o producto en base a la eleccion)
    if (modelo.img) {

      //Construimos una ruta absoluta con la funcion join, ya que la funcion existSync solo funciona con rutas absolutas, esta ruta absoluta está compuesra por la ruta actual + uploads yendo hacia atrás + coleccion que coincide con el nombre de la carpeta + el nombre guardado en el parámetro img.
      const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);

      //Comprobamos si existe la imagen en esa ruta pasandosela y si existe le mandamos la imagen con sendfile
      if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen)
      }
    }

    
    //Si no existiese le mandariamos un imagen genérica guardada en una carpeta assets
    pathNoImagen = path.join(__dirname, '../assets/no-image.png');
    res.sendFile(pathNoImagen);
    
    
  } catch (error) {
    console.log(error);
    res.json({error})
  }
}




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}