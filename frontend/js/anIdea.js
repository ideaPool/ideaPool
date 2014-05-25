function showAnIdea(){
  $('.anIdeaContainer').css('display', 'inline');
}
function hideAnIdea(){
  $('.anIdeaContainer').css('display', 'none');
}

// get parameter
$(document).ready(function(){
  var url=window.location.toString();
  var str="";
  var str_value="";
  if(url.indexOf("?")!=-1){
      var ary=url.split("?")[1].split("&");
      for(var i in ary){
          str=ary[i].split("=")[0];
          if (str == "id") {
              str_value = decodeURI(ary[i].split("=")[1]);
          }
      }
  }
  // alert(str_value);
});

// test
var id;
$(document).ready(function(){
  $('#button').draggable();
  $('#button').click(function(event){
    showAnIdea();
  });
  var name = {str: 'name'};
  //getName(name, "https://graph.facebook.com/100002031714388");
  //setTimeout(function(){alert('4 '+name.str);}, 500);
  // getName("https://graph.facebook.com/100002031714388");
});
function getName(obj, url){
  $.getJSON(url, function(result){
    obj.str = result.name;
    id = result.name;
    //alert('1 '+obj.str);
    //alert('2 '+id);
  });
}