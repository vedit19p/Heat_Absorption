
var reportData = {
    moduleTitle: null,
    startTime: null,
    totalTimeTaken: '',
    totalPossibleScore: 0,
    totalScore: 0,
    totalScorePercent: 0,
    totalActivities: null,
    pass: null,
    activityData: [],
    assessmentData: null,
    activityTotalScore: 0,
    userFinishedActivities:[] //not zero based...i.e. activit 1 would be 1
};


var simReport = {
    currentActivity: null,
    init: function (cb) {
        reportData.moduleTitle = module.moduleTitle;
        reportData.totalActivities = this.getTotalActivities();
        //reportData.totalScore += reportData.assessmentData.totalScore;
        reportData.totalPossibleScore = this.calculateTotalPossiblePoints();
        reportData.totalScorePercent = this.calculatedTotalScorePercentage();
        reportData.totalTimeTaken = this.calculateTotalTimeTaken();
        reportData.pass = this.checkIfPassOrFail();
        this.wireDomEvents();

        cb();
    },
    wireDomEvents: function () {
        var self  = this;
        $(document).on('click', '#congratulationsView #downloadBtn', function () {
            self.displayProgressReportView();
        });

        $(document).on('click', '#processReport #printButton', function () {
            self.downloadProgressReport();
        });

        $(document).on('click', '#processReport #closeButton', function () {
            self.sendDataToLTI();
            window.parent.ReturnToBack();
        });

        $(document).on('click', '#congratulationsView #closeBtn', function () {
            self.sendDataToLTI();
            window.parent.ReturnToBack();
        });
    },
    sendDataToLTI: function() {
        console.log("Inside sendDataToLTI", reportData);
		reportData.activityTotalScore = reportData.totalPossibleScore;
        var scoreToSend = (reportData.totalScore / reportData.totalPossibleScore).toFixed(2);
        console.log(scoreToSend + " = " + reportData.totalScore + "/" + reportData.totalPossibleScore);
        if (scoreToSend > 1){
            scoreToSend = 1;
        }

        if (typeof window.parent.sendToLTI === "function"){
            console.log("window.parent.sendToLTI DOES EXIST");
			window.parent.sendToLTI(scoreToSend, reportData);            
        }
        else{
            console.log("window.parent.sendToLTI IS NOT AVAILABLE");
        }
        //window.parent.sendToLTI(scoreToSend, reportData);
    },
    displayCongratulationView: function () {
        $( "#congratulationsTmpl" )
            .tmpl(reportData)
            .appendTo( "#congratulationsView");
        $('#congratulationsView').show();
        $('#gameContainer').show();
        $('#mainContainer').show();

        if(audioPlay){
            var audioReportResult = (reportData.pass ? 'congratulations' : 'sorry');
            audioPlay('assets/audio/'+audioReportResult+'.mp3');
        }
    },
    displayProgressReportView: function () {
        $("#mainWrapper").css("overflow", "visible");
        $( "#progressReportTmpl" )
            .tmpl(reportData)
            .appendTo( "#processReport #table");
        $('#processReport #table').mCustomScrollbar({scrollbarPosition:'outside'});
        $("#pageHeader .module-activity").html(module.moduleTitle);
        $('#congratulationsView').hide();
        $('#processReport').show();
    },
    checkIfPassOrFail: function () {
        return (reportData.totalScorePercent >= parseInt(module.passingScore) ? true: false);
    },
    getTotalActivities: function () {
        var count = 0;
        $.each(module.activity, function (i, o) {
            count++;
        });
        return count;
    },
    calculatedTotalScorePercentage: function () {
        return Math.round((reportData.totalScore / reportData.totalPossibleScore) * 100)
    },
    calculateTotalPossiblePoints: function() {
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
    calculateTotalTimeTaken: function () {
        var endTime = new Date().getTime();
        var timeDiffInSecs = ((endTime - reportData.startTime) / 1000);
        var mins = Math.floor(timeDiffInSecs % 3600 / 60);
        var secs = Math.floor(timeDiffInSecs % 3600 % 60);
        return mins + ' mins ' + secs + ' secs';
    },
    startActivity: function (activity) {
        var self = this;
		var totalActivityScore = 0;
		self.currentActivity = activity;
		$.each(activity.possiblePoints, function(idx, point){
			totalActivityScore += parseInt(point);
		});
		reportId++;
		reportData.activityData.push({ id: activity.id, reportId: reportId, title: activity.title, totalActivityScore: totalActivityScore });
		
		reportData.activityData.sort(function(a, b) {
			var a1 = a.id, b1 = b.id;
			if (a1 == b1) return 0;
			return a1 > b1 ? 1 : -1;
		});
		console.log('Start activity reporting', reportData);
    },
    submitTaskScore: function (taskScore) {
        var self = this;
        var activity = $.grep(reportData.activityData, function (a) {
            return self.currentActivity.id == a.id;
        })[0];
        if(activity){
            if(!activity.scores){
                activity['scores'] = [];
            }
            activity.scores.push(taskScore);
        };

        reportData.totalScore += parseInt(taskScore.score);
        reportData.activityTotalScore += parseInt(taskScore.score);

        //Push total score into score val container
        $('#scoreArea #scoreval').html(reportData.totalScore);
    },
    resetScoreOnQuitActivity: function () {
        reportData.totalScore -= reportData.activityTotalScore;
        //Push total score into score val container
        $('#scoreArea #scoreval').html(reportData.totalScore);
    },
    resetReportOnQuitActivity: function () {
        var self = this;
        reportData.activityData = $.grep(reportData.activityData, function (activity) {
            return activity.id != self.currentActivity.id;
        });
    },
    endActivity: function () {
        var self = this, totalScore = 0;
        var activity = $.grep(reportData.activityData, function (a) {
            return self.currentActivity.id == a.id;
        })[0];
        if(activity){
            $.each(activity.scores, function (i, a) {
                totalScore += parseInt(a.score);
            });
            activity['totalScore'] = totalScore;
        }
        reportData.activityTotalScore = 0;
        console.log('End activity reporting', reportData);
    },
    downloadProgressReport: function () {
        $( "#progressReportTmpl")
            .tmpl(reportData)
            .appendTo( "#pdfViewer #pdfData");
        $('#pdfViewer .series').html(module.seriesName);
        $('#pdfViewer .module-activity').html(module.moduleTitle);
        $('#pdfViewer').show();
        $('#mainWrapper').hide();
        head.load(
            "assets/js/vendor/jsPDF/dist/jspdf.debug.js",
            "assets/js/vendor/jsPDF/plugins/from_html.js",
            "assets/js/vendor/jsPDF/plugins/split_text_to_size.js",
            "assets/js/vendor/jsPDF/plugins/standard_fonts_metrics.js",
            "assets/js/vendor/jsPDF/plugins/addimage.js",
            "assets/js/vendor/jsPDF/plugins/addhtml.js",
            "assets/js/vendor/jsPDF/libs/html2canvas/dist/html2canvas.js",
            "assets/js/vendor/jsPDF/libs/html2canvas/dist/jquery.plugin.html2canvas.js",
            "assets/js/vendor/jsPDF/libs/html2pdf.js",
            "assets/js/vendor/jsPDF/FileSaver/FileSaver.min.js",
            function () {
                var pdf = new jsPDF('p', 'pt', 'letter');
                var options = {
                    'width': '100%',
                    'background': '#fff'
                };
                pdf.addHTML($(document.body)[0], 0, 0, options, function()
                {
                    pdf.save("Performance_Report.pdf");
                    $('#mainWrapper').show();
                    $('#pdfViewer').hide();

                });
            }
        );
    }
    // viewQuickPdfContainer: function () {
    //     $( "#progressReportTmpl")
    //         .tmpl(completedReportData)
    //         .appendTo( "#pdfViewer #pdfData");
    //     $('#pdfViewer .series').html(module.seriesName);
    //     $('#pdfViewer .module-activity').html(module.moduleTitle);
    //     $('#pdfViewer').show();
    //     //$('#processReport #table').mCustomScrollbar({scrollbarPosition:'outside'});
    //     $('#mainWrapper').hide();
    //     head.load(
    //         "assets/js/vendor/jsPDF/dist/jspdf.debug.js",
    //         "assets/js/vendor/jsPDF/plugins/from_html.js",
    //         "assets/js/vendor/jsPDF/plugins/split_text_to_size.js",
    //         "assets/js/vendor/jsPDF/plugins/standard_fonts_metrics.js",
    //         "assets/js/vendor/jsPDF/plugins/addimage.js",
    //         "assets/js/vendor/jsPDF/plugins/addhtml.js",
    //         "assets/js/vendor/jsPDF/libs/html2canvas/dist/html2canvas.js",
    //         "assets/js/vendor/jsPDF/libs/html2canvas/dist/jquery.plugin.html2canvas.js",
    //         "assets/js/vendor/jsPDF/libs/html2pdf.js",
    //         "assets/js/vendor/jsPDF/FileSaver/FileSaver.min.js",
    //         function () {
    //             var pdf = new jsPDF('p', 'pt', 'letter');
    //             var options = {
    //                 'width': 980,
    //                 'background': '#fff'
    //             };
    //             pdf.addHTML($('#pdfViewer'), 0, 0, options, function()
    //             {
    //                 pdf.save("Performance_Report.pdf");
    //             });
    //         }
    //     );
    // }

};