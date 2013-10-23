var Models = {};

var Pista = Backbone.Model.extend({
    initialize: function(){
    },
    idAttribute: '_id'
});

var Pistas = Backbone.Collection.extend({
    model: Pista,
    initialize: function(){
    },
    url: '/api/pistas'
});

var Hora = Backbone.Model.extend({
    initialize: function(){},
    idAttribute: '_id'
});

var Cuadro = Backbone.Collection.extend({
    model: Hora,
    initialize: function(idPista){
        this.idPista = idPista;
    },
    url: function(){ return '/api/horas/' + this.idPista}
});

Models.Pista = Pista;
Models.Pistas = Pistas;
Models.Hora = Hora;