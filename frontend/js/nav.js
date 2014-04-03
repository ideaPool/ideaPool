
function showDownBar(barId)
{
    var el = document.getElementById(barId);
    el.className = "dBar";
}
function hideDownBar(barId)
{
    var el = document.getElementById(barId);
    el.className = "hide";
}

console.log("=0=");
$( document ).ready(function() {
    hideDownBar("mySpace");
    $( "#mySpace" ).mouseover(function() {
          showDownBar('mySpace');
    });
    $( "#mySpace" ).mouseout(function() {
          hideDownBar('mySpace');
    });
});
console.log("kk");
