/** BLOWER SWITCH ***********************************************/
var blowerPosition = "off";
var blowerPosition1Selected_1 = false;
var blowerPosition2Selected_2 = false;
var blowerPosition3Selected_3 = false;
var blowerPosition4Selected_4 = false;
var blowerPosition5Selected_5 = false;
var blowerRunning = false;

/** IGNITION SWITCH ***********************************************/
var ignitionSwitchPositionLock = false;
var ignitionSwitchPositionACC = false;
var ignitionSwitchPositionON = false;
var ignitionSwitchPositionStart = false;

/** SCORE ***********************************************/
var score = 0;

/** SHOW ALL THE COMPONENT LABELS! ***********************************************/
$('#activityContainer.activity5 .component-label').show();

$(function() {
    $('#blowerSwitchKnob').on('click', function() {
		activity.incorrectAnswer();
		if (activity.hinting) {
			$('.correctSel').addClass('highlight').hide().show();
		}
    });
});

/********************************************************
 * IGNITION SWITCH FUNCTIONS
 *******************************************************/
var ignitionPosition = "lock";
var carStarted = 0;

var turnCarOn = function() {
    /*$('#ignitionSwitch').css({
        'background': 'url("activities/activity_5/ignition_key_switch_on.png") no-repeat',
        'background-size': 'cover'
    });*/
	$('#ignitionSwitch').hide();
	$('#ignitionPlaceholder').show();
    startCoilBoil();
    Draggable.get('#blowerSwitchKnob').enable();
    carStarted = 1;
	
	$('#ignitionPlaceholder').click(function() {
        activity.incorrectAnswer();
		if (activity.hinting) {
			$('#blowerSwitchHint').addClass('highlight2').hide().show();
		}
    });
};

var turnCarOff = function() {
    $('#ignitionSwitch').css({
        'background': 'url("activities/activity_5/ignition_key_switch_off.png") no-repeat',
        'background-size': 'cover'
    });
};

/** Ignition Key: Drag/Rotate Function */
var carKey = Draggable.create("#carKey", {
    type: "rotation",
    throwProps: false,
    bounds: {
        minRotation: 50,
        maxRotation: 152
    },
    liveSnap: [50, 93, 120, 152],
    onDragEnd: function() {
        /** IGNITION POSITION: Lock (Off) */
        if (this.rotation == 50) {
            ignitionPosition = "lock";
            //turnCarOff();
        }

        /** IGNITION POSITION: Acc */
        else if (this.rotation == 93) {
            ignitionPosition = "acc";
        }

        /** IGNITION POSITION: On */
        else if (this.rotation == 120) {
            ignitionPosition = "on";
            turnCarOn();
            if (carStarted > 1) {
				$("#carKey").draggable("disable");
            }
        }

        /** IGNITION POSITION: Start */
        else if (this.rotation == 152) {
            ignitionPosition = "start";
            turnCarOn();
            // Return key to on position after start
            setTimeout(function() {
                TweenMax.to("#carKey", 1, {
                    rotation: 120
                });
                ignitionPosition = "on";
            }, 250);
			if (carStarted > 1) {
				$("#carKey").draggable("disable");
            }
        }

        // Check if the ignition is in the correct position
        isCorrectIgnitionPosition();
    }
});

/** Ignition Key: Click to LOCK position */
$('#ignitionSwitchClickSpot_lock').on('click', function() {
    // Set ignition position
    ignitionPosition = "lock";

    // Rotate key to lock position
    TweenMax.to("#carKey", 1, {
        rotation: 50
    });

    // Turn car on
    turnCarOff();

    ignitionSwitchPositionLock = true;

    // Check if the ignition is in the correct position
    isCorrectIgnitionPosition();
});

/** Ignition Key: Click to ACC position */
$('#ignitionSwitchClickSpot_acc').on('click', function() {
    // Set ignition position
    ignitionPosition = "acc";

    // Rotate key to on position
    TweenMax.to("#carKey", 1, {
        rotation: 93
    });

    ignitionSwitchPositionACC = true;

    // Check if the ignition is in the correct position
    isCorrectIgnitionPosition();
});

