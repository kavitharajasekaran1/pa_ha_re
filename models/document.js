'use strict';


const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var Photo = mongoose.Schema({
    url: {
        type: String,
        length: 255
    },

    rapidID: String

});
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://manoj:manoj123@ds111492.mlab.com:11492/phr',{ useNewUrlParser: true });

module.exports = mongoose.model('files', Photo);