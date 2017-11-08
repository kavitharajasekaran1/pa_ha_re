'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = mongoose.Schema({
    
    
    profileObj : Object,
    growableObj : Object,
    referenceid : String,
    rapidID : String,
    created_at: String,
});


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rpqb:Rpqb@123@ds151355.mlab.com:51355/phr_v1', { useMongoClient: true });

module.exports = mongoose.model('report', reportSchema);