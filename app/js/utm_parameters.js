$(function(){
 $.urlParam = function(name){
    name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
    var regexS = '[\\?&]' + name + '=([^&#]*)';
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    
    var utm_referrer = function(){
        if(window.document.referrer != ''){
            var url = new URL(window.document.referrer).hostname;
            return url;
        } else {
            return null
        }
    };

    if(results == null && utm_referrer() == window.location.hostname) {
        var results2 = regex.exec(document.referrer);
        if(results2 == null) {
            return null;
        } else {
            return decodeURIComponent(results2[1].replace(/\+/g, ' '));
        }

    } else if(results == null) {
        return null;
    } else {
       return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
 };

 function utm_parameters(){
    if($.urlParam('utm_source') != null){$('form').append('<input type="text" name="utm_source" value="'+$.urlParam('utm_source')+'" style="display:none;">')};
    if($.urlParam('utm_medium') != null){$('form').append('<input type="text" name="utm_medium" value="'+$.urlParam('utm_medium')+'" style="display:none;">')};
    if($.urlParam('utm_campaign') != null){$('form').append('<input type="text" name="utm_campaign" value="'+$.urlParam('utm_campaign')+'" style="display:none;">')};
    if($.urlParam('utm_term') != null){$('form').append('<input type="text" name="utm_term" value="'+$.urlParam('utm_term')+'" style="display:none;">')};
    if($.urlParam('utm_content') != null){$('form').append('<input type="text" name="utm_content" value="'+$.urlParam('utm_content')+'" style="display:none;">')};
    if($.urlParam('keyword') != null){$('form').append('<input type="text" name="utm_keyword" value="'+$.urlParam('keyword')+'" style="display:none;">')};
    var str_perehoda = document.referrer;
    if(str_perehoda != ''){$('form').append('<input type="text" name="str_perehoda" value="'+str_perehoda+'" style="display:none;">')};
 };

 utm_parameters();

});