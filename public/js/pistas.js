var App = {
    cuadro: cuadro,
    views: {
        pistas: {}
    },
    init: function() {
        App.cuadro.models.forEach(function(pista) {
            var successCb = function(collection, response, options){
                var pistaView = new PistaView({model: pista});
                App.views.pistas[pista.id] = pistaView;

                var $el = pistaView.render().$el;
                $('#pistas').append($el);
                $hoy = pistaView.$hoy;
                $manana = pistaView.$manana;

                App.masonry($hoy);
                App.masonry($manana);
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