/** Ignition Key: Click to ON position */
$('#ignitionSwitchClickSpot_on').on('click', function() {
    // Set ignition position
    ignitionPosition = "on";

    // Rotate key to on position
    TweenMax.to("#carKey", 1, {
        rotation: 120
    });

    // Turn car on
    turnCarOn();

    ignitionSwitchPositionON = true;

    // Check if the ignition is in the correct position
    isCorrectIgnitionPosition();
});

/** Ignition Key: Click to START position */
$('#ignitionSwitchClickSpot_start').on('click', function() {
    // Set ignition position
    ignitionPosition = "start";

    // Rotate key to start position
    TweenMax.to("#carKey", 1, {
        //onStart: function() {
        //    Draggable.liveSnap.kill();
        //},
        rotation: 200
    });

    // Turn Car on
    turnCarOn();

    ignitionSwitchPositionStart = true;

    // Rotate key to on position after start
    setTimeout(function() {
        TweenMax.to("#carKey", 1, {
            rotation: 120
        });
        ignitionPosition = "on";
    }, 450);

    // Check if the ignition is in the correct position
    isCorrectIgnitionPosition();
});

/** IS IGNITION IN THE CORRECT POSITION??? */
var isCorrectIgnitionPosition = function() {
    if (ignitionPosition == "on" || ignitionPosition == "start" || ignitionSwitchPositionON || ignitionSwitchPositionStart) {
        score = activity.taskScore;
        $("#blowerSwitchKnob").unbind("click");
        carKey[0].disable();
        activity.correctAnswer(null, null, score);
		$('.correctSel').removeClass('highlight').hide().show();
    } else if (!ignitionSwitchPositionLock && !ignitionSwitchPositionACC){
        activity.incorrectAnswer();
		if (activity.hinting) {
			$('.correctSel').addClass('highlight').hide().show();
		}
    }
};

/** INCORRECT ANSWER HINTING HIGHLIGHT **/
$('.wrong-spot').click(function() {
    activity.incorrectAnswer();
    if (activity.hinting) {
		$('.correctSel').addClass('highlight').hide().show();
    }
});

/********************************************************
 * BLOWER SWITCH FUNCTIONS
 *******************************************************/


var blowerOn = false;
var turnBlowerOn = function() {
	$('#blowerSwitchHint').removeClass('highlight2').hide().show();
    blowerOn = true;
    $('#blowerHousingOn').css('display', 'block');
    $('#blowerHousingOff').css('display', 'none');
    //startCoilBoil();
}

var turnBlowerOff = function() {
    blowerOn = false;
    $('#blowerHousingOff').css('display', 'block');
    $('#blowerHousingOn').css('display', 'none');
    //endCoilBoil();
}

var setTempGuage = function(temp) {
    $('#airOutTempText').html(temp);
};

var setAirSpeed = function(speed) {
    if (speed == "0") {
        $('#flowingAir1').hide();
        $('#flowingAir2').hide();
        $('#flowingAir3').hide();
        $('#flowingAir4').hide();
        $('#flowingAir5').hide();
    } else if (speed == "1") {
        $('#flowingAir1').show();
        $('#flowingAir2').hide();
        $('#flowingAir3').hide();
        $('#flowingAir4').hide();
        $('#flowingAir5').hide();
    } else if (speed == "2") {
        $('#flowingAir1').hide();
        $('#flowingAir2').show();
        $('#flowingAir3').hide();
        $('#flowingAir4').hide();
        $('#flowingAir5').hide();
    } else if (speed == "3") {
        $('#flowingAir1').hide();
        $('#flowingAir2').hide();
        $('#flowingAir3').show();
        $('#flowingAir4').hide();
        $('#flowingAir5').hide();
    } else if (speed == "4") {
        $('#flowingAir1').hide();
        $('#flowingAir2').hide();
        $('#flowingAir3').hide();
        $('#flowingAir4').show();
        $('#flowingAir5').hide();
    } else if (speed == "5") {
        $('#flowingAir1').hide();
        $('#flowingAir2').hide();
        $('#flowingAir3').hide();
        $('#flowingAir4').hide();
        $('#flowingAir5').show();
    }
}

