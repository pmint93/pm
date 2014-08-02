/**
 * Created by pmint on 7/30/14.
 */
module.exports = Model.extend({
    init: function(db){
        this._super(db);
        this.collection = 'lists';
    },
    add: function(configs){
        var collection = this.getData();
        return collection.insert(configs, {saved: true}, function(err, results){
            console.log(results);
        });
    },
    find: function(id){
        var ObjectID = require("mongodb").ObjectID;
        var collection = this.getData();
        return collection.find({_id: new ObjectID(id)});
    },
    getAll: function(parent){
        var collection = this.getData();
        return collection.find({ parent: parent.toString() });
    },
    update: function(configs){

    },
    del: function(id){

    }
});