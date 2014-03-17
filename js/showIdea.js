//Finds y value of given object
function findPos(obj)
{
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}

function scroll(id)
{
	window.scroll(0,findPos(document.getElementById(id)));
}
