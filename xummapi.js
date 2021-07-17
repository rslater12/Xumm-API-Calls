var request = require("request");

//There are other API calls that can be made, escrow create, cancel, sell and buy on the DEX, IOU's, Trustlines 

//xumm api key and secret
const apikey = '';
const apisecret = '';


const Address = "";
var DestinationAddress
var PayloadUUID;
const value = "1"
var qr;
var cancelled;
var reason;
var uuid

	// GeneratePayload()
	// Status()
	// login()
	// authenticate()
	// DeletePayload()
	// checkcreate()
	// checkcancel()
	// checkcash()
  // setTrustline()
  // setGravatar()
  //paymentIOU()
  // CrossCurrency()


//Generate a payment Transaction
async function GeneratePayload() {

	DestinationAddress = String(Address)
	
var options = {
  method: 'POST',
  url: 'https://xumm.app/api/v1/platform/payload',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apikey,
    'x-api-secret': apisecret 
  },
  body: {
	  "options": {
		    "submit": true,
		    "return_url": {
	    		"web": "",
	    		"app": ""
	    	}
		    
	  },
		  "txjson": {
		    "TransactionType": "Payment",
		    "Destination": DestinationAddress,
				"Amount": value,
		    "Fee": "12"
		  }
		},
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

 PayloadUUID = body.uuid;
 console.log("This is Generate Payment Body " + body);
 console.log(body.uuid);
 
});


}

// only works wiht Body
async function Status(){
	
	var data = String(PayloadUUID);

	var options = {
	  method: 'GET',
	  url: 'https://xumm.app/api/v1/platform/payload/' + data,
	  headers: {
	    'x-api-key': apikey,
	    'x-api-secret': apisecret,
	    'content-type': 'application/json'
	    
	  },
	};

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);

	  var jsonBody = JSON.parse(body)
	  console.log("I Am Status Body: " + jsonBody)
	
	});
	
}




// Login/SignIn/Sign T&C's
async function login(){
	
	destinationAddress = String(Address);
	 
	var jar = request.jar();
	
	var options = {
	  method: 'POST',
	  url: 'https://xumm.app/api/v1/platform/payload',
	  headers: {
	    'content-type': 'application/json',
	    'x-api-key': apikey,
	    'x-api-secret': apisecret,
	    authorization: 'Bearer' + apisecret
	  },
	  body: {
		  "options": {
			    "submit": true,
			    "return_url": {
		    		"web": "",
		    		"app": ""
				    	}    
				  },
			  "txjson": {
			    "TransactionType": "SignIn",
			    "Destination": destinationAddress, 
			    "Fee": "12"
			  }
			},
	  json: true,
	  jar: 'JAR'
	};

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);
	  
	  PayloadUUID = body.uuid;
	  qr = body.refs.qr_png; // link to web URL QR Code
	 // module.exports.b = body.uuid;
	 // module.exports.qr = body.refs.qr_png;
	
	  console.log(body);
	  
	//console.log('\x1b[34m%s\x1b[0m',"QRcode URL: " + qr);
	//console.log('\x1b[34m%s\x1b[0m',"UUID: " + Payload);
	});
}

 
//Authenticate XUMM Login 
//Get Status
async function authenticate(){
	
	// payload uuid from XUMM Login
	var data = String(PayloadUUID);
	
	var options = {
			  method: 'GET',
			  url: 'https://xumm.app/api/v1/platform/payload/' + data,
			  headers: {
				    'x-api-key': apikey,
				    'x-api-secret': apisecret,
				    'content-type': 'application/json'
				    
				  },
				};
			request(options, function (error, response, body) {
			  if (error) throw new Error(error);

			var jsonBody = JSON.parse(body)
			signed = jsonBody.meta.resolved;
			Loginaddress = jsonBody.response.account;
			//module.exports.signed = jsonBody.meta.resolved;
			//module.exports.Logginaddress = jsonBody.response.account;
			console.log("::::::::Loginaddress::::::: " + Loginaddress + "::::::::Signed:::::::::" + signed); 
			
			  
			});

	  
}

