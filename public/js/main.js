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
                horaEl = $($el.children('.horas')[0]);
                App.masonry(horaEl);
            };
            cuadro.fetch({success: successCb});
        });
    },
    masonry: function($el){
        var $container = $($el);
        $container.masonry({
            isAnimated: true,
            itemSelector: '.hora',
            gutter: 10
        });
    }
}
$(document).ready(App.init);