const express = require('express');

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const nodemailer = require("nodemailer");



const multer = require('multer');

//import pdfKit
const fs = require('fs');

const webpush = require('web-push');



const PDFDocument = require('./pdfkit');

const blobStream = require('blob-stream');

const path = require('path');

const User = require('./models/user')
const Group = require('./models/group');
const Conges = require('./models/conges');
const Cour = require('./models/cour');
const Matiere = require('./models/matiere');
const Subject = require('./models/subject');
const Paiment = require('./models/paiment');
const Notifications = require('./models/notifications');
const Reclamation = require('./models/reclamation');
const Courseonline = require('./models/courseonline');
const Event = require('./models/event');


const Fiche = require('./models/fiche');
const Note = require('./models/note');


const bodyParser = require('body-parser');

const cors = require('cors');

//console.log(webpush.generateVAPIDKeys());







const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: '*'

}));












mongoose.connect('mongodb://localhost:27017/pfe', { useNewUrlParser: true, useUnifiedTopology: true });
//securite configuration
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Content-Type, X-Requested-with, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS, PATCH, PUT"
    );
    next();
});

//config multer

app.use('/images', express.static(path.join('backend/images')))
const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'application/pdf': 'pdf',
    'video/mp4': 'mp4',
    'audio/mp3': 'mp3',
    'application/msword':'msword',
    'application/vnd.ms-powerpoint':'vnd.ms-powerpoint'
}

const storage = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Mime type is invalid");
        if (isValid) {
            error = null;
        }
        //Affecter la destination
        cb(null, 'backend/images')
    },
    //file name
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        const imgName = name + '-' + Date.now() + '-pfe-' +
            '.' + extension;

        //Affecter file name
        cb(null, imgName);
    }

});




// ajout des utilisateur

app.post("/api/addUser", multer({ storage: storage }).single('img'), (req, res) => {

    console.log("here in create user", req.body);

    bcrypt.hash(req.body.mdp, 10).then(cryptedPwd => {
        let url = req.protocol + '://' + req.get('host');
        console.log('here URL', url);




        let user = {};
        
        if (req.body.role == "teacher") {




            user = new User({
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                mdp: cryptedPwd,
                tel: req.body.tel,
                cin: req.body.cin,
                role: req.body.role,
                img2: url + '/images/' + req.file.filename,
                type: req.body.type,
                status: req.body.status






            });
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                    user: 'ajmiaziz109@gmail.com',
                    pass: 'partnerhdi'
                }
            });
        
            var mailOptions = {
                from: 'ajmiaziz109@gmail.com',
                to: req.body.email,
                subject: 'Votre candidature a été enregistrée pour loffre: - Ecole Bahrouni',
                text: 'Le recruteur vous contactera si votre profil correspond au poste proposé. Dans le cas contraire veuillez considérer que votre candidature n´a probablement pas été retenue pour ce poste. Vous pouvez suivre le statut de votre candidature sur votre email...\n\n' +
                    'Nous vous remercions pour votre confiance et pour votre fidélité..:\n\n' +
                    '.\n\n' +
                    '..\n'
        
            };
        
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ',req.body.email);
                }
            });
        }
        else if (req.body.role == "student") {
            user = new User({

                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                mdp: cryptedPwd,
                tel: req.body.tel,
                role: req.body.role,
                img: url + '/images/' + req.file.filename,
                type: req.body.type,
                datenaissance: req.body.datenaissance,
                nat: req.body.nat,
                status: req.body.status,
                presence:req.body.presence,
                niveau:req.body.niveau

            });
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                    user: 'ajmiaziz109@gmail.com',
                    pass: 'partnerhdi'
                }
            });
        
            var mailOptions = {
                from: 'ajmiaziz109@gmail.com',
                to: req.body.email,
                subject: 'Votre candidature a été enregistrée pour loffre: - Ecole Bahrouni',
                text: 'Nous tiendrons dabord à vous remercier pour votre Préinscription et pour l’intérêt que vous portez à notre ecole...\n\n' +
                    'Nous vous remercions pour votre confiance et pour votre fidélité..:\n\n' +
                    '.\n\n' +
                    '..\n'
        
            };
        
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ',req.body.email);
                }
            });

        } else {
            user = new User({

                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                mdp: cryptedPwd,
                role: req.body.role,
                type: req.body.type


            });

        }

        user.save();//save lel user 

        res.status(200).json({
            message: "User created"

        })

      

        

    })
     







});
//add photo to profil
app.post("/api/addphoto/:id", multer({ storage: storage }).single('photo'), (req, res) => {
    console.log("update status", req.body);
    let id = req.params.id;
    console.log(id);

    let url = req.protocol + '://' + req.get('host');
    console.log('here URL', url);


    let user = {
        photo: url + '/images/' + req.file.filename,






    }



    User.updateOne({ _id: id }, {
        $set: {
            photo: url + '/images/' + req.file.filename,

        }
    }).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "insert  photo success"
                })
            }
        }
    )





})
//get les users


