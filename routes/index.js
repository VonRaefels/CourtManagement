
/*
 * GET home page.
 */

exports.index = function(req, res){
    var cuadro = [{_id: 1, nombre: "Pista A"}, {_id: 2, nombre: "Pista B"}, {_id: 3, nombre: "Pista C"}];
    res.render('index', { cuadro:  cuadro});
};