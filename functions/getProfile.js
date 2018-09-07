'use strict';


const user = require('../models/user');
const report = require('../models/report');

const nem = require("nem-sdk").default;


exports.getProfile = ((address) =>{
    var decoded= [];
   return new Promise((resolve, reject) => {
       // create an endpoint
        var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");
      //call for getting account data of a particular user
        nem.com.requests.account.transactions.all(endpoint, address)
        .then(function(res) {
    console.log("\nAll transactions of the account:");
    console.log("res",response);
	for (let i=0;i<res.data.length;i++){
		if(!res.data[i].transaction.message)
			{
    console.log("error");
	}
	else{
        console.log(res.data)
		var message= (res.data[i].transaction.message.payload);
      decoded.push(nem.utils.format.hexToUtf8(message));
      console.log("sri",decoded);
    
    }
}
console.log("rfsdrsrsarsa",decoded)
		report.find({"referenceid":decoded})

		.then(reports => {
            var profileObj =[];
            var growableObj =[];
             
                for(let i=0;i<reports.length;i++){

                    if(reports[i]._doc.profileObj){
                       
                        profileObj.push(reports[i]._doc.profileObj)
                    }else{
                       
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

			if(reports.length!=0){

			resolve({
                        status: 200,
                       
                        "profileObj":profileObj,
                        "growableObj": growableObj
                    })

                 }else {

                    reject({
                        status: 402,
                        message: 'Profile of the user not built yet'
                    });
                }
            })

            
            .catch(err => reject({
                message: 'Internal Server Error!'
            }));

	})
	})
})