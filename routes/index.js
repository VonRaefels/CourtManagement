
/*
 * GET home page.
 */

exports.index = function(req, res){
    var data = [{_id: 1, nombre: "Pista A"}, {_id: 2, nombre: "Pista B"}, {_id: 3, nombre: "Pista C"}];
    res.render('index', { pistas:  data});
};