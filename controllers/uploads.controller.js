const path             = require('path'               );
const fs               = require('fs'                 );
const { response     } = require("express"            );
const { subirArchivo } = require("../helpers"         );
const Usuario          = require("../models/usuario"  );
const Producto         = require("../models/producto" );
const cloudinary       = require('cloudinary'         ).v2  //TODO cloudinary 1 , antes de esto se ha instalado y se ha puesto la variable de entorno
cloudinary.config(process.env.CLOUDINARY_URL); //TODO cloudinary 2

//TODO uploads 6
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


//TODO uploads Actualiza imagen 4
const actualizarImagen = async(req, res=response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
      case 'usuarios':
          modelo = await Usuario.findById(id);
          if (!modelo) {
            return res.status(400).json({
              msg: `No existe ningun usuario con el ID ${id}`
            });
          }
        break;
    
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

    try {
      if (modelo.img) {
        //Borrar imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
          fs.unlinkSync(pathImagen)
        }
      }


      modelo.img = await subirArchivo(req.files, undefined, coleccion);
      await modelo.save();
      res.json({modelo})
      
    } catch (error) {
      
      res.json({error})
    }

}

//TODO cloudinary 3
const actualizarImagenCloudinary = async(req, res=response) => {

  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe ningun usuario con el ID ${id}`
          });
        }
      break;
  
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

  try {
    if (modelo.img) {
      //TODO cloudinary 6
      const nombreArr = modelo.img.split('/');
      const nombre    = nombreArr[nombreArr.length - 1];
      const [ id ]        = nombre.split('.');
      cloudinary.uploader.destroy(id);
    }

    const {tempFilePath} = req.files.archivo

    //TODO cloudinary 5
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)


    modelo.img = secure_url
    await modelo.save();
     res.json(modelo)
    
  } catch (error) {
    
    res.json({error})
  }

}


const mostrarImagen = async(req, res=response) =>{

  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe ningun usuario con el ID ${id}`
          });
        }
      break;
  
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

  try {
    if (modelo.img) {
      console.log(modelo.img);
      //Borrar imagen del servidor
      const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
      if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen)
      }
    }

    

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