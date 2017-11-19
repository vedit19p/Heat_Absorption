/** SHOW ALL THE COMPONENT LABELS! ***********************************************/
$('#activityContainer.activity3 .component-label').show();


/***************************************************
 * ACTIVITY DEFAULTS
 **************************************************/

var temp = 0;
var psi = 55;

var removeClickEvent = function() {
    $('#pressureGaugeContainer > div').unbind("click");
    $('#thermostatContainer > div').unbind("click");
};

var removeAllClickEvents = function() {
    $('#thermostatUpArrow').unbind("click");
    $('#thermostatDownArrow').unbind("click");
    $('#gaugeUpArrow').unbind("click");
    $('#gaugeDownArrow').unbind("click");
};


/***************************************************
 * STEP ONE - TASKS SEQUENCING
 **************************************************/

var stepOneTaskOne = function() {
    $(document).find('#thermostatUpArrow').click(function() {
        increaseTemp();

        if (activity.hinting) {
            temp = 48;
            $('#thermostatDisplayText').html(temp);
        }

        if (temp === 48) {
            activity.correctAnswer();
			$("#startContainer").hide();
            $('.showHintTempUp').removeClass('blink');
            stepOneTaskTwo();
        }
    });

    $(document).find('#thermostatDownArrow, #gaugeUpArrow, #gaugeDownArrow ').click(function() {
        activity.incorrectAnswer();
		if (activity.hinting) {
            $('.showHintTempUp').addClass('blink');
        }
    });
};

var stepOneTaskTwo = function() {
    removeClickEvent();
    $(document).find('#gaugeDownArrow').click(function() {
        decreasePSI();

        if (activity.hinting) {
            psi = 45;
            $('#gaugeDisplayText').html(psi);
        }

        if (psi === 45) {
            $('.showHintPsiDown').removeClass('blink');
            activity.correctAnswer();
            startBoil();
            stepTwoTaskOne();
        }
    });

    $(document).find('#thermostatDownArrow, #gaugeUpArrow, #thermostatUpArrow').click(function() {
        activity.incorrectAnswer();
		if (activity.hinting) {
            $('.showHintPsiDown').addClass('blink');
        }
    });
};


/***************************************************
 * STEP TWO - TASKS SEQUENCING
 **************************************************/

function stepTwoTaskOne() {
    removeClickEvent();
    //stopBoil(); 
    //temp = 0;    
    $('#thermostatDisplayText').html(temp);

    var thermostatDownArrowClicked = false;
    $(document).find('#thermostatDownArrow').click(function() {

        decreaseTemp();

        // Check to see if this has already been clicked one time.
        if (thermostatDownArrowClicked == false) {
            stopBoil();
        }

        // set to true to prevent stopBoil from being called every time this is clicked.
        thermostatDownArrowClicked = true;

        if (activity.hinting) {
            temp = 14;
            $('#thermostatDisplayText').html(temp);
        }

        if (temp == 14) {
            $('.showHintTempDown').removeClass('blink');
            activity.correctAnswer();
            stepTwoTaskTwo();
        }
    });

    $(document).find('#thermostatUpArrow, #gaugeUpArrow, #gaugeDownArrow ').click(function() {
        activity.incorrectAnswer();
		if (activity.hinting) {
            $('.showHintTempDown').addClass('blink');
        }
    });
};


var stepTwoTaskTwo = function() {
    removeClickEvent();
    $(document).find('#gaugeDownArrow').click(function() {
        decreasePSI();

        if (activity.hinting) {
            psi = 15;
            $('#gaugeDisplayText').html(psi);
        }

        if (psi === 15) {
            $('.showHintPsiDown').removeClass('blink');
            activity.correctAnswer();
            removeClickEvent();
            startBoil();
            setTimeout(function() {
                stepThreeTaskOne();
            }, 2000);
        }
    });

    $(document).find('#thermostatDownArrow, #gaugeUpArrow, #thermostatUpArrow ').click(function() {
        activity.incorrectAnswer();
		if (activity.hinting) {
            $('.showHintPsiDown').addClass('blink');
        }
    });
};


/***************************************************
 * STEP THREE - TASKS SEQUENCING
 **************************************************/

var stepThreeTaskOne = function() {
    removeClickEvent();

    $(document).find('#gaugeUpArrow').click(function() {
        increasePSI();
        stopBoil();

        if (activity.hinting) {
            psi = 25;
            $('#gaugeDisplayText').html(psi);
        }

        if (psi === 25) {
            $('.showHintPsiUp').removeClass('blink');
            activity.correctAnswer();
            stepThreeTaskTwo();
        }

    });

    $(document).find('#thermostatDownArrow, #gaugeDownArrow, #thermostatUpArrow').click(function() {
        activity.incorrectAnswer();
		if (activity.hinting) {
            $('.showHintPsiUp').addClass('blink');
        }
    });
};

var stepThreeTaskTwo = function() {
    removeClickEvent();
    $(document).find('#thermostatUpArrow').click(function() {
        increaseTemp();

        if (activity.hinting) {
            temp = 28;
            $('#thermostatDisplayText').html(temp);
        }

        if (temp === 28) {
            $('.showHintTempUp').removeClass('blink');
            activity.correctAnswer();
            startBoil();
            removeAllClickEvents();
        }
    });

    $(document).find('#thermostatDownArrow, #gaugeUpArrow, #gaugeDownArrow').click(function() {
        activity.incorrectAnswer();
		if (activity.hinting) {
            $('.showHintTempUp').addClass('blink');
        }
    });
};


