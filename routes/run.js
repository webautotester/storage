const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = function(mongoServerName, webServer) {
	const dbUrl = `mongodb://${mongoServerName}:27017/wat_storage`;
	webServer.get('/run', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('run', function(err, runCollection) {
				if (err) {
					res.send(err).status(404).end();
				} else {
					runCollection.find().toArray().then(runsArray => {
						res.send(runsArray).status(200).end();
					}).catch(err => {
						res.send(err).status(500).end();
					});
				}
			});
			db.close();
		}).catch(err => {
			winston.info(err);
			res.send(err).status(500).end;
		});
	}).get('/run/:id', function(req, res) { //req.params.id
		MongoClient.connect(dbUrl).then(db => {
			db.collection('run').find({_id: new ObjectID(req.params.id)}).toArray().then(founds => {
				res.send(founds).status(200).end();
			}).catch(err => {
				res.send(err).status(500).end();
			});
			db.close();
		}).catch(err => {
			res.send(err).status(500).end();
		});
	});
    
	webServer.post('/run', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('run', function(err, runCollection) {
				if (err) {
					res.send(err).status(404).end();
				} else {
					var newRun = req.body;
					newRun._id = ObjectID();  
					runCollection.save(newRun).then(savedRun => {
						res.send(savedRun).status(200).end();
					}).catch(err => {
						res.send(err).status(500).end();
					});
				}
			});
			db.close();
		}).catch(err => {
			winston.info(err);
			res.send(err).status(500).end;
		});
	});
};