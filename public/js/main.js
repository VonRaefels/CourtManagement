var App = {
    pistas: pistas,
    init: function(){
        App.pistas.models.forEach(function(pista){
            var cuadro = new Cuadro(pista.id);
            var successCb = function(collection, response, options){
                pista.set('cuadro', collection.toJSON());
                pista.cuadro = collection;
                var $el = new PistaView({model: pista}).render().$el;
                $('#pistas').append($el);
            };
            cuadro.fetch({success: successCb});
        });
    }
}
$(document).ready(App.init);