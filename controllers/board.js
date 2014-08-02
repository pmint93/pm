/**
 * Created by pmint on 7/30/14.
 */
module.exports = Controller.extend({
    init: function(req, res){
        this._super(req, res);
        if(this.req.session.loginID == undefined || this.req.session.loginID == "") return this.res.redirect("/login");
    },
    index: function(){
        var _self = this;
        if(_self.req.query.goback) return _self.res.redirect(_self.req.query.goback);
        this.newDB("boards").getAll(_self.req.session.loginID).toArray(function(err, results){
            _self.render("boardlist", {title: "My boards", boards: results, menuactive: "board"});
        });
    },
    view: function(){
        var _self = this;
        var boardId = _self.req.params.id.toString();
        if(boardId){
            _self.newDB("boards").getAll(_self.req.session.loginID).toArray(function(err, boards){
                var board = {};
                for(var j=0; j<boards.length; j++){
                    if(boards[j]._id == boardId) board = boards[j];
                }
                if(!err){
                    _self.newDB("lists").getAll(boardId).toArray(function(err, lists){
                        var allCard = [];
                        if(!err){
                            if(lists.length <= 0) return _self.render("boardview", { title: board.name, boards: boards, board: board, menuacive: "board" });
                            var cardsModel = _self.newDB("cards");
                            var getCards = function(i){
                                cardsModel.getAll(lists[i]._id).toArray(function(err, cards){
                                    allCard.push(cards);
                                    if(typeof(lists[i+1]) != "undefined"){
                                        getCards(i+1);
                                    } else {
                                        _self.render("boardview", {
                                            title: board.name,
                                            userID: _self.req.session.loginID,
                                            board: board,
                                            boards: boards,
                                            lists: lists,
                                            allCard: allCard,
                                            menuactive: "board"
                                        })
                                    }
                                });
                            }
                            getCards(0);
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            _self.render("boardview", { menuactive: "board"});
        }
    },
    request: function(){
        var _self = this;
        var request = this.req.params.id;
        switch(request){
            case "add": _self.add(); break;
            case "remove": _self.remove(); break;
            case "edit": _self.edit(); break;
            default: _self.res.end(JSON.stringify({
                status: 1,
                msg: "Invalid parameters [GET]",
                pushBack: _self.req.body
            }))
        }
    },
    add: function(){
        var _self = this;
        if(this.req.body.boardName && this.req.body.boardName != ""){
            if(this.req.session.loginID){
                this.res.writeHead(200);
                this.res.end(JSON.stringify({
                    status: _self.newDB("boards").add({ name: _self.req.body.boardName, admin: _self.req.session.loginID }),
                    msg: "Request received !"
                }))
            }
        } else {
            this.res.writeHead(200);
            this.res.end(JSON.stringify({
                status: 1,
                msg: "Invalid parameters [POST]"
            }))
        }
    },
    remove: function(){
        var _self = this;
        if(this.req.body.boardId&& this.req.body.boardId != ""){
            if(this.req.session.loginID){
                this.res.end(JSON.stringify({
                    status: _self.newDB("boards").remove(_self.req.body.boardId),
                    msg: "Request received !"
                }))
            }
        } else {
            this.res.end(JSON.stringify({
                status: 1,
                msg: "Invalid parameters [POST]"
            }))
        }
    },
    edit: function(){

    }
});
