const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = function(mongoServerName, webServer) {
	const dbUrl = `mongodb://${mongoServerName}:27017/wat_storage`;
	webServer.get('/user', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('user', (err, userCollection) => {
				if (err) {
					res.send(err).status(404).end();
				} else {
					userCollection.find().toArray().then(usersArray => {
						res.send(usersArray).status(200).end();
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
	}).get('/user/:id', (req, res) => { //req.params.id
		MongoClient.connect(dbUrl).then(db => {
			db.collection('user').find({_id: new ObjectID(req.params.id)}).toArray().then(founds => {
				res.send(founds).status(200).end();
			}).catch(err => {
				res.send(err).status(500).end();
			});
			db.close();
		}).catch(err => {
			res.send(err).status(500).end();
		});
	}).get('/user/:id/scenario', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('user').find({_id: new ObjectID(req.params.id)}).toArray().then(founds => {
				if (founds.length > 0) {
					const user = founds[0];
					winston.info(`get scenario of user ${JSON.stringify(user)}`);
					db.collection('scenario').find({uid:user._id}).toArray().then(scenarios => {
						res.send(scenarios).status(200).end();    
					});
				} else {
					res.send('no user id').status(404).end();
				}
			}).catch(err => {
				res.send(err).status(500).end();
			});
			db.close();
		});
	}).get('/user/:uid/scenario/:sid/run', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('run').find({uid:req.params.uid, sid:req.params.sid}).toArray().then(founds => {
				if (founds.length > 0) {
					res.send(founds).status(200).end();
				} else {
					res.send(`no run for user ${req.params.uid} and scenario ${req.params.sid}`).status(404).end();
				}
			}).catch(err => {
				res.send(err).status(500).end();
			});

		});
	});
    
	webServer.post('/user', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('user', (err, userCollection) => {
				if (err) {
					res.send(err).status(404).end();
				} else {
					var newUser = req.body;
					newUser._id = ObjectID();  
					winston.log(`recording new user: ${JSON.stringify(newUser)}`);
					userCollection.save(newUser).then(savedUser => {
						res.send(savedUser).status(200).end();
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