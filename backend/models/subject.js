const mongoose = require ('mongoose');


const subjectSchema = mongoose.Schema({

    idAdmin : String,
    nomModule : String,
    coef :String,
 




});


    
const subject = mongoose.model('Subject',subjectSchema);


module.exports = subject ;