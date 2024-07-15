const mongoose = require ('mongoose');


const courseonlineSchema = mongoose.Schema({

   
    nom: String,
    description: String,   
    prix: String,
    times: String,
    max: String,
    enseignant: String,
    img :String,
    idEtra:String,



});


    
const courseonline = mongoose.model('Courseonline',courseonlineSchema);


module.exports = courseonline ;