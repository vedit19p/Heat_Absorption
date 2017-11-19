    var  firstName = '[Name]', secondName = '', studentName = '';
    var firstTime = false;
    var skipping = false;
	var activityInProgress = false;
	var activityDone = false;
	var scoreRecordedAudio;
    var globalCurrentActivity = -1;
    var closeSimulationClicked = false;
	var reportId = 0;
    /***************************************************************************************
     *
     *
     * ACTIVITY OBJECT
     *
     *
     ***************************************************************************************/

    var activity = {
    /**
     *  Activity Properties
     * 
     */    
    currentActivity: 0,
    currentActivityDirectory: 1,
    synchronizeCCAudio: 0,
    currentTask: 0,
    activityLength: module.activity.length,
    taskScore: 0,
    incorrectTaskCount: 0,
    incorrectTaskAmount: 3,
    skipNarrative: false,
    audioTracker: 1,
    taskBoxContent: [],
    audioPlayList: [],
    hinting: false,
    activitySkip: false,
    activityTracker: [],
    completedActivites: [],
    ccState:null,
    audioCompleted:false,
    repeatPreviousAudio: [],
    repeatPreviousCC: [],
    repeatPreviousAudioCounter: 0,
    activityCompleted: false,

    getDataFrmLTI: function (jsonObj) {
        console.log("getDataFrmLTI jsonObj: "+jsonObj);
        if (jsonObj != undefined) {
            if (window.parent.ViewMode == "completed") {//Complete stage.
            reportData = jsonObj;
            console.log("Completed: "+jsonObj);
            }
            else if (window.parent.ViewMode == "resume") {//Incomplete stage.
                reportData = jsonObj;
                console.log("Resumed: "+jsonObj);
            }
        }
    },



    /***************************************************************************************
     *
     *
     * LAUNCH ACTIVITY
     *
     *
     ***************************************************************************************/


    launchActivity: function(id) {
        var self = this;
        toggleCCBar('show');    
        toggleScoreArea('show');

         //Get activity index
        for(var i=0; i<self.activityLength; i++){
            self.activityTracker.push([i+1]);
        }

        //Show skip screen
        $("#skipIntroCover").show();

        
         $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase());

        //just testing here the ability to resume user from beginning.
        getDataFrmLTI(window.parent.GetInputData);
        //reportData.userFinishedActivities.push(1);
        //reportData.userFinishedActivities.push(2);
        //reportData.userFinishedActivities.push(3);
        //reportData.userFinishedActivities.push(4);
        //reportData.userFinishedActivities.push(5);
        //reportData.totalScore = parseInt(3) + parseInt(18);

        secondName=window.parent.LisPersonNameFamily;
        firstName=window.parent.LisPersonNameGiven;
        studentName = firstName+' '+secondName;
        console.log('studentName :'+studentName,window.parent.LisPersonNameFamily);
        firstTime =true;
    
        if (reportData.activityData.length  > 0){
            $("#skipIntroCover").hide();
            toggleIconBar('show');

            /*$.each(reportData.userFinishedActivities, function(key, value){
                //removeItem(self.activityTracker, value.id);
                self.completedActivites.push(value);
            });*/

            

            $.each(reportData.userFinishedActivities, function(key, value){  
                var i = 0;
                while (i < self.activityTracker.length){
                    if (self.activityTracker[i][0] == value){
                        self.activityTracker.splice(i, 1);
                        i = self.activityTracker.length;
                    }
                    i++;
                }

                activity.completedActivites.push( { id: value });
                /*reportData.activityData.push(
                    { 
                        id: reportData.activityData[value - 1].id, 
                        title: reportData.activityData[value - 1].title
                    });*/
               // reportData.activityData.score
                /*var tmpScore = tmpScore = reportData.activityData[value - 1].scores[0].score;
                reportData.activityData.scores.push(tmpScore);*/
            });


            self.currentActivityDirectory = self.getNextUnfinishedActivity(self.activityTracker);
            globalCurrentActivity = self.currentActivityDirectory;
            self.currentActivity = self.currentActivityDirectory - 1;
      
            $('#scoreArea #scoreval').html(reportData.totalScore);
        }


         
        globalCurrentActivity = self.currentActivityDirectory;
        //Load Activity Content
        self.loadActivity(self.currentActivityDirectory, self.currentActivity);

    },
    getNextUnfinishedActivity: function(tracker){
        var retValue = -1;
        $.each(tracker, function(key, value){
            if (reportData.userFinishedActivities.indexOf(value[0]) == -1){
                retValue = value[0];
                return false;
            }
        });

        return retValue;
    },

    /***************************************************************************************
     *
     *
     * LOAD ACTIVITY
     *
     *
     ***************************************************************************************/

    sendPartialDataToLTI: function() {
            console.log("Insdse sendPartialDataToLTI");
            console.log(JSON.stringify(reportData));
            
            if (typeof window.parent.ExitSendDataToLTI === "function"){
                console.log("window.parent.ExitSendDataToLTI DOES EXIST");
                window.parent.ExitSendDataToLTI(reportData);
            }
            else{
                console.log("window.parent.ExitSendDataToLTI IS NOT AVAILABLE");
            }
            
        
    },
    loadActivity:function(currentActivityDirectory, currentActivity) {
        var self = this;

        if (firstTime){
            firstTime = false;
        }
        else{
            self.sendPartialDataToLTI();
        }
        

    
        $('#contentInnerContainer').load('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + '.html', function() {   

            //Load assets
            /*
            head.load(
                'activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".js",
                'activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".css"

            );
            */
            
           //console.log('self.completedActivites =', self.completedActivites);

            //Remove script after activity completed
            for(var i=0; i<self.completedActivites.length; i++){
              removeScriptFile('activities/activity_' + self.completedActivites[i].id + '/activity_' + self.completedActivites[i].id + ".js", "js") //remove all occurences of "somescript.js" on page
              removeScriptFile('activities/activity_' + self.completedActivites[i].id + '/activity_' + self.completedActivites[i].id + ".css", "css") //remove all occurences "somestyle.css" on page 
            }
            //Load next activity files
              loadScriptFile('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".js", "js") //dynamically load and add this .js file
              loadScriptFile('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".css", "css") ////dynamically load and add this .css file
            // Added to make sure the activity title gets set when the activity loads (JL 5/31/2017)
            //$("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase() + ' / ' + module.activity[self.currentActivity].title);
            

        });

        if (self.activityTracker.length > 0){
            if(simReport){
                simReport.startActivity(module.activity[currentActivity]);
            }
            activity.loadTask();
        }
        //Create an activity object in reportData activityData array
		
		activityInProgress = false;
    },

    /***************************************************************************************
     *
     *
     * SKIP ACTIVITY INTRO
     *
     *
     ***************************************************************************************/


    skipIntro: function() {
        var self = this;
        $("#skipIntroCover").hide();
        toggleIconBar('show');
        audioSequencePlayer.pause();
        self.skipNarrative = true;
        self.audioTracker = 1;

            
        $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase() + ' / ' + module.activity[self.currentActivity].title);
   

        activity.loadTask();
    },

    /***************************************************************************************
     *
     *
     * SKIP ACTIVITY
     *
     *
     ***************************************************************************************/

    skipActivity:function(skipTo){
      var self = this;
      audioSequencePlayer.pause();
      audioPlayer.pause();
      //self.currentTask = 0;
      //Offset skipTo to keep activity id ontrack array 0 to 1
      //skipTo--;
      removeScriptFile('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".js", "js") //remove all occurences of "somescript.js" on page
      removeScriptFile('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".css", "css") //remove all occurences "somestyle.css" on page 
      $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase() + ' / ' + module.activity[self.currentActivity].title);
      self.currentTask = 0;
      self.currentActivityDirectory = skipTo;
      globalCurrentActivity = self.currentActivityDirectory;
      self.currentActivity = skipTo-1;
      self.audioTracker = 1;
      self.activitySkip = false;
      self.nextActivity();
    },

    /***************************************************************************************
     *  Audio Box is a sequence player that takes 3 params.
     *  Playlist array
     *  CCtask array. (Optional)
     *  Callback function.(Optional)
     ***************************************************************************************/

    audioBox: function(arrPlayList, arrTaskCC, callback) {
        var self = this;
        var playListLength = arrPlayList.length;
        var completedCounter = 1;
        self.audioCompleted = false;
        toggleCCBar('show'); 

        


       playListIndex = 0;
       self.synchronizeCCAudio = 0;

       if(arrTaskCC === null){ arrTaskCC = ''}

       setTimeout(function() {
            $('#ccContent > #cctxt').html(self.taskBoxContent[self.synchronizeCCAudio]);
        }, 10);


        self.repeatPreviousAudio = arrPlayList;
        self.repeatPreviousCC = arrTaskCC

        audioSequence(arrPlayList)
        audioSequencePlayer.onended = function() {
            self.synchronizeCCAudio++;
            completedCounter++;
            //console.log('self.synchronizeCCAudio = ', self.synchronizeCCAudio);
            //console.log(audioSequencePlayer.src);
            //console.log('playListLength', playListLength);

            //Audio done playing flag
            if(playListLength === self.synchronizeCCAudio){
            self.audioCompleted = true;
            }
            
            $("#skipIntroCover").hide();
            audioSequence(arrPlayList)
            $('#ccContent > #cctxt').html(arrTaskCC[self.synchronizeCCAudio]);
            $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase() + ' / ' + module.activity[self.currentActivity].title);

              
            if (callback && completedCounter > playListLength) {
             callback();

          }

        }
    },

    /***************************************************************************************
     *
     *
     * Audio Box Repeat
     *
     *
     ***************************************************************************************/

    audioBoxRepeat: function(arrPlayList, arrTaskCC, callback) {
        var self = this;
        var playListLength = arrPlayList.length;
        var completedCounter = 1;
        self.audioCompleted = false;
        playListIndex = 0;
        self.synchronizeCCAudio = 0;
        //self.synchronizeCCAudio = playListLength;


        //console.log('arrPlayList =', arrPlayList);
        //console.log('arrTaskCC =', arrTaskCC);
        //self.repeatPreviousAudio = arrPlayList;
        //self.repeatPreviousCC = arrTaskCC;
        if(self.activityCompleted !== true){toggleCCBar('show')};
        $('#ccContent > #cctxt').html(arrTaskCC[self.synchronizeCCAudio]);
        audioSequence(arrPlayList);
        audioSequencePlayer.onended = function() {
            self.synchronizeCCAudio++;
            //toggleCCBar('hide');
            console.log('self.synchronizeCCAudio', self.synchronizeCCAudio);
            console.log('playListLength', playListLength);
            //completedCounter++;

            //Audio done playing flag
            if(playListLength === self.synchronizeCCAudio){
               self.audioCompleted = true;
               toggleCCBar('hide'); 
            }


            //$("#skipIntroCover").hide();
            audioSequence(arrPlayList)
            $('#ccContent > #cctxt').html(arrTaskCC[self.synchronizeCCAudio]);

            if (callback && completedCounter > playListLength) {
                callback();
            }
        }
    },


    /***************************************************************************************
     *
     *
     * LOAD TASK
     *
     *
     ***************************************************************************************/

    loadTask: function() {
        var self = this;
        var activityTaskLength = module.activity[self.currentActivity].cc.ccTasks.length;
        //May need to add this to a Reset function
        self.taskBoxContent = [];
        self.audioPlayList = [];
        //Reset Score
        self.incorrectTaskCount = 0;
        self.hinting = false;
        self.activityCompleted = false;
        toggleCCBar('show');
		
        $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase() + ' / ' + module.activity[self.currentActivity].title);       


        //toggleIconBar('show');
        //taskScore: get possible points
        self.taskScore = module.activity[self.currentActivity].possiblePoints[self.currentTask];

        playListIndex = 0;
        self.synchronizeCCAudio = 0;
        self.repeatPreviousAudioCounter = 0;
        //May need to add this to a Reset function

        $(".text-btn > button").attr("disabled", false);

        console.log('--------------- start ****----------------');
        console.log('--------------- ****----------------');
        console.log('--------------- ****----------------');
        console.log('--------------- Task Loaded ----------------');
        console.log('self.taskScore =', self.taskScore);
        console.log('currentActivity =', self.currentActivity);
        console.log('currentActivityDirectory =', self.currentActivityDirectory);
        console.log('synchronizeCCAudio =', self.synchronizeCCAudio);
        console.log('currentTask =', self.currentTask);
        console.log('audioTracker =', self.audioTracker);
        console.log('--------------- ****----------------');
        console.log('--------------- ****----------------');
        console.log('--------------- end ****----------------');


        console.log('check to see if task completed', self.currentTask, activityTaskLength)
        if (self.currentTask >= activityTaskLength) {
            activity.taskComplete();
            return false;
        }

        //New activity launch 
        if (self.currentTask === 0) {

            //Get the intro ccData and push into array to create a synchronize sequence
            //Intro
            if (module.activity[self.currentActivity].intro.length > 0 && self.skipNarrative !== true) {
                self.taskBoxContent.push(module.activity[self.currentActivity].intro);
                self.audioPlayList.push(audioDirectory + activityAudioIntro);

                $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase());
                
            }
            //Get the narrative ccData and push into array to create a synchronize sequence
            //Narrative
            if (module.activity[self.currentActivity].cc.narrative.length > 0) {

                for (var i = 0; i < module.activity[self.currentActivity].cc.narrative.length; i++) {
                    self.taskBoxContent.push(module.activity[self.currentActivity].cc.narrative[i]);
                    self.audioPlayList.push(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_Narrative" + self.audioTracker + ".mp3");
                    self.audioTracker++;
                }   
            }
            //Get the first task ccData and push into array to create a synchronize sequence
            //Task
            if (module.activity[self.currentActivity].cc.ccTasks.length > 0) {
                console.log('---- multi Task loop ----');
                //Reset to get the first task
                self.audioTracker = 1;
                for (var i = 0; i < module.activity[self.currentActivity].cc.ccTasks[0].task.length; i++) {
                    self.taskBoxContent.push(module.activity[self.currentActivity].cc.ccTasks[self.currentTask].task[i]);
                    self.audioPlayList.push(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_T" + self.audioTracker + ".mp3");
                    self.audioTracker++;
                }
            }

            //Play Audio
            self.audioBox(self.audioPlayList, self.taskBoxContent, function(){
                toggleIconBar('show');
                toggleCCBar('hide'); 
            });

        } else {

            activity.nextTask();
            
        }
    },


    /***************************************************************************************
     *
     *
     * NEXT TASK
     *
     *
     ***************************************************************************************/

    nextTask: function() {
        var self = this;
        var activityId = module.activity[self.currentActivity].id;
        //self.currentTask++;

        console.log('****** Next Task *******');
        //Get all of the cc task data that has more than one index and use sequence event

        console.log("Task cc Length");
        console.log(module.activity[self.currentActivity]);
        console.log('self.currentTask = ', self.currentTask);
        console.log('self.audioTracker = ', self.audioTracker);
        console.log('Task Length = ', module.activity[self.currentActivity].cc.ccTasks[self.currentTask].task.length);

        if (module.activity[self.currentActivity].cc.ccTasks[self.currentTask].task.length > 1) {

            console.log('****** multiple ccDate *******');

            for (var i = 0; i < module.activity[self.currentActivity].cc.ccTasks[self.currentTask].task.length; i++) {
                self.taskBoxContent.push(module.activity[self.currentActivity].cc.ccTasks[self.currentTask].task[i]);
                self.audioPlayList.push(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_T" + self.audioTracker + ".mp3");
                self.audioTracker++
            }

         

            console.log(self.taskBoxContent);
            console.log(self.audioPlayList);

            self.repeatPreviousAudio.push(self.audioPlayList)
            self.repeatPreviousCC.push(self.taskBoxContent)

            //Play Audio
            self.audioBox(self.audioPlayList, self.taskBoxContent, function(){
                toggleCCBar('hide');  
            });

        } else {

            console.log('******** single ccDate **********');
            console.log('self.currentTask =', self.currentTask)
            console.log(module.activity[self.currentActivity].cc.ccTasks[1].task[0]);

             if(self.repeatPreviousCC.constructor !== Array){self.repeatPreviousCC = []}
            
            //Reset repeat audio array to play next task only. 
            self.repeatPreviousAudio = [];
            self.repeatPreviousCC = [];    
            self.repeatPreviousAudio.push(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_T" + (self.currentTask + 1) + ".mp3");
            self.repeatPreviousCC.push(module.activity[self.currentActivity].cc.ccTasks[self.currentTask].task[0]); 


            $('#ccContent > #cctxt').html(module.activity[self.currentActivity].cc.ccTasks[self.currentTask].task[0]);
            audioPlay(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_T" + (self.currentTask + 1) + ".mp3", function(){
                toggleCCBar('hide');
            });
        }
    },

    /***************************************************************************************
     *
     *
     * TASK COMPLETE
     *
     *
     ***************************************************************************************/


    taskComplete: function() {
        var self = this;

        $(".text-btn > button").attr("disabled", true);

        //If taskComplete length 0
        if(module.activity[self.currentActivity].cc.taskComplete.length === 0){
            $("#btnContinue").show();
            toggleCCBar('hide');

            //reportData.userFinishedActivities.push({ id: self.currentActivityDirectory, title: self.title });

            //Reset for new activity
            self.currentTask = 0;
            self.audioTracker = 1;
            return false;
        }

        console.log('>>>>>> Task Completed <<<<<<')
        console.log('self.audioTracker = ', self.audioTracker)
        console.log('taskComplete length = ', module.activity[self.currentActivity].cc.taskComplete.length);
       
        //Get ccData taskComplete and audio
        for (var i = 0; i < module.activity[self.currentActivity].cc.taskComplete.length; i++) {
            self.taskBoxContent.push(module.activity[self.currentActivity].cc.taskComplete[i]);
            self.audioPlayList.push(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "act" + self.currentActivityDirectory + "_task" + self.audioTracker + ".mp3");
            self.audioTracker++;
        }


            self.audioBox(self.audioPlayList, self.taskBoxContent,function() {
                 toggleCCBar('hide');
                $("#btnContinue").show(); 

                //reportData.userFinishedActivities.push({ id: self.currentActivityDirectory, title: self.title });
            });


        //Restart task counter
        console.log('again self.audioTracker = ', self.audioTracker)

        self.currentTask = 0;
        self.audioTracker = 1;

    },


    /***************************************************************************************
     *
     *
     * CHECK FOR ASSESSMENT
     *
     *
     ***************************************************************************************/



    checkForAssessment: function() {
        var self = this;
        var assessmentData = module.activity[self.currentActivity].assessment;
        reportData.userFinishedActivities.push(parseInt(self.currentActivityDirectory));


        //Check for assessement question
        if (assessmentData.length > 0) {
          //if (assessmentData.length === 'testing') {

            toggleCCBar('hide');
            console.log('>>>>>>>>> Load Assessment <<<<<<<<<<<');
            console.log('self.synchronizeCCAudio =', self.synchronizeCCAudio);
            console.log('self.audioTracker = ', self.audioTracker);

            self.audioPlayList = [];
            //Get ccData assessment and audio
            for (var i = 0; i < module.activity[self.currentActivity].cc.assessment.length; i++) {
                self.audioPlayList.push(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "act" + self.currentActivityDirectory + "_assessment" + self.audioTracker + ".mp3");
                self.audioTracker++;
            }

            //Play Audio
            self.audioBox(self.audioPlayList, null);

            assessment.init(assessmentData);
            assessment.start();
            self.audioTracker =  1;
            } else {

            if(module.activity[activity.currentActivity].endScreenText === ""){
                activity.nextActivity();
                return false;
            }

            $("#activityEndScr").show();
            $("#finalCover").html('<span>' + module.activity[activity.currentActivity].endScreenText + '</span>');

            activity.endActivity();

        }
    },

    /***************************************************************************************
     *
     *
     * CORRECT ANSWER
     *
     *
     ***************************************************************************************/

    correctAnswer: function(id, event, score) {
        var self = this;
        toggleCCBar('show'); 

        if(!self.hinting) {
            self.incorrectTaskCount++;
        }

        //Submit Task Scores
        self.submitTaskScore(score);

        self.incorrectTaskCount = 0;
        self.currentTask++;
        
        $(".text-btn > button").attr("disabled", true);
        $(".btu-hotspots > .wrong-spot").attr("disabled", true);

        //If audio sequence is playing pause it. 
        audioSequencePlayer.pause();
        audioPlayer.pause();
        audioSequencePlayer.src = "";
        audioPlayer.src = "";

        console.log('********* Correct answer ***********');
        console.log('self.currentTask = ', self.currentTask);
        console.log('positive Response Length = ', module.activity[self.currentActivity].positiveResponse.length);
        console.log('self.currentActivity = ', self.currentActivity);
        console.log('self.currentTask - 1 =', self.currentTask - 1);
        console.log('module.activity[self.currentActivity].positiveResponse[self.currentTask - 1].task = ', module.activity[self.currentActivity].positiveResponse[self.currentTask - 1].task);


        //Check to see if current Activity have Positive Response data
        if (module.activity[self.currentActivity].positiveResponse[self.currentTask - 1].task !== '') {

            $('#ccContent > #cctxt').html(module.activity[self.currentActivity].positiveResponse[self.currentTask - 1].task);
            audioPlay(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_T" + self.currentTask + "_P" + self.currentTask + ".mp3", function(){
                //toggleCCBar('hide');
            });
            audioPlayer.addEventListener('ended', function handler() {
                activity.loadTask();
                this.removeEventListener('ended', handler);
            });
        } else {
            activity.loadTask();
        }
		
		//activityInProgress = true;
    },


    /***************************************************************************************
     *
     *
     * INCORRECT ANSWER
     *
     *
     ***************************************************************************************/

    incorrectAnswer: function(id, hinting) {
        var self = this;
        self.hinting = hinting ? true : false;
        toggleCCBar('show'); 

        var incorrectAudio = self.currentTask + 1;
        audioSequencePlayer.pause();
        audioPlayer.pause();
        audioSequencePlayer.src = "";
        audioPlayer.src = "";
			
        //Track hot spots
        if(id){
          $('#ccContent > #cctxt').html(module.activity[self.currentActivity].negitiveResponse[self.currentTask].spot[id-1].response);
            audioPlay(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_T" + incorrectAudio + "_N" + id + ".mp3",function(){
                toggleCCBar('hide');
            });
            //I think audioPlayer.addEventListener below can be removed 
            audioPlayer.addEventListener('ended', function handler() {
                this.removeEventListener('ended', handler);
          });

            if(!self.hinting) {
                self.incorrectTaskCount++;
                //Subtract score
                if (self.taskScore >= 1){
                    self.taskScore--;
                }
                
            }

          return false;  
        }

        //Track wrong answer
        if(!self.hinting) {
            self.incorrectTaskCount++;
            //Subtract score
             if (self.taskScore >= 1){
                self.taskScore--;
            }
        }


        console.log('********* inCorrect answer ***********');
        console.log('self.currentTask = ', self.currentTask);
        console.log('positive Response Length = ', module.activity[self.currentActivity].positiveResponse.length);

        //If incorrect 3 times show hint
        if (self.incorrectTaskCount !== self.incorrectTaskAmount) 
        {

            console.log('********* inCorrect Audio Tracker ***********');
            console.log('self.currentTask = ', incorrectAudio);

            //**** Play Audio
            $('#ccContent > #cctxt').html(module.activity[self.currentActivity].negitiveResponse[self.currentTask].task);
            audioPlay(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_T" + incorrectAudio + "_N" + incorrectAudio + ".mp3", function(){
                toggleCCBar('hide');
            });
            audioPlayer.addEventListener('ended', function handler() {
                this.removeEventListener('ended', handler);
            });
            self.audioTracker = 1;
        } else {
            //Reset counter
            //**** Play Audio
            $('#ccContent > #cctxt').html(module.activity[self.currentActivity].negitiveResponse[self.currentTask].task);
            audioPlay(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_T" + incorrectAudio + "_N" + incorrectAudio + ".mp3", function(){
                toggleCCBar('hide');
            });
            self.hinting = true;
            //self.incorrectTaskCount = 0;
        }
		
		//activityInProgress = true;
    },

   /***************************************************************************************
     *
     *
     * SUBMIT TASK SCORE
     *
     *
     ***************************************************************************************/

    submitTaskScore: function(score) {
        var self = this;
        var taskScore = {
            reportLabel: module.activity[self.currentActivity].reportLabel[self.currentTask],
            attempts: self.incorrectTaskCount,
            score: (score ? parseInt(score) : parseInt(self.taskScore))
        };

        if (simReport) {
           simReport.submitTaskScore(taskScore);
        }
    },

      /***************************************************************************************
     *
     *
     * CHECK FOR SKIPPED ACTIVITY
     *
     *
     ***************************************************************************************/

    checkForSkippedActivity:function(){
        var self = this;

        if(self.activityTracker.length > 0){

            self.activitySkip = true;

           for(var i=0;self.activityTracker.length; i++){
              //Set next activity to pass
            self.currentActivity = self.activityTracker[i]-1;
            self.currentActivityDirectory = self.activityTracker[i];

            console.log('>>>>>>>>>>', self.currentActivity[i]-1);
            console.log('>>>>>>>>>>', self.currentActivityDirectory[i]);

            self.loadActivity(self.currentActivityDirectory, self.currentActivity);
             return false;
           }

       } else {

            //Last Activity load assessment question
            $('#wholeContainer').hide();
            $("btnContinue").hide();
            assessment.init(module.finalAssessment);
            assessment.review();
        }

    },
    proceedToFinalAssessment: function(){
            //Last Activity load assessment question
            $('#wholeContainer').hide();
            $("btnContinue").hide();
            assessment.init(module.finalAssessment);
            assessment.review();
    },
   
     /***************************************************************************************
     *
     *
     * NEXT ACTIVITY
     *
     *
     ***************************************************************************************/

    nextActivity: function() {
        var self = this;

        //Show/Hide activity end screen and continue button
        $("#activityEndScr").hide();
        $("#btnContinue").hide();

        //reportData.userFinishedActivities.push(parseInt(self.currentActivityDirectory));

        console.log(">>>>> Last Activity Check<<<<<", self.currentActivity, self.activityLength-1);
        //Check to see if this is the last activity 

        /*if(self.activitySkip === true){
         self.checkForSkippedActivity();
          return false
        }*/

        /*if (self.currentActivity !== self.activityLength - 1) {*/

            //Set next activity to pass
            //self.currentActivity++;
            //self.currentActivityDirectory++;
            if (skipping){
               
                //eat it
                 //skipping = false;
            }
            else{
                var nextActivityNumber = self.getNextUnfinishedActivity(self.activityTracker);
                globalCurrentActivity = nextActivityNumber;
                if (nextActivityNumber == -1){
                    self.proceedToFinalAssessment();
                    return false;
                }
                else{
                    self.currentActivityDirectory = nextActivityNumber;
                    self.currentActivity = self.currentActivityDirectory - 1;
                }
            }
            
            

            /*if (self.activityTracker.length == 0){
               
            }
            else{
               self.currentActivityDirectory = self.activityTracker[0];
                self.currentActivity = self.currentActivityDirectory - 1; 
            }
            self.currentActivityDirectory = self.activityTracker[0];
            self.currentActivity = self.currentActivityDirectory - 1;
*/

            //Load content screen

            $('#contentInnerContainer').load('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + '.html', function() {
                //Load assets
                /*
                head.load(
                    'activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".js",
                    'activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".css"

                );
                */
                
                //removeScriptFile('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".js", "js") //remove all occurences of "somescript.js" on page
                //removeScriptFile('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".css", "css") //remove all occurences "somestyle.css" on page 
                //loadScriptFile('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".js", "js") //dynamically load and add this .js file
                //loadScriptFile('activities/activity_' + self.currentActivityDirectory + '/activity_' + self.currentActivityDirectory + ".css", "css") ////dynamically load and add this .css file
                

            });

            //Create an activity object in reportData activityData array
            self.loadActivity(self.currentActivityDirectory, self.currentActivity);
            self.activitySkip = true;

        /*} else {
           self.checkForSkippedActivity();
        }*/

    },
   
     /***************************************************************************************
     *
     *
     * END ACTIVITY
     *
     *
     ***************************************************************************************/

    endActivity: function() {
        var self = this;
        var currentActivity = module.activity[activity.currentActivity];
        self.completedActivites.push({ id: currentActivity.id, title: currentActivity.title });
        self.activityCompleted = true;

        //If user skip activities
        if (self.activityTracker.length > 0) {
            removeItem(self.activityTracker, self.currentActivityDirectory);
            console.log('>>>>>>>>> self.activityTracker <<<<<<< array', self.activityTracker);
        }

        simReport.endActivity(module.activity[self.currentActivity]);
        $("#btnContinue").hide();
        $('#activityAssessmentWindow').hide();

        console.log(module.activity.length, self.completedActivites.length);

        if(self.completedActivites.length == module.activity.length){
            $('#btncon').hide();
            $('#btnReviewQuestions').show();
        } else {
            $('#btncon').show();
        }
        $("#activityEndScr").show();
        $('#dragContainment').hide();
        console.log('end screen');
        $("#finalCover").html('<span>' + currentActivity.endScreenText + '</span>');
        audioSequencePlayer.pause();
       
        self.repeatPreviousAudio = [];
        self.repeatPreviousAudio.push(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_Summary.mp3")

        audioPlay(audioDirectory + "activity_" + self.currentActivityDirectory + "/" + "A" + self.currentActivityDirectory + "_Summary.mp3", function(){
        toggleCCBar('hide');
         });
        toggleCCBar('hide');
    }


} // End Activity Object

  /***************************************************************************************
     *
     *
     * EVENT HANDLERS
     *
     *
     ***************************************************************************************/

    $('#btnContinue').on('click', function() {
        $(this).hide();

        activity.checkForAssessment();
        self.audioTracker = 1;
    });

    //End screen continue button
    $('#btncon, #btnReviewQuestions').on('click', function() {
        //activity.endActivity();
        audioPlayer.pause();
        audioPlayer.src = "";
        activity.nextActivity();
    });


    $('#skipBtn').on('click', function() {
        //activity.loadTask();
        activity.skipIntro();
    });



