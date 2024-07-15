//importation de mongoose
const mongoose = require('mongoose');
//generation dun shema
const userSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    mdp: String,
    tel: String,
    role: String,
    type: String,
    cin: String,
    datenaissance: String,
    img: String,
    img1: String,
    img2: String,
    nat: String,
    status: String,
    idgroupe: String,
    cours: String,
    idetranger: String,
    priorite:String,
    idcourseonline:String,
    photo:String,
    presence:String,
    niveau:String









});
//generate model 
const user = mongoose.model('User', userSchema);
//export model

module.exports = user;