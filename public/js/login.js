$(document).ready(function() {
    var sendLogin = function(e) {
        e.preventDefault();
        if(validateForm()) {
            var username = $('#username').val();
            var password = $('#password').val();
            var urba = $('#urbas').select2("val");
            var data = {name: username, password: password, _urba: urba};
            $.ajax({
                type: 'POST',
                url: '/login',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data)
            })
            .done(function(res) {
                modalOpt = {keyboard: true, show: true};
                if(res.error) {
                    $('#data-error').modal(modalOpt);
                }else {
                    document.location.href = '/';
                }
            })
            .fail(function() {
                modalOpt = {keyboard: true, show: true};
                $('#server-error').modal(modalOpt);
            });
        }
    }

    var validateForm = function() {
        var $username = $('#username');
        var $password = $('#password');
        var $urba = $('#urbas');

        if(!isValidText($username.val())) {
            showError($username);
            return false;
        }else {
            removeError($username);
        }

        if(!isValidText($password.val())) {
            showError($password);
            return false;
        }else {
            removeError($password);
        }

        if(!isValidText($urba.select2("val"))) {
            showError($urba);
            return false;
        }else {
            removeError($urba);
        }

        return true;
    }

    function isValidText(text) {
        return text != '' && text.length < 40;
    }

    function showError($el) {
        $el.focus();
        $formGroup = $el.closest('.form-group');
        $formGroup.addClass('has-error');
    }

    function removeError($el){
        $formGroup = $el.closest('.form-group');
        $formGroup.removeClass('has-error');
    }

    $('#urbas').select2();
    $('#login-btn').on('click', sendLogin);

});