//Reusable functions
 function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
        }
    }
}


/**
 * Get Data From LTI (Parent Application)
 * 
 * @param {*} jsonObj 
 */
var getDataFrmLTI = function(jsonObj) {
    if (jsonObj != undefined) {
        if (window.parent.ViewMode == "completed") { //Complete stage.
            reportData = jsonObj;
            console.log("Completed: " + jsonObj);
        } else if (window.parent.ViewMode == "resume") { //Incomplete stage.
            reportData = jsonObj;
            console.log("Resumed: " + jsonObj);
        }
    }
}


/**********************************************************************************************
 *
 *   HOME & VIDEO PAGE FUNCTIONS
 *  
 **********************************************************************************************/

/**
 * Builds and appends buttons for Home & Video Page
 * 
 * @param {*} id 
 * @param {*} title 
 * @param {*} imageClass 
 * @param {*} textClass 
 * @param {*} text 
 * @param {*} appendTo 
 */
var buildRoundButton = function(id, title, imageClass, textClass, text, appendTo) {
    var btn = '';
    btn += '<div id="' + id + '" title="' + title + '">';
    btn += '<div class="' + imageClass + '"></div>';
    btn += '<div class="' + textClass + '">' + text + '</div>';
    btn += '</div>';
    $('#' + appendTo).append(btn);
};



