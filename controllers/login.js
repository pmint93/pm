/**
 * Created by pmint on 7/30/14.
 */
module.exports = Controller.extend({
    init: function(req, res){
        this._super(req, res);
        if(this.req.session.loginID) this.goBack();
    },
    index: function(){
        var sess = this.req.session;
        var _self = this;
        if(this.req.body.submit == undefined ){
            this.render("login", {title: "Login"});
        } else {
            this.check(_self.req.body.username, _self.req.body.password, function(result){
                if(result === true){
                    _self.getUserID(_self.req.body.username, function(id){
                        sess.loginID = id;
                        sess.username = _self.req.body.username;
                        sess.save();
                        _self.goBack();
                    });
                } else {
                    error = result;
                    _self.render("login", {title: "Login to continue", error: error});
                }
            });
        }
    },
    check: function(username, password, callback){
        var md5 = require('MD5');
        this.newDB("users").find(username, md5(password)).count(function(err, result){
            if(!result) callback("Username or password wrong");
            else callback(true);
        });
        return true;
    },
    getUserID: function(username, callback){
        this.newDB("users").find(username).toArray(function(err, result){
            callback(result[0]._id);
        });
    },
    goBack: function(){
        this.res.redirect("/board");
    }
});