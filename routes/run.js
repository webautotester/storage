const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = function(mongoServerName, webServer) {
	const dbUrl = `mongodb://${mongoServerName}:27017/wat_storage`;
	webServer.get('/run', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('run', function(err, runCollection) {
				if (err) {
					res.status(404).send(err).end();
				} else {
					runCollection.find().toArray().then(runsArray => {
						res.status(200).send(runsArray).end();
					}).catch(err => {
						res.status(500).send(err).end();
					});
				}
			});
			db.close();
		}).catch(err => {
			winston.info(err);
			res.status(500).send(err).end;
		});
	}).get('/run/:id', function(req, res) { //req.params.id
		MongoClient.connect(dbUrl).then(db => {
			db.collection('run').find({_id: new ObjectID(req.params.id)}).toArray().then(founds => {
				res.status(200).send(founds).end();
			}).catch(err => {
				res.status(500).send(err).end();
			});
			db.close();
		}).catch(err => {
			res.status(500).send(err).end();
		});
	});
    
	webServer.post('/run', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('run', function(err, runCollection) {
				if (err) {
					res.status(404).send(err).end();
				} else {
					var newRun = req.body;
					newRun._id = ObjectID();  
					runCollection.save(newRun).then(savedRun => {
						res.status(200).send(savedRun).end();
					}).catch(err => {
						res.status(500).send(err).end();
					});
				}
			});
			db.close();
		}).catch(err => {
			winston.info(err);
			res.status(500).send(err).end;
		});
	});
};