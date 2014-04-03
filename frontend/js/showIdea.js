var changeBlockEnable = 1;
function nextBlock()
{
	if(changeBlockEnable){
        var el = document.getElementById('disp');
        var r = document.getElementById('click-r');
        var l = document.getElementById('click-l');
        var curLeft = parseInt(el.style.left);
        var change = 0;
        if( curLeft >= -70 ){
            //el.style.left = parseInt(el.style.left) - 80 + '%';
            change = 1;
            changeBlockEnable = 0;
        }
        $(function(){
            if(change==1)
                $("#disp").animate({
                    left: (curLeft-80) + '%'
                },500, function(){
                    changeBlockEnable = 1;
                    if( curLeft-80 <= -150 )
                        r.style.display = "none";
                    else{
                        r.style.display = "";
                        l.style.display = "";
                    }
                });
        });
        console.log(el.style.left);
    }
}
function preBlock()
{
	if(changeBlockEnable){
        var el = document.getElementById('disp');
        var r = document.getElementById('click-r');
        var l = document.getElementById('click-l');
        var curLeft = parseInt(el.style.left);
        var change = 0;
        if( curLeft <= -70 ){
            //el.style.left = parseInt(el.style.left) + 80 + '%';
            change = 1;
            changeBlockEnable = 0;
        }
        $(function(){
            if(change==1)
                $("#disp").animate({
                    left: (curLeft+80) + '%'
                },500, function(){
                    changeBlockEnable = 1;
                    if(  curLeft+80 >= 10 )
                        l.style.display = "none";
                    else {
                        r.style.display = "";
                        l.style.display = "";
                    }
                });
        });
        console.log(el.style.left);
	}
}
var enableCreateLarge = 1;
function createLarge(id)
{
	if(enableCreateLarge==1){
        var el = document.getElementById(id);
        var el2 = el.cloneNode(1);
        var w = el.offsetWidth;
        var h = el.offsetHeight;
        el2.style.position = "absolute";
        el2.style.left =  el.offsetLeft - 0.15*w + 'px';
        el2.style.top = el.offsetTop - 0.15*h + 'px';
        el2.style.width = w*1.3+ 'px';
        el2.style.height = h*1.3 + 'px';
        el2.className = "createLarge draggable";
        el2.setAttribute("onmouseover", "");
        el2.setAttribute("onmouseout", "del('tmpLarge');");
        el2.id = "tmpLarge";

        el.parentNode.appendChild(el2);
        makeDraggable();
    }
}
function del(id)
{
	var el = document.getElementById(id);
	if(el!==null)   el.remove(); 
}

/* draggable */
$( document ).ready(makeDraggable());

function makeDraggable()
{
    $( ".draggable" ).draggable({
      helper: "clone",
      revert: "invalid",
      cursor: "move",
      cursorAt: { bottom: 30, right: 30 },
      start: function(){
          $('.backGray').css('display', 'block');
          $('.droppable').css('display', 'block');
      },
      drag: function(){
      },
      stop: function(){
          $('.backGray').css('display', 'none');
          $('.droppable').css('display', 'none');
      }
    });
    $('.droppable').droppable({
        drop: function(){
            //alert($('.ui-draggable-dragging').get(0).text);
            alert('Dropped!');
            $('.droppable').css('display', 'none');
        }
    });
}