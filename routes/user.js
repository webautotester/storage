const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = (mongoServerName, webServer) => {
	const dbUrl = `mongodb://${mongoServerName}:27017/wat_storage`;
	webServer
		.get('/user', (req, res) => {
			MongoClient.connect(dbUrl)
				.then(db => {
					db.collection('user', {strict:true}, (err, userCollection) => {
						if (err) {
							res.status(404).send(err).end();
							db.close();
						} else {
							userCollection.find().toArray()
								.then(usersArray => {
									res.status(200).send(usersArray).end();
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
		.post('/user', (req, res) => {
			MongoClient.connect(dbUrl)
				.then(db => {
					db.collection('user', (err, userCollection) => {
						if (err) {
							res.status(404).send(err).end();
							db.close();
						} else {
							var newUser = req.body;
							newUser._id = ObjectID();  
							winston.log(`recording new user: ${JSON.stringify(newUser)}`);
							userCollection.save(newUser)
								.then(savedUser => {
									res.status(200).send(savedUser).end();
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
					res.send(err).status(500).end;
				});
		});
};