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
mongoose.connect('mongodb://manoj:manoj123@ds111492.mlab.com:11492/phr',{ useNewUrlParser: true });

module.exports = mongoose.model('report', reportSchema);