//delete Payload
async function DeletePayload(){
	
	var data = String(PayloadUUID);

	
	
	var options = {
	  method: 'DELETE',
	  url: 'https://xumm.app/api/v1/platform/payload/' + data,
	  headers: {
	    'x-api-key': apikey,
	    'x-api-secret': apisecret,
	    'content-type': 'application/json'
	  },
	};

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);
	  
	  var jsonBody = JSON.parse(body)
	  
	  cancelled = jsonBody.result.cancelled;
	  reason = jsonBody.result.reason; 

	  console.log('\x1b[31m%s\x1b[0m',"Cancelled: " + cancelled);
	  console.log('\x1b[31m%s\x1b[0m',"Reason: " + reason);
	  
	  
	});
}

//Create Check

async function checkcreate(){
    var Note = "test";
    var options = {
        method: 'POST',
        url: 'https://xumm.app/api/v1/platform/payload',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apikey,
          'x-api-secret': apisecret,
          authorization: 'Bearer' + apisecret
        },
        body: { 
                    "options": {
                        "submit": true,
                        "return_url": {
                            "web": "",
                            "app": ""
                                    }
                                },
    "txjson": {
        "TransactionType": "CheckCreate",
        "Destination": Address, 
            "Amount": value,
            "DestinationTag": dstTag,
        "Fee": "12",
        "Memos": [
            {
              "Memo": {
                "MemoType": Buffer.from('KYC', 'utf8').toString('hex').toUpperCase(),
                "MemoData": Buffer.from(Note, 'utf8').toString('hex').toUpperCase()
              }
            }
          ]
      }
     
    },
    json: true,
    };
    
    request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body); // Payload UUID.
    
    })

}

// Check Cancel
async function checkcancel(){
    var Note = "test";
    var options = {
        method: 'POST',
        url: 'https://xumm.app/api/v1/platform/payload',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apikey,
          'x-api-secret': apisecret,
          authorization: 'Bearer' + apisecret
        },
        body: { 
                    "options": {
                        "submit": true,
                        "return_url": {
                            "web": "",
                            "app": ""
                                    }
                                },
    "txjson": {
        "TransactionType": "CheckCancel",
        "CheckID": "A6C390310C60A9A0E68B1DC101EBF4F8F1775B735102E24C29478F6A8608A205"
        
      }
     
    },
    json: true,
    };
    
    request(options, async function (error, response, body) {
        if (error) throw new Error(error);
    
        console.log(body); // Payload UUID.
        
        })
    
    }

//Cash Check

async function checkcash(){
        var Note = "test";
        var options = {
            method: 'POST',
            url: 'https://xumm.app/api/v1/platform/payload',
            headers: {
              'content-type': 'application/json',
              'x-api-key': apikey,
              'x-api-secret': apisecret,
              authorization: 'Bearer' + apisecret
            },
            body: { 
                        "options": {
                            "submit": true,
                            "return_url": {
                                "web": "",
                                "app": ""
                                        }
                                    },
        "txjson": {
            "TransactionType": "CheckCash",
            "CheckID": "205B32B747E2571BDBAAF27DF1F0DF0CFD75F791D560BB98510BC156D5DD9BBA",
            "Fee": "12",
            "Amount":  "1" 
            
          }
         
        },
        json: true,
        };
        
        request(options, async function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body); // Payload UUID.
            
            })
        
        }

/* set trust line*/
 async function setTrustline(){

var trustValue = '' // value/amount to trust issuer
var setCurrency = '' //currency code
var DestinationAddress = '' // destination address
var Address = ''; // issuer;
	
        var options = {
          method: 'POST',
          url: 'https://xumm.app/api/v1/platform/payload',
          headers: {
            'content-type': 'application/json',
            'x-api-key': apikey,
            'x-api-secret': apisecret,
            authorization: 'Bearer' + apisecret
          },
          body: {
            options: {
              submit: true,
              expire: 5,
              return_url: {
                web: "",
                app: ""
                  }    
                },
              txjson: {
                TransactionType: 'TrustSet',
                Account: dstAddress,
                Fee: '12',
                Flags: 131072,
                //LastLedgerSequence: 8007750,
                LimitAmount: {
                currency: setCurrency,
                issuer: srcAddress,
                value: trustValue
                }
              }
              },
            json: true,
            jar: 'JAR'
          };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);        
            console.log(body); // Payload UUID.        
            })
        }
