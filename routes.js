'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
var path = require('path');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var cors = require('cors');

const nem = require("nem-sdk").default;
 const register = require('./functions/register');
 const builded = require('./functions/builded');
 const verifyphone = require('./functions/phoneverification');
 const verifyemail = require('./functions/emailverification');
 const login = require('./functions/login');
 const fmgetProfile = require('./functions/fmgetProfile')
 const addFamilyMember = require('./functions/addFamilyMember')
  const getfamilymembers = require('./functions/getfamilymembers')
 const buildProfile =require('./functions/buildprofile');
 const fmBuildProfile = require('./functions/fmBuildProfile');
 const updateProfile =require('./functions/updateprofile');
 const fmUpdateProfile =require('./functions/fmUpdateProfile');

 const editProfile = require('./functions/editprofile');
 const getresults = require('./functions/getresults')
const config = require('./config/config.json');
const getProfile = require('./functions/getProfile');
var Photo = require('./models/document');
var user = require('./models/user')

const nodemailer = require('nodemailer');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({apiKey: '814c55ce', apiSecret: '942e6e2cc98f7802'});

// connection to email API
var transporter = nodemailer.createTransport("SMTP", {
    host: 'smtp.ipage.com',
    port: 587,
    secure: true,
    auth: {
        user: "risabh.sharma@rapidqube.com",
        pass: "Rpqb@12345"
    }
});
module.exports = router => {

    cloudinary.config({
        cloud_name: 'diyzkcsmp',
        api_key: '188595956976777',
        api_secret: 'F7ajPhx0uHdohqfbjq2ykBZcMiw'

    });

//========================================================================//
	router.get('/', (req, res) => res.end('Welcome to phr!'));

router.post('/registerUser', cors(),function(req,res)
{

const registerObj = req.body.registerObj;
console.log("registerObj",registerObj); 
const Email = req.body.Email;
 const Password = crypto.createHash('sha256').update(req.body.Password).digest('base64');
 console.log("password",Password);
const rapidID = crypto.createHash('sha256').update(Email).digest('base64');
console.log("rapidID",rapidID);
var otp = "";
var possible = "0123456789";
for (var i = 0; i < 4; i++) 
    otp += possible.charAt(Math.floor(Math.random() * possible.length));
var encodedMail = new Buffer(Email).toString('base64');
var Type = req.body.UserType;
       // Set a wallet name
const walletName = Email;
// Set a password
const password = Password;
// Create PRNG wallet
const nem_id = nem.model.wallet.createPRNG(walletName, password, nem.model.network.data.mijin.id);

var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");
// Create a common object
 var common = nem.model.objects.create("common")(password, "");

// // // Get the wallet account to decrypt

 var walletAccount = nem_id.accounts[0];

// // Decrypt account private key 
 nem.crypto.helpers.passwordToPrivatekey(common, walletAccount, "pass:bip32");

// // The common object now has a private key
 console.log("my private key :"+ JSON.stringify(common.privateKey))
 const privateKey = common.privateKey;

if (!Email || !Password) {

            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            register.registerUser(registerObj,Email,Password,Type,nem_id,rapidID,privateKey,otp,encodedMail)

            .then(result => {
                
         var remoteHost = "119.81.59.59:8000"
 var link = "http://" + remoteHost + "/email/verify?mail=" + encodedMail;
console.log(link);
                    var otptosend = otp;
                    var mailOptions = {
                        transport: transporter,
                        from: '"PHR Service"<risabh.sharma@rapidqube.com>',
                        to: Email,
                        subject: 'Please confirm your Email account',

                        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {}
                    });
                    nexmo
                        .message
                        .sendSms('918169226823', registerObj.Phone, otptosend, {
                            type: 'unicode'
                        }, (err, responseData) => {
                            if (responseData) {
                                console.log(responseData)
                            }
                        });
                        res.status(result.status).json({
                            message: result.message
                          
                        });
    
                    })
                    .catch(err => res.status(err.status).json({message: err.message}).json({status: err.status}));
            }
        });
  //====================================================================//
      router.post('/login',  cors(),(req, res) => {

        const Email = req.body.Email;
           console.log(Email)
        const Password1 = req.body.Password;
        const Password= crypto.createHash('sha256').update(Password1).digest('base64')
     console.log(Password)

        if (!Email) {

            res.status(400).json({
                message: 'Invalid Request !'
            });


        } else {

            login.loginUser(Email, Password)

            .then(result => {

                    const token = jwt.sign(result, config.secret, {
                        expiresIn: 60000000000
                    })


                    res.status(result.status).json({
                        message: result.message,
                        token: token,
                        user:result.users.registerObj.FirstName
                       
                    });
                    
          
                })
                 .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
   
        });
  //=======================================================================//      
        router.get("/email/verify", cors(), (req, res, next) => {
            var status;
            var querymail = req.query.mail;
            console.log("URL: " + querymail);
            verifyemail
                .emailverification(querymail)
                .then(result => {
                    var status = result.usr.status
                    if (status.length == 2) {
                        res.send({"status": true, "message": "Registration Successful"});
                    } else {
    
                        res.send({"status": false, "message": "Please verify mobile no too"});
                    }
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        });
        
//==================================================================================//
        router.post("/user/phoneverification",(req, res) => {
           const phone = req.body.Phone;
           console.log("phone",phone);
            var otp = parseInt(req.body.Otp);
            console.log("otp",otp);
    
            verifyphone
                .phoneverification(otp, phone)
                .then(result => {
                    var status = result.usr.status
                    if (status.length == 2) {
                       res
                            .status(result.status)
                            .json({message: "Registration Successful", status: true})
                    } else {
    
                        if (result.status === 404) {
                            res
                                .status(result.status)
                                .json({message: result.message});
                        } else {
                            res
                                .status(200)
                                .json({message: "Please verify emailid too", status: false});
    
                        }
                   }
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        });
    
//================================================================================//
router.post("/addFamilyMember",(req,res)=>{
    if (!checkToken(req)) {
        return res.status(401).json({
            message: "Invalid Token"
        })
     }
     const requestObj = getAddress(req);
     const rapidID = requestObj.users.rapidID;
     const fmRapidID =req.body.rapidID
     console.log("rapidID",rapidID,"fmRapidID",fmRapidID)
     

     if(!fmRapidID){
        res.status(400).json({message:"Invalid Request"})
    }
   
       else{
        addFamilyMember.add(rapidID,fmRapidID)

             .then(result => {
                   res.status(result.status).json({
                   message: result.message
                   });

       })
    .catch(err => res.status(err.status).json({
           message: err.message
       }))
   }
   });
//===============================================================================//
router.get('/fetchfamilyMembers',(req,res)=>{
    if (!checkToken(req)) {
        console.log("invalid token")
        return res.status(401).json({
            message: "Invalid Token"
        })
     }
     const requestObj = getAddress(req);
     
     const rapidID = requestObj.users.rapidID;
     console.log(rapidID)
     
     getfamilymembers.getfamilymembers(rapidID)
      
     .then(result => {
        res.status(result.status).json({
        names: result.names
       // fmRapidID:result.members
        });

})
.catch(err => res.status(err.status).json({
message: err.message
}))
})
//===============================================================================//
    router.post('/buildProfile', (req, res) => {
         if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "Invalid Token"
            })
         }
         const requestObj = getAddress(req);
         const address =requestObj.users.nem_id.accounts[0].address;
         console.log("address",address)
         const rAddress = "MAXS2BX5ZYI7H6ULCSFT7RT5A3CNJO2VQC7AWP5H";
         const profileObj = req.body.profileObj;
         const referenceid =crypto.createHash('sha256').update(JSON.stringify(profileObj)).digest('base64');
         console.log("refernce id",referenceid)
         const password = requestObj.users.Password;
         const privateKey = requestObj.users.privateKey;
         const rapidID = requestObj.users.rapidID;
         console.log("rapidID",rapidID);

         if(!address||!profileObj){
             res.status(400).json({message:"Invalid Request"})
         }
        
            else{
                buildProfile.dotx(rAddress,address,profileObj,password,privateKey,referenceid,rapidID)

                  .then(result => {
                        res.status(result.status).json({
                        message: result.message
                        });

            })
         .catch(err => res.status(err.status).json({
                message: err.message
            }))
        }
        });
 //===========================================================================//
 
//===========================================================================//
router.post('/updateProfile', (req, res) => {
    if (!checkToken(req)) {
       console.log("invalid token")
       return res.status(401).json({
           message: "Invalid Token"
       })
    }
    const requestObj = getAddress(req);
    const address =requestObj.users.nem_id.accounts[0].address;
    console.log("address",address)
    const rAddress = "MAXS2BX5ZYI7H6ULCSFT7RT5A3CNJO2VQC7AWP5H";
     const growableObj = req.body.growableObj;
    const referenceid =crypto.createHash('sha256').update(JSON.stringify(growableObj)).digest('base64');
    console.log("refernce id",referenceid);
    const password = requestObj.users.Password;
    const privateKey = requestObj.users.privateKey;
    const rapidID = requestObj.users.rapidID;

    if(!address||!growableObj){
        res.status(400).json({message:"Invalid Request"})
    }
   
       else{
           updateProfile.update(rAddress,address,growableObj,password,privateKey,referenceid,rapidID)

             .then(result => {
                   res.status(result.status).json({
                   message: result.message
                   });

       })
    .catch(err => res.status(err.status).json({
           message: err.message
       }))
   }
   });
   //===========================================================================================//
  router.get("/builded",(req,res) =>{
    if (!checkToken(req)) {
        console.log("invalid token")
        return res.status(401).json({
            message: "Invalid Token"
        })
     }
     const address1 = getAddress(req);
     const rapidID = address1.users.rapidID;
     builded.builded(rapidID)
     
                       .then(result => {
                             res.status(result.status).json({
                             message:result.message
                             });
     
                 })
                          .catch(err => res.status(err.status).json({
                     message: err.message
                 }));
  })

   //===========================================================================================//        
        router.get("/getProfile",(req,res) =>{
              if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "Invalid Token"
            })
         }
        const address1 = getAddress(req);
        const rapidID = address1.users.rapidID;
        console.log(address1.users.nem_id.accounts[0].address); 
        const address = address1.users.nem_id.accounts[0].address; 
        getProfile.getProfile(address)

                  .then(result => {
                        res.status(result.status).json({
                        profileObj:result.profileObj[0],
                        growableObj:result.growableObj

                        });

            })
                     .catch(err => res.status(err.status).json({
                message: err.message
            }));
                   
        }
    )
    //========================================================================================//
    router.post("/fmgetProfile",(req,res) =>{
        if (!checkToken(req)) {
      console.log("invalid token")
      return res.status(401).json({
          message: "Invalid Token"
      })
   }
  const rapidID = req.body.rapidID
  fmgetProfile.fmgetProfile(rapidID)

            .then(result => {
                  res.status(result.status).json({
                  profileObj:result.profileObj[0],
                  growableObj:result.growableObj

                  });

      })
               .catch(err => res.status(err.status).json({
          message: err.message
      }));
             
  }
)
    //===========================================================================//
    router.post('/editProfile', (req, res) => {
         if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "Invalid Token"
            })
         }
         const address1 = getAddress(req);
        const rapidID = address1.users.rapidID;
        const FirstName = req.body.FirstName;
        const LastName = req.body.LastName;
        const Address = req.body.Address;

         if(!address||!profileObj){
             res.status(400).json({message:"Invalid Request"})
         }
        
            else{
                editProfile.edit(FirstName,LastName,Address)

                  .then(result => {
                        res.status(result.status).json({
                        message: result.message

                        });

            })
         .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
   
        });
  //=========================================================================================//     
      router.post('/UploadDocs', multipartMiddleware, function(req, res, next) {
        const id1 = getAddress(req)
        const rapidID =id1.users[0].rapidID
        var photo = new Photo(req.body);
        
        console.log("req.files.image" + JSON.stringify(req.files));
        var imageFile = req.files.file.path;


        cloudinary.uploader.upload(imageFile, {
                tags: 'express_sample'
            })
            .then(function(image) {
                console.log('** file uploaded to Cloudinary service');
                console.dir(image);
                photo.url = image.url;
                photo.rapidID = rapidID;
                // Save photo with image metadata
                return photo.save();
            })
            .then(function(photo) {

                res.send({
                    url: photo._doc.url,
                    message: "Files Uploaded Succesfully"
                });
            })
            .finally(function() {

                res.render('photos/create_through_server', {
                    photo: photo,
                    upload: photo.image
                });
            });
    });
