var configureNavbar = function() {
    var prepareInfoPopOver = function() {
        var title = '<span class="text-info glyphicon glyphicon-info-sign"></span> \
                 &nbsp<span class="text-info">Leyenda</span>';
        var content = $('#info-content').html();
        opts = {
            animation: true,
            html: true,
            placement: 'bottom',
            trigger: 'click',
            title: title,
            content: content,
            container: 'body'
        }
        $('#info').popover(opts);
    }
    var prepareLogout = function() {
        $('#logout-btn').on('click', function(e) {
            e.preventDefault();
            document.location.href = '/logout';
        });
    };
    prepareInfoPopOver();
    prepareLogout();
}

