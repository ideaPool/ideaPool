var iconIsDrag = 0;

/* make icon draggable*/
$( document ).ready(iconEnDrag());
function iconEnDrag(){
    console.log('buff en drag!');
    $(function() {
        var tmpOnclick;
        $( ".icon").draggable({
            start: function(event, ui){
               iconIsDrag = 1;
            },
            drag: function(){
                
            },
            stop: function(event, ui){
                setTimeout(function(){iconIsDrag=0;}, 300);
            } 
        });
    });
}

function hideIcon()
{
    $('.icon').css('display', 'none');
}

function showIcon()
{
    $('.icon').css('display', 'block');
}