//============================================================================//
    router.get('getUploads', (req, res) => {
        const rapidID = req.query.rapidID
        Photo.find({
                "rapidID": rapidID
            })
            .then((images) => {
                var image = [];
                for (let i = 0; i < images.length; i++) {
                    image.push(images[i]._doc)

                }

                res.send({

                    images: image,
                    message: "Image Fetched Succesfully"
                });
            })


    });
                 
//==================================================================================================//     
//check sending
router.get('/getresults',(req,res)=>{ 
             var token =req.query.token
             
             var decoded = jwt.verify(token, config.secret);
             var rapidID =(decoded.users.rapidID)
             console.log(rapidID)
        getresults.reports(rapidID)
        .then(result => {  

                       
            res.render('index', {title:"PHR", permanent:result.message})
})
.catch(err => res.status(err.status).json({
    message: err.message
}));

});
//==================================================================================//
router.get('/fmgetresults',(req,res)=>{ 
    var rapidID =decodeURIComponent(req.query.rapidID);
    console.log(rapidID)
    console.log(rapidID)
getresults.reports(rapidID)
.then(result => {  
    console.log(result)

              
   res.render('index', {title:"PHR", permanent:result.message})
})
.catch(err => res.status(err.status).json({
message: err.message
}));

});

//======================================================================//
router.post("/shareReports",(req,res)=>{
    const email = req.body.email
    const token = req.body.token
 
    if(!email||!token){
        res.status(400).json({
            message: 'Invalid Request !'
    })
} else {
    console.log("hello")

    
    var remoteHost = "119.81.59.59:8000"
    var link = "http://" + remoteHost + "/getresults/?token=" + token;
                       var mailOptions = {
                           transport: transporter,
                           from: '"PHR Service"<risabh.sharma@rapidqube.com>',
                           to: email,
                           subject: 'click the link to check reports',
                
                           html: "Hello,<br> Please Click on the link to see reports.<br><a href=" + link + ">Click here to see reports</a>"
                       };
                       transporter.sendMail(mailOptions, (error, info) => {
                           if (error) {
                               console.log(error)
                           }

                        });
                       res.status(200).json({
                        message: "Email Sent"
                      
                    })

            
         
        }
    });
