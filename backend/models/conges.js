const mongoose = require ('mongoose');


const congesSchema = mongoose.Schema({
nom : String,
prenom : String,
email : String,
message:String,
datedebut:String,
datefin:String,
type:String,
idenseignant:String,
status:String,
certif:String

});


    
const conges = mongoose.model('Conges',congesSchema);


module.exports = conges ;