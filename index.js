// MODULES [install express, mongoose and body-parser with npm]
// Express
var express = require('express');
// Mongoose
var mongoose = require("mongoose");
// Body-parser (Used for request's body when html form is used)
var bodyParser = require("body-parser");

// DATABASE CONEXION [install MongoDB and create yourdatabase]
mongoose.connect("mongodb://localhost:27017/yourdatabase", { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Can\'t connect to database'));
db.once('open', function (){
    console.log("Connected to database");
});

// DATABASE ENTITIES [create entities in your database]
var starship_schema = new mongoose.Schema( 																		//
	{
		name: String,
		lenght: Number,
		passengers: Number,
		propulsion: String,
		membership: String,
		commissioning: [{comm_date: Date, location: String }]
	}
);
var starship_model = mongoose.model('starships', starship_schema);

var spaceman_schema = new mongoose.Schema(
	{
		name: String,
		age: Number,
		species: String
	}
);
var spaceman_model = mongoose.model('spacemans', spaceman_schema);

// ENVIRONMENT
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));															//
app.use(bodyParser.json());

var MyRouter = express.Router();

// ROUTES
// starships
MyRouter.route('/starships')
// GET, get all starships
.get(function(req,res){
	starship_model.find(function(err, starships){
        if(err)res.send(err);
        res.json(starships);
    }); 
})
// POST, insert one starship
.post(function(req, res){
	//Create starship
	var starship = new starship_model();
	//Add attributes
	starship.name = req.body.name;
	starship.lenght = req.body.lenght;
	starship.passengers = req.body.passengers;
	starship.propulsion = req.body.propulsion;
	starship.membership = req.body.membership;
	starship.commissioning = req.body.commissioning;
	//Add to database
	starship.save(function(err){
		if(err)res.send(err);
		res.send({message: "Saved."});
	})
})

// starship
MyRouter.route('/starships/:starship_id')
// get one starship from ID
.get(function(req,res){
	starship_model.findById(req.params.starship_id, function(err, starship) {
        if(err)res.send(err);
        res.json(starship);
    });
})
// put one starship
.put(function(req, res){
	starship_model.findById(req.params.starship_id, function(err, starship){
		if(err)res.send(err);
		//PUT
		starship.name = req.body.name;
		starship.lenght = req.body.lenght;
		starship.passengers = req.body.passengers;
		starship.propulsion = req.body.propulsion;
		starship.membership = req.body.membership;
		starship.commissioning = req.body.commissioning;
		//Add to database
		starship.save(function(err){
			if(err)res.send(err);
			res.json({message: "Update done."});
		});
	})
})
// delete one starship
.delete(function(req, res){
	starship_model.remove({_id: req.params.starship_id}, function(err, starship){
        if (err)res.send(err);
        res.json({message:"Starship deleted."});
    });
})

// spacemans
// Same like starships...

app.use(MyRouter);
app.listen(8081);