/**************************************************
 * BOILING FUNCTIONS
 **************************************************/

// Create the canvas
var canvas = document.createElement("canvas");
canvas.id = "boilingBubbles";
var ctx = canvas.getContext("2d");
canvas.width = 256;
canvas.height = 451;
$('#evapContainer').append(canvas);


var startBoil = function() {

    var startBoilImage = new Image();
    startBoilImage.src = "activities/activity_3/start_boil_sprite.png";
    startBoilImage.addEventListener("load", loadImage, false);

    function loadImage(e) {
        animatStartBoil();
    }

    var shift = 0;
    var frameWidth = 256;
    var frameHeight = 451;
    var totalFrames = 111;
    var currentFrame = 0;

    function animatStartBoil() {
        ctx.clearRect(0, 0, 256, 451);

        //draw each frame + place them in the middle
        ctx.drawImage(startBoilImage, shift, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

        shift += frameWidth + 1;

        /* Call boil() when its reached the end of the sprite! */
        if (currentFrame == totalFrames) {
            shift = 0;
            currentFrame = 111;
        }

        currentFrame++;
        boil();
    }
};

var boil = function() {

    var midBoilImage = new Image();
    midBoilImage.src = "activities/activity_3/mid_boil_sprite.png";
    midBoilImage.addEventListener("load", loadImage, false);

    function loadImage(e) {
        animateMidBoil();
    }

    var shift = 0;
    var frameWidth = 256;
    var frameHeight = 451;
    var totalFrames = 111;
    var currentFrame = 0;

    function animateMidBoil() {
        ctx.clearRect(0, 0, 256, 451);

        //draw each frame + place them in the middle
        ctx.drawImage(midBoilImage, shift, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

        shift += frameWidth + 1;

        /*
            Start at the beginning once you've reached the
            end of your sprite!
        */
        if (currentFrame == totalFrames) {
            shift = 1;
            currentFrame = 1;
        }

        currentFrame++;
        requestAnimationFrame(animateMidBoil);
    }
};

var stopBoil = function() {
    var stopBoilImage = new Image();
    stopBoilImage.src = "activities/activity_3/stop_boil_sprite.png";
    stopBoilImage.addEventListener("load", loadImage, false);

    function loadImage(e) {
        animateStopBoil();
    }

    var shift = 0;
    var frameWidth = 256;
    var frameHeight = 451;
    var totalFrames = 77;
    var currentFrame = 1;

    function animateStopBoil() {
        ctx.clearRect(0, 0, 256, 451);

        //draw each frame + place them in the middle
        ctx.drawImage(stopBoilImage, shift, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

        shift += frameWidth + 1;

        /* Exit once you've reached the end of the sprite! */
        if (currentFrame == totalFrames) {
            currentFrame = 77;
            shift = 74016;
            var noBoilImage = new Image();
            noBoilImage.src = "activities/activity_3/454-Height-Static.png";
            ctx.clearRect(0, 0, 256, 451);
            ctx.drawImage(noBoilImage, 0, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
        }

        currentFrame++;
        requestAnimationFrame(animateStopBoil);

    }
};



/**************************************************
 * THERMOSTAT FUNCTIONS
 **************************************************/

var decreaseTemp = function() {
	$('#thermostatDisplayText').html('');
	
    if (temp !== 0) {
        temp = temp - 2;
    } else {
        temp = 0;
    }

    $('#thermostatDisplayText').html(temp);
	$('#thermostatContainer').hide().show();
};

var increaseTemp = function() {
    $('#thermostatDisplayText').html('');
	
	if (temp !== 48) {
        temp = temp + 2;
    } else {
        temp = 48;
    }
	
    $('#thermostatDisplayText').html(temp);
	$('#thermostatContainer').hide().show();
};



/**************************************************
 * PSI FUNCTIONS
 **************************************************/

var decreasePSI = function() {
	$('#gaugeDisplayText').html('');
	
    // Can't adjust PSI till temperature is set.
    if (psi !== 5) {
        psi = psi - 10;
    } else {
        psi = 5;
        $('#gaugeDisplayText').html('0');
    }

    $('#gaugeDisplayText').html(psi);
	$('#pressureGaugeContainer').hide().show();
};

var increasePSI = function() {
	$('#gaugeDisplayText').html('');
	
    // Can't adjust PSI till temperature is set.    
    if (psi !== 55) {
        psi = psi + 10;
    } else {
        psi = 55;
    }

    $('#gaugeDisplayText').html(psi);
	$('#pressureGaugeContainer').hide().show();
};

(function() {
	preload([
		'activities/activity_3/start_boil_sprite.png',
		'activities/activity_3/mid_boil_sprite.png',
		'activities/activity_3/stop_boil_sprite.png'
	]);
	stopBoil();
    stepOneTaskOne();
})($);

function preload(image) {
    $(image).each(function(index) {
		$('<img/>').attr('src', this).appendTo('body').hide();
    });
}