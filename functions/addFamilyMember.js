'use strict';

const user = require('../models/user');

exports.add = (rapidID,fmRapidID) =>

    new Promise((resolve, reject) => {

     user.find({"rapidID":fmRapidID})
     .then(owner=>{
       if(owner.length=1){  
    
        user.findOneAndUpdate({
            "rapidID": rapidID
        }, {
            $push: {
                "familyMembers": fmRapidID
            }
        })
            .then(users => {
              
                if(owner[0].rapidID === fmRapidID){
                    resolve({
                        status: 200,
                        users: users[0]
                    });
                }
                else{
                    reject({
                        status: 402,
                        message: 'wrong rapidID'
                    });
                }
            
            })
        }
    })
            .catch(err => reject({
                status: 500,
                message: 'register please!'
            }))
    });