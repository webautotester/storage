const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = (mongoServerName, webServer) => {
	const dbUrl = `mongodb://${mongoServerName}:27017/wat_storage`;
	webServer
		.get('/run', (req, res) => {
			MongoClient.connect(dbUrl)
				.then(db => {
					db.collection('run', {strict:true}, (err, runCollection) => {
						if (err) {
							res.status(404).send(err).end();
							db.close();
						} else {
							runCollection.find().toArray()
								.then(runsArray => {
									res.status(200).send(runsArray).end();
									db.close();
								}).catch(err => {
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
		})
		.get('/run/:sid', (req, res) => { //req.params.id
			MongoClient.connect(dbUrl)
				.then(db => {
					db.collection('run', {strict:true}).find({sid: new ObjectID(req.params.sid)}).toArray()
						.then(founds => {
							res.status(200).send(founds).end();
							db.close();
						}).catch(err => {
							res.status(500).send(err).end();
							db.close();
						});
				})
				.catch(err => {
					res.status(500).send(err).end();
				});
		});

	webServer
		.post('/run', (req, res) => {
			MongoClient.connect(dbUrl)
				.then(db => {
					db.collection('run', (err, runCollection) => {
						if (err) {
							res.status(404).send(err).end();
							db.close();
						} else {
							var newRun = req.body;
							newRun._id = ObjectID();  
							runCollection.save(newRun)
								.then(savedRun => {
									res.status(200).send(savedRun).end();
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
};