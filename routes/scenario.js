const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = (mongoServerName, webServer) => {
	const dbUrl = `mongodb://${mongoServerName}:27017/wat_storage`;
	webServer
		.get('/scenario', (req, res) => {
			MongoClient.connect(dbUrl)
				.then(db => {
					db.collection('scenario', (err, scenarioCollection) => {
						if (err) {
							res.status(404).send(err).end();
							db.close();
						} else {
							scenarioCollection.find().toArray()
								.then(scenariosArray => {
									res.send(scenariosArray).status(200).end();
									db.close();
								})
								.catch(err => {
									res.status(500).send(err).end();
									db.close();
								});
						}
					});
				})
				.catch(err => {
					winston.info(err);
					res.status(500).send(err).end;
				});
		});
    
	webServer
		.post('/scenario', (req, res) => {
			MongoClient.connect(dbUrl)
				.then(db => {
					db.collection('scenario', (err, scenarioCollection) => {
						if (err) {
							res.status(404).send(err).end();
							db.close();
						} else {
							var newScenario = req.body;
							if (newScenario._id === undefined || newScenario._id === null) {
								newScenario._id = new ObjectID();  
							} else {
								newScenario._id = new ObjectID(newScenario._id);  
							}
							scenarioCollection.findOneAndReplace({_id:newScenario._id},newScenario,{upsert:true})
								.then(savedScenario => {
									res.status(200).send(savedScenario).end();
									db.close();
								})
								.catch(err => {
									winston.error(err);
									res.status(500).send(err).end();
									db.close();
								});
						}
					});
				}).catch(err => {
					winston.error(err);
					res.status(500).send(err).end;
				});
		});
};