//importation de mongoose
const mongoose= require('mongoose');
//generation dun shema
const groupSchema = mongoose.Schema({
    nomgroupe:String,
    module:String,
    enseignat:String,
    datedebut:String,
    datefin:String,
    mat:String,
    type:String,
    idEleve:String
   

    



});
//generate model 
const group=mongoose.model('Group',groupSchema);
//export model

module.exports=group;