/**********************************************************************************************
 *
 *   SIMULATION SHELL FUNCTIONS
 *  
 **********************************************************************************************/


/**
 * Get Activity Tasks
 * This loops through the current activites tasks and creates a list
 */
var getActivityTasks = function(frameNum) {
    var activityTitle = '';
    var taskListDesciption = '';
    var taskListItem = '';
    $.each(module.activity, function(index, value) {
        if (value.id == frameNum) {
            activityTitle = value.title;
            taskListDesciption = value.taskDescription;
            $.each(value.tasks, function(i, v) {
                taskListItem += '<li class="taskListItem">' + v + '</li>';                
            });
        }
    });

    var data = [
        activityTitle,
        taskListDesciption,
        taskListItem
    ];

    return data;
}



/**
 * Toggle Icon Bar
 * On or Off
 * 
 * @param {*} action 
 */
var toggleIconBar = function(action) {
    if (action == "show") {
        // Show the icon bar 
        $('#simulationPage > #iconBar').show();
    } else if (action == "hide") {
        // Hides the icon bar
        $('#simulationPage > #iconBar').hide();
    }
};

/**
 * Toggle Closed Caption Bar
 * On or Off
 * 
 * @param {*} action 
 */
var toggleCCBar = function(action) {

    if (action === "show" && activity.ccState !== 'off') {
        // Sets the closed caption icon to active
        //$('#ccIcon').removeClass('active');

        // Show the closed caption bottom bar 
        $('#simulationPage > #footer > #ccContent').show();
    } else if (action === "hide") {
        // Removes the closed cpation icon active class
        //$('#ccIcon').addClass('active');

        // Hides the closed caption bottom bar
        $('#simulationPage > #footer > #ccContent').hide();
    }

};


