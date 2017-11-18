/*******************************************************************************
 * BUILD SERVICE INFORMATION MENU
 ******************************************************************************/
var buildServiceInformationMenu = function() {    
    
    var currentActivity = activity.currentActivity;
    
    var siMenuItems = '';
    if(activity.currentActivity === 0) {       
        siMenuItems += '<li id="'+ siMenuData[0].id +'" class="txt" data-content="'+ siMenuData[0].img +'">';
        siMenuItems += '     <span class="litext" style="padding-left:10px">'+ siMenuData[0].item +'</span>';
        siMenuItems += '</li>';       
    }
    else if(activity.currentActivity === 1) {
        $.each(siMenuData, function(index, value) {
            if(index <= 4) {
                siMenuItems += '<li id="'+ value.id +'" class="txt" data-content="'+ value.img +'">';
                siMenuItems += '     <span class="litext" style="padding-left:10px">'+ value.item +'</span>';
                siMenuItems += '</li>';
            }            
        });
    }
    else if(activity.currentActivity === 2) {
        $.each(siMenuData, function(index, value) {
            if(index !== 7) {
                siMenuItems += '<li id="'+ value.id +'" class="txt" data-content="'+ value.img +'">';
                siMenuItems += '     <span class="litext" style="padding-left:10px">'+ value.item +'</span>';
                siMenuItems += '</li>';
            }
            else if(index === 7) {
                siMenuItems += '<li id="'+ value.id +'" class="vidSubmnuItem" data-video="'+ value.video +'">';
                siMenuItems += '     <span class="litext" style="padding-left:10px">'+ value.item +'</span>';
                siMenuItems += '</li>';
            }
        });
    }
    $('#siMenu').append(siMenuItems); 
};


/*******************************************************************************
 * SERVICE INFORMATION WINDOW
 ******************************************************************************/

/**
 * Service Information Window Zoom In
 * 
 * @param {leve}
 */
var siZoomLevel = '1';
var siZoomIn = function(siZoomLevel) {     
    $('#serviceInformationContent').css(
        { 
            'overflow': 'hidden',
            'display': 'block',
            'cursor': 'move',
            'padding': '0'
        }
    );
    $('#serviceInformationInnerContent').css(
        { 
            'transform': 'scale('+ siZoomLevel +')',
            'transform-origin': '0 0',
            'display': 'block'
        }
    );         
};

/**
 * Service Information Window Zoom Out
 */
var siZoomOut = function(siZoomLevel) {    
    $('#serviceInformationContent').css(
        { 
            'overflow-': 'auto',
            'cursor': 'default'
        }
    );
    $('#serviceInformationInnerContent').css(
        { 
            'transform': 'scale('+ siZoomLevel +')',
            'transform-origin': 'center center'
        }
    ); 
}; 

// Service Information Window: Zoom In & Out Vars
var si_contentTop;
var si_contentLeft;

// Service Information Window: Zoom In
$(document).on('click', '#serviceInformationZoomIn', function() { 
    // zoom in from 1 to 1.5
    if(siZoomLevel == '1') { 
        siZoomIn('1.5');        
        siZoomLevel = '1.5';        
        $('#serviceInformationZoomOut').attr('src','assets/images/icons/zoom_out.png');        
        si_contentTop = $('#serviceInformationInnerContent').position().top;
        si_contentLeft = $('#serviceInformationInnerContent').position().left;
        $('#serviceInformationInnerContent').draggable();       
    } 

    // zoom in from 1.5 to 2
    else if(siZoomLevel == '1.5') {  
        siZoomIn('2');  
        siZoomLevel = '2';
        $(this).attr('src', 'assets/images/icons/zoomin_inactive.png');       
    }
});

// Service Information Window: Zoom Out
$(document).on('click', '#serviceInformationZoomOut', function() {
    // zoom out from 1.5 to 1
    if(siZoomLevel == '1.5') {  
        siZoomOut('1');  
        siZoomLevel = '1';        
        $(this).attr('src', 'assets/images/icons/zoomin_inactive.png');       
        $('#serviceInformationInnerContent').css({
            'top': si_contentTop -25,
            'left': si_contentLeft
        });
    }
    // zoom out from 2 to 1.5
    else if(siZoomLevel == '2') {  
        siZoomOut('1.5');  
        siZoomLevel = '1.5';
        $('#serviceInformationZoomIn').attr('src','assets/images/icons/zoom_in.png');
        $('#serviceInformationZoomIn').css({'cursor': 'pointer'}); 
               
    }
});

// Service Information: Download
$(document).on('click', '#serviceInformationDownload', function() {    
    // Get content to download
    var imgSrc = $(document).find('#si-image').attr('src');    
    var x = new XMLHttpRequest();
	x.open("GET", imgSrc, true);
	x.responseType = 'blob';
	x.onload = function(e) { 
        download(x.response, "download.png", "image/png" ); 
    }
	x.send();
});

// Service Information Window: Minimize or Maximize
$(document).on('click', '#serviceInformationMinMax', function() {
    if($(this).hasClass("max")) {
        $('#serviceInformationWindow').animate({"height": "30px"});
        $(this).attr('src','assets/images/icons/down_icon.png').removeClass("max").addClass('min');
        $('#serviceInformationInnerContent > img').hide();
    } 
    else if($(this).hasClass("min")) {
        $('#serviceInformationWindow').animate({"height": "400px"});
        $(this).attr('src','assets/images/icons/up_icon.png').removeClass("min").addClass('max');
        $('#serviceInformationInnerContent > img').show();
    }
});

// Service Information: Close Window
$('#serviceInformationClose').on('click', function() {
    // Global Function (global.js)
    closeServiceInformationWindow();
});

// Service Information: SubMenu Links
$(document).on('click', '#siMenu > li.txt', function() {
    var content = $(this).data('content');    
    toggleServiceInformationWindow(content);
    $('#siMenu').toggle();
    $('#menuLightbox').toggle(); 
});