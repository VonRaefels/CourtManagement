var User = Backbone.Model.extend({
    initialize: function() {
    },
    idAttribute: '_id',
    url: function() {return '/api/user';},
    hasReserva: function(hora) {
        var idHora = hora.id || hora;
        var horas = this.get('horas');
        for (var i = horas.length - 1; i >= 0; i--) {
            if(horas[i]['_id'] === idHora) {
                return true;
            }
        }
        return false;
    },
    putReserva: function(hora) {
        this.get('horas').push(hora.toJSON());
    },
    removeReserva: function(hora) {
        var idHora = hora.id || hora;
        var horas = this.get('horas');
        for (var i = horas.length - 1; i >= 0; i--) {
            if(horas[i]['_id'] === idHora) {
                 horas.splice(i, 1);
            }
        }
    }
});


var Pista = Backbone.Model.extend({
    initialize: function(){
        this.horas = new Horas(this);
        this.horas.id = this.id;
    },
    idAttribute: '_id'
});

var Cuadro = Backbone.Collection.extend({
    model: Pista,
    initialize: function(){
    },
    comparator: function(pista) {
        return pista.get('_id');
    },
    url: function() {return '/api/cuadros/' + this.id;}
});

var Hora = Backbone.Model.extend({
    initialize: function(){},
    idAttribute: '_id',
    isLibre: function() {
        return this.get('_idUser') === undefined;
    },
    isHoy: function() {
        return this.get('dia') == 'hoy';
    },
    url: function() {
        return '/api/horas/' + this.id;
    },
    parse: function(response, options) {
        var hora = new Date(response.hora);
        var horaString = String('00' + hora.getHours()).slice(-2)
                         + ':' + String('00' + hora.getMinutes()).slice(-2);
        response.hora = horaString;
        return response;
    },
    isUserReserved: function() {
        return App.user.hasReserva(this.id);
    },
    onActionSuccess: function(cb) {
        var self = this;
        return function(model, response) {
            var hashSet = self.parse(model, null);
            self.clear();
            self.set(hashSet);
            cb(self, model);
        }
    },
    action: function(action, successCb, errorCb, params) {
        var url = this.url(),
        options = {
            url: url,
            type: 'POST',
            data: JSON.stringify({action: action}),
            contentType: 'application/json',
            success: this.onActionSuccess(successCb),
            error: errorCb
        };
        return (this.sync || Backbone.sync).call(this, null, this, options);
    },
    reservar: function(successCb, errorCb) {
        this.action('reservar', successCb, errorCb);
    },
    anular: function(successCb, errorCb) {
        this.action('anular', successCb, errorCb);
    }
});

var Horas = Backbone.Collection.extend({
    model: Hora,
    initialize: function(pista) {
        this.pista = pista;
    },
    parse: function(response, options) {
        var hoy = response.hoy;
        var manana = response.manana;
        var horasArr = hoy.concat(manana);
        horasArr.sort(function (a, b) {
            var aDate = new Date(a.hora);
            var bDate = new Date(b.hora);

            if (aDate < bDate) return -1;
            if (aDate > bDate) return 1;
            return 0;
        });
        return horasArr;
    },
    url: function(){
        return '/api/pistas/' + this.id + '/horas/'}
});
