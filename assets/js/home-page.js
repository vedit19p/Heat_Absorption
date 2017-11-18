$(document).ready(function() {
    
    /*****************************************************************
     *  HOME PAGE FUNCTIONS
     */

    /** Setup Home Page Headings **************************/ 
    // append the headings
    $('#mainHeading').append(module.heading);
    $('#subHeading').append(module.moduleTitle);

    
    /** HOME BUTTONS *************************************/
    // BTN: Using the Simulation
    buildRoundButton('btnUseSimulation','Using the Simulation','btnUseSimulationImage','btnUseSimulationText','Using the<br/>Simulation','homeButtons');
    $('#btnUseSimulation').on('click', function() {
        $("#homePage").fadeOut("fast");
        $("#videoPage, #pageHeader").fadeIn("slow");
        $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase() + ' / ' + videos[0].title);
        $("#videoFrame").attr("src","assets/videos/intro_video.html");                
    }); 

    /* What type of Module is this: Concept or Equipment? */
    if(module.moduleType === "Concept") {
        // BTN: Understanding the Concepts
        buildRoundButton('btnUnderstandConcepts','Understanding the Concepts','btnUnderstandConceptsImage','btnUnderstandConceptsText','Understanding<br/>the Concepts','homeButtons');
        $('#btnUnderstandConcepts').on('click', function() {
            $("#homePage").fadeOut("fast");
            $("#videoPage, #pageHeader").fadeIn("slow");
            $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase() + ' / ' + videos[1].title);        
            $("#videoFrame").attr("src","assets/videos/act_video.html");
            $("#vbtnUnderstandConcepts").hide();
            $("#vbtnUseSimulation").show(); 
        });
    }
    else if(module.moduleType === "Equipment") {
        // BTN: Understanding the Equipment
        buildRoundButton('btnUnderstandEquipment','Understanding the Equipment','btnUnderstandEquipmentImage','btnUnderstandEquipmentText','Understanding<br/>the Equipment','homeButtons');
        $('#btnUnderstandEquipment').on('click', function() {
            $("#homePage").fadeOut("fast");
            $("#videoPage, #pageHeader").fadeIn("slow");
            $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase() + ' / ' + videos[1].title);        
            $("#videoFrame").attr("src","assets/videos/act_video.html");
            $("#vbtnUnderstandConcepts").hide();
            $("#vbtnUseSimulation").show(); 
        });
    }        

    // BTN: Enter Simulation
    buildRoundButton('btnSimulation','Enter Simulation','btnSimulationImage','btnSimulationText','Enter<br/>Simulation','homeButtons');
    $('#btnSimulation').on('click', function(){
        $("#homePage").fadeOut("fast");
        $("#simulationPage, #pageHeader, #footer").fadeIn("slow");
        $("#pageHeader .module-activity").html(module.moduleTitle.toUpperCase());
        
        //Lanuch Activity on Screen
        activity.launchActivity();

        // lazy load the functions for the simulation shell
        head.load("assets/js/sim-shell.js", function() {
           simShellInit();
        });                
    });


    function downloadProgressReport() {

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

 
    if (window.parent.ViewMode !== undefined){
         if (window.parent.ViewMode == "completed"){
             $('#wholeContainer').hide();
             reportData = window.parent.GetInputData;
             

            //$("#mainWrapper").css("overflow", "visible");
            $( "#progressReportTmpl" )
                .tmpl(reportData)
                .appendTo( "#processReport #table");
            $('#processReport #table').mCustomScrollbar({scrollbarPosition:'outside'});
            $("#pageHeader .module-activity").html(module.moduleTitle);
            $('#congratulationsView').hide();
            $("#gameContainer").show();
            $("#mainContainer").show();
            $('#processReport').show();
            $("#processReport").css("top", "-48px");
            $("#processReport").css("height", "630px");

            $(document).on('click', '#processReport #printButton', function () {
                reportData = window.parent.GetInputData;
                downloadProgressReport();
            });

            $(document).on('click', '#processReport #closeButton', function () {
                window.parent.ReturnToBack();
            });
         }
     } 
});