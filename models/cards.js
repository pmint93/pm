/**
 * Created by pmint on 7/30/14.
 */
module.exports = Model.extend({
    init: function(db){
        this._super(db);
        this.collection = 'cards';
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
    updateBoard: function(configs){

    },
    deleteBoard: function(id){

    },
    getList: function(boardId, callback){
        var lists = [
            {

            }
        ];
        var collection = this.getData();
        return collection.find({boardId: boardId}).toArray(function(err, results){
            callback(result);
        });
    }
});
