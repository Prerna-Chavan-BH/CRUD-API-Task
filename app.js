const express = require('express');
const bodyParser = require('body-parser');
const typesRoutes = require('./routes/typesRoutes');
const alertsRoutes = require('./routes/alertsRoutes');
const sequelize = require('./config/db');

//create an express app
const app = express();
const PORT = 9000;

//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api', typesRoutes);
app.use('/api', alertsRoutes);

// //default routes
// app.get('/', (req, res) => {
//     res.send('Welcome to CRUD API for types and Alerts');
// });
//start the server and initialise the database
(async () => {
    try{
        await sequelize.sync();
        console.log('Sequelize models synchronised successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(error){
        console.log('Error synchronising sequelize models: ', error);
    }
}) ();