/**
 * Toggle Score Area
 * 
 * @param {*} action 
 */
var toggleScoreArea = function(action) {
    if (action == "show") {
        $('#footer > #scoreArea').show();
    } else if (action == "hide") {
        $('#footer > #scoreArea').hide();
    }
};



/**
 * Toggle LightBox
 * 
 * @param {*} action 
 */
var toggleLightBox = function(action) {
        
    if (action == "show") {
        $('#menuLightbox').css({
            'display': 'block'
        });
    } else if (action == "hide") {
        $('#menuLightbox').css({
            'display': 'none'
        });
    }
};

/**
 * Toggle DropDown Menu
 * 
 * @param {*} action 
 */
var toggleMenu = function() {
    if($('#menu').is(':visible')) {
        $('#menu').hide();
        $('.submenuActivites').hide();
        $('.submenuVideos').hide();
        if(activity.audioCompleted !== true){
            togglePauseAudio();
        }
        toggleLightBox('hide');
    }
    else {
        $('#menu').show();
        //togglePauseAudio();
        audioSequencePlayer.pause();
        audioPlayer.pause();
        toggleLightBox('show');
    }
};



/**
 * Toggle & Load the Float Window
 * 
 * Used for list of tasks for the current activity, or
 * Assement questions at the end of an activity.
 * 
 * types: task, assessment 
 * 
 * @param {*} type
 * @param {*} title 
 * @param {*} content 
 */
