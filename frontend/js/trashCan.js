function makeDelLayerDroppable(onMouseOut)
{
     $('#delLayer').droppable({
        drop: function(){
            alert('Deleted!');
            $('.draggable').attr('onmouseout', onMouseOut);
            $('.droppable').css('display', 'none');
            $('#trashCan').css('display', 'none');
            $('#delLayer').css('display', 'none');
            if(currentDragId!==null){
                delIdea(currentDragId); /* this function is in buffer.js*/
            } 
            console.log('oaoa');
            currentDragId = null;
        }
    });
}