/** BLOWER SWITCH KNOB: Drag/Rotate Function */
Draggable.create("#blowerSwitchKnob", {
    type: "rotation",
    throwProps: false,
    bounds: {
        minRotation: 0,
        maxRotation: 180
    },
    liveSnap: [0, 38, 76, 114, 146, 180],
    onDragEnd: function() {

        /** BLOWER POSITION: OFF */
        if (this.rotation == 0) {
            blowerPosition = "off";
            turnBlowerOff();
            blowerRunning = false;
            setTempGuage('70');
            setAirSpeed("0");
        }

        /** BLOWER POSITION: 1 */
        else if (this.rotation == 38) {
            blowerPosition = "1";
            if (blowerRunning == false) {
                turnBlowerOn();
                blowerRunning = true;
            }
            setTempGuage('42');
            setAirSpeed("1");
            blowerPosition1Selected_1 = true;
        }

        /** BLOWER POSITION: 2 */
        else if (this.rotation == 76) {
            blowerPosition = "2";
            if (blowerRunning == false) {
                turnBlowerOn();
                blowerRunning = true;
            }
            setTempGuage('44');
            setAirSpeed("2");
            blowerPosition2Selected_2 = true;
        }

        /** BLOWER POSITION: 3 */
        else if (this.rotation == 114) {
            blowerPosition = "3";
            if (blowerRunning == false) {
                turnBlowerOn();
                blowerRunning = true;
            }
            setTempGuage('46');
            setAirSpeed("3");
            blowerPosition3Selected_3 = true;
        }

        /** BLOWER POSITION: 4 */
        else if (this.rotation == 146) {
            blowerPosition = "4";
            if (blowerRunning == false) {
                turnBlowerOn();
                blowerRunning = true;
            }
            setTempGuage('48');
            setAirSpeed("4");
            blowerPosition4Selected_4 = true;
        }

        /** BLOWER POSITION: 5 */
        else if (this.rotation == 180) {
            blowerPosition = "5";
            if (blowerRunning == false) {
                turnBlowerOn();
                blowerRunning = true;
            }
            setTempGuage('50');
            setAirSpeed("5");
            blowerPosition5Selected_5 = true;

            // Check if the blower is in the correct position
            isCorrectBlowerPosition();
        }
    }
});

/** Blower Switch Knob: Click to OFF position */
$('#blowerSwitchClickSpot_off').on('click', function() {
    // Set blower position
    blowerPosition = "off";

    // Rotate key to lock position
    TweenMax.to("#blowerSwitchKnob", 1, {
        rotation: 0
    });

    // Turn Blower Off
    turnBlowerOff();
    blowerRunning = false;
    setTempGuage('70');
    setAirSpeed("off");
});

/** Blower Switch Knob: Click to 1 position */
$('#blowerSwitchClickSpot_1').on('click', function() {
    if (carStarted != 0) {
        // Set blower position
        blowerPosition = "1";

        // Rotate key to lock position
        TweenMax.to("#blowerSwitchKnob", 1, {
            rotation: 38
        });


        // If blower is not running, turn blower On
        if (blowerRunning == false) {
            turnBlowerOn();
            blowerRunning = true;
        }

        setTempGuage('42');
        setAirSpeed("1");
        //x = 1;
        blowerPosition1Selected_1 = true;
    }
});

/** Blower Switch Knob: Click to 2 position */
$('#blowerSwitchClickSpot_2').on('click', function() {
    if (carStarted != 0) {
        // Set blower position
        blowerPosition = "2";

        // Rotate key to lock position
        TweenMax.to("#blowerSwitchKnob", 1, {
            rotation: 76
        });

        // If blower is not running, turn blower On
        if (blowerRunning == false) {
            turnBlowerOn();
            blowerRunning = true;
        }

        setTempGuage('44');
        setAirSpeed("2");
        blowerPosition2Selected_2 = true;
    }
});

/** Blower Switch Knob: Click to 3 position */
$('#blowerSwitchClickSpot_3').on('click', function() {
    if (carStarted != 0) {
        // Set blower position
        blowerPosition = "3";

        // Rotate key to lock position
        TweenMax.to("#blowerSwitchKnob", 1, {
            rotation: 114
        });

        // If blower is not running, turn blower On
        if (blowerRunning == false) {
            turnBlowerOn();
            blowerRunning = true;
        }

        setTempGuage('46');
        setAirSpeed("3");
        blowerPosition3Selected_3 = true;
    }
});

