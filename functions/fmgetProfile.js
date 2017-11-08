'use strict';

const report = require('../models/report');

exports.fmgetProfile = ((rapidID) =>{

   return new Promise((resolve, reject) => {
   
		report.find({"rapidID":rapidID})

		.then(reports => {
            var profileObj=[];
            var growableObj=[];
               console.log("length of reports",reports.length)
                for(let i=0;i<reports.length;i++){

                    if(reports[i]._doc.profileObj){
                       
                        profileObj.push(reports[i]._doc.profileObj)
                    }else{
                        console.log(reports[i]._doc.created_at)
                        const mydate =(reports[i]._doc.created_at)
                        console.log(mydate)
                        const date =  mydate.substr(0, 15);
                        const time = mydate.substr(16,9)
                        console.log("formdate ======>>",date);
                        console.log("formdate ======>>",time);
                        
                        growableObj.push({"growableObj":reports[i]._doc.growableObj,
                        "date":date,
                        "time":time})
                    }
                    
                    
                }
               // console.log("profileObj",profileObj)

			if(reports.length!=0){

			resolve({
                        status: 200,
                        "growableObj": growableObj,
                        "profileObj":profileObj
                    });

                 }else {

                    reject({
                        status: 402,
                        message: 'Profile Not Built Yet'
                    });
                }
            })

            
            .catch(err => reject({
                status: 500,
                message: 'Internal Server Error!'
            }));

	})
	})