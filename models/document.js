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
mongoose.connect('mongodb://rpqb:rpqb123@ds251845.mlab.com:51845/phr', { useMongoClient: true });

module.exports = mongoose.model('files', Photo);