/** Blower Switch Knob: Click to 4 position */
$('#blowerSwitchClickSpot_4').on('click', function() {
    if (carStarted != 0) {
        // Set blower position
        blowerPosition = "4";

        // Rotate key to lock position
        TweenMax.to("#blowerSwitchKnob", 1, {
            rotation: 146
        });

        // If blower is not running, turn blower On
        if (blowerRunning == false) {
            turnBlowerOn();
            blowerRunning = true;
        }

        setTempGuage('48');
        setAirSpeed("4");
        blowerPosition4Selected_4 = true;
    }
});

/** Blower Switch Knob: Click to 5 position */
$('#blowerSwitchClickSpot_5').on('click', function() {
    if (carStarted != 0) {
        // Set blower position
        blowerPosition = "5";

        // Rotate key to lock position
        TweenMax.to("#blowerSwitchKnob", 1, {
            rotation: 180
        });

        // If blower is not running, turn blower On
        if (blowerRunning == false) {
            turnBlowerOn();
            blowerRunning = true;
        }

        setTempGuage('50');
        setAirSpeed("5");
        blowerPosition5Selected_5 = true;

        // Check if the blower is in the correct position
        isCorrectBlowerPosition();
    }
});

/** IS BLOWER IN THE CORRECT POSITION??? */
// var isCorrectBlowerPosition = function() {
//     if (blowerPosition1Selected_1 == true) {                 
//         score = parseInt(score) + 6;
//         activity.correctAnswer(null, null, score);
//     } else if (blowerPosition1Selected_1 == false) {         
//         score = parseInt(score) + 3;
//         activity.correctAnswer(null, null, score);         
//     } else if (blowerPosition1Selected_1 == false && blowerPosition2Selected_2 == false && blowerPosition3Selected_3 == false && blowerPosition4Selected_4 == false) {
//         activity.incorrectAnswer();
//     }
// };

/** IS BLOWER IN THE CORRECT POSITION??? */
var isCorrectBlowerPosition = function() {
    //If user not switch in sequence 1, 2, 3, 4, 5
    /*if(!blowerPosition1Selected_1 && !blowerPosition2Selected_2 && !blowerPosition3Selected_3 && !blowerPosition4Selected_4) {
        activity.incorrectAnswer();
    } else if(blowerPosition5Selected_5){
        score = activity.taskScore;
        activity.correctAnswer(null, null, score);
    }*/
	
	if(blowerPosition5Selected_5){
        score = activity.taskScore;
        activity.correctAnswer(null, null, score);
		
		$('#blowerSwitch').hide();
		$('#blowerSwitchPlaceholder').show();
    }
};


if (carStarted == 0) {
    Draggable.get("#blowerSwitchKnob").disable();
}



/********************************************************
 * EVAP COIL ANIMATION FUNCTIONS
 *******************************************************/
var startCoilBoil = function() {
    $('#flowingFluidStart').show();
    var src = 'activities/activity_5/coil_start.gif';
    src = src.replace(/\?.*$/, "") + "?x=" + Math.random();
    setTimeout(function() {
        $('#flowingFluidStart').attr('src', src);
    }, 0);

    setTimeout(function() {
        loopCoilBoil();
    }, 18000);
};

var loopCoilBoil = function() {
    $('#flowingFluidLoop').show();
    var src = 'activities/activity_5/coil_mid.gif';
    src = src.replace(/\?.*$/, "") + "?x=" + Math.random();
    $('#flowingFluidLoop').attr('src', src);
    setTimeout(function() {
        $('#flowingFluidLoop').attr('src', src);
        loopCoilBoil();
    }, 3000);
    $('#flowingFluidStart').hide();
};

/* Kurt said this is not needed. Kept the code incase that changes or for future reuse
var endCoilBoil = function() {
    $('#flowingFluidStop').show();
    var src = 'activities/activity_5/coil_end.gif';
    src = src.replace(/\?.*$/,"")+"?x="+Math.random();
    setTimeout(function() {
        $('#flowingFluidStop').attr('src', src);
    }, 0);
    $('#flowingFluidLoop').hide();

    setTimeout(function(){
        $('#flowingFluidStop').hide();
    }, 18500);
};
*/