app.get("/api/allUsers", (req, res) => {

    console.log("here in get all users");

    User.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                users: docs

            });

        }
    });
});


//delete users add by admin

app.delete("/api/deleteuser/:id", (req, res) => {
    console.log("delete user");

    let id;
    id = req.params.id;
    console.log(id);

    User.deleteOne({ _id: id }).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete sucess"
                })
            }
        }
    )

});

//update type enseignant

app.put("/api/updatetype/:id", (req, res) => {
    console.log("update type");
    let id = req.params.id;
    console.log(id);


    let user = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,

        tel: req.body.tel,
        cin: req.body.cin,
        role: req.body.role,

        type: req.body.type,
        typeetranger: req.body.typeetranger




    }



    User.updateOne({ _id: id }, user).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "update type success"
                })
            }
        }
    )
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'ajmiaziz109@gmail.com',
            pass: 'partnerhdi'
        }
    });

    var mailOptions = {
        from: 'ajmiaziz109@gmail.com',
        to: req.body.email,
        subject: 'Condidature de preinscripttion Ecole primaire Bahrouni',
        text: 'Nous tiendrons dabord à vous remercier pour votre candidature et pour l’intérêt que vous portez à notre ecole..\n\n' +
            'En réponse à votre candidature pour passer votre condidature au sein de notre  ecole, nous sommes au regret de devoir vous informer que celle-ci a été retenue avec success.:\n\n' +
            'un de notre equipe sera reapelerais pour plus dinformations.\n\n' +
            'Bonne journéé..\n'

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ',req.body.email);
        }
    });





})
//update status

app.put("/api/updatestatus/:id", (req, res) => {
    console.log("update status");
    let id = req.params.id;
    console.log(id);


    let user = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,

        tel: req.body.tel,
        cin: req.body.cin,
        role: req.body.role,

        type: req.body.type,
        status: req.body.status,

        statusetranger: req.body.statusetranger




    }



    User.updateOne({ _id: id }, user).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "update status success"
                })
            }
        }
    )
    

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'ajmiaziz109@gmail.com',
            pass: 'partnerhdi'
        }
    });

    var mailOptions = {
        from: 'ajmiaziz109@gmail.com',
        to: req.body.email,
        subject: 'Condidature de preinscripttion Ecole primaire Bahrouni',
        text: 'Nous tiendrons dabord à vous remercier pour votre candidature et pour l’intérêt que vous portez à notre ecole..\n\n' +
            'En réponse à votre candidature pour passer votre condidature au sein de notre  ecole, nous sommes au regret de devoir vous informer que celle-ci na pas été retenue.:\n\n' +
            'Soyez cependant assuré que cette décision ne met pas en cause vos qualités personnelles, ni même celles de votre formation.\n\n' +
            'Bonne chance pour la suite de vos recherches..\n'

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ',req.body.email);
        }
    });





})

//create group

app.post("/api/addgroup", (req, res) => {

    console.log("here in create group", req.body);




    let group = {};





    group = new Group({
        nomgroupe: req.body.nomgroupe,
        module: req.body.module,
        enseignat: req.body.enseignat,
        datedebut: req.body.datedebut,
        datefin: req.body.datefin,
        type: req.body.type,
        idEleve: req.body.idEleve





    });




    group.save();//save lel user 

    res.status(200).json({
        message: "group has been created"

    })








});

//login 

