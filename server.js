/**
 * Showing with the Express framwork http://expressjs.com/
 * Express must be installed for this sample to work
 */

var tropowebapi = require('./lib/tropo-webapi');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var request = require('request');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

 app.get('/', function (req, res) {
    res.send('Hello from Cisco Shipped!');
});
	 

app.post('/', function(req, res){
	
	
	
	// Create a new instance of the TropoWebAPI object.
	var tropo = new tropowebapi.TropoWebAPI();
	// Use the say method https://www.tropo.com/docs/webapi/say.htm
	tropo.say("Welcome to Shipped Tropo Web API demo.");

	result=ask( "Press 1. For weather, press 2. For contact search.", {choices:"1, 2"} );

	if (result.name=='choice')
	{
		if (result.value=="1") { tropo.say( "you have selected 1"); }
		if (result.value=="2") { tropo.say( "you have selected 2" );}
	}
	
	/* // Demonstrates how to use the base Tropo action classes.
	var say = new Say("Please enter your 5 digit zip code.");
	var choices = new Choices("[5 DIGITS]");

	// Action classes can be passes as parameters to TropoWebAPI class methods.
	// use the ask method https://www.tropo.com/docs/webapi/ask.htm
	tropo.ask(choices, 3, false, null, "foo", null, true, say, 5, null);
	 
	
	// use the on method https://www.tropo.com/docs/webapi/on.htm
	tropo.on("continue", null, "/answer", true); */
	 
    res.send(tropowebapi.TropoJSON(tropo));
});

weatherReport=function(nil,callback){
	var tropo = new tropowebapi.TropoWebAPI();
// Demonstrates how to use the base Tropo action classes.
	var say = new Say("Please enter your 5 digit zip code.");
	var choices = new Choices("[5 DIGITS]");

	// Action classes can be passes as parameters to TropoWebAPI class methods.
	// use the ask method https://www.tropo.com/docs/webapi/ask.htm
	tropo.ask(choices, 3, false, null, "foo", null, true, say, 5, null);
	 
	
	// use the on method https://www.tropo.com/docs/webapi/on.htm
	tropo.on("continue", null, "/answer", true);
	 
    res.send(tropowebapi.TropoJSON(tropo));	
};

getWeather=function(zip, callback){
	request('http://api.openweathermap.org/data/2.5/weather?zip='+zip+'&appid=a8f81765ac74e18e357c9496ac295aad', function (error, response, body) {
	if (!error && response.statusCode == 200) {
    callback(body)
	 
	}});
	
};

app.post('/answer', function(req, res){	
	 var tropo = new tropowebapi.TropoWebAPI();
	//console.log(req.body['result']['actions']['interpretation'])
	var zip=req.body.result.actions.interpretation;
	tropo.say("Fetching weather information for your zip code "+ zip);
	getWeather(zip,function(response){
		var j= JSON.parse(response)
			if(j.cod==200){
				
				var wtr= "Weather for "+j.name+" is ! clouds " +j.weather[0].description+ ", Temperature " +j.main.temp +" kelvin, Pressure " +j.main.pressure +", Humidity " +j.main.humidity +"%"
				console.log(wtr);
				tropo.say(wtr);
				tropo.say( "Goodbye !");
			}
			else{
				console.log(j.message);
				tropo.say( "Oops ! "+ j.message);
				tropo.say( "Please try again.");
			}	
		 res.send(tropowebapi.TropoJSON(tropo));
	});
	
});

app.listen(3000);
console.log('Server running on http://0.0.0.0:3000/');
