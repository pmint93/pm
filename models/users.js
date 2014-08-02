module.exports = Model.extend({
	init: function(db){
		this._super(db);
		this.collection = 'users';
	},
	add: function(configs){
		var collection = this.getData();
		return collection.insert(configs, {saved: true}, function(err, results){
			console.log(results);
		});
	},
	find: function(user, password){
		var collection = this.getData();
		if(!password){
			return collection.find({username: user});
		}
		else{
			return collection.find({username: user, password: password});
		}
	},
	getAll: function(callback){
		var collection = this.getData();
		return collection.find().toArray(function(err, results){
			callback(results);
		});
	},
	update: function(configs){

	},
	del: function(id){
		
	}
});