/* set Gravatar */
// not tested on xumm
async function setGravatar(){
          var md5 = require('md5');
          var hash = md5('')
          var res = hash.toUpperCase()
          var Address = '';
          var options = {
            method: 'POST',
            url: 'https://xumm.app/api/v1/platform/payload',
            headers: {
              'content-type': 'application/json',
              'x-api-key': apikey,
              'x-api-secret': apisecret,
              authorization: 'Bearer' + apisecret
            },
            body: {
              "options": {
                  "submit": true,
                  "return_url": {
                    "web": "",
                    "app": ""
                      }    
                  },
                "txjson": {
                  TransactionType: 'AccountSet',
                  Account: Address,
                  Fee: '12',
                  EmailHash: res
                }
                },
            json: true,
            jar: 'JAR'
            };
          
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            
            console.log(body)
          
            });
        } 

/* Send IOU PAyment */

async function paymentIOU(){

var options = {
  method: 'POST',
  url: 'https://xumm.app/api/v1/platform/payload',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apikey,
    'x-api-secret': apisecret,
    authorization: 'Bearer' + apisecret
  },
  body: {
      "options": {
            "submit": true,
            "expire": 5,
            "return_url": {
                "web": "", 
                "app": ""
                    }    
              },
          "txjson": {
          "TransactionType": "Payment",
          "Destination": "", 
          "DestinationTag": "",
          "Fee": "12",
            "Amount": {
              "value": "10",
            "currency": "",
            "issuer": "",
            },
            "Memos": [
            {
              "Memo": {
              "MemoType": Buffer.from('Aud', 'utf8').toString('hex').toUpperCase(),
              "MemoData": Buffer.from("Note", 'utf8').toString('hex').toUpperCase()
              }
            }
            ]
        }
    },
  json: true,
  jar: 'JAR'
};
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body)

})
}

/* Cross Currerncy*/
async function CrossCurrency(){
var source = ""
var currency = ""
var Note = "Cross Currecny Test" //"IOU Payment from Porta Para XRPL"
var Amount = "10"
var options = {
          method: 'POST',
          url: 'https://xumm.app/api/v1/platform/payload',
          headers: {
          'content-type': 'application/json',
          'x-api-key': apikey,
          'x-api-secret': apisecret,
          authorization: 'Bearer' + apisecret
          },
          body: {
            "options": {
              "submit": true,
              "return_url": {
                "web": "",
                "app": ""
                  }    
                },
                "txjson": {
                  "TransactionType": "Payment",
                  "Destination": source, 
                  //"DestinationTag": "3",
                  "Fee": "12",
                    "Amount": {
                      "value": Amount,
                    "currency": currency,
                    "issuer": "",
                    },
                    "Flags": 2147614720,
                    "SendMax": {
                    "currency": "GBP",
                    "issuer": "",
                    "value": Amount
                    },
                    "Memos": [
                      {
                        "Memo": {
                        "MemoType": Buffer.from('IOU', 'utf8').toString('hex').toUpperCase(),
                        "MemoData": Buffer.from(Note, 'utf8').toString('hex').toUpperCase()
                        }
                      }
                      ]
                   
                  }
                
            },
          json: true,
          jar: 'JAR'
        };
      
        request(options, async function (error, response, body) {
          if (error) throw new Error(error);
          
          UUID = body.uuid;
          PQR = body.refs.qr_png;
          module.exports.UUID = body.uuid;
          module.exports.PQR = body.refs.qr_png;
          //console.log(body);
          
        console.log('\x1b[34m%s\x1b[0m',"PQRcode URL: " + PQR);
        console.log('\x1b[34m%s\x1b[0m',"UUID: " + UUID);
        
        })
      }
