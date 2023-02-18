const path             = require('path')
const fs               = require('fs')
const { response     } = require("express"            );
const { subirArchivo } = require("../helpers"         );
const Usuario          = require("../models/usuario"  );
const Producto         = require("../models/producto" );


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




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}