app.post("/api/login", (req, res) => {
    console.log("Here in login", req.body);



    User.findOne({ email: req.body.email }).then( //hashty b user wehed //
        (resultEmail) => {
            console.log("resultEmail", resultEmail);//ken fama haja email besh yarjaa f resultemail//
            if (!resultEmail) {
                //ken email ghalta//
                res.status(200).json({
                    findedUser: "Wrong Email"
                    //yajaalo msg hedheka //
                });
            }
            //besh yetaada ytasty aal mdp

            return bcrypt.compare(req.body.mdp, resultEmail.mdp);//besh decryptage khater crypte //
        })
        .then(
            (resultPwd) => {
                console.log("resultPwd", resultPwd);
                if (!resultPwd) {

                    //len mdp ghalta //
                    res.status(200).json({
                        findedUser: "Wrong password" //yrajaalek msg hedheka //
                    });
                }
                //si non yrajaalek ojet kol 
                else {

                    User.findOne({ email: req.body.email }).then(
                        (result) => {

                            console.log("result", result);
                            res.status(200).json({
                                findedUser: result //variable finded user besh takho result //
                            })
                        }
                    )

                }

        })

        

        









});

//get user by id
app.get("/api/allusers/:id", (req, res) => {
    let id;
    let user = {};

    id = req.params.id;
    console.log(id);
    //search

    User.findOne({ _id: id }).then(
        (doc) => {
            console.log(doc);
            //succes to front
            res.status(200).json({
                user: doc
            })
        }
    )
})
// update user
app.put("/api/updateuser/:id", (req, res) => {
    console.log("update user");

    let user = {
        _id: req.body._id,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        mdp: req.body.mdp,
        img: req.body.img


    }

    let id = req.params.id;
    User.updateOne({ _id: id }, user).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "update sucess"
                })
            }
        }
    )





});

//create conges
app.post("/api/addconges", multer({
    storage: storage
}).single('certif'), (req, res) => {

    console.log("here in create conges", req.body);

    let url = req.protocol + '://' + req.get('host');
    console.log('here URL', url);




    let conges = {};





    conges = new Conges({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        datefin: req.body.datefin,
        datedebut: req.body.datedebut,
        message: req.body.message,
        type: req.body.type,
        idenseignant: req.body.idenseignant,
        status: req.body.status,
        certif: url + '/images/' + req.file.filename,






    });




    conges.save();//save lel user 

    res.status(200).json({
        message: "conges has been created"

    })








});

app.get("/api/allconges", (req, res) => {

    console.log("here in get all conges");

    Conges.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                conges: docs

            });

        }
    });
});

//update sur le  de conges de l'enseignant

app.put("/api/updateconge/:id", (req, res) => {
    console.log("update conges");
    let id = req.params.id;
    console.log(id);



    let conges = {
        _id: req.body._id,
        status: req.body.status,
        nom: req.body.nom,
        prenom: req.body.prenom,
        datedebut: req.body.datedebut,
        datefin: req.body.datefin,
        message: req.body.message,
        certif: req.body.certif






    }


    Conges.updateOne({ _id: id }, conges).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "update sucess"
                })
            }
        }
    )





});
//update status conges
app.put("/api/updatestatusconges/:id", (req, res) => {
    console.log("update status");
    let id = req.params.id;
    console.log(id);


    let conges = {
        _id: req.body._id,

        nom: req.body.nom,
        prenom: req.body.prenom,
        datedebut: req.body.datedebut,
        datefin: req.body.datefin,
        message: req.body.message,
        status: req.body.status,
        certif: req.body.certif




    }



    Conges.updateOne({ _id: id }, conges).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "update status success"
                })
            }
        }
    )





});
//get by id conges
app.get("/api/allconge/:id", (req, res) => {
    let id;
    let conge = {};

    id = req.params.id;
    console.log(id);
    //search

    Conges.findOne({ _id: id }).then(
        (doc) => {
            console.log(doc);
            //succes to front
            res.status(200).json({
                conge: doc
            })
        }
    )
})
//delete conges
app.delete("/api/deleteconge/:id", (req, res) => {
    console.log("delete conge");
    console.log(req.params.id);

    let id;
    id = req.params.id;
    console.log(id);

    Conges.deleteOne({ _id: id }).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete sucess"
                })
            }
        }
    )

});

//add paiment

app.post("/api/addpay", (req, res) => {

    console.log("here in create pay ", req.body);





    let paiment = {};





    paiment = new Paiment({
        idEleve: req.body.idEleve,
        date: req.body.date,
        Price: req.body.Price,
        mode: req.body.mode,
        tranche: req.body.tranche,
        Advance: req.body.Advance,
        Rest: req.body.Rest






    });




    paiment.save();//save lel user 

    res.status(200).json({
        message: "pay created"

    })









});
// get paiment by id

