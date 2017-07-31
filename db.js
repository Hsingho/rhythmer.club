var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:2222/msgBoard';
var documentName = 'msg';

function save(data, callback){
	MongoClient.connect(url, function(err,db){
		if (err) {
			console.log(err);
		}else{
			var collection = db.collection(documentName);

			data.comments = [];

			collection.insert(data, function(err, result){
				if (err) {
					console.log(err);
				}else{
					callback && callback(result);
					db.close();
				}
			});
		}
	});
}

function search(data, callback){
	data._id = ObjectID(data._id);
	MongoClient.connect(url,function(err, db){
		if (err) {
			console.log(err);
		}else{
			var collection = db.collection(documentName);

			collection.findOne(data, function(err, result){
				if (err) {
					console.log(err);
				}else{
					callback && callback(result);
					db.close();
				}
			});
		}
	});
}

function update(data, callback){
	var comments = JSON.parse(data.comments);
	data._id = ObjectID(data._id);
	var index = {
		_id:data._id
	};
	MongoClient.connect(url,function(err, db){
		if (err) {
			console.log(err);
		}else{
			var collection = db.collection(documentName);

			collection.findOne(index, function(err, results){
				if (err) {
					console.log(err);
				}else{
					results.comments.push(comments);
					collection.update(index, results, function(err,result){
						if (err) {
							console.log(err);
						}else{
							callback && callback(results);
							db.close();
						}
					});
				}
			});
		}
	});
}

function searchAll(callback){
	MongoClient.connect(url,function(err, db){
		if (err) {
			console.log(err);
		}else{
			var collection = db.collection(documentName);

			collection.find().toArray(function(err,docs){
	           callback && callback(docs);
	           db.close();
            });
		}
	});
}

module.exports = {
	update:update,
	save:save,
	find:searchAll,
	findOne:search
};