/**
 * Created by pmint on 7/31/14.
 */

new PopupPlugin({
    title: "New board",
    classes: "123",
    inputtext: "Username@name, Password@password",
    endpoint: "Create@/board/request/add"
});
Element = Class.extend({
    init: function(config){
        var _self = this;
        this.config = config;
        this.children = {};
        this.dom = document.createElement(config.tag || "div");
        this.dom.setAttribute("class", config.classes || "");
        if(config.attributes){
            for(var attr in config.attributes){
                _self.dom.setAttribute(attr, config.attributes[attr]);
            }
        }
        if(config.events){
            for(var event in config.events){
                if(typeof(config.events[event]) == "function"){
                    console.log(event);
                    _self.dom.addEventListener(event, config.events[event]);
                }
            }
        }
        if(config.html) this.dom.innerHTML = config.html;
    },
    appendTo: function(target){

    },
    dependTo: function(target){

    },
    destroy: function(){
        var _self = this;
        return _self.dom.parentElement.removeChild(_self.dom);
    }
});

PopupPlugin = Element.extend({
    init: function(config){
        var _self = this;
        this._super(config);
        this.config = config;
        this.reqParams = {};
        this.dom = new Element({
            tag: "div",
            attributes: {
                id: "popup-"+new Date().getTime(),
                class: "popup_plugin "+(config.classes?config.classes:"")
            }
        });
        this.title = new Element({
            tag: "div",
            attributes: {
                class: "popup-title"
            }
        });
        this.titletext = new Element({
            tag: "span",
            attributes: {

            },
            html: config.title
        });
        this.closeBtn = new Element({
            tag: "span",
            attributes: {
                class: "glyphicon glyphicon-remove"
            },
            events: {
                click: function(e){

                }
            }
        });
        this.popupbody = new Element({});
    },
    createBody: function(){
        var popupbody = document.createElement("div");
            popupbody.setAttribute("class", "popup-body");
        if(this.config.inputtext){
            var inputtexts = this.config.inputtext.split(",");
            var temp;
            for(var i=0; i< inputtexts.length; i++){
                if(inputtexts[i] == "") continue;
                temp = document.createElement("div");
                temp.setAttribute("class", "input-group");
                temp.innerHTML =  '<span class="input-group-addon">'+inputtexts[i].split("@")[0];
                temp.innerHTML += '</span><input type="text" class="form-control" name="'+inputtexts[i].split("@")[1]+'">';
                popupbody.appendChild(temp);
            }
        }
        return popupbody;
    },
    createFooter: function(){
        var _self = this;
        var popupfootter = document.createElement("div");
            popupfootter.setAttribute("class", "popup-footer");
        var submitBtn = document.createElement("input");
            submitBtn.setAttribute("type", "button");
            submitBtn.setAttribute("class", "btn btn-info");
            submitBtn.setAttribute("name", "submit");
            submitBtn.setAttribute("value",this.config.endpoint.split("@")[0]);
            submitBtn.addEventListener("click", function(){
            $.ajax({
                url: _self.config.endpoint.split("@")[1],
                method: "POST",
                beforeSend: function(){

                },
                data: _self.reqParams,
                success: function(){

                },
                error: function(e){

                }
            });
        });
        popupfootter.appendChild(submitBtn);
        return popupfootter;
    },
    show: function(){
        return this.dom.css.setProperty("display", "none");
    },
    hide: function(){
        return this.dom.css.setProperty("display", "inline-block");
    },
    remove: function(){
        return this.dom.parentElement.removeChild(this.dom);
    },
    refactor: function(config){

    },
    End: function(){

    }
})