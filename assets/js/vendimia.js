$(document).ready(function () {
    var hora = new Date();

    $('#hora').text(hora.getDate()+'/'+hora.getMonth()+'/'+hora.getFullYear()+' '+hora.getHours()+':'+hora.getMinutes());

    $('.list').on('click', 'li', function(){
        $('.list li').removeClass('active');
        $(this).addClass('active');
    });
});