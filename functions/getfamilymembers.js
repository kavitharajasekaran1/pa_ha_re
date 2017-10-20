'use strict';


const user = require('../models/user');


exports.getfamilymembers = ((rapidID) =>{

   return new Promise((resolve, reject) => {
       user.find({"rapidID":rapidID})
     
		.then(users => {
            var name =[];
          var members =users[0].familyMembers
             user.find({"rapidID":members})
                .then(member =>{
                    if(members.length>=1){
			for (let i =0;i<member.length;i++){
                       name.push({"name": member[i].registerObj.FirstName,
                                        "member":member[i].rapidID })
            }
			resolve({
                        status: 200,
                        names: name
                        

                    });

                 }else {  

                    reject({
                        status: 402,
                        message: 'profile not built yet'
                    });
                }
            })
        })
        

            
            .catch(err => reject({
                status: 500,
                message: 'internal server error!'
            }));

    })
});