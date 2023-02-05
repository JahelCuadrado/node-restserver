const mongoose = require('mongoose')

const dbConnection = async() => {

    try {

        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_ATLAS);

        console.log('Base de datos online');


    } catch (error) {
        throw new Error('Error a la hora de iniciar la base de datos')
    }

}

module.exports = {
    dbConnection
}