app.get("/api/allpaiment/:id", (req, res) => {
    let id;
    let paiment = {};

    id = req.params.id;
    console.log(id);
    //search

    Paiment.findOne({ _id: id }).then(
        (doc) => {
            console.log(doc);
            //succes to front
            res.status(200).json({
                paiment: doc
            })
        }
    )
})
//get all paiments

app.get("/api/allpaiments", (req, res) => {

    console.log("here in get all paiments");


    Paiment.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                paiments: docs //users besh takho docs ely fih les utilisateurs taa bd//

            });

        }



    });



});
//delete paiment

app.delete("/api/deletepaiment/:id", (req, res) => {
    console.log("here in delete paiment");

    let id;
    id = req.params.id;
    console.log(id);
    Paiment.deleteOne({ _id: id }).then(

        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete  with seccess"
                })
            }
        }
    )
});



//update paiment

app.put("/api/updatepaiment/:id", (req, res) => {
    console.log("update paiment");

    let paiment = {
        _id: req.body._id,
        date: req.body.date,
        Price: req.body.Price,
        mode: req.body.mode,
        Advance: req.body.Advance,
        Rest: req.body.Rest,
        tranche: req.body.tranche



    }

    let id = req.params.id;
    Paiment.updateOne({ _id: req.body._id }, paiment).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "update sucess"
                })
            }
        }
    )





});
//add cour

app.post("/api/addcour", multer({
    storage: storage
}).single('img'), (req, res) => {

    console.log("here in create cour ", req.body);
    let url = req.protocol + '://' + req.get('host');
    console.log('here URL', url);





    let cour = {};





    cour = new Cour({



        idModule: req.body.idModule,
        idEnseignant: req.body.idEnseignant,
        nomMatiere: req.body.nomMatiere,
        idMatiere: req.body.idMatiere,
        status: req.body.status,
        niveau: req.body.niveau,
        type: req.body.type,
        img: url + '/images/' + req.file.filename,








    });




    cour.save();//save lel user 

    res.status(200).json({
        message: "course created"

    })









});
//get all cours



app.get("/api/allcours", (req, res) => {

    console.log("here in get all cours");


    Cour.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                cours: docs //users besh takho docs ely fih les utilisateurs taa bd//

            });

        }



    });



});



// delete //
app.delete("/api/deletecour/:id", (req, res) => {
    console.log("here in delete cour");

    let id;
    id = req.params.id;
    console.log(id);
    Cour.deleteOne({ _id: id }).then(

        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete  with seccess"
                })
            }
        }
    )
});

//update status cour

app.put("/api/updatestatuscour/:id", (req, res) => {
    console.log("update status");
    let id = req.params.id;
    console.log(id);


    let cour = {
        nomModule: req.body.nomModule,
        idModule: req.body.idModule,
        idEnseignant: req.body.idEnseignant,
        nomMatiere: req.body.nomMatiere,
        idMatiere: req.body.idMatiere,
        status: req.body.status,
        type: req.body.type,




    }



    Cour.updateOne({ _id: id }, cour).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "update status success"
                })
            }
        }
    )





})




// create module
app.post("/api/addsubject", (req, res) => {

    console.log("here in create matiere", req.body);




    let subject = {};






    subject = new Subject({
        nomModule: req.body.nomModule,
        coef: req.body.coef,
        idAdmin: req.body.idAdmin,






    });

    Subject.findOne({ nomModule: req.body.nomModule }).then(
        (doc) => {
            console.log(doc);
            //success to front
            if (doc) {
                res.status(200).json({
                    message: "Module exist"
                })
            } else {
                subject.save();//save lel user 

                res.status(200).json({
                    message: "subject  created"

                })
            }

        }
    )













});

//get all modules    

app.get("/api/allmodules", (req, res) => {

    console.log("here in get all modules");
    //besh nrecuperih men backend //

    Subject.find((err, docs) => {  //ken commande  manajmetesh trecuperih besh trjaaholy f err si non variables docs besh trajaaly les utilisateurs ely jebethom men bd
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                subjects: docs //users besh takho docs ely fih les utilisateurs taa bd//

            });

        }



    });



});










