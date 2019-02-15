'use strict';

$(document).ready(function(){
    const mailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const telReg = /^\+[0-9]{3}\s*?-*?[0-9]{2}\s*?-*?[0-9]{3}\s*?-*?[0-9]{2}\s*?-*?[0-9]{2}$/;

    $(document).on('focusin', '.rep-form textarea.textarea', function(){
        $(this).removeClass('error-field');
    });

    $('.rep-form input.textarea').focusin(function() {
        $(this).removeClass('error-field');
    });

    $('.rep-form').submit(function(event){
        
        let errstr = '';
        let form = event.currentTarget,
            mailField = form.querySelector('.rep-form .email'),
            nameField = form.querySelector('.rep-form .name'),
            telField = form.querySelector('.rep-form .tel'),
            msgField = form.querySelector('.rep-form #message_text'),
            textareas = [];
            
        if (contains(form, msgField)) {
            textareas.push(msgField);
            if (msgField.value.length < 5) {
                if (errstr.length > 0) errstr += '\n';
                errstr +='Поле с вопросом должно содержать минимум 5 символов.';
                msgField.classList.add('error-field');
            }
        };

        if (contains(form, telField)) {
            textareas.push(telField);
            if (!telReg.test(telField.value)) {
                errstr += 'Поле "Ваш номер" должно содержать номер телефона с кодом в формате " +***-**-******* ".' + ' ';
                telField.classList.add('error-field');
            }
        };

        if (contains(form, mailField)) {
            textareas.push(mailField);
            if (!mailReg.test(mailField.value)) {
                if (errstr.length > 0) errstr += '\n';
                errstr += 'Поле "Ваш e-mail" должно содержать правильный адрес электронной почты.' + ' ';
                mailField.classList.add('error-field');
            }
        };

        if (contains(form, nameField)) {
            textareas.push(nameField);
            if (nameField.value.length < 5) {
                if (errstr.length > 0) errstr += '\n';
                errstr +='Поле с именем должно содержать минимум 5 символов.';
                nameField.classList.add('error-field');
            }
        };

        if (errstr.length > 0) {
            textareas.forEach(function(item, i){
                item.blur();
            });

            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }

            _alert(errstr);
        } else {
            form.querySelector('h2').focus(); //change focus to some element to prevent keyboard visible state.

            $('.ironCurtain').show();
            $('.progressBar').show();


            $(this).ajaxSubmit({
                forceSync: true,
                uploadProgress: function(event, position, total, percentComplete) {
                    //centring again after keyboard slowly goes out
                    if (percentComplete < 99) {
                        if (!!position) {
                            $('#progressStatus').html('Загружено' + ' <span id="pos">' + bytesToSize(position, 1) + '</span> ' + ' из '  +' <span id="total">' + bytesToSize(total, 1) + '</span>');
                        } else {
                            $('#progressStatus').html('Загрузка');
                        }
                    } else {
                        setTimeout(function() {
                            $('#progressStatus').html( 'Почти загружено.' + '<br>' + 'Пожалуйста, подождите еще немного.');
                        }, 5000);
                    }
                    
                    $('.progressBar .bar').css('width', Math.abs(percentComplete * 2.7) + 'px');

                },
                // dataType identifies the expected content type of the server response
                dataType:  'json',
                // success identifies the function to invoke when the server response
                // has been received
                error: function(xhr, textStatus, errorThrown) {
                    $('.progressBar #pos').html('');
                    $('.progressBar #total').html('');
                    $('.progressBar .bar').css('width', '10px');
                    $('.ironCurtain').hide();
                    $('.progressBar').hide();
                    _alert('Проблемы при передаче сообщения. Попробуйте еще раз.');
                    console.log(textStatus);
                    console.log(xhr.responseText);
                    console.log(errorThrown);
                },
                success: function (data) {

                    $('#progressStatus').html('100%');
                    $('.progressBar .bar').css('width', '100%');

                    setTimeout(function() {
                        $('.ironCurtain').hide();
                        $('.progressBar').hide();

                        let mess_obj = data;
                        if (mess_obj.sent != 1 ||  data == '') {
                            _alert('Пожалуйста, заполните все поля формы.');
                        } else {
                            _alert('Сообщение отправлено.');
                            if (!!telField) telField.value = '';
                            if (!!mailField) mailField.value = '';
                            if (!!msgField) msgField.value = '';
                            if (!!nameField) nameField.value = '';
                        }
                    }, 500);
                }
            });
            return false;
        }
    });

});

function _alert(message) {
    setTimeout(function() {
        alert(message);
    }, 500);
}

function contains(parent, child) {
    let children = parent.childNodes;
    for (var i = children.length - 1; i >= 0; i--) {
        if (child == children[i]) return true;

    }
    return false;
}