var toggleFloatWindow = function(type, title, content) {
    if (type === "task") {

        $('#floatWindow > #floatHeader > .activityTitle').html(title);
		
		if (navigator.userAgent.match(/Tablet/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Kindle/i) || navigator.userAgent.match(/Nexus/i) || navigator.userAgent.match(/Android/i)) {
			$('#floatWindow').addClass('tabletSize');
		}

        if (content[0] == "") {
            $('.taskListDescription').hide();
            $('ol.taskList').css('margin-top', '-30px');
        } else {
            $('span.taskListDescription').empty();
            $('span.taskListDescription').append(content[0]);
            $('ol.taskList').css('margin-top', '15px;');
        }

        $('#floatWindow').find('ol.taskList').empty();
        $('#floatWindow').find('ol.taskList').append(content[1]);
        $("#floatWindow > #floatContent").mCustomScrollbar();

    } else if (type === "assessment") {

    }

    // Show the float window and make it draggable
    $('#floatWindow').draggable({
        containment: $('#simulationContainer > #dragContainment').show()
    }).show();
};

/**
 * Close the Float Window & Reset Location
 */
var closeFloatWindow = function() {
    $('#floatWindow').hide().css({
        'left': '750px',
        'top': '96px'
    });
};

/**
 *  Toggle & Load Alert Box* 
 * 
 * @param {*} action
 * @param {*} content 
 */
