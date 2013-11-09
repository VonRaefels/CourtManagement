
/*
 * GET home page.
 */

exports.cuadro = function(req, res){
    var cuadro = [{_id: 1, nombre: "Pista A"}, {_id: 2, nombre: "Pista B"}, {_id: 3, nombre: "Pista C"}];
    res.render('index', {cuadro:  cuadro});
};

exports.login = function(req, res){
    var urbas = [{value: '1', name: 'Las Matas'}, {value: '2', name: 'Las Rozas'}, {value: '3', name: 'Alcobendas'}];
    res.render('login', {urbas: urbas});
}