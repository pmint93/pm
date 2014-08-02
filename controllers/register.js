module.exports = Controller.extend({
    init: function(req, res){
        this._super(req, res);
         this.model = {
             user: this.newDB("users")
         }
         this.md5 = require('MD5');
    },
    index: function(){
        var _self = this;
        var errorMsg = false;
        var successMsg = false;
        if(_self.req.body._username && _self.req.body._pwd &&_self.req.body._repwd){
            var username = _self.req.body._username;
            var pass = _self.req.body._pwd;
            var repass = _self.req.body._repwd;
            if(pass != repass){
                errorMsg = "Password not match !";
                return _self.render("register", {title: "Dang ky", errorMsg: errorMsg, successMsg: successMsg});
            } else {
                _self.model.user.find(username).toArray(function(err, results){
                    if(results.length > 0){
                        errorMsg = "Username already exist !";
                    } else if(_self.model.user.add({username: username, password: _self.md5(pass)})){
                        successMsg = "Create user successfull !";
                    } else {
                        errorMsg = "Sorry: Error in create new User ! Try again later ...";
                    }
                    return _self.render("register", {title: "Dang ky", errorMsg: errorMsg, successMsg: successMsg});
                })
            }
        } else {
            if(_self.req.body.submit) errorMsg = "All fields are required !";
            return _self.render("register", {title: "Dang ky", errorMsg: errorMsg, successMsg: successMsg});
        }
    }
});