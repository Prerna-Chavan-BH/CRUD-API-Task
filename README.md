Welcome to the CRUD API task :)
This repository consists of the implementation of the crud api's: where i have implemented the basic 4 apis 
      1. POST
      2. GET
      3. DELETE
      4. UPDATE
Technology stack:
    1. Node.js: Backend framework for creating APIs
    2. Express.js: Framework for handling the HTTP requests and routing
    3. Sequelize: ORM for the database interaction (ORM: programming technique that allows developers to work with database data using object-oriented programming languages)
    4. PostgerSQL: Database for storing type definations and alerts
Setup and Installation:
    1. Required: Node.js, Postman and PostgreSQL
    2. Commands required for proper code execution:
      - npm i nodemon
      - npm i --save-dev nodemon
      - npm i uuid
      - npm install express --save
      - npm install --save-dev sequelize-cli
Endpoints:
    1. Post the type : /types (POST)
    2. Get the type : /type (GET)
    3. Fetch type by ID : /type/:id (GET)
    4. Create alerts : /alerts (POST)
    5. Create alerts/search : /alerts/search (POST)
Testing is done using postman. 
