var App = {
    pistas: null,
    _this: null,
    init: function(that){
        App._this = that;
        return function(){
            that.pistas = new Models.Pistas();
            that.pistas.reset(<%= pistas %>);
        }
    }
}

$(document).ready(App.init(App));

