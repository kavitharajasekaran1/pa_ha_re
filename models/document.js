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
mongoose.connect('mongodb://phr:phr12345@ds211592.mlab.com:11592/phr',{ useNewUrlParser: true });

module.exports = mongoose.model('files', Photo);