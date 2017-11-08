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
mongoose.connect('mongodb://rpqb:Rpqb@123@ds151355.mlab.com:51355/phr_v1', { useMongoClient: true });

module.exports = mongoose.model('files', Photo);