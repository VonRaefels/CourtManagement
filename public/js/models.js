
var Pista = Backbone.Model.extend({
    initialize: function(){
        this.horas = new Horas({id: this.id});
    },
    idAttribute: '_id'
});

var Cuadro = Backbone.Collection.extend({
    model: Pista,
    initialize: function(){
    },
    url: '/api/pistas'
});

var Hora = Backbone.Model.extend({
    initialize: function(){},
    idAttribute: '_id'
});

var Horas = Backbone.Collection.extend({
    model: Hora,
    initialize: function(){
    },
    url: function(){ return '/api/pistas/' + this.id + '/horas/'}
});
