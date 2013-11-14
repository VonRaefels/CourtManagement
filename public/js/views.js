var PistaView = Backbone.View.extend({
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
    renderHoras: function(){
        var horas = this.model.horas;
        var $el = this.$el;
        horas.forEach(function(hora, index){
            var $horaEl = new HoraView({model: hora}).render().$el;
            var $hoy = $el.find('.hoy');
            var $manana = $el.find('.manana');
            if(hora.get('dia') == 'hoy') {
                $hoy.append($horaEl);
            }else {
                $manana.append($horaEl);
            }
        });
    }
});

var HoraView = Backbone.View.extend({
    id: function() { return this.model.id; },
    tagName: 'div',
    className: function(){
        var className = 'hora';
        if(this.model.isLibre()) {
            className += ' libre';
        }else{
            className += ' ocupada';
        }
        return className;
    },
    events: {
        'click'     : 'showReservaDialog'
    },
    showReservaDialog: function() {
        var modalOpt = {keyboard: true, show: true};
        var $horaDialog = new HoraDialogView({model: this.model}).render().$el;
        $horaDialog.modal(modalOpt);
    },
    template: Handlebars.compile($('#hora-template').html()),
    render: function() {
        this.$el.append(this.template(this.model.toJSON()));
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
