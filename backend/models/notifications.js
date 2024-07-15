const mongoose = require('mongoose');


const notificationsSchema = mongoose.Schema({

  title:String,
  date:String,
  status:String,
  type:String,
  nom:String,
  prenom:String,
  idEnseignant:String

  
   


});



const notifications = mongoose.model('Notifications', notificationsSchema);


module.exports = notifications;