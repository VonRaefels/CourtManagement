
exports.getHoras = function(req, res){
    var id = req.param('id');
    var data = [{_id: 1, hora: "7:30", reserva: "74"}, {_id: 2, hora: "9", reserva: "-1"}
    , {_id: 3, hora: "10:30", reserva: "-1"}, {_id: 4, hora: "12", reserva: "-1"}, {_id: 5, hora: "13:30", reserva: "23"}
    , {_id: 6, hora: "15:00", reserva: "-1"}, {_id: 7, hora: "16:30", reserva: "-1"}, {_id: 8, hora: "18:00", reserva: "12"}
    , {_id: 9, hora: "19:30", reserva: "-1"}, {_id: 10, hora: "21:00", reserva: "-1"}, {_id: 11, hora: "10:30", reserva: "-1"}];
    res.json(data);
};

exports.getPistas = function(req, res){
    var data = [{_id: 1, nombre: "Pista A"}, {_id: 2, nombre: "Pista B"}, {_id: 3, nombre: "Pista C"}];
    res.json(data);
}