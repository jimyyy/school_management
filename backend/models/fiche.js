const mongoose = require ('mongoose');


const ficheSchema = mongoose.Schema({
idEleve : String,
idEnseignant : String,
idAdmin:String,
remarque : String,
presence : String,
idGroupe: String,
idMatiere : String,
date: String,
type:String
});


    
const fiche = mongoose.model('Fiche',ficheSchema);


module.exports = fiche ;