// create matiere 
app.post("/api/addmatiere", (req, res) => {

    console.log("here in create matiere", req.body);




    let matiere = {};






    matiere = new Matiere({
        nomMatiere: req.body.nomMatiere,
        description: req.body.description,
        idModule: req.body.idModule,
        nomModule: req.body.nomModule,





    });

    Matiere.findOne({ nomMatiere: req.body.nomMatiere }).then(
        (doc) => {
            console.log(doc);
            //success to front
            if (doc) {
                res.status(200).json({
                    message: "matiere exist"
                })
            } else {
                matiere.save();//save lel user 

                res.status(200).json({
                    message: "matiere create"

                })
            }

        }
    )













});

//get all matieres

app.get("/api/allmatieres", (req, res) => {

    console.log("here in get all matiere");


    Matiere.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                matieres: docs

            });

        }



    });



});


//generate quittance de payment

app.get("/paiments/generateFile/pdf", (req, res) => {



    Paiment.find((err, docs) => {
        if (err) {
            console.log("ERROR");
        } else {

            const doc = new PDFDocument({});

            doc.pipe(fs.createWriteStream(`backend/pdfs/test1.pdf`));
            const stream = doc.pipe(blobStream());



            doc
                .image("backend/images/logo.jpg", 50, 45, { width: 50 })
                .fillColor('#444444')
                .fontSize(20)
                .text('ACME Inc.', 110, 57)
                .fontSize(10)
                .text('123 Main Street', 200, 65, { align: 'right' })
                .text('New York, NY, 10025', 200, 80, { align: 'right' })
                .moveDown();



           


            const table = {
                headers: [

                    "Date de Paeiment",
                    "mode",
                    "tranche",
                    "Avance",
                    
                    "total"

                ],
                rows: [],
            };

            for (const paiment of docs) {
                table.rows.push([

                    paiment.date,
                    paiment.mode,
                    paiment.tranche,
                    paiment.Advance,
                    
                    paiment.Price,





                ]);
            }
















            doc.moveDown().table(table, 10, 270, { width: 590 });
            doc.fontSize(
                10,
            ).text(
                'Payment is due within 15 days. Thank you for your business.',
                50,
                700,
                { align: 'center', width: 500 },
            );
            doc.end();
            // stream.on('finish', function () {
            //     var blob, url;
            //     blob = stream.toBlob('application/pdf');
            //     url = stream.toBlobURL('application/pdf');
            //     return iframe.src = url;

            // });




            res.status(200).json({
                message: "HERE PDF (success)",


            });

            // res.download('blob');
        }
    });


});

app.get("/payments/generateFile/pdf/:id", (req, res) => {
    console.log("here in get pdf eleve");
    let id = req.params.id;
    Paiment.findOne({ _id: id }).then(
      (doc) => {
        if (doc) {
          console.log(doc);
          User.findOne({ _id: doc.idEleve }).then(
            (user) => {
              // Create The PDF document
              const document = new PDFDocument();
              // Pipe the PDF into a user's file
              document.pipe(fs.createWriteStream(`backend/pdfs/test2.pdf`));
              // Add the header -https://pspdfkit.com/blog/2019/generate-invoices pdfkit-node/
              document
                .image("backend/images/logo.jpg", 50, 45, { width: 50 })
                .fillColor("#444444")
                .fontSize(20)
                .text("liste des éleves payés", 110, 57)
                .fontSize(10)
                .text("Ecole Primaire", 200, 65, { align: "right" })
                .text(" De Karoui Mayssa", 200, 80, { align: "right" }).moveDown();
              // Create the table  https://www.andronio.me/2017/09/02/pdfkit-tables/
              const table = {
                headers: [
                  "FirstName",
                  "LastName",
                  "Email Address",
                  "Phone",
                  "Date de Paeiment",
                  "mode",
                  "Total",
                  "Avance",
                  
  
                ],
                rows: [],
              };
              // Add the users to the table
              // for (const payment of doc) {
              table.rows.push([
                user.nom,
                user.prenom,
                user.email,
                user.tel,
                doc.date,
                doc.mode,
                doc.Price,
                doc.Advance,
                
  
  
  
  
  
              ]);
              // }
              // Draw the table
              document.moveDown().table(table, 10, 125, { width: 590 }); // Finalizethe PDF and end the stream
              document.end();
              res.status(200).json({
                message: "HERE PDF (success)",
              });
            });
        }
        else {
          console.log("error in DB");
        }
      });
  
  });




