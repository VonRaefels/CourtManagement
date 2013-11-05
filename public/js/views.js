var PistaView = Backbone.View.extend({
    id: function(){ return 'pista-' + this.model.id; },
    tagName: 'div',
    className: 'pista',
    template: Handlebars.compile($('#pista-template').html()),
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        this.renderPistas();
        return this;
    },
    renderPistas: function(){
        var cuadro = this.model.cuadro;
        var $el = this.$el;
        cuadro.forEach(function(hora, index){
            var $horaEl = new HoraView({model: hora}).render().$el;
            $($el.children('.horas')[0]).append($horaEl);
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

