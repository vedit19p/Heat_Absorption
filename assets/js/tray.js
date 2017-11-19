var totalNum = 6;
var leftAimPos = 0;
var leftCount = 0;
var activateNavEvents = function() {
	createNavElem();
	activateClick();
	$('#navElem1').draggable({zIndex:1000, helper:'clone', appendTo:'#mainContainer',scroll:true});
}

var createNavElem = function() {
	for (var i = 1; i <= totalNum; i++) {
		$("<div />",{id:"navElemCover"+i,class:"navElemCover"}).appendTo('#thumbnail');
		$("<div />",{id:"navElem"+i,class:"navElem"}).css({background:'url(./assets/images/support/thumbnails/pic'+i+'.png)'}).appendTo('#navElemCover'+i);
	}
}
var activateClick = function() {
	$('#trayLeftArrow').off('click').on('click',moveLeftDir).addClass('disableNavElem');
	$('#trayRightArrow').off('click').on('click',moveRightDir);
}
var moveLeftDir = function() {
	if (!$('#trayLeftArrow').hasClass('disableNavElem')) {
		leftAimPos = leftAimPos + 186;
		leftCount++;
		animateNav();
	}
	
}
var moveRightDir = function() {
	if (!$('#trayRightArrow').hasClass('disableNavElem')) {
		leftAimPos = leftAimPos - 186;
		leftCount--;
		animateNav();
	}
}
var animateNav = function() {
	$('#thumbnail').animate({left:leftAimPos+'px'},500);
	console.log(leftCount)
	if(leftCount == -2) {
		$('#trayRightArrow').addClass('disableNavElem');
	}
	else if(leftCount == 0) {
		$('#trayLeftArrow').addClass('disableNavElem');
	}
	else {
		$('#trayRightArrow,#trayLeftArrow').removeClass('disableNavElem');
	}
}