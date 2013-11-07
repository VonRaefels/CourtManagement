
/*
 * GET home page.
 */

exports.cuadro = function(req, res){
    var cuadro = [{_id: 1, nombre: "Pista A"}, {_id: 2, nombre: "Pista B"}, {_id: 3, nombre: "Pista C"}];
    res.render('index', {cuadro:  cuadro});
};

exports.login = function(req, res){
    var urbas = [{value: 'Las Matas', tokens: ['Matas', 'Rozas', 'Las'], name: 'Las Matas'}]
    res.render('login', {urbas: urbas});
}