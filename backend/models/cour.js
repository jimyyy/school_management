const mongoose = require ('mongoose');


const courSchema = mongoose.Schema({
   
    idEnseignant : String,
    idModule : String,
    idMatiere: String,
    nomMatiere:String,
    niveau:String,
    type:String,
    status:String,
    img:String


});


    
const cour = mongoose.model('Cour',courSchema);


module.exports = cour ;