var toggleAlertBox = function(action, content, id) {

    if (action == "show") {
        //$('#btnContinue').hide();
        $('#alertBox > #alertContent').empty();
        $('#alertBox > #alertContent').append(content);
        $('#alertBox').show();
        $('#menuLightbox').show();
        $('#alertBox').css({ position: "absolute", top:"0px"});
        $("#btnContinue").off("click");

        /* Had to add this code snippet for resetting the score when the user skips and activity.
        ** Everytime this toggleAlertBox function is called, it binds a new click event to the Yes/No buttons.
        ** If the user opens the alertbox 10 times, then click the yes button, it will run the all the events
        ** encapsulated within the yes button event handler function. As a result, the unbind method is necessary
        ** before delegating the click event to the Yes/No buttons.
         */
        $('#alertBox > #buttonBar > #btnYes').unbind('click');
        $('#alertBox > #buttonBar > #btnNo').unbind('click');
        // Button: Yes
        $('#alertBox > #buttonBar > #btnYes').on('click', function() {
            $("#btnContinue").on("click", function() {
                $(this).hide();

                activity.checkForAssessment();
                self.audioTracker = 1;
            });

			if (activityDone === true) {
				$("#alertBox").hide();
				$("#menu, #menuLightbox").hide();
				$("#activityDoneScr").show();
                $('#btnContinue').show();
                
				
				scoreRecordedAudio = document.createElement('audio');
    			scoreRecordedAudio.setAttribute('src', 'assets/audio/score_recorded.mp3');
				scoreRecordedAudio.play();
			} else {
				toggleAlertBox('hide');
				$("#menu, #menuLightbox").hide();
				
				if (skipping) {
					activity.skipActivity(id);
					skipping = false;
					
					reportData.totalScore -= reportData.activityTotalScore;
					$('#scoreArea #scoreval').html(reportData.totalScore);
					reportData.activityTotalScore = 0;
					
					$(reportData.activityData).each(function(index) {
						if (reportData.activityData[index].reportId === reportId) {
							reportData.activityData.splice(index - 1, 1);
						}
                    });
				} else {
					if(simReport) {
						simReport.resetScoreOnQuitActivity();
					}
	
					$('#simulationPage > #iconBar > #icons > #menu').hide();

                    if (closeSimulationClicked === true){
                        closeSimulationClicked = false;
                        window.parent.ReturnToBack();
                    }
					
				}
			}
        });

        // Button: No
        $('#alertBox > #buttonBar > #btnNo').on('click', function() {
            toggleAlertBox('hide');
			$("#menu, #menuLightbox").hide();
            $("#btnContinue").on("click", function() {
                $(this).hide();

                activity.checkForAssessment();
                self.audioTracker = 1;
            });
        });
    } else if (action == "hide") {
        $('#alertBox > #alertContent').empty();
        $('#alertBox').hide();
        $('#menuLightbox').hide();

}
}
/**
 *  Clear Timer
 * 
 */
