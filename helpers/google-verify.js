const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


 //TODO: iniciar sesion con google 3, creamos la funcion que nos proporciona google en su documentacion (https://acortar.link/s4N97I).

//La función recibirá el token que nos proporcionó google anteriormente
async function googleVerify( token = '' ) { 

    //Se usa la funcion verifytoken a la que se le manda el token, y la clave de desencriptado que nos proporciona google y que estan en los  .env, esta funcion nos devolverá un objeto con todos los datos del usuario
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
  });

  //desestructuramos el objeto y obtenemos los datos que queremos.
  const {name, picture, email} = ticket.getPayload();
  
  //devolvemos esos datos
  return {
    name,
    picture,
    email
  }
}

module.exports = {
    googleVerify
}