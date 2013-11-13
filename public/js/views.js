var PistaView = Backbone.View.extend({
    id: function(){ return 'pista-' + this.model.id; },
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
    id: function(){ return 'hora-' + this.model.id; },
    tagName: 'div',
    className: function(){
        var className = 'hora';
        if(this.model.get('reserva') === undefined){
            className += ' libre';
        }else{
            className += ' ocupada';
        }
        return className;
    },
    template: Handlebars.compile($('#hora-template').html()),
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});

