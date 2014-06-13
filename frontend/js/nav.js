function showMySpace()
{
    $('#mySpaceLi').css('display', 'block');
}
function hideMySpace()
{
    $('#mySpaceLi').css('display', 'none');
}
function showFbLogin()
{
    $('#fbLoginLi').css('display', 'block');
}
function hideFbLogin()
{
    $('#fbLoginLi').css('display', 'none');
}
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
