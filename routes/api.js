
exports.getHoras = function(req, res) {
    var id = req.param('id');
    var data = [{_id: 1, hora: "07:30", reserva: "74"}, {_id: 2, hora: "09:00"}
    , {_id: 3, hora: "10:30"}, {_id: 4, hora: "12:00"}, {_id: 5, hora: "13:30", reserva: "23"}
    , {_id: 6, hora: "15:00"}, {_id: 7, hora: "16:30"}, {_id: 8, hora: "18:00", reserva: "12"}
    , {_id: 9, hora: "19:30"}, {_id: 10, hora: "21:00"}, {_id: 11, hora: "10:30"}];
    res.json(data);
};

exports.getPistas = function(req, res) {
    var data = [{_id: 1, nombre: "Pista A"}, {_id: 2, nombre: "Pista B"}, {_id: 3, nombre: "Pista C"}];
    res.json(data);
}

exports.login = function(req, res) {
    var data = {error: true};
    res.json(data);
}