
var assessment = {

    isReviewAssessment: false,
    completed: false,
    assessment: [],
    assessmentContainer: null,
    assessmentWindowHeight: null,
    reviewAssessmentContainer: null,
    reviewAssessmentPaging: false,
    userAnswers: [],
    totalScore: null,
    pageNumber: 1,
    totalPages: 0,
    perPage: 4,

    init: function (assessment, isActivityAssessment) {
        var self = this;
        self.reset();
        self.assessment = self.randomizeAnswers(assessment);

        if(isActivityAssessment !== undefined){
            self.isActivityAssessment = isActivityAssessment;
        }
        self.assessmentContainer = $('body').find('#activityAssessmentWindow');
        self.reviewAssessmentContainer = $('body').find('#reviewAssessment');
        self.wireDomEvents();

    },
    start: function () {
        var self = this;
        $('#activityAssessmentContent').html('');
        $( "#assessmentTmpl" )
            .tmpl({ assessment: self.assessment })
            .appendTo( "#activityAssessmentContent");

        /** Make the Assessment Window Draggable and Show it */
        self.assessmentContainer.draggable({
            containment: $('#simulationContainer > #dragContainment').show()
        }).show();

        $('.assessment .submit').show();
    },
    review: function () {
        var self = this;
        //Set assessment type to review assessment
        self.isReviewAssessment = true;
        //$('#mainWrapper').addClass('review-bg');
        //check if there are more that the perPage assessment questions.
        if(self.assessment.length > self.perPage){
            self.reviewAssessmentPaging = true;
            self.initPaging();
        }


        //At the end of ever assessment, go to next frame.
        $(document).on('click', '#reviewAssessment #viewReport', function(e) {
            self.viewReport();
        });
        $(document).on('click', '#reviewAssessment .btn-continue', function () {
            self.next();
        });


        self.displayFinalAssessment();
    },
    reset: function () {
        this.isActivityAssessment = false;
        this.isReviewAssessment = false;
        this.completed = false;
        this.assessment = [];
        this.assessmentContainer = null;
        this.reviewAssessmentContainer = null;
        this.userAnswers = [];
        this.totalScore = null;
    },
    displayFinalAssessment: function () {
        var self = this;
        $("#pageHeader .module-activity").html(module.moduleTitle);
        $('#reviewAssessmentContent').html('');
        $( "#reviewAssessmentTmpl" )
            .tmpl({ assessment: self.assessment })
            .appendTo( "#reviewAssessmentContent");
        self.reviewAssessmentContainer.show();
        if(!self.reviewAssessmentPaging) {
            $('#reviewAssessment #submit').show();
        }
        $('#simulationPage').hide();
    },
    wireDomEvents: function () {
        var self = this;

        //Get user's selection then add selection to user's answers
        $(document).on('click', '.assessment .answers input', function(e) {
            if(e.target.type === 'radio')
            {
                self.handleRadioClickEvent($(this));
            }
            else {
                self.handleCheckboxClickEvent($(this));
            }
        });
        //Validate user's answers
        $(document).on('click', '.assessment .submit', function(e) {
            self.checkAnswers();
        });

        $(document).on('click', '#activityAssessmentWindow #endActivity', function () {
            if(activity){
                activity.endActivity();
            }
        });

        $(document).on('click', '#activityAssessmentWindow > #activityAssessmentHeader > .minMaxIcon', function(event) {
            var isMaximized = $(this).hasClass('maximized');
            if(isMaximized){
                self.minimizeAssessmentWindow($(this));
            }
            else {
                self.maximizeAssessmentWindow($(this));
            }
        });
    },
    unWireDomEvents: function () {
        var self = this;

        //Get user's selection then add selection to user's answers
        $(document).off('click', '.assessment .answers input');
        //Validate user's answers
        $(document).off('click', '.assessment .submit');

        $(document).off('click', '#activityAssessmentWindow > #activityAssessmentHeader > .minMaxIcon');
    },
    handleRadioClickEvent: function (input) {
        var self = this;
        var qid = input.parents('.question').attr('id').replace('question_', '');
        var answer = {qid: Number(parseInt(qid)), answers: [{id: parseInt(input.val())}]};
        self.addRadioAnswer(answer);
    },
    handleCheckboxClickEvent: function (input) {
        var self = this;
        var qid = input.parents('.question').attr('id').replace('question_', '');
        var userAnswer = {qid: parseInt(qid), answers: {id: parseInt(input.val())}};
        if(input.is(':checked')){
            self.addCheckboxAnswer(userAnswer);
        }
        else {
            self.removeCheckboxAnswer(userAnswer);
        }
    },
    addRadioAnswer: function (userAnswer) {
        var self = this;
        self.userAnswers = $.grep(self.userAnswers, function(answer) {
            return answer.qid !== userAnswer.qid;
        });
        self.userAnswers.push(userAnswer);

        //Enable submit button if all questions
        //have been answered
        if(self.assessment.length === self.userAnswers.length){
            $('.assessment .submit, .assessment .btn-continue').css({"pointerEvents":"auto"});
            //this.completed = true;
        }
    },
    addCheckboxAnswer: function (userAnswer) {
        var self = this;

        //Retrieve the answer from the user's answers
        var foundUserAnswer = $.grep(self.userAnswers, function(answer) {
            return answer.qid === userAnswer.qid;
        })[0];
        //if answer does not exist, just add it to the array.
        if(!foundUserAnswer){
            userAnswer.answers = [{ id: userAnswer.answers.id}];
            self.userAnswers.push(userAnswer);
        }
        //else add answer to existing list of answers for the question.
        else {
            var answersArr = $.grep(foundUserAnswer.answers, function(answer) {
                return answer.id !== userAnswer.answers.id;
            });
            //Update the user's answer located in the userAnswers array
            answersArr.push({ id: userAnswer.answers.id });
            foundUserAnswer.answers = answersArr;

            //Remove user's answer from array then add the updated user answer
            self.userAnswers = $.grep(self.userAnswers, function(answer) {
                return answer.qid !== userAnswer.qid;
            });
            self.userAnswers.push(foundUserAnswer);
        }

        //Enable submit button if all questions
        //have been answered
        if(self.assessment.length === self.userAnswers.length){
            $('.assessment .submit, .assessment .btn-continue').css({"pointerEvents":"auto"});
            //this.completed = true;
        }
    },
    removeCheckboxAnswer: function (userAnswer) {
        var self = this;
        var foundUserAnswer = $.grep(self.userAnswers, function(answer) {
            return answer.qid === userAnswer.qid;
        })[0];
        var answersArr = $.grep(foundUserAnswer.answers, function(answer) {
            return answer.id !== userAnswer.answers.id;
        });
        //Update the user's answer located in the userAnswers array
        foundUserAnswer.answers = answersArr;

        //Remove user's answer from array then add the updated user answer
        self.userAnswers = $.grep(self.userAnswers, function(answer) {
            return answer.qid !== userAnswer.qid;
        });

        //if user's answer ids is empty, the remove it from user's answers
        if(foundUserAnswer.answers.length > 0) {
            self.userAnswers.push(foundUserAnswer);
        }

        //Enable submit button if all questions
        //have been answered
        if(self.assessment.length > self.userAnswers.length){
            $('.assessment .submit, .assessment .btn-continue').css({"pointerEvents":"none"});
        }
    },
    randomizeAnswers: function (questions) {
        var randomizedAssessment = [];
        $.each(questions, function (i, question) {
            if(question.randomize) {
                var randomizeAnswers = question.answers.sort(function () {
                    return .5 - Math.random()
                });
                question['answers'] = randomizeAnswers;
                randomizedAssessment.push(question);
            } else {
                randomizedAssessment.push(question);
            }
        });
        return randomizedAssessment;
    },
    checkAnswers: function () {
        var self = this;
        //reset self.assessment to origin array
        if(self.isReviewAssessment)
        {
            self.assessment = module.finalAssessment;
        }

        $.each(self.userAnswers, function (i, userAnswer) {

            //Get question for assessment questions
            var assessmentQuestion = $.grep(self.assessment, function (question) {
                return question.id == userAnswer.qid;
            })[0];

            //Retrieve correct answers from assessment question
            var answersArr = $.map(assessmentQuestion.answers, function (answer) {
                if(answer.correct){
                    return {
                        id: answer.id,
                        correct: answer.correct
                    }
                }
            });
            $.each(userAnswer.answers, function (i, answer) {
                var inAnswersArr = $.grep(answersArr, function (correctAnswer) {
                    return correctAnswer.id === answer.id;
                });
                if(inAnswersArr.length === 0){
                    answersArr.push({ id: answer.id, correct: false });
                }
            });

            userAnswer.answers = answersArr;

        });

        self.feedback();
        self.scoring();

        self.sendDataToLTI();
        
        self.displayContinueButton();
    },
	
	calculateTotalActivitiesForLTI: function() {
		return module.activity.length;
	},
	
	calculateTotalTimeTakenForLTI: function() {
        var endTime = new Date().getTime();
        var timeDiffInSecs = ((endTime - reportData.startTime) / 1000);
        var mins = Math.floor(timeDiffInSecs % 3600 / 60);
        var secs = Math.floor(timeDiffInSecs % 3600 % 60);
        return mins + ' mins ' + secs + ' secs';
	},
	
    calculateTotalPossiblePointsForLTI: function() {
        var self = this, totalPossiblePoints = 0;

        //Calculate possible points from activities
        $.each(module.activity, function (i, activity) {
            $.each(activity.possiblePoints, function (idx, point) {
                totalPossiblePoints += parseInt(point);
            });
            if(activity.assessment.length > 0 ){
                $.each(activity.assessment, function (idx, question) {
                    totalPossiblePoints += parseInt(question.possiblePoints);
                })
            }
        });
        $.each(module.finalAssessment, function (i, question) {
            totalPossiblePoints += parseInt(question.possiblePoints);
        });

        return totalPossiblePoints;
    },

    sendDataToLTI: function() {
		var self = this;
        console.log("Inside sendDataToLTI");
		
        var totolPossiblePoints = self.calculateTotalPossiblePointsForLTI();
		var totalPointsEarned = reportData.totalScore + reportData.assessmentData.totalScore;
		var scoreToSend = (totalPointsEarned / totolPossiblePoints).toFixed(2);
        console.log(scoreToSend + " = " + totalPointsEarned + "/" + totolPossiblePoints);
        if (scoreToSend > 1){
            scoreToSend = 1;
        }
		
		reportData.totalActivities = self.calculateTotalActivitiesForLTI();
		reportData.totalScore = totalPointsEarned;
		reportData.totalPossibleScore = totolPossiblePoints;
		reportData.activityTotalScore = reportData.totalPossibleScore;
		reportData.totalScorePercent = Math.round((reportData.totalScore / reportData.totalPossibleScore) * 100);
		reportData.totalTimeTaken = self.calculateTotalTimeTakenForLTI();
		console.log(reportData);

        if (typeof window.parent.sendToLTI === "function"){
                console.log("window.parent.sendToLTI DOES EXIST");
                window.parent.sendToLTI(scoreToSend, reportData);
        }
        else{
            console.log("window.parent.sendToLTI IS NOT AVAILABLE");
        }
    },
    feedback: function () {
       var self = this;
       $.each(self.userAnswers, function (i, question) {
           var assessmentContainer =
               (!self.isReviewAssessment ?  self.assessmentContainer : self.reviewAssessmentContainer);

           var answerContainer = assessmentContainer.find('#question_' + question.qid + ' .answers');
           $.each(question.answers, function (i, answer) {
               if(answer.correct){
                   answerContainer.find('#answer_'+ answer.id).addClass('correct');
               }
               else {
                   answerContainer.find('#answer_'+answer.id).addClass('incorrect');
               }
           });

       });
    },
    displayContinueButton: function () {
        var self = this;
        if(!self.isReviewAssessment){
            //activity.pauseTask = true;
            $('#activityAssessmentWindow .submit').hide();
            $(document).find('#btnContinue').css({'display': 'inline-block'});
            //$('#activityAssessmentWindow .btn-continue').css({'display': 'inline-block'});
        } else {
            $('#reviewAssessment #viewReport').toggle();
            $('#reviewAssessment #submit').toggle();
        }
    },
    initPaging: function () {
        var self = this;
        self.totalPages = (parseInt(self.assessment.length/self.perPage) + 1);
        self.pageNumber = 1;
        //Get the 'perPage' questions from assessment array
        var pagingAssessmentQuestions = $.grep(self.assessment, function (question, i) {
            return (i >= (i-1) && i < (self.perPage));
        })
        self.assessment = pagingAssessmentQuestions;
        self.reviewAssessmentContainer.find('.btn-continue').show();
        self.reviewAssessmentContainer.find('.submit').hide();
    },
    next: function () {
        var self = this;
        self.pageNumber++;
        var startIdx = ((self.pageNumber - 1) * self.perPage);
        //Get the 'perPage' questions from assessment array
        var pagingAssessmentQuestions = $.grep(module.finalAssessment, function (question, i) {
            return (i >= startIdx && i < (startIdx + self.perPage));
        });
        pagingAssessmentQuestions = $.each(pagingAssessmentQuestions, function (question, i) {
            console.log(question, i)
        });
        self.assessment = pagingAssessmentQuestions;

        console.log(self.pageNumber, self.totalPages);
        if(self.pageNumber === self.totalPages - 1){
            self.reviewAssessmentContainer.find('.btn-continue').hide();
            self.reviewAssessmentContainer.find('.submit').show();
            self.reviewAssessmentPaging = false;
        }
        $('.assessment .submit, .assessment .btn-continue').css({"pointerEvents":"auto"});
        self.displayFinalAssessment();

    },
    viewReport: function () {
        if(simReport){
            simReport.init(function () {
                simReport.displayCongratulationView();
            });
        }
    },
    scoring: function () {
        var self = this;
        var totalScore = 0;
        var question = null;
        $.each(self.userAnswers, function (i, q) {
            question = $.grep(self.assessment, function (question) {
                return question.id === q.qid;
            })[0];
            var totalCorrectAnswers = $.grep(question.answers, function (answer) {
                return answer.correct === true;
            }).length;

            var totalSelectedAnswers = $('.assessment #question_' + q.qid + ' input:checked').length;

            var hasIncorrect = $.grep(q.answers, function (answer) {
                return answer.correct === false;
            });
            if(hasIncorrect.length === 0 && totalSelectedAnswers === totalCorrectAnswers){
                totalScore += parseInt(question.possiblePoints);
            }
        });

        if(!self.isReviewAssessment){
            var taskScore = {
                reportLabel: question.question,
                attempts: 1,
                score: totalScore
            };
            if(simReport){
                simReport.submitTaskScore(taskScore);
            }
        } else {
            if(reportData){
                var totalPossiblePoints = module.finalAssessment.length;
                reportData.assessmentData = {
                    totalScore: totalScore,
                    totalPossiblePoints: totalPossiblePoints
                }
            }
        }
    },
    minimizeAssessmentWindow: function (icon) {
        var self = this;
        self.assessmentWindowHeight = icon.parents('#activityAssessmentWindow').height();
        icon.parents('#activityAssessmentWindow').stop().animate({
            height: '0px'
        }, function() {
            $('#activityAssessmentContent, #activityAssessmentFooter').hide();
            icon.attr('title', 'Maximize');
            icon.removeClass('maximized');
            icon.addClass('minimized');
        });

    },
    maximizeAssessmentWindow: function (icon) {
        var self = this;
        icon.parents('#activityAssessmentWindow').stop().animate({
            height: self.assessmentWindowHeight + 'px'
        }, function() {
            $('#activityAssessmentContent, #activityAssessmentFooter').show();
            icon.attr('title', 'Minimize');
            icon.removeClass('minimized');
            icon.addClass('maximized');
        });
    },
    closeAssessmentWindow: function () {
        var self = this;
        self.unWireDomEvents();
        $('#simulationContainer > #dragContainment').hide();

        $('.assessment .submit').hide();
        $('#activityAssessmentContent').html('');
        if(self.assessmentContainer) {
            self.assessmentContainer.css({'height':'auto'});
            self.assessmentContainer.hide();
        }

    }
};