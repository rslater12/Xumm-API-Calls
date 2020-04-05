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

	// generatepayload()
	// status()
	// login()
	// authenticate()
	// del()


//Generate a payment Transaction
function generatepayload() {

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
function status(){
	
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
function login(){
	
	
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

function del(){
	
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

