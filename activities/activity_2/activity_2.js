
var showCounter = 0;
var selectedCorrectAnswer = false;

$(document).on('click', '.wrong-spot', function(evt){
if(selectedCorrectAnswer){
	return
}

  evt.stopPropagation();
  evt.preventDefault();
  evt.stopImmediatePropagation();


	showCounter++;
	if(showCounter === 3){
    $('.showHint').show();
	}
});


$(document).on('click', '#correctSpot', function(){	
 	$('.showHint').hide();
 	$("#correctSpot").prop("disabled", true);
 	selectedCorrectAnswer = true;
});
