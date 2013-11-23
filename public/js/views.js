var events = _.extend({}, Backbone.Events);

var showAlert = function(elId, time) {
    var $el = $('#' + elId);
    $el.toggleClass('in');
    window.setTimeout(function() { $el.removeClass('in'); }, time);
}

events.on('selectDay', function(dia) {
    App.destroyPopover();
    $('.pill-dia').removeClass('active');
    var $liDia = $('.nav-dia').find("li[dia='" + dia + "']");
    $liDia.addClass('active');
    $('.horas').removeClass('active');
    $('.' + dia).addClass('active');
});

events.on('reserva', function(err, model) {
    if(err) {
        showAlert('error-reserva', 3500);
    }else {
        if(model.max) {
            showAlert('maximo-reservas-error', 5000);
        }else {
            showAlert('success-reserva', 5000);
            var pistaView = App.views.pistas[model.collection.pista.id];
            App.user.putReserva(model);
            pistaView.repaintHora(model);
        }
    }
});

events.on('anulacion', function(err, hora) {
    if(err) {
        showAlert('error-anulacion', 3500);
    }else {
        showAlert('success-anulacion', 5000);
        var pistaView = App.views.pistas[hora.collection.pista.id];
        App.user.removeReserva(hora);
        pistaView.repaintHora(hora);
    }
});

var PistaView = Backbone.View.extend({
    initialize: function() {
        this.children = {};
        $(window).bind("resize.app", _.bind(this.resize, this));
    },
    remove: function() {
        $(window).unbind("resize.app");
        Backbone.View.prototype.remove.call(this);
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
    resize: function(e) {
        this.$el.css("min-height", function(){
            return $(this).find('active').height();
        });
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
        this.$horas = $el.find('.horas');
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
    events: {
        'click'     : 'reservar'
    },
    reservar: function() {
        if(this.model.isUserReserved()) {
                var modalOpt = {keyboard: true, show: true};
                var $anularDialog = new AnularDialogView({model: this.model}).render().$el;
                $anularDialog.modal(modalOpt);
        }else if(App.user.puedeReservar(this.model)) {
            if(this.model.isLibre()) {
                var modalOpt = {keyboard: true, show: true};
                var $horaDialog = new HoraDialogView({model: this.model}).render().$el;
                $horaDialog.modal(modalOpt);
            }
        }else {
            App.showPopOver(this.$el);
        }
    },
    template: Handlebars.compile($('#hora-template').html()),
    render: function() {
        var model = this.model.toJSON();
        var className = 'ocupada';
        if(this.model.isLibre()) {
            className = 'libre';
        }else if(this.model.isUserReserved()) {
            className = 'mine'
            model.mine = true;
        }
        this.$el.removeClass()
                .addClass(className)
                .addClass('hora')
                .html(this.template(model));
        return this;
    }
});

var AnularDialogView = Backbone.View.extend({
    id: function() {return this.model.id},
    tagName: 'div',
    className: 'modal fade',
    template: Handlebars.compile($('#anular-dialog-template').html()),
    events: {
        'click .anular':    'anular'
    },
    anular: function(e) {
        var self = this;
        var $el = self.$el;
        var $buttons = $el.find('.anular, .cancelar');
        $buttons.button('loading');
        var anulacionCallback = function(err, model) {
            $buttons.button('reset');
            $el.modal('hide');
            events.trigger('anulacion', err, model);
        };
        var onSuccess = function(model, response) {
            anulacionCallback(false, model);
        };
        var onError = function(model, response) {
            anulacionCallback(true, model);
        }
        this.model.anular(onSuccess, onError);
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
        var onSuccess = function(model, response) {
            reservaCallback(false, model);
        };
        var onError = function(model, response) {
            reservaCallback(true, model);
        }
        this.model.reservar(onSuccess, onError);
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
