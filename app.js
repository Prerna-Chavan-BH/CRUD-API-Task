const express = require('express');
const bodyParser = require('body-parser');
const initDB = require('./models/dbSetup');
const typesRoutes = require('./routes/typesRoutes');
const alertsRoutes = require('./routes/alertsRoutes');

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

//default routes
app.get('/', (req, res) => {
    res.send('Welcome to CRUD API for types and Alerts');
});
//start the server and initialise the database
app.listen(PORT, async() => {
    try{
        console.log(`Server is running at http://localhost:${PORT}`);
        await initDB();  //initialise database tables
        console.log('Database initialized successfully');
    }catch(err){
        console.error('Error initialising database: ',err.message);
        process.exit(1); //exit the process if db initialization failed
    }
});