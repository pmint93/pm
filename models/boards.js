/**
 * Created by pmint on 7/30/14.
 */
module.exports = Model.extend({
    init: function(db){
        this._super(db);
        this.collection = 'boards';
        this.ObjectId = require("mongodb").ObjectID;
    },
    add: function(configs){
        if(typeof(configs) == "undefined" || Object.keys(configs).length <= 0) return false;
        var collection = this.getData();
        return collection.insert(configs, {saved: true}, function(err, results){
            console.log(results);
        });
    },
    find: function(id){
        if(typeof(id) == "undefined" || id == "") return false;
        var _self = this;
        var collection = this.getData();
        return collection.find({_id: new _self.ObjectId(id) });
    },
    getAll: function(uid){
        if(typeof(uid) == "undefined" || uid == "") return false;
        var collection = this.getData();
        return collection.find({ admin: uid.toString() });
    },
    update: function(configs){
        if(typeof(configs) == "undefined" || Object.keys(configs).length <= 0) return false;
    },
    remove: function(id){
        if(typeof(id) == "undefined" || id == "") return false;
        var _self = this;
        var collection = this.getData();
        return collection.remove({_id: new _self.ObjectId(id)}, {saved: true}, function(err, results){
            console.log(results);
        });
    }
});