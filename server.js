const express = require('express');
const User = require('./Modeles/user');

 const medecinRoute = require("./routes/medecin.route");
 const patientRoute = require("./routes/patient.route")
 const userRoute = require ("./routes/user.route");
 const adminRoute = require ("./routes/admin.route");
 const disponibiliteRoute =require ("./routes/disponibilite.route");
 const  specialiteRoute = require ("./routes/specialite.route");
 const rendRoute = require ("./routes/rend.route")
 const dosRoute = require("./routes/dossmedicale.route");
 const ordRoute = require("./routes/ord.route");
 const consRoute = require("./routes/cons.route");

require('./config/connect')
const app = express();
app.use(express.json());

//http://127.0.0.1:3000/patient 
app.use('/user', userRoute);
app.use('/medecin', medecinRoute);
app.use('/patient', patientRoute );
app.use('/admin',adminRoute);
app.use('/specialite', specialiteRoute );
app.use('/disponibilite', disponibiliteRoute );
app.use('/rend' , rendRoute)
app.use('/ord' , ordRoute)
app.use('/doss', dosRoute)
app.use('/cons',consRoute)







app.listen(3000, () => {
    console.log('server work');
});
