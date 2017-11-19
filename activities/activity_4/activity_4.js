var wrong = false; 
var correctCounter = 0;
var correctAnswerAmount = 3;

var wrongAnswer = 0;

var wrongAnswerAmount = 3;
var drag1Good = false;
var drag2Good = false;
var drag3Good = false;

var drag1Filled = false;
var drag2Filled = false;
var drag3Filled = false;

var currentSelection1, currentSelection2, currentSelection3;
var topPosition;

var ifCorrect = function(dropId){
    correctCounter++;
    if(correctCounter === correctAnswerAmount){

          $("#btnSubmit").show();
    }
}


var ifNotCorrect = function(){
    wrongAnswer++;
    if(wrongAnswer === wrongAnswerAmount){
    	showHint();

    	return false;
    }
     activity.incorrectAnswer()
}


var showHint = function(){
   $('.draggable, .divider-h').hide();
   $('.showhint').show();
}




  $( function() {


    var tops =[65, 140, 215];
    var left = 7;
    var drag1Top, drag2Top, drag3Top = 0;

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    $(document).ready(function() {
      // Used like so
      var arr = tops;
      arr = shuffle(arr);
      for(var i = 0; i<=2; i++){
        $("#draggable" + (i+1)).css("top", arr[i] + "px");

        if (i == 0){
          drag1Top = arr[i];
        }
        else if (i ==1){
          drag2Top = arr[i];
        }
        else if (i == 2){
          drag3Top = arr[i];
        }
      }
      console.log(arr);
    });

    $("#btnSubmit").click(function(){
        if (!drag1Good){
          drag1Filled = false;
          drag1Good = false;
           $("#draggable1").draggable({ disabled: false});
          //$("#draggable1").css( { top:"65px", left:"7px"});
          $("#draggable1").css( { top:drag1Top +"px", left:"-11px", "z-index":"2"});
          $("#drop1Check").hide();
        }
        else{
          drag1Filled = true;
          $("#drop1Check").show();
          $("#draggable1").draggable({ disabled: true });
		  $("#droppable1").droppable("option", "disabled", true);
        }

        if (!drag2Good){
          drag2Filled = false;
          drag2Good = false;
           $("#draggable2").draggable({ disabled: false});
         // $("#draggable2").css( { top:"140px", left:"7px" });
          $("#draggable2").css( { top:drag2Top +"px", left:"-11px", "z-index":"2"});
          $("#drop2Check").hide();
        }
        else{
          drag2Filled = true;
          $("#drop2Check").show();
          $("#draggable2").draggable({ disabled: true });
		  $("#droppable2").droppable("option", "disabled", true);
        }

        if (!drag3Good){
          drag3Filled = false;
          drag3Good = false;
           $("#draggable3").draggable({ disabled: false});
          //$("#draggable3").css( { top:"215px", left:"7px" });
          $("#draggable3").css( { top:drag3Top +"px", left:"-11px", "z-index":"2"});
          $("#drop3Check").hide();
        }
        else{
          drag3Filled = true;
          $("#drop3Check").show();
          $("#draggable3").draggable({ disabled: true });
		  $("#droppable3").droppable("option", "disabled", true);
        }


        $("#btnSubmit").hide();
        if (drag1Good && drag2Good && drag3Good){
           activity.correctAnswer();
        }
        else{
          wrongAnswer++;
          

          if (wrongAnswer >= 3){
			activity.incorrectAnswer();
            $("#draggable1").css({ top: "140px",left: "657px"});
            $("#draggable2").css({ top: "140px", left:"418px"});
            $("#draggable3").css({ top: "140px", left: "198px"});

            drag1Filled = true;
            drag2Filled =true;
            drag3Filled = true;
			
			$("#drop1Check, #drop2Check, #drop3Check").show();
            activity.correctAnswer();
          }
          else{
            activity.incorrectAnswer();
          }

          
        }

       
    });

   
   //Drag Element
   $("#draggable1").draggable({ 
   	  snapTolerance:100,
	  revert: "invalid",
      create: function(){$(this).data('position',$(this).position())},
      drag: 
        function(evt, ui) { 
          //console.log("left-> " + ui.position.left + " -- top-> " + ui.position.top);

		  $(ui.draggable).css('z-index', '2');
		  
          if (ui.position.top >= 407){
            ui.position.top =407;
          }
          if (ui.position.top <= -31){
            ui.position.top  = -31;
          }
          if (ui.position.left <= -21){
            ui.position.left = -21;
          }
          if (ui.position.left >= 777){
            ui.position.left = 777;
          }
        }
  });
    //Drop Zones
   $("#droppable1").droppable({
   	//Correct answer
    accept: '#draggable1,#draggable2,#draggable3',
    drop:function(event, ui){
			if (drag1Filled == true) {
				$('#' + currentSelection1).css({top: topPosition + 'px', left: '-11px', 'z-index': '2'});
				$('#' + currentSelection1).draggable('enable');
			}
				
			currentSelection1 = ui.draggable[0].id;
			if (currentSelection1 == "draggable1") {
				topPosition = drag1Top;
			} else if (currentSelection1 == "draggable2") {
				topPosition = drag2Top;
			} else {
				topPosition = drag3Top;
			}
			
            $(ui.draggable).css('top','140px');
            $(ui.draggable).css('left', '657px');
			$(ui.draggable).css('z-index', '1');
    
             drag1Filled = true;
             if (currentSelection1 == "draggable1") {
				drag1Good = true;
			 } else {
				drag1Good = false;
			 }

             $("#" + ui.draggable[0].id).draggable({ disabled: true });

             decideToShowSubmit();
             
         }
});

    //Drag Element
   $("#draggable2").draggable({ 
      create: function(){$(this).data('position',$(this).position())},
	  revert: "invalid",
      snapTolerance: 100,
      drag: 
        function(evt, ui) { 
          //console.log("left-> " + ui.position.left + " -- top-> " + ui.position.top);

		  $(ui.draggable).css('z-index', '2');
		  
          if (ui.position.top >= 407){
            ui.position.top =407;
          }
          if (ui.position.top <= -31){
            ui.position.top  = -31;
          }
          if (ui.position.left <= -21){
            ui.position.left = -21;
          }
          if (ui.position.left >= 777){
            ui.position.left = 777;
          }
        }
   });
   //Drop Zones
   $("#droppable2").droppable({
   	//Correct answer
    accept: '#draggable2,#draggable1,#draggable3',
    drop:function(event, ui){
     		if (drag2Filled == true) {
				$('#' + currentSelection2).css({top: topPosition + 'px', left: '-11px', 'z-index': '2'});
				$('#' + currentSelection2).draggable('enable');
			}
				
			currentSelection2 = ui.draggable[0].id;
			if (currentSelection2 == "draggable1") {
				topPosition = drag1Top;
			} else if (currentSelection2 == "draggable2") {
				topPosition = drag2Top;
			} else {
				topPosition = drag3Top;
			}

            $(ui.draggable).css('top','140px');
            $(ui.draggable).css('left', '418px');
			$(ui.draggable).css('z-index', '1');
			
            drag2Filled = true;
            
			if (currentSelection2 == "draggable2") {
				drag2Good = true;
			} else {
				drag2Good = false;
			}

            $("#" + ui.draggable[0].id).draggable({ disabled: true });

            decideToShowSubmit();
         }
});


  //Drag Element
  $("#draggable3").draggable({ 
      create: function(){$(this).data('position',$(this).position())},
	  revert: "invalid",
      snapTolerance:100,
      drag: 
        function(evt, ui) { 
          //console.log("left-> " + ui.position.left + " -- top-> " + ui.position.top);

		  $(ui.draggable).css('z-index', '2');
          if (ui.position.top >= 407){
            ui.position.top =407;
          }
          if (ui.position.top <= -31){
            ui.position.top  = -31;
          }
          if (ui.position.left <= -21){
            ui.position.left = -21;
          }
          if (ui.position.left >= 777){
            ui.position.left = 777;
          }
        }
   });
   //Drop Zones
   $("#droppable3").droppable({
      //Correct answer
      accept: '#draggable3,#draggable1,#draggable2',
      drop:function(event, ui) {
			if (drag3Filled == true) {
				$('#' + currentSelection3).css({top: topPosition + 'px', left: '-11px', 'z-index': '2'});
				$('#' + currentSelection3).draggable('enable');
			}
				
			currentSelection3 = ui.draggable[0].id;
			if (currentSelection3 == "draggable1") {
				topPosition = drag1Top;
			} else if (currentSelection3 == "draggable2") {
				topPosition = drag2Top;
			} else {
				topPosition = drag3Top;
			}
			
            $(ui.draggable).css('top','140px');
            $(ui.draggable).css('left', '198px');
			$(ui.draggable).css('z-index', '1');
			
            drag3Filled = true;
            
			if (currentSelection3 == "draggable3") {
				drag3Good = true;
			} else {
				drag3Good = false;
			}

            $("#" + ui.draggable[0].id).draggable({ disabled: true });

            decideToShowSubmit();
          }
    });

    function decideToShowSubmit() {
		if (drag1Filled && drag2Filled && drag3Filled) {
			activityInProgress = true;
			$('#btnSubmit').show();
		}
	}
});