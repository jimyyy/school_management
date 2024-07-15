//importation de mongoose
const mongoose = require('mongoose');
//generation dun shema
const reclamationSchema = mongoose.Schema({
    idEleve: String,
    idEnseignant: String,

    reclamation: String,
    idMatiere: String,
    date: String,
    idModule: String,
    type:String










});
//generate model 
const reclamation = mongoose.model('Reclamation', reclamationSchema);
//export model

module.exports = reclamation;