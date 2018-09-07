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

              console.log("users",users)

                if(users.rapidID === fmRapidID){

                    resolve({

                        status: 200,

                        message: "Family member Added"

                    });

                }

                else{

                    reject({

                        status: 402,

                        message: 'Wrong RapidID'

                    });

                }

            

            })

        }

    })

            .catch(err => reject({

                status: 500,

                message: 'Register Please!'

            }))

    });


