/**
 * Created by pmint on 7/31/14.
 */

$(document).ready(function(evt){
    $(this).click(function(e){
        if(e.toElement != $(".popup")[0]) $(".popup").hide();
    })
});

ExtFunctions = {
    findCloseElement: function(coordinate, targets, opts){
        var _self = this;
        var anchor = {x: 0.5, y: 0.5};
        if(!opts) opts = {};
        if(!opts.extend) opts.extend = 0;
        if(targets.length <= 0) return false;
        var minIdx = 0;
        for(var i=0; i<targets.length; i++){
            var currentDist = _self.p2p(coordinate, {
                x: targets[i].getBoundingClientRect().left + (targets[i].getBoundingClientRect().width*anchor.x),
                y: targets[i].getBoundingClientRect().top + (targets[i].getBoundingClientRect().height*anchor.y)
            });
            var lastDist = _self.p2p(coordinate, {
                x: targets[minIdx].getBoundingClientRect().left + (targets[minIdx].getBoundingClientRect().width*anchor.x),
                y: targets[minIdx].getBoundingClientRect().top + (targets[minIdx].getBoundingClientRect().height*anchor.y)
            });
            if(-1 < currentDist && currentDist < lastDist) minIdx = i;
        }
        var finalDist = _self.p2p(coordinate, {
            x: targets[minIdx].getBoundingClientRect().left + (targets[minIdx].getBoundingClientRect().width*anchor.x),
            y: targets[minIdx].getBoundingClientRect().top + (targets[minIdx].getBoundingClientRect().height*anchor.y)
        });
//        for(var i=0; i<targets.length; i++){
//            $(targets[i]).css({ 'border': "1px solid transparent" });
//        }
//        $(targets[minIdx]).css({ 'border': "1px solid #f00" });
        return targets[minIdx];
    },
    p2p: function(p1, p2){
        var ret = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        if(isNaN(ret)) return -1;
        return ret;
    },
    insertDOM: function(element, opts){
        if(!element || !opts){ throw new Error("Invalid parameters !}")};
        if(opts.before) return $(element).insertBefore($(opts.before));
        if(opts.after && $(opts.after).next().length > 0) return $(element).insertBefore($(opts.after).next());
        if(opts.parent) $(opts.parent).append(element);
        return new Error("No position defined !");
    }
}
Board = {
    add: {
        xhr: null,
        send: function(){
            if(Board.add.xhr) Board.add.xhr.abort();
            var name = $("#newboard").find("input").val();
            if(!name || name == "") return false;
            Board.add.xhr = $.ajax({
                url: "/board/request/add",
                method: "POST",
                beforeSend: function(){

                },
                data: {
                    boardName: name
                },
                success: function(response){
                    Board.add.xhr = null;
                    try{
                        response = JSON.parse(response);
                        if(!response.status){
                            Board.add.hide();
                            window.location.reload();
                        } else {
                            console.log("Failed !")
                        }
                    } catch (ex){
                        console.log(ex);
                    }
                },
                error: function(){

                }
            });
        },
        show: function(){
            $("#newboard").show();
            $("#newboard").find("input").focus();
        },
        hide: function(){
            $("#newboard").hide();
        }
    },
    remove: function(){

    },
    edit: function(id){

    },
    drag: function(board){

    }
}

List = {
    add: function(){
        
    },
    remove: function(){

    },
    edit: function(){

    },
    drag: function(list){

    }
}

Card = {
    add: function(){

    },
    remove: function(){

    },
    edit: function(){

    },
    drag: {
        cached: {
            element: null,
            clone: null
        },
        start: function(card){
            var _self = Card.drag;
            _self.cached.element = card[0];
            _self.cached.clone = card[0].cloneNode(true);
            $(_self.cached.clone).css({
                'position': 'absolute',
                'width': _self.cached.element.getBoundingClientRect().width+'px',
                'height': _self.cached.element.getBoundingClientRect().height,
                'left': event.x - _self.cached.element.getBoundingClientRect().width/2,
                'top': event.y - _self.cached.element.getBoundingClientRect().height/2,
                'z-index': "9999"
            });
            $(document.body).append(_self.cached.clone);
            $(document).bind("mousemove",_self.move);
            $(document).bind("mouseup",_self.end);
            $(_self.cached.element).addClass("drag_shadow");
            $(_self.cached.clone).addClass("drag_piece_start");
        },
        move: function(){
            var _self = Card.drag;
            var pointer = { x: event.x, y: event.y };
            $(_self.cached.clone).css({
                'position': 'absolute',
                'left': pointer.x - _self.cached.element.getBoundingClientRect().width/2,
                'top': pointer.y - _self.cached.element.getBoundingClientRect().height/2,
                'z-index': "9999"
            });
            $(_self.cached.clone).removeClass("drag_piece_start");
            $(_self.cached.clone).addClass("drag_piece_move");
            var closeList = ExtFunctions.findCloseElement(pointer, $("#board-detail").find(".board-list:not(.new-demo)"), {extend: 50});
            if(closeList){
                var closeCard = _self.cached.closeCard = ExtFunctions.findCloseElement(pointer, $(closeList).find(".card"), { extend: 50 });
                var insertOpts = {
                    parent: $(closeList).find(".list-group")[0]
                };
                var clone = _self.cached.element.cloneNode(true);
                if(closeCard){
                    if(pointer.y - closeCard.getBoundingClientRect().top - closeCard.getBoundingClientRect().height/2 <= 0 ) insertOpts.before = closeCard;
                    else insertOpts.after = closeCard;
                }
                ExtFunctions.insertDOM(clone, insertOpts);
                $(_self.cached.element).remove(); // self remove
                _self.cached.element = clone;
            }
        },
        end: function(){
            var _self = Card.drag;
            $(document).unbind("mousemove", _self.move);
            $(document).unbind("mouseup", _self.end);
            $(_self.cached.element).removeClass("drag_shadow");
            $(_self.cached.clone).remove();
            _self.cached.element = null;
            _self.cached.clone = null;
        }
    }
}
