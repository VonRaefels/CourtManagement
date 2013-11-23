var App = {
    cuadro: cuadro,
    cuadros: cuadros,
    pistas: pistas,
    user: user,
    views: {
        pistas: {}
    },
    $popover: undefined,
    popoverTimeout: undefined,
    init: function() {
        var _renderPistas = _.after(App.pistas.length, App.renderPistas);
        App.pistas.models.forEach(function(pista) {
            var successCb = function(collection, response, options){
                _renderPistas();
            };
            pista.horas.fetch({success: successCb});
            App.events();
        });
    },
    renderPistas: function() {
        App.pistas.models.forEach(function(pista) {
            var pistaView = new PistaView({model: pista});
            App.views.pistas[pista.id] = pistaView;

            var $el = pistaView.render().$el;
            $('#pistas').append($el);
        });
        events.trigger('selectDay', 'hoy');
    },
    showPopOver: function($el) {
        App.destroyPopover();
        App.$popover = $el;
        var content =  'Ya ha alcanzado el <strong>máximo \
                        de reservas</strong> para el día seleccionado';
        opts = {
            animation: true,
            html: true,
            placement: 'auto',
            trigger: 'manual',
            title: 'Aviso',
            content: content,
            container: 'body'
        }
        App.$popover.popover(opts);
        App.$popover.popover('show');
        App.popoverTimeout = window.setTimeout(function() {
            App.destroyPopover();
        }, 2500);
    },
    destroyPopover: function() {
        if(App.$popover && App.popoverTimeout) {
            window.clearTimeout(App.popoverTimeout);
            App.$popover.popover('hide');
            App.$popover.popover('destroy');
            App.$popover = undefined;
        }
    },
    events: function() {
        configureNavbar();
        $('.pill-dia > a').on('click', function() {
            events.trigger('selectDay', $(this).closest('li').attr('dia'));
        });
    }
}
$(document).ready(App.init);