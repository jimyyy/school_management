//importation de mongoose
const mongoose= require('mongoose');
//generation dun shema
const matiereSchema = mongoose.Schema({
    nomMatiere: String,
    description : String,
    idModule : String,
    nomModule: String,



    



});
//generate model 
const matiere=mongoose.model('Matiere',matiereSchema);
//export model

module.exports=matiere;