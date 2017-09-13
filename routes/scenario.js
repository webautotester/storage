const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = function(mongoServerName, webServer) {
	const dbUrl = `mongodb://${mongoServerName}:27017/wat_storage`;
	webServer.get('/scenario', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('scenario', function(err, scenarioCollection) {
				if (err) {
					res.status(404).send(err).end();
				} else {
					scenarioCollection.find().toArray().then(scenariosArray => {
						res.send(scenariosArray).status(200).end();
						db.close();
					}).catch(err => {
						res.status(500).send(err).end();
					});
				}
			});
			
		}).catch(err => {
			winston.info(err);
			res.send(err).status(500).end;
		});
	}).get('/scenario/:id', function(req, res) { //req.params.id
		MongoClient.connect(dbUrl).then(db => {
			db.collection('scenario').find({_id: new ObjectID(req.params.id)}).toArray().then(founds => {
				res.status(200).send(founds).end();
			}).catch(err => {
				res.status(500).send(err).end();
			});
			db.close();
		}).catch(err => {
			winston.error(err);
			res.status(500).send(err).end();
		});
	});
    
	webServer.post('/scenario', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('scenario', function(err, scenarioCollection) {
				if (err) {
					res.send(err).status(404).end();
				} else {
					var newScenario = req.body;
					newScenario._id = ObjectID();  
					scenarioCollection.save(newScenario).then(savedScenario => {
						res.status(200).send(savedScenario).end();
					}).catch(err => {
						winston.error(err);
						res.status(500).send(err).end();
					});
				}
			});
			db.close();
		}).catch(err => {
			winston.error(err);
			res.status(500).send(err).end;
		});
	});
};