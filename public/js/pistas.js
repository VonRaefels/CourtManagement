var App = {
    cuadro: cuadro,
    init: function() {
        App.cuadro.models.forEach(function(pista) {
            var successCb = function(collection, response, options){
                var $el = new PistaView({model: pista}).render().$el;
                $('#pistas').append($el);
                horaEl = $($el.children('.horas')[0]);
                App.masonry(horaEl);
            };
            pista.horas.fetch({success: successCb});
            App.events();
        });
    },
    masonry: function($el) {
        var $container = $($el);
        $container.masonry({
            isAnimated: true,
            itemSelector: '.hora',
            gutter: 10
        });
    },
    events: function() {
        $('#logout-btn').on('click', function(e) {
            e.preventDefault();
            document.location.href = '/logout';
        });
    }
}
$(document).ready(App.init);