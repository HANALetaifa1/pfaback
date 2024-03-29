const express = require('express');
const router = express.Router();
const User = require('../Modeles/user');
// const Medecin = require('../models/medecin.js');
 const specialite = require('../Modeles/specialite');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { uploadFile } = require("../middleware/uploadFile");
const jwt = require('jsonwebtoken'); 


var transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: 'rahmaa.hamza.2001@gmail.com',
        pass: 'szpluqqcsmtbbqwa'
    },
    tls: {
        rejectUnauthorized: false
    }
})

require('dotenv').config()

router.post('/register', uploadFile.single("avatar"),async (req, res) =>  { 
    try { 
        //ajou****
    let { email, password, firstName, lastName,accountStatus ,  isActive} = req.body 
    const avatar =req.file.filename 
     const user = await User.findOne({ email }) 
             if (user) return res.status(404).send({ success: false, message: "L'utilisateur existe déjà" }) 
      
             const newUser = new User({ email, password, firstName, lastName,avatar }) 
      
             const createdUser = await newUser.save() 
      
    // Un e-mail de vérification est envoyé à l'utilisateur pour vérifier son adresse e-mail
    var mailOption ={ 
      from: '"Vérifiez votre e-mail " <rahmaa.hamza.2001@gmail.com>', 
      to: newUser.email, 
      subject: 'vérifiez votre email ', 
      html:`<h2>${newUser.firstName}! Merci de votre inscription sur notre site</h2> 
      <h4>Veuillez vérifier votre e-mail pour continuer.</h4> 
      <a href="http://${req.headers.host}/api/user/status/edit?email=${newUser.email}"> Cliquez ici </a>` 
    } 
    transporter.sendMail(mailOption,function(error,info){ 
      if(error){ 
        console.log(error) 
      } 
      else{ 
        console.log('email de vérification envoyé à votre compte Gmail ') 
      } 
    }) 
      //const url =`http://localhost:3000/activate/${token}`; 
     
     
        return res.status(201).send({ success: true, message: "Compte créé avec succès", user: createdUser }) 
      
         } catch (err) { 
             console.log(err) 
             res.status(404).send({ success: false, message: err }) 
      
         } 
      
     }); 
      


    //  router.get('/status/edit/', async (req, res) => {
    //     try {
    
    //         let email = req.query.email
    //         console.log(email)
    //         let user = await User.findOne({ email })
    //         user.isActive = !user.isActive
    //         user.save()
    //         res.send({ success: true, user })
    //     } catch (err) {
    //         return res.send({ success: false, message: err })
    //     }
    // })

    
router.put('/status/edit',  async (req, res) =>  { 
        try { 
     
            let { idUser } = req.body 
            let user = await User.findById(idUser).select('+isActive') 
            user.isActive = !user.isActive 
            user.save() 
            res.status(200).send({ success: true, user }) 
        } catch (err) { 
            return res.status(404).send({ success: false, message: err }) 
        } 
       })





// router.post('/login', async (req, res) => {
//     try {
//         const data = req.body;
//         const user = await User.findOne({ email: data.email });
        
//         if (!user) {
//             return res.status(404).send('Email or password invalid !');
//         } else {
//             const validPass = bcrypt.compareSync(data.password, user.password);
//             if (!validPass) {
//                 return res.status(401).send('password  invalid');
//             } else {
//                 const payload = {
//                     _id: user._id,
//                     email: user.email
//                 };
//                 const token = jwt.sign(payload, '000000');
//                 return res.status(200).send({ mytoken: token });
//             }
//         }
//     } catch (err) {
//         return res.status(500).send(err);
//     }
// });
//login d'utilisateur se connecter
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return res.send({ success: false, message: "All fields are required" })
        }
        let user = await User.findOne({
            email
        }).populate('specialiteID')
        if (!user) {
            return res.send({ success: false, message: "Le compte n'existe pas" })
        } else {
            let isCorrectPassword = await bcrypt.compare(password, user.password)
            if (isCorrectPassword) {
                if (user.accountStatus !== 'accepter') {
                    return res.send({ success: false, message: "Votre compte n'est pas accepté pour l'administrateur" })
                }
                delete user._doc.password
                if (!user.isActive) return res.send({
                    success:
                        false, message: ' Votre compte est inactif, veuillez contacter votre administrateur'
                })
                const token = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                // const token = jwt.sign({
                //     iduser: user._id, 
                //     role: user.role,
                //      firstName: user.firstName, 
                //      lastName: user.lastName ,
                //      phone: user.phone ,
                //      email: user.email },
                //     process.env.SECRET, { expiresIn: "1h", })
                return res.send({ success: true, user, token, refreshToken })
            } else {
                return res.send({
                    success: false, message:
                        "vérifier vos informations d'identification"
                })
            }
        }
    } catch (err) {
        return res.send({
            success: false, message: err.message
        })
    }
});

//Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ iduser: user._id, role: user.role },
        process.env.SECRET, { expiresIn: '60s' })
}

// Refresh
function generateRefreshToken(user) {
    return jwt.sign({ iduser: user._id, role: user.role },
        process.env.REFRESH, { expiresIn: '1y' })
}
//Refresh Route
router.post('/refreshToken', async (req, res,) => {
    console.log(req.body.refreshToken)
    const refreshtoken = req.body.refreshToken;
    if (!refreshtoken) {
        return res.send({
            success: false, message: 'Token Not Found'
        });
    }
    else {
        jwt.verify(refreshtoken, process.env.REFRESH, (err, user) => {
            if (err) {
                console.log(err)
                return res.send({
                    success: false, message:
                        'Unauthorized'
                });
            }
            else {
                const token = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                console.log("token-------", token);
                res.send({
                    success: true,
                    token,
                    refreshToken
                })
            }
        });
    }
});





//************************************** */


router.get('/getall', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).send(users); // 200 indique que la réponse est réussie
        })
        .catch(err => {
            res.status(500).send(err); // Envoyer une réponse d'erreur avec un code de statut 500
        });
});

router.get('/getbyid/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).send("Utilisateur non trouvé"); // Envoyer une réponse avec un code de statut 404 si l'utilisateur n'est pas trouvé
            }
            res.status(200).send(user);
        })
        .catch(err => {
            res.status(500).send(err); // Envoyer une réponse d'erreur avec un code de statut 500
        });
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).send("Utilisateur non trouvé"); // Envoyer une réponse avec un code de statut 404 si l'utilisateur n'est pas trouvé
            }
            res.status(200).send(deletedUser);
        })
        .catch(err => {
            res.status(500).send(err); // Envoyer une réponse d'erreur avec un code de statut 500
        });
});

router.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    User.findByIdAndUpdate(id, newData, { new: true }) // Utilisez l'option { new: true } pour retourner le document mis à jour
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).send("Utilisateur non trouvé"); // Envoyer une réponse avec un code de statut 404 si l'utilisateur n'est pas trouvé
            }
            res.status(200).send(updatedUser);
        })
        .catch(err => {
            res.status(500).send(err); // Envoyer une réponse d'erreur avec un code de statut 500
        });
});

module.exports = router;
