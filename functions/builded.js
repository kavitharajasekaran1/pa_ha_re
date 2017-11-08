'use strict';
const report = require('../models/report');

exports.builded=(rapidID) =>{
 return    new Promise((resolve, reject) => {
    var cont=[];
    var build =[];
    var notbuild =[];

        report.find({
            "rapidID":rapidID
        })
        .then((reports) =>{
                 console.log(reports.length)
            for(let i=0;i<reports.length;i++){

              cont.push(reports[i]._doc.profileObj)
             
             }
             console.log(cont);
             console.log(cont.length)
             for (let i=0;i<cont.length;i++){
             if (typeof cont[i] !== 'undefined'){
                 build.push(i)
                 console.log(build)
             }else{
                notbuild.push(i)
                console.log(notbuild)
             }
            }
             if(build.length<1){  
        resolve({
              status: 201,
                message:"Please Build Profile"
            })
        }else{  
        reject({ 
             status: 409,
             message:"Profile Already Built"
           })
        }
        })
          
            .catch(err => {

                    reject({
                        status: 500,
                        message: 'Internal Server Error'
                    });
            });

        })
    }