var mongoose = require('mongoose');
var config = require('../config/config'),
    bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;

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
        xadm        : {type: Boolean, required: false},
        _idUrba     : {type: ObjectId, required: true, ref: 'Urbanizacion'}
    },
    {
        collection  : 'User'
    }
);

// User.pre('save', function(next) {
//     var user = this;

//     if (!user.isModified('pwd')) return next();
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);

//         bcrypt.hash(user.pwd, salt, function(err, hash) {
//             if (err) return next(err);

//             user.pwd = hash;
//             next();
//         });
//     });
// });

// User.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.pwd, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

var Cuadro = new Schema(
    {
        name        : {type: String, required: true},
        _idUrba     : {type: ObjectId, required: true, ref: 'Urbanizacion'},
        startHour   : {type: Date, required: true},
        lastDate    : {type: Date},
        duration    : {type: Number, required: true},
        limit       : {type: Number},
        max         : {type: Number, required: true}
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

var Hora = new Schema(
    {
        hora        : {type: Date, required: true},
        _idPista    : {type: ObjectId, required: true, ref: 'Pista'},
        reserva     : {type: String, requried: false},
        dia         : {type: String, required: true},
        _idUser     : {type: ObjectId, required: false}
    },
    {
        collection  : 'Hora'
    }
)

/*
 * Statics
 */
Hora.statics.findSorted = function findSorted(query, callback) {
    // TO DO Fields and options?
    return this.find(query).sort('hora').exec(callback);
}


module.exports.Urbanizacion = mongoose.model('Urbanizacion', Urbanizacion);
module.exports.User = mongoose.model('User', User);
module.exports.Cuadro = mongoose.model('Cuadro', Cuadro);
module.exports.Pista = mongoose.model('Pista', Pista);
module.exports.Hora = mongoose.model('Hora', Hora);