var clearTimer = function() {

};

/************************************************************************
 *  AUDIO FUNCTIONS
 ***********************************************************************/
/* Toggle Audio */
var toggleAudio = function(action) {
	if (audioSequencePlayer.muted === false || audioPlayer.muted === false) {
		audioSequencePlayer.muted = true;
		audioPlayer.muted = true;
        $('#muteIcon').addClass('active');
    } else {
		audioSequencePlayer.muted = false;
		audioPlayer.muted = false;
        $('#muteIcon').removeClass('active');
    }
};

/* Toggle Pause Audio */
var togglePauseAudio = function() {  

    if (audioSequencePlayer.paused == false || audioPlayer.paused == false) {
         audioSequencePlayer.pause();
         audioPlayer.pause();
    } else {
         if(audioSequencePlayer.src !== ""){audioSequencePlayer.play()};
         if(audioPlayer.src !== ""){audioPlayer.play()};
    }
}

/* Toggle Repeat Audio */

/*
var toggleRepeatAudio = function() {

        if(audioPlayer.src !== ""){
        audioPlay(audioPlayer.src, function(){
          toggleCCBar('hide');
        }); 
        }  

        if(audioSequencePlayer.src !== ""){
        audioPlay(audioSequencePlayer.src, function(){
          toggleCCBar('hide'); 
         }); 

   }
    
}


*/


