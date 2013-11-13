
var Pista = Backbone.Model.extend({
    initialize: function(){
        this.horas = new Horas();
        this.horas.id = this.id;
    },
    idAttribute: '_id'
});

var Cuadro = Backbone.Collection.extend({
    model: Pista,
    initialize: function(){
    },
    url: function() {'/api/cuadros/' + this.id}
});

var Hora = Backbone.Model.extend({
    initialize: function(){},
    idAttribute: '_id'
});

var Horas = Backbone.Collection.extend({
    model: Hora,
    initialize: function(){
    },
    parse: function(response, options) {
        var hoy = response.hoy;
        var manana = response.manana;
        return hoy.concat(manana);
    },
    url: function(){
        return '/api/pistas/' + this.id + '/horas/'}
});