//get all  groupes

app.get("/api/allgroups", (req, res) => {

    console.log("here in get all groups");
    //besh nrecuperih men backend //

    Group.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                groups: docs
            });

        }



    });



});

//create fiche

app.post("/api/addfiche", (req, res) => {

    console.log("here in create fiche", req.body);



    let fiche = {};


    fiche = new Fiche({

        remarque: req.body.remarque,
        presence: req.body.presence,
        idEleve: req.body.idEleve,
        idEnseignant: req.body.idEnseignant,
        idAdmin: req.body.idAdmin,
        idMatiere: req.body.idMatiere,
        idGroupe: req.body.idGroupe,
        date: req.body.date,









    });


    fiche.save();

    res.status(200).json({
        message: "fiche created"

    })







});




//get fiches
app.get("/api/allfiches", (req, res) => {

    console.log("here in get all fiches");


    Fiche.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                fiches: docs

            });

        }



    });



});



//get fiche by id


app.get("/api/allfiches/:id", (req, res) => {
    let id;
    let fiche = {};


    id = req.params.id;

    console.log(id);
    //search //

    Fiche.findOne({ _id: id }).then(
        (doc) => {
            console.log(doc);
            //success to front
            res.status(200).json({
                fiche: doc
            })
        }
    )



});



// delete fiches
app.delete("/api/deletefiche/:id", (req, res) => {
    console.log("here in delete fiche ");

    let id;
    id = req.params.id;
    console.log(id);
    Fiche.deleteOne({ _id: id }).then(

        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete  with seccess"
                })
            }
        }
    )
});


//create Note

app.post("/api/addnote", (req, res) => {

    console.log("here in create note", req.body);



    let note = {};


    note = new Note({

        note: req.body.note,

        idEleve: req.body.idEleve,
        idEnseignant: req.body.idEnseignant,
        idAdmin: req.body.idAdmin,
        idMatiere: req.body.idMatiere,
        idModule: req.body.idModule,
        idGroupe: req.body.idGroupe,











    });


    note.save();

    res.status(200).json({
        message: "note created"

    })







});

//get notes
app.get("/api/allnotes", (req, res) => {

    console.log("here in get all notes");


    Note.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                notes: docs

            });

        }



    });



});




// delete notes
app.delete("/api/deletenote/:id", (req, res) => {
    console.log("here in delete note ");

    let id;
    id = req.params.id;
    console.log(id);
    Note.deleteOne({ _id: id }).then(

        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete  with seccess"
                })
            }
        }
    )
});

app.get("/api/notebyid/:id", (req, res) => {
    let id;
    let note = {};

    id = req.params.id;
    console.log(id);
    //search

    Note.findOne({ _id: id }).then(
        (doc) => {
            console.log(doc);
            //succes to front
            res.status(200).json({
                note: doc
            })
        }
    )
})

// insert id groupe into user
app.post("/api/addaffect/:id", (req, res) => {
    console.log("update status", req.body);
    let id = req.params.id;
    console.log(id);


    let affect = {
        idgroupe: req.body.idgroupe





    }



    User.updateOne({ _id: id }, {
        $set: {
            idgroupe: req.body.idgroupe
        }
    }).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "insert success"
                })
            }
        }
    )





})

//create reclamation eleve

app.post("/api/addreclamation", (req, res) => {

    console.log("here in create reclamation", req.body);



    let reclamation = {};


    reclamation = new Reclamation({


        reclamation: req.body.reclamation,
        idEleve: req.body.idEleve,
        idEnseignant: req.body.idEnseignant,
        idMatiere: req.body.idMatiere,
        date: req.body.date,
        idModule: req.body.idModule,
        type: req.body.type








    });


    reclamation.save();

    res.status(200).json({
        message: "reclamation created"

    })







});



//get reclamations
app.get("/api/allreclamations", (req, res) => {

    console.log("here in get all reclamations");


    Reclamation.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                reclamations: docs

            });

        }



    });



});


app.delete("/api/deletereclam/:id", (req, res) => {
    console.log("here in delete reclam ");

    let id;
    id = req.params.id;
    console.log(id);
    Reclamation.deleteOne({ _id: id }).then(

        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete  with seccess"
                })
            }
        }
    )
});

//create notif

