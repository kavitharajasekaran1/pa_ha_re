'use strict';
const report = require('../models/report');

exports.reports=(rapidID) =>{
    var record = [];
 return    new Promise((resolve, reject) => {

        report.find({
            "rapidID":rapidID
        })
        .then((reports) =>{
              for(let i=0;i<reports.length;i++){
              record.push(reports[i])
            }
            console.log(record)
        })
        .then(() =>resolve({

           
                status: 201,
                message:record
            }))
       

            .catch(err => {

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
            });

        })
    }