var toggleRepeatAudio = function() {
    audioPlayer.muted = true;
	
    console.log('>>>>>>>> Repeat Audio <<<<<<<<');
    console.log('repeatPreviousAudio =', activity.repeatPreviousAudio);
    console.log('repeatPreviousCC =', activity.repeatPreviousCC);
    console.log('>>>>>>>> Repeat Audio End <<<<<<<<');
  


    console.log('activity.repeatPreviousAudioCounter =', activity.repeatPreviousAudioCounter);
    console.log('activity.repeatPreviousAudio.length =', activity.repeatPreviousAudio.length);


    if(activity.repeatPreviousAudioCounter !== activity.repeatPreviousAudio.length){
        var savePreviousAudio = [];
        var savePreviousCC = [];
        var reversePreviousAudio = activity.repeatPreviousAudio.reverse();
        var reversePreviousCC = activity.repeatPreviousCC.reverse();
        activity.repeatPreviousAudioCounter++;
           for(var i=activity.repeatPreviousAudioCounter -1; i>=0; --i){
              savePreviousAudio.push(reversePreviousAudio[i]);
              savePreviousCC.push(reversePreviousCC[i]);
           }  
           activity.repeatPreviousAudio.reverse();
           activity.repeatPreviousCC.reverse();
           activity.audioBoxRepeat(savePreviousAudio, savePreviousCC, function() {
              toggleCCBar('hide');
            });
      } else {
         activity.audioBoxRepeat(activity.repeatPreviousAudio, activity.repeatPreviousCC, function() {
              toggleCCBar('hide');
            });

      }

}




/**
 *  SHOW THE AUTOMOTIVE SHOP
 */
var showAutomotiveShop = function() {
    // Hide the wholeContainer
    $('#wholeContainer').hide();    

    // Close the CCBar
    //toggleCCBar('off');

    // Hide the Parts Department Conatiner
    $('#automotiveShop').show();    
}

/**
 *  CLOSE THE AUTOMOTIVE SHOP
 */
var closeAutomotiveShop = function() {
    // Show the wholeContainer
    $('#wholeContainer').show();    


    // Open the CCBar
    toggleCCBar('show');    

    // Hide the Parts Department Conatiner
    $('#automotiveShop').hide();    
}



/**
 *  CLOSE THE PARTS DEPARTMENT
 */
var closePartsDepartment = function() {
    // Show the wholeContainer
    $('#wholeContainer').show();

    // Open the CCBar
    toggleCCBar('show');    

    // Hide the Parts Department Conatiner
    $('#partsDepartment').hide();

    // Deactivate Parts Department Icon
    $('#iconBar > #icons > ul > li > #partsDepartmentIcon').css({
        'background': 'url("assets/images/icons/parts_dep_active.png")',
        'background-size': '23px 18px',
        'cursor': 'pointer'
    });
}

   

//Reusable functions
 function removeItem(array, item){
            for(var i in array){
                if(array[i]==item){
                    array.splice(i,1);
                    break;
                }
            }
        }

 function loadScriptFile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", filename)
 }
 if (typeof fileref!="undefined")
  document.getElementsByTagName("head")[0].appendChild(fileref)
}       


function removeScriptFile(filename, filetype){
 var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
 var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
 var allsuspects=document.getElementsByTagName(targetelement)
 for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
  if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
   allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
 }
}