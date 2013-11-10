var mongoose = require('mongoose');
var config = require('../config/config');

mongoose.connect(config.dbLocation);

// var mongooseTypes = require('mongoose-types');
// mongooseTypes.loadTypes(mongoose);

var Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
    // Email = mongoose.SchemaTypes.Email;


var Urbanizacion = new Schema(
    {
        name        : {type: String, required: true}
    },
    {
        collection  : 'Urbanizacion'
    }
);

var User = new Schema(
    {
        name        : {type: String, required: true},
        pwd         : {type: String, required: true},
        _idUrba     : {type: ObjectId, required: true, ref: 'Urbanizacion'}
    },
    {
        collection  : 'User'
    }
);

var Cuadro = new Schema(
    {
        name        : {type: String, required: true},
        _idUrba     : {type: ObjectId, required: true, ref: 'Urbanizacion'}
    },
    {
        collection  : 'Cuadro'
    }
);

var Pista = new Schema(
    {
        name        : {type: String, required: true},
        _idCuadro   : {type: ObjectId, required: true, ref: 'Cuadro'}
    },
    {
        collection  : 'Pista'
    }
);


module.exports.Urbanizacion = mongoose.model('Urbanizacion', Urbanizacion);
module.exports.User = mongoose.model('User', User);
module.exports.Cuadro = mongoose.model('Cuadro', Cuadro);
module.exports.Pista = mongoose.model('Pista', Pista);
