'use strict';

const express    = require('express');        
const app        = express(); 
var swaggerJSDoc = require('swagger-jsdoc'); 
var path = require('path'); 
var swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:8001',
    basePath: '/',
  };
  
  // options for the swagger docs
  var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
  };

  // initialize swagger-jsdoc
  var swaggerSpec = swaggerJSDoc(options);             
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();

const port 	   = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(logger('dev'));

require('./routes')(router);
app.use('/', router);
app.engine('pug', require('pug').__express)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.listen(port);

console.log(`App Runs on ${port}`);
