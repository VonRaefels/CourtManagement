var User = Backbone.Model.extend({
    initialize: function(data) {
        this.parse(data);
    },
    idAttribute: '_id',
    url: function() {return '/api/user';},
    parse: function(response, options) {
        var horas = response.horas;
        this.horas = new Horas();
        for (var i = horas.length - 1; i >= 0; i--) {
            this.horas.add(new Hora(horas[i]));
        }
        return response;
    },
    hasReserva: function(hora) {
        var idHora = hora.id || hora;
        var horas = this.get('horas');
        return this.horas.get(idHora) != undefined;
    },
    putReserva: function(hora) {
        this.horas.add(hora);
    },
    removeReserva: function(hora) {
        this.horas.remove(hora);
    },
    puedeReservar: function(hora) {
        var horas = this.horas.where({dia: hora.get('dia')});
        var count = 0;
        for (var i = horas.length - 1; i >= 0; i--) {
            var _hora = horas[i];
            var pista = App.pistas.get(hora.get('_idPista'));
            var _pista = App.pistas.get(_hora.get('_idPista'));
            if(_pista === undefined) continue;
            var sameCuadro = pista.get('_idCuadro') == _pista.get('_idCuadro');
            if(sameCuadro) {
                 count++;
            }
        }
        return count < App.cuadro.get('max');
    }
});


var Pista = Backbone.Model.extend({
    initialize: function(){
        this.horas = new Horas(this);
        this.horas.id = this.id;
    },
    idAttribute: '_id'
});

var Pistas = Backbone.Collection.extend({
    model: Pista,
    initialize: function(cuadro){
        this.cuadro = cuadro;
    },
    comparator: function(pista) {
        return pista.get('_id');
    },
    url: function() {return '/api/cuadros/' + cuadro.id + '/pistas/'}
});

var Cuadro = Backbone.Model.extend({
    initialize: function() {
    },
    url: function() {return 'api/cuadros/' + this.id}
});

var Cuadros = Backbone.Collection.extend({
    model: Cuadro,
    initialize: function() {
    },
    url: 'api/cuadros'
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
        if(response.max) return response;
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
            if(model.max) return cb(model, response);
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
        // if(App.user.puedeReservar(this)) {
            this.action('reservar', successCb, errorCb);
        // }else {

        // }

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
