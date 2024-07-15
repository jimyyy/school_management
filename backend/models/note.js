const mongoose = require ('mongoose');


const noteSchema = mongoose.Schema({
idEleve : String,
idEnseignant : String,
idAdmin:String,
note : String,
presence : String,
idGroupe: String,
idMatiere : String,
idModule: String,
type:String
});


    
const note = mongoose.model('Note',noteSchema);


module.exports = note ;