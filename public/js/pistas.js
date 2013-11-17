var App = {
    cuadro: cuadro,
    user: user,
    views: {
        pistas: {}
    },
    init: function() {
        var _renderPistas = _.after(App.cuadro.length, App.renderPistas);
        App.cuadro.models.forEach(function(pista) {
            var successCb = function(collection, response, options){
                _renderPistas();
            };
            pista.horas.fetch({success: successCb});
            App.events();
        });
    },
    renderPistas: function() {
        App.cuadro.models.forEach(function(pista) {
            var pistaView = new PistaView({model: pista});
            App.views.pistas[pista.id] = pistaView;

            var $el = pistaView.render().$el;
            $('#pistas').append($el);
            $hoy = pistaView.$hoy;
            $manana = pistaView.$manana;

            App.masonry($hoy);
            App.masonry($manana);
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
        configureNavbar();
    }
}
$(document).ready(App.init);