//importation de mongoose
const mongoose= require('mongoose');
//generation dun shema
const paimentSchema = mongoose.Schema({
    
    date:String,
    Price:String,
    mode:String,
    tranche:String,
    Advance:String,
    Rest:String,
    idEleve:String
  
    



    



});
//generate model 
const paiment=mongoose.model('Paiment',paimentSchema);
//export model

module.exports=paiment;