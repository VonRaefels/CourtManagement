$(document).ready(function() {
    var sendLogin = function(e) {
        e.preventDefault();
        if(validateForm()) {
            var username = $('#username').val();
            var password = $('#password').val();
            var urba = $('#urbas').val();
            var data = {username: username, password: password, urba: urba};
            $.ajax({
                type: "POST",
                url: "/login",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data)
            })
            .done(function(msg) {
                console.log(msg);
            })
            .fail(function() {
            });
        }
    }

    var validateForm = function() {
        var $username = $('#username');
        var $password = $('#password');

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

        return true;
    }

    function isValidText(text) {
        return text != '' && text.length < 20;
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