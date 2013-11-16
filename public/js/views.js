var events = _.extend({}, Backbone.Events);

events.on('reserva', function(err, hora) {
    var showAlert = function(elId, time) {
        var $el = $('#' + elId);
        $el.toggleClass('in');
        window.setTimeout(function() { $el.removeClass('in'); }, time);
    }
    if(err) {
        showAlert('error-reserva', 3500);
    }else {
        showAlert('success-reserva', 5000);
        var pistaView = App.views.pistas[hora.collection.pista.id];
        pistaView.repaintHora(hora);
    }
});

var PistaView = Backbone.View.extend({
    initialize: function() {
        this.children = {};
    },
    id: function(){ return this.model.id; },
    tagName: 'div',
    className: 'pista',
    template: Handlebars.compile($('#pista-template').html()),
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        this.renderHoras();
        return this;
    },
    events: {
        'shown.bs.tab   a[data-toggle="tab"]'   : "layout"
    },
    layout: function(e) {
        e.preventDefault();
        var target = $(e.target).attr('href');
        var masonry = $(target).find('.horas').data('masonry');
        masonry.layout();
    },
    renderHoras: function() {
        var horas = this.model.horas;
        var self = this;
        this.cacheViewData();
        horas.forEach(function(hora, index){
            self.renderHora(hora);
        });
    },
    cacheViewData: function() {
        var $el = this.$el;
        this.$hoy = $el.find('.hoy');
        this.$manana = $el.find('.manana');
    },
    renderHora: function(hora) {
        var horaView = new HoraView({model: hora});
        this.children[hora.id] = horaView;

        var $horaEl = horaView.render().$el;
        if(hora.isHoy()) {
            this.$hoy.append($horaEl);
        }else {
            this.$manana.append($horaEl);
        }
    },
    repaintHora: function(hora) {
        var horaView = this.children[hora.id];
        horaView.render();
    }
});

var HoraView = Backbone.View.extend({
    id: function() { return this.model.id; },
    tagName: 'div',
    className: function(){
        return 'hora';
    },
    events: {
        'click'     : 'reservar'
    },
    reservar: function() {
        if(this.model.isLibre()) {
            var modalOpt = {keyboard: true, show: true};
            var $horaDialog = new HoraDialogView({model: this.model}).render().$el;
            $horaDialog.modal(modalOpt);
        }else {
            // TO DO Mostrar aviso o información...
        }

    },
    template: Handlebars.compile($('#hora-template').html()),
    render: function() {
        var className = 'ocupada';
        if(this.model.isLibre()) {
            className = 'libre';
        }
        this.$el.addClass(className).html(this.template(this.model.toJSON()));
        return this;
    }
});

var HoraDialogView = Backbone.View.extend({
    id: function() { return this.model.id },
    tagName: 'div',
    className: 'modal fade',
    template: Handlebars.compile($('#hora-dialog-template').html()),
    events: {
        'click  .reservar'  : 'reservar'
    },
    reservar: function(e) {
        var self = this;
        var $el = self.$el;
        var $buttons = $el.find('.reservar, .cancelar');
        $buttons.button('loading');
        var reservaCallback = function(err, model) {
            $buttons.button('reset');
            $el.modal('hide');
            events.trigger('reserva', err, model);
        };
        this.model.save([], {
            success: function(model, response) {
                reservaCallback(false, model);
            },
            error: function(model, response) {
                reservaCallback(true, model);
            }
        });
    },
    render: function() {
        var model = this.model.toJSON();
        model.pista = this.model.collection.pista.get('name');
        var _dia = model.dia;
        var dia = 'Hoy';
        if(_dia == 'manana'){
            dia = 'Mañana';
        }
        model.dia = dia;
        this.$el.append(this.template(model));
        return this;
    }
});