//=============================================================================================//
router.post("/fmshareReports",(req,res)=>{
    const email = req.body.email
    const token = req.body.token
    const rapidID = req.body.rapidID
    console.log(rapidID);
    if(!email||!token||!rapidID){
        res.status(400).json({
            message: 'Invalid Request !'
    })
} else {
    console.log("hello")

    
    var remoteHost = "119.81.59.59:8000"
    var link = "http://" + remoteHost + "/fmgetresults/?rapidID=" + encodeURIComponent(rapidID);;
   console.log(link);
                       var mailOptions = {
                           transport: transporter,
                           from: '"PHR Service"<risabh.sharma@rapidqube.com>',
                           to: email,
                           subject: 'click the link to get result',
   
                           html: "Hello,<br> Please Click on the link to see reports.<br><a href=" + link + ">Click here to see reports</a>"
                       };
                       transporter.sendMail(mailOptions, (error, info) => {
                           if (error) {}
                        });

                       res.status(200).json({
                        message: "Email Sent"
                      
                    })

            
         
        }
    });
//================================================================================================//
router.post("/sos",(req,res)=>{
  
    if (!checkToken(req)) {
        console.log("invalid token")
        return res.status(401).json({
            message: "Invalid Token"
        })
     }
     const longitude = req.body.Longitude;
     console.log(longitude)
     const lattitude = req.body.Latitude;
     console.log(lattitude)
     const userObj = getAddress(req);
     const emergency = userObj.users.registerObj.Eemail[0];
     const FirstName =userObj.users.registerObj.FirstName
    

    if(!emergency||!userObj){
        res.status(400).json({
            message: 'Invalid Request !'
    })
} else {
    for(var propName in emergency) {
        emergency.hasOwnProperty(propName)
            var propValue = emergency[propName];
            console.log(propValue)
    var link = "https://maps.google.com/maps?q="+lattitude+","+longitude+"&hl=es";
   var link1 ="https://maps.googleapis.com/maps/api/staticmap?center="+lattitude+","+longitude+"+&zoom=12&size=300x300"
                       var mailOptions = {
                           transport: transporter,
                           from: '"PHR Service"<risabh.sharma@rapidqube.com>',
                           to: propValue,
                           subject: 'urgent emergency',
                           text :FirstName+" is in an emergency please contact him as soon as possible",
                            html:"<a href="+link+">Click here to open in maps</a><img src= "+link1+" ></img><br>"
                            
                       
                             
                          
                        };
                       transporter.sendMail(mailOptions, (error, info) => {
                           if (error) {}
                        });
                    }
                       res.status(200).json({
                        message: "Email Sent to the emergency contacts"
                      
                    })

            
         
        }
    });

//==========================================================================================================//
         function checkToken(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {

                var decoded = jwt.verify(token, config.secret);

                return true;


            } catch (err) {

                return false;
            }

        } else {

            return false;
        }
    }
     function getAddress(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {

                var decoded = jwt.verify(token, config.secret);

                return decoded;


            } catch (err) {

                return false;
            }

        } else {

            return false;
        }
    }
  
    };


