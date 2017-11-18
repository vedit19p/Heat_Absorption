/**
 *  Audio Player 
 **/
var audioPlayer = document.createElement('audioActivity');
var audioSequencePlayer = document.createElement('audioSequenceActivity');
audioPlayer = new Audio();
audioSequencePlayer = new Audio();

var playListIndex = 0;

var videos = [
    {
        id: 'vid1',
        title: 'Using the Simulation',
        src: 'intro_video'
    },
    {
        id: 'vid2',
        title: 'Understanding the Concepts',
        src: 'act_video'            
    }
];    

function audioPlay(filePath, callback) {
    audioPlayer.pause();
	if (!$('#muteIcon').hasClass('active')) {
		audioSequencePlayer.muted = false;
		audioPlayer.muted = false;
	}
    audioPlayer.src = filePath;

    var playPromise = audioPlayer.play();
    if (playPromise !== undefined){
        playPromise.then(function(){

            //toggleCCBar('show');

            audioPlayer.onended = function() {
                if(callback){
                    callback();
                }
            }

        }).catch(function(error){
            console.log("error in audioPlay()..filePath => " + filePath + + "..error => " + error.message);
        })
    }    
};

function audioSequence(playListArr) {

    audioSequencePlayer.pause();
    if (playListIndex < playListArr.length) {
        audioSequencePlayer.src = playListArr[playListIndex];
		audioSequencePlayer.play();
        playListIndex++;
    } else {
        audioSequencePlayer.pause();
        playListIndex = 0;
        return false;
    }
}