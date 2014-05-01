function closeLoadingIcon()
{
    var loader = document.getElementsByClassName("loader");
    console.log("close loading icon!\n", loader);
    for(var i in loader){
        loader[i].style.display = "none";
    }
    
}