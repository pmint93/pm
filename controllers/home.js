module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
        if(this.req.session.loginID == undefined) return this.res.redirect("/login");
	},
	index: function(){
        var _self = this;
        return this.res.redirect("/board");
        _self.render("home", {title: "Home", menuactive: "home"});
	}
});