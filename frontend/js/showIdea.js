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
	del('tmpLarge'); /* in case that some still exist*/
    if(enableCreateLarge==1){
        divL = createLargeDiv(id);
        enLargeChildImg(divL);
        makeDraggable();
    }
}
function enLargeChildImg(divL)
{
    var img = $("#"+divL.id).find("img");
    img.css('width', divL.style.width);
    img.css('height', divL.style.height);
    img.css('filter', 'saturate(0.5) brightness(0.5)');
    img.addClass('draggable');
}
function createLargeDiv(id)
{
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
    return el2;
}
function del(id)
{
	var el = document.getElementById(id);
	if(el!==null)   el.remove(); 
}
function createSmallImg(id, img)
{
    var dom_img = document.createElement("img");
    var el = document.getElementById(id);
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    dom_img.src = img;
    dom_img.style.zIndex = 100;
    dom_img.style.position = "absolute";
    dom_img.style.top = "0";
    dom_img.style.left = '0'; 
    dom_img.style.width = '50 px'; 
    dom_img.style.height = '50 px';
    dom_img.id = 'tmpSmallImg';
    el.appendChild(dom_img);
} 
/* draggable */
$( document ).ready(makeDraggable());
function getDragImg(clickedObj)
{
    var obj = $(clickedObj);
    var img = obj.find('img');
    console.log("get Small Img");
    console.log(img.get(0));
    if(img!== null &&  img!== undefined)
        return $(img.get(0));
    else return $(clickedObj);
}
function makeDraggable()
{
    var onMouseOut;
    $( ".draggable" ).draggable({
      helper: function() {
        //debugger;
        var tmp =  $(this).find('img').clone();
        $(tmp.get(0)).css('z-index', '10000');
        $(tmp.get(1)).css('z-index', '10005');
        tmp.css('width', '160px');
        tmp.css('height', '120px');
        return $("<div></div>").append(tmp);
      },
      revert: "invalid",
      cursor: "move",
      cursorAt: { top: 30, left: 30 },
      start: function(){
          getDragImg(this);
          $('.backGray').css('display', 'block');
          $('.droppable').css('display', 'block');
          onMouseOut = $('.draggable').attr('onmouseout');
          $('.draggable').attr('onmouseout', ''); 
      },
      drag: function(){
      },
      stop: function(){
          $('.draggable').attr('onmouseout', onMouseOut);
          $('.backGray').css('display', 'none');
          $('.droppable').css('display', 'none');
      }
    });
    $('.droppable').droppable({
        drop: function(){
            //alert($('.ui-draggable-dragging').get(0));
            alert('Dropped!');
            $('.draggable').attr('onmouseout', onMouseOut);
            $('.droppable').css('display', 'none');
        }
    });
}