app.post("/api/addnotif", (req, res) => {

    console.log("here in create notif", req.body);



    let notif = {};


    notif = new Notifications({

        title: req.body.title,

        date: req.body.date,
        status: req.body.status,
        type: req.body.type,
        nom: req.body.nom,
        prenom: req.body.prenom,
        idEnseignant: req.body.idEnseignant











    });


    notif.save();

    res.status(200).json({
        message: "notif created"

    })







});
//get all notif

app.get("/api/allnotifications", (req, res) => {

    console.log("here in get all notifications");


    Notifications.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                notification: docs

            });

        }



    });



});

//delete notif

app.delete("/api/deletenotification/:id", (req, res) => {
    console.log("here in delete notif ");

    let id;
    id = req.params.id;
    console.log(id);
    Notifications.deleteOne({ _id: id }).then(

        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete  with seccess"
                })
            }
        }
    )
});

//update status notif

app.put("/api/updatestatusnotif/:id", (req, res) => {
    console.log("update status");
    let id = req.params.id;
    console.log(id);


    let notif = {
        _id: req.body._id,

        nom: req.body.nom,
        prenom: req.body.prenom,
        title: req.body.title,

        date: req.body.date,
        status: req.body.status,
        type: req.body.type




    }



    Notifications.updateOne({ _id: id }, notif).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "update status success"
                })
            }
        }
    )





});



//create  online user

app.post("/api/addonline", (req, res) => {

    console.log("here in create  online user", req.body);

    bcrypt.hash(req.body.mdp, 10).then(cryptedPwd => {

        let user = {};


        user = new User({
            nom: req.body.nom, //req.body:corps de requete shnia fih //
            prenom: req.body.prenom,
            email: req.body.email,
            mdp: cryptedPwd,  //cryptage taa password//
            tel: req.body.tel,

            cours: req.body.cours,
            status: req.body.status,
            idetranger: req.body.idetranger,

            type: req.body.type,
            priorite: req.body.priorite,
            idcourseonline: req.body.idcourseonline







        });


        user.save();

        res.status(200).json({
            message: "online user created"

        })



    })



});

// create online course 
app.post("/api/addcourseonline", multer({
    storage: storage
}).single('img'), (req, res) => {

    console.log("here in create online", req.body);




    let courseonline = {};

    let url = req.protocol + '://' + req.get('host');
    console.log('here URL', url);







    courseonline = new Courseonline({
        nom: req.body.nom,
        enseignant: req.body.enseignant,
        prix: req.body.prix,
        max: req.body.max,
        img: req.body.img,
        description: req.body.description,
        idEtra: req.body.idEtra,
        img: url + '/images/' + req.file.filename



    });




    courseonline.save();//save lel user 

    res.status(200).json({
        message: "course has been created"

    })








});





//get all course online    

app.get("/api/allcourseonline", (req, res) => {

    console.log("here in get all courses ");
    //besh nrecuperih men backend //

    Courseonline.find((err, docs) => {  //ken commande  manajmetesh trecuperih besh trjaaholy f err si non variables docs besh trajaaly les utilisateurs ely jebethom men bd
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                courseonlines: docs //users besh takho docs ely fih les utilisateurs taa bd//

            });

        }



    });



});





// delete cours online //
app.delete("/api/deletecouronline/:id", (req, res) => {
    console.log("here in delete cour");

    let id;
    id = req.params.id;
    console.log(id);
    Courseonline.deleteOne({ _id: id }).then(

        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete  with seccess"
                })
            }
        }
    )
});

//add and delete and get
app.post("/api/addevent", (req, res) => {

    console.log("here in create event", req.body);





    let event = {};





    event = new Event({
        title: req.body.title,
        date: req.body.date,
        datefin: req.body.datefin,

    });








    event.save();//save lel user 

    res.status(200).json({
        message: "success"

    })









});
app.get("/api/allevents", (req, res) => {

    console.log("here in get all events");

    Event.find((err, docs) => {
        if (err) {

            console.log('error in DB');

        }

        else {
            res.status(200).json({
                posts: docs

            });

        }
    });
});
app.delete("/api/deleteevent/:id", (req, res) => {
    console.log("delete event");

    let id;
    id = req.params.id;
    console.log(id);

    Event.deleteOne({ _id: id }).then(
        (result) => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "delete sucess"
                })
            }
        }
    )

});










































































module.exports = app;


