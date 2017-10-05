var mobile = false;
var mobileBreak = 768;
var stickyBreak = 768;
if($(window).width() <= mobileBreak){mobile = true;}
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var path;
function freezePage(){$('body').css({'width':'100%','height':'100%','overflow':'hidden'});}
function unfreezePage(){$('body').css({'width':'','height':'','overflow':''});}
function animScroll(sec, speed, offset){
	activeOffset = $(sec).offset().top+offset;	
	TweenMax.to('html,body', speed, {scrollTop:activeOffset, ease:Expo.easeInOut});
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}




//! - WINDOW RESIZE

var winW;
var winH;
$(window).resize(function(){
	winW = $(window).width();
	winH = $(window).height();
	//console.log(winW);
	
	if(winW<=mobileBreak && !mobile){
		mobile = true;
		if(st > 0){
			$('.sticky-mobile').addClass('locked');
		}
	}
	if(winW>mobileBreak && mobile){
		mobile = false;
		$('.sticky-mobile').removeClass('locked');
	}
	
	// update sticky
	if(winW<stickyBreak && stickyOpen){
		$('.sticky').attr('style','');					
		stickyOpen = false;
	}
	
	
	// fix Firefox flex v spacing problem
	updateBoxes();
	
	// adjust timeline sizing
	updateTimeline();
	
	// space out menu links vertically
	menuSpacer();
	
	// update complex divs to resize with spacers
	updateScales();
	
	// update graph draggable
	//if(winW<=650){updateGraphDrag();}
})
$(window).resize();






//! STICKY NAV

var stickyOpen = false;
var logoLocked = false;
var logoBlue = false;
var stickyH = 86;
var lastSt = 0;
var topDif = 0;
var blueDif = 160;
var st;
var autoOff = false;

$(window).scroll(function(){
		
	st = $(this).scrollTop();

	// freeze logo in place
	if(st > topDif){	
		if(!logoLocked){
			$('#stickyLogo, #globalMenu').addClass('locked');
			
			if(winW<=mobileBreak){
				$('.sticky-mobile').addClass('locked');	
			}			
					
			logoLocked = true;
		}
	} else {		
		if(logoLocked){
			$('#stickyLogo, #globalMenu').removeClass('locked');
			
			if(winW<=mobileBreak){
				$('.sticky-mobile').removeClass('locked');	
			}
			logoLocked = false;
		}
	}
	
	// turn blue after signup gap
	if(winW>mobileBreak){
		if(st > blueDif){	
			if(!logoBlue){
				$('#stickyLogo').addClass('blue');
				logoBlue = true;
			}
		} else {		
			if(logoBlue){
				$('#stickyLogo').removeClass('blue');
				logoBlue = false;
			}
		}
	}

	// drop sticky bar
	if(st<lastSt && winW>=stickyBreak){	
		if(!stickyOpen && st > 40){
			TweenMax.to($('.sticky'), .5, {delay:.2, 'transform':'translate3d(0px, 0px, 0px)', 'display':'block', ease:Expo.easeOut});	
			stickyOpen = true;
		}	
		if(stickyOpen && st <= 30){
			TweenMax.to($('.sticky'), .3, {'transform':'translate3d(0px, '+ -stickyH +'px, 0px)', 'display':'none', ease:Power3.easeOut});					
			stickyOpen = false;
		}
	}
	if(st>lastSt){
		if(stickyOpen){
			TweenMax.to($('.sticky'), .3, {'transform':'translate3d(0px, '+ -stickyH +'px, 0px)', 'display':'none', ease:Power3.easeOut});					
			stickyOpen = false;
		}
	}
	
	if(st<=0 && !autoOff){
		TweenMax.killTweensOf($('.sticky'));
		autoOff = true;
		TweenMax.to($('.sticky'), .3, {'transform':'translate3d(0px, '+ -stickyH +'px, 0px)', 'display':'none', ease:Power3.easeOut, onComplete:function(){
			autoOff = false;
		}});					
		stickyOpen = false;
	}

	lastSt = st;
})





//! SIGNUP DROP DOWN

var signupOpen = false;
var signupStickyOpen = false;

$('#hero').find('.mailing-list-btn').click(function(){
	if(!signupOpen){
		openSignup();		
	} else {
		closeSignup();
	}
})

function openSignup(){	
	signupOpen = true;
	$('.mailing-list-btn').find('.icon').addClass('flip')
	TweenMax.to('.mailing-list-drop', .75, {top:0, ease:Expo.easeInOut})
	TweenMax.to($('#hero').find('.signup-form'), .5, {delay:.5, opacity:1, 'display':'block'})
}
function closeSignup(){	
	signupOpen = false;
	$('.mailing-list-btn').find('.icon').removeClass('flip')
	TweenMax.to('.mailing-list-drop', .5, {top:-165, ease:Expo.easeInOut})
	TweenMax.to($('#hero').find('.signup-form'), .3, {opacity:0, 'display':'block'})
}

$('.sticky').find('.mailing-list-btn').click(function(){
	if(!signupStickyOpen){
		openStickySignup();		
	} else {
		closeStickySignup();
	}
})

function openStickySignup(){	
	signupStickyOpen = true;
	$('.sticky').find('.mailing-list-btn').find('.icon').addClass('flip')
	TweenMax.to('.sticky', .75, {height:160, ease:Expo.easeInOut})
	TweenMax.to($('.sticky').find('.signup-form'), .5, {delay:.5, opacity:1, 'display':'block'})
}
function closeStickySignup(){	
	signupStickyOpen = false;
	$('.sticky').find('.mailing-list-btn').find('.icon').removeClass('flip')
	TweenMax.to('.sticky', .5, {height:80, ease:Expo.easeInOut})
	TweenMax.to($('.sticky').find('.signup-form'), .3, {opacity:0, 'display':'block'})
}




//! GLOBAL MENU

var menuOpen = false;

$('.menuLines').click(function(){
	
	if(!menuOpen){
		openMenu();
		
	} else {
		closeMenu();
	}
	
	return false;
})

	
function openMenu(){	
	//alert(window.innerHeight+' / '+winH)
	
	menuOpen = true;
	freezePage();
	$('#globalMenu, .menuLines').addClass('open');
	TweenMax.to('.menufill', .3, {opacity:1, 'display':'block'})
	
	// open big box
	TweenMax.set('.menubg', {scaleX:0, scaleY:0, 'display':'block'})
	TweenMax.to('.menubg', .75, {scaleX:1, scaleY:1, opacity:1, ease:Elastic.easeOut, easeParams:[1,2]})

	// open menu contents
	TweenMax.set('.menu-contents', {opacity:1, 'display':'block'})
	
	// animate lines into X
	TweenMax.to($('.menuLines .top'), .75, {delay:.1, rotation:-45, top:0, ease:Expo.easeOut})
	TweenMax.to($('.menuLines .mid'), .2, {delay:.1, opacity:0})
	TweenMax.to($('.menuLines .bottom'), .75, {delay:.1, rotation:45, top:0, ease:Expo.easeOut})	
}

function closeMenu(){	
	// close big box 
	TweenMax.to('.menubg', .5, {scaleX:0, scaleY:0, opacity:0, ease:Back.easeInOut, easeParams:[.75,2], onComplete:function(){
		TweenMax.set('.menubg', {'display':'none'})
		$('#globalMenu').removeClass('open');
		menuOpen = false;
		unfreezePage();
	}})
	TweenMax.to('.menufill', .3, {delay:.3, opacity:0, 'display':'none'})
	
	// animate lines back to burger
	$('.menuLines').removeClass('open');
	TweenMax.to($('.menuLines .top'), .75, {rotation:0, top:-9, ease:Expo.easeOut})
	TweenMax.to($('.menuLines .mid'), .2, {delay:.2, opacity:1})
	TweenMax.to($('.menuLines .bottom'), .75, {rotation:0, top:9, ease:Expo.easeOut})	
}

// space out links

var menuSpaceT =  100;
var menuSpaceB = 90;
var menuM = 17;
var minSp = 30;
var menuMin = $('.nav-btns').find('a').length*minSp;

function menuSpacer(){
	menuS = window.innerHeight - (menuSpaceT+menuSpaceB+(menuM*2));
	if(menuS<menuMin){menuS = menuMin;}
	$('.nav-btns ul').css({'height':menuS+'px'});
}

$('.nav-btns').find('a:not(".ext")').click(function(){
	closeMenu();
	goSec = $(this).attr('href');
	if($(goSec).attr('data-mobile-offset')){
		offset = Number($(goSec).attr('data-mobile-offset'));
	} else {
		offset = 0;
	}
	
	setTimeout(function(){
		animScroll(goSec, .75, offset);
	}, 400);
	return false;
})

$('#stickyLogo').click(function(){
	animScroll('#hero', .75, 0);
})







//! FORM SUBMIT

var formSent = false;
var formURL = $('.signup-form').attr('action');

$('.signup-form').submit(function(){
	if(validateForm($(this))){
		sendForm($(this));
	}
	return false;
});

function sendForm(formObj){

// animation actions

var formData = $(formObj).serialize();

$.ajax({
    url: formURL,
    type: 'GET',
    data: formData,
	dataType: "jsonp",
    jsonp: "c",
    contentType: "application/json; charset=utf-8",
        
    success: function(data){					
		formSent = true;
		//console.log(data.result);
		$(formObj).find('input[name="EMAIL"]').val('');
		TweenMax.to($(formObj).find('.thanks'), .5, {'opacity':1, 'display':'block'})
    }
});

}

function validateForm(formObj){	
	var vNum = 0;
	$(formObj).find('[data-type="req"]').each(function(){
		if($(this).val() == ""){
			vNum++;
		}
	});
	if(vNum==0){
		return true;
	} else {
		$(formObj).addClass('error');
		return false;
	}
}

$('input').focus(function(){
	parentRef = $(this).parents('.signup-form');
	TweenMax.to(parentRef.find('.thanks'), .5, {'opacity':0, 'display':'none'});
	parentRef.removeClass('error');
	formSent = false;	
})





//! - LOADER

freezePage();
$(window).on('load', function(){
	$(window).resize();
	$('#hero').addClass('on');
	TweenMax.to('#loader', .5, {delay:.2, opacity:0, 'display':'none', onComplete:function(){
		unfreezePage();
	}});
})




//! UPDATES ON RESIZE

function updateBoxes(){
	// update loan boxes
	updateLoanBoxes();
	
	// update example boxes
	updateExampleBoxes();
	
	// update shared boxes
	updateSharedBoxes();
	
	// update dist boxes
	updateDistBoxes();
	
	// update team boxes
	updateTeamBoxes();
}





//! SECTION: 0 HERO

var clouds = 5;
var addClouds = '';
for(i=0;i<3;i++){
	addClouds += '<div class="cloud-set" data-num="'+(i+1)+'">';
	for(n=0;n<clouds;n++){
		addClouds += '<div class="cloud" data-num="'+(n+1)+'"><img src="/assets/images/v3/parts/hero-cloud@2x.png"></div>';
	}
	addClouds += '</div>'
}
$('#hero').find('.clouds').html(addClouds);





//! SECTION: 2 LOANING

function updateLoanBoxes(){
	if(winW>768){
		tmpM = ($('.loan-boxes').width() - $('.loan-box[data-num="1"]').outerWidth()*3)/2;
		$('.loan-box:nth-child(-n+3)').css({'margin-bottom':tmpM+'px'});
	} else {
		$('.loan-box:nth-child(-n+3)').css({'margin-bottom':''});
	}
	
	tmpH = 0;
	$('.loan-boxes').find('.box-txt').each(function(){
		$(this).height('');
		if($(this).height()>tmpH){
			tmpH = $(this).height();
		}
	})
	$('.loan-boxes').find('.box-txt').height(tmpH);
}

// DROPPING ICONS

var totalIcons = 4;
var gap = 20;
/*
for(i=0;i<totalIcons;i++){
	if(i%2==0){
		tmpIc = '<div class="icon-ball light" data-num="'+i+'" style="left:'+(i*gap)+'px;"><img src="images/parts/lender-icon@2x.png"></div>';
	} else {
		tmpIc = '<div class="icon-ball dark" data-num="'+i+'" style="left:'+(i*gap)+'px;"><img src="images/parts/lender-icon@2x.png"></div>';
	}
	
	$('.falling-icons').append(tmpIc);
}
*/



//! SECTION: 4 TOKEN

var totalTokens = 7;
var tGap = 110;
var addToken = '';
var tokenArray = [];
var tokenDel = .5;
var tokY = -1200;
var boundsX = 600;

for(i=0;i<totalTokens;i++){
	addToken += '<div class="token part" data-num="'+i+'"';
	addToken += 'style="left:'+(i*tGap)+'px"';
	addToken += '><img src="/assets/images/v3/parts/token-big@2x.png"></div>';
	tokenArray[i] = i;
}		
$('#token').find('.tokens').html(addToken);

// so tokens come out random
shuffleArray(tokenArray);

// init for animation
function dropTokens(){
	for(i=0;i<totalTokens;i++){
		TweenMax.to($('#token').find('.token[data-num="'+tokenArray[i]+'"]'), 3, {delay:(i*tokenDel), y:0, startAt:{y:-1200}, ease:Power3.easeInOut})
	}
}
function removeTokens(){
	TweenMax.killTweensOf($('#token').find('.token'));
	$('#token').find('.token').css('transform','')
}

// offset delays for floating hearts/stars
var floatDel = .75;
$('.star-set.special').find('.star').each(function(n){
	$(this).css({'animation-delay':-(n*floatDel)+'s'})
})






//! SECTION: 5 RISK POOLS

var r1c;
var r2c;

function openRiskGraphs(){
	TweenMax.to($('.risk-graph[data-num="1"]').find('.risk-graph-bar'), 1, {delay:.25, startAt:{scaleY:0}, scaleY:1, ease:Power2.easeInOut})
	TweenMax.to($('.risk-graph[data-num="1"]').find('.risk-graph-image'), 2, {delay:.5, startAt:{y:400}, y:0, ease:Elastic.easeInOut, easeParams:[1.2,2]})
	TweenMax.to($('.risk-graph[data-num="1"]').find('.star-set, .cloud, .lst-bubble>img'), .5, {delay:2, startAt:{opacity:0}, opacity:1})
	
	//goPer = Number($('.risk-table[data-num="1"]').find('.meter').attr('data-percent')/100);
	//setTimeout(function(){$('.risk-table[data-num="1"]').find('.meter').css({'transform':'scaleX('+goPer+')'})}, 200);
	
	// animate meter and numbers
	numCt1 = setTimeout(function(){	
		r1Count = 1500;
		r1End = 2000;
		r1Inc = 3;
		r1c = setInterval(function(){
			r1Count += r1Inc;
			$('.risk-table[data-num="1"]').find('.counter').text(formatNumber(r1Count));
			if(r1Count >= r1End){
				clearInterval(r1c);
				$('.risk-table[data-num="1"]').find('.counter').text(formatNumber(r1End));
			}
		}, 10);
		
		$('.risk-table[data-num="1"]').find('.meter').addClass('on');
	}, 500);
	
	
	rDel2 = 1.25;
	TweenMax.to($('.risk-graph[data-num="2"]').find('.risk-graph-bar'), 1, {delay:rDel2+.25, startAt:{scaleY:0}, scaleY:1, ease:Power2.easeInOut})
	TweenMax.to($('.risk-graph[data-num="2"]').find('.risk-graph-image'), 2, {delay:rDel2+.5, startAt:{y:300}, y:0, ease:Elastic.easeInOut, easeParams:[1.2,2]})
	TweenMax.to($('.risk-graph[data-num="2"]').find('.cloud'), .5, {delay:rDel2+2, startAt:{opacity:0}, opacity:1})
	
	// animate meter and numbers
	numCt2 = setTimeout(function(){	
		r2Count = 1300;
		r2End = 1800;
		r2Inc = 3;
		r2c = setInterval(function(){
			r2Count += r2Inc;
			$('.risk-table[data-num="2"]').find('.counter').text(formatNumber(r2Count));
			if(r2Count >= r2End){
				clearInterval(r2c);
				$('.risk-table[data-num="2"]').find('.counter').text(formatNumber(r2End));
			}
		}, 10);
		
		$('.risk-table[data-num="2"]').find('.meter').addClass('on');
	}, 1500);
}
function resetRiskGraphs(){
	$('.risk-graph-bar, .risk-graph-image, .star-set, .cloud, .lst-bubble>img').attr('style','');
	$('.risk-table').find('.meter').removeClass('on');
	clearTimeout(numCt1);
	clearTimeout(numCt2);
	clearInterval(r1c);
	clearInterval(r2c);
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}





// for mobile swipe

var curGr = 1;
/*
var draggable = Draggable.create(".graph-swipe", {
	type:"x",
	cursor:"pointer",
	bounds: '.risk-graph-swipe',
	
	onDragStart:function(){
    	startx = this.x;
	},
	onDragEnd:function(){	
		endx = this.x	
		
		if(winW<=500){
			snapX = 140;
		} else {
			snapX = 198;
		}
		
		if(endx<startx-5){
			TweenMax.to('.graph-swipe', .5, {'transform':'translateX(-'+snapX+'px)', ease:Expo.easeOut});
			curGr = 2;
			setGraphData(1);
		} 
		if(endx>startx+5){
			TweenMax.to('.graph-swipe', .5, {'transform':'translateX('+snapX+'px)', ease:Expo.easeOut});
			curGr = 1;
			setGraphData(2);
		}
	},
	/*
	onPress:function(){
		if(winW<=500){
			snapX = 140;
		} else {
			snapX = 198;
		}
		if(curGr == 1){TweenMax.set('.graph-swipe', {'transform':'translateX('+snapX+'px)'});}
		if(curGr == 2){TweenMax.set('.graph-swipe', {'transform':'translateX('+-snapX+'px)'});}
	}
	*/
/*});
*/
/*
if(winW<=500){
	snapX = 140;
} else {
	snapX = 198;
}
TweenLite.set(draggable[0].target, {x:snapX});
*//*
function updateGraphDrag(){
	if(winW<=500){
		snapX = 140;
	} else {
		snapX = 198;
	}
	if(curGr == 1){TweenLite.set(draggable[0].target, {x:snapX});}
	if(curGr == 2){TweenLite.set(draggable[0].target, {x:-snapX});}	
}
*/
function setGraphData(id){
	TweenMax.to('.risk-table-wrap', .5, {opacity:0, onCompleteParams:[id], onComplete:function(num){
		if(num == 1){
			$('.risk-table-wrap').find('.risk-table[data-num="1"]').hide();
			$('.risk-table-wrap').find('.risk-table[data-num="2"]').show();
		} else {
			$('.risk-table-wrap').find('.risk-table[data-num="1"]').show();
			$('.risk-table-wrap').find('.risk-table[data-num="2"]').hide();
		}
		
		TweenMax.to('.risk-table-wrap', .5, {opacity:1})
	}});
}

$('.risk-graph-swipe.mob').click(function(){
	if(winW<=500){
		snapX = 140;
	} else {
		snapX = 198;
	}
	if(curGr == 2){TweenLite.to('.graph-swipe', .5, {x:snapX, ease:Expo.easeOut}); setGraphData(curGr); curGr = 1;} else
	if(curGr == 1){TweenLite.to('.graph-swipe', .5, {x:-snapX, ease:Expo.easeOut}); setGraphData(curGr); curGr = 2;}	
	
})






//! SECTION: 6 EXAMPLE

function updateExampleBoxes(){
	if(winW>=768){
		tmpM = ($('.example-boxes').width() - $('.example-box[data-num="1"]').outerWidth()*2);
		$('.example-box:nth-child(-n+2)').css({'margin-bottom':tmpM+'px'})
	} else {
		$('.example-box:nth-child(-n+2)').css({'margin-bottom':''})
	}

	
	tmpH = 0;
	$('.example-boxes').find('.box-txt').each(function(){
		$(this).height('');
		if($(this).height()>tmpH){
			tmpH = $(this).height();
		}
	})
	if(winW>=768){
		$('.example-boxes').find('.box-txt').height(tmpH);
	} else {
		$('.example-boxes').find('.box-txt').height('');
	}
}





//! SECTION: 7 SHARED

function updateSharedBoxes(){
	if(winW>=768){
		sW = $('.shared-box[data-num="2"]').outerWidth();
		tmpM = ($('.shared-boxes').width() - sW*2);
		$('.shared-boxes').find('.row.spaced').css({'margin':tmpM+'px 0px'})
		$('.shared-boxes').find('.row.single').find('.shared-box').width(sW);
	} else {
		$('.shared-boxes').find('.row.spaced').css({'margin':''})
		$('.shared-boxes').find('.row.single').find('.shared-box').width('');
	}
}


// MONEY STACKS

var mGap = 7;
var mDel = 1.25;
var mOffsets = [1,1.5,2,0,.75];

$('.moneystack').each(function(n){
	addStack = '';
	
	for(i=0;i<Number($(this).attr('data-total'));i++){
		addStack += '<div class="money" ';
		addStack += 'style="top:'+(i*-mGap)+'px; ';
		addStack += 'animation-delay:'+Number(mOffsets[n]+(i*mDel))+'s;"';
		addStack += '><img src="/assets/images/v3/parts/moneystack@2x.png"></div>';
	}
	
	$(this).html(addStack);
})





//! SECTION: 9 TIMELINE

var tlBoxW = 550;
var boxGap = 35;
var tlBoxes = $('.tl-box').length;
var timelineBreak = 600;
var tlCurNum = 0;
var tlLastNum = 0;
var tlM = 30;
var baseH = 190;

// starting position
if(winW<=timelineBreak){tlBoxW = 340;}
tlW = (tlBoxW*tlBoxes)+(boxGap*(tlBoxes-1));
var startingPos = (tlW/2)-(tlBoxW/2);

// init first box
$('.tl-boxes').css({'transform':'translateX('+startingPos+'px)'});
activeColor = $('.tl-box[data-num="'+tlCurNum+'"]').attr('data-color');
$('.tl-robot').find('.cover').attr('data-color',activeColor);

// get height of text for expand
if(winW>timelineBreak){
	tlH = baseH+$('.tl-box[data-num="'+tlCurNum+'"]').find('.box-txt').outerHeight()+tlM;
	TweenMax.to($('.tl-box[data-num="'+tlCurNum+'"]'), .5, {height:tlH, ease:Expo.easeInOut});
}

function updateTimeline(){	
	
	// change to mobile
	if(winW<=timelineBreak){
		//tlBoxW = winW-40;
		tlBoxW = 340;
		$('.tl-box').css('height','');
		
		newPos = startingPos - ((tlCurNum*tlBoxW)+(tlCurNum*boxGap));
		TweenMax.set($('.tl-boxes'), {'transform':'translateX('+newPos+'px)'});
		
		
	// change to desktop
	} else {
		tlBoxW = 550;		
		tlH = baseH+$('.tl-box[data-num="'+tlCurNum+'"]').find('.box-txt').outerHeight()+tlM;
		$('.tl-box[data-num="'+tlCurNum+'"]').css('height',tlH);
		
		newPos = startingPos - ((tlCurNum*tlBoxW)+(tlCurNum*boxGap));
		TweenMax.set($('.tl-boxes'), {'transform':'translateX('+newPos+'px)'});
	}

	$('.tl-box').css({'width':tlBoxW+'px'})
	tlW = (tlBoxW*tlBoxes)+(boxGap*(tlBoxes-1));
	$('.tl-boxes').css({'width':tlW+'px','margin-left':-tlW/2+'px'})
	startingPos = (tlW/2)-(tlBoxW/2);
}

$('.tl-controls').find('.arr').click(function(){
	if(!$(this).hasClass('off')){
		dir = Number($(this).attr('data-dir'));
		moveTL(dir);
	}
})

function moveTL(num){
	tlCurNum += num;
	newPos = startingPos - ((tlCurNum*tlBoxW)+(tlCurNum*boxGap));
	activeColor = $('.tl-box[data-num="'+tlCurNum+'"]').attr('data-color');
	//console.log(tlCurNum+' / '+newPos)
	
	// expand/collapse details
	if(winW>timelineBreak){
		tlH = baseH+$('.tl-box[data-num="'+tlCurNum+'"]').find('.box-txt').outerHeight()+tlM;
		TweenMax.to($('.tl-box[data-num="'+tlLastNum+'"]'), .75, {height:baseH, ease:Back.easeInOut, easeParams:[2,2]})
		TweenMax.to($('.tl-box[data-num="'+tlCurNum+'"]'), .75, {delay:.5, height:tlH, ease:Elastic.easeInOut, easeParams:[2,2]})
	}	
	
	// close robot
	TweenMax.to($('.tl-robot-head>div'), .5, {y:200, ease:Power3.easeInOut})
	TweenMax.to($('.tl-robot-arm.left .mover'), .5, {rotation:110, y:130, ease:Power3.easeInOut, onComplete:function(){}})
	TweenMax.to($('.tl-robot-arm.right .mover'), .5, {rotation:-110, y:130, ease:Power3.easeInOut, onStart:function(){
		setTimeout(function(){
			$('.tl-robot-arm').css('z-index',0);
			$('.tl-robot').find('.cover').attr('data-color','');
		}, 100);
	}})
	
	// slide boxes
	TweenMax.to($('.tl-boxes'), .75, {delay:.25, 'transform':'translateX('+newPos+'px)', ease:Expo.easeInOut});
	
	// open robot
	TweenMax.to($('.tl-robot-head>div'), .75, {delay:.75, y:0, ease:Elastic.easeInOut, easeParams:[1.3,2], onStart:function(){
		$('.tl-robot').find('.cover').attr('data-color',activeColor);
		$('.tl-robot-arm').css('z-index',5);
	}})
	TweenMax.to($('.tl-robot-arm.left .mover'), 1, {delay:.75, rotation:0, y:0, ease:Elastic.easeInOut, easeParams:[1.3,2]})
	TweenMax.to($('.tl-robot-arm.right .mover'), 1, {delay:.75, rotation:0, y:0, ease:Elastic.easeInOut, easeParams:[1.3,2]})
	
	// update arrows
	if(tlCurNum>0 && $('.arr.left').hasClass('off')){
		$('.arr.left').removeClass('off');	
	}
	if(tlCurNum<(tlBoxes-1) && $('.arr.right').hasClass('off')){
		$('.arr.right').removeClass('off');	
	}
	if(tlCurNum == (tlBoxes-1)){
		$('.arr.right').addClass('off')	
	}
	if(tlCurNum == 0){
		$('.arr.left').addClass('off')	
	}
	
	tlLastNum = tlCurNum;
}





//! SECTION: x10 DISTRIBUTION

var distBoxNums = [];
var distBoxEnds = [];
var distCount = [];

$('.distribution-box').each(function(i){
	$(this).find('.meter').css('width',Number($(this).attr('data-percent'))+'%');
	distBoxNums[i] = 0;
	distBoxEnds[i] = Number($(this).attr('data-percent'));
})

function updateDistBoxes(){
	if(winW>768){
		tmpM = ($('.distribution-boxes').width() - $('.distribution-box').outerWidth()*3)/2 - 40;
		if(tmpM < 75){tmpM = 75;}
		$('.distribution-box:nth-child(-n+3)').css({'margin-bottom':tmpM+'px'})
	} else {
		$('.distribution-box:nth-child(-n+3)').css({'margin-bottom':''})		
	}
}



function openDistBoxes(){
	
	// animate meter and numbers
	
	setTimeout(function(){	
		distCount0 = setInterval(function(){
			if(distBoxNums[0] < distBoxEnds[0]){
				distBoxNums[0] += 1;
				scAmt0 = (distBoxNums[0] / distBoxEnds[0]);
				$('.distribution-box[data-num="1"]').find('.num').text(distBoxNums[0]);
				$('.distribution-box[data-num="1"]').find('.meter').css({'transform':'scaleX('+scAmt0+')'})
			}
			
			// shut off interval
			if(distBoxNums[0] >= distBoxEnds[0]){
				clearInterval(distCount0);
			}
		
		}, 30);
	}, 500)
	
	setTimeout(function(){	
		distCount1 = setInterval(function(){
			if(distBoxNums[1] < distBoxEnds[1]){
				distBoxNums[1] += 1;
				scAmt1 = (distBoxNums[1] / distBoxEnds[1]);
				$('.distribution-box[data-num="2"]').find('.num').text(distBoxNums[1]);
				$('.distribution-box[data-num="2"]').find('.meter').css({'transform':'scaleX('+scAmt1+')'})
			}
			
			// shut off interval
			if(distBoxNums[1] >= distBoxEnds[1]){
				clearInterval(distCount1);
			}
		
		}, 100);
	}, 1000)
	
	setTimeout(function(){	
		distCount2 = setInterval(function(){
			if(distBoxNums[2] < distBoxEnds[2]){
				distBoxNums[2] += 1;
				scAmt2 = (distBoxNums[2] / distBoxEnds[2]);
				$('.distribution-box[data-num="3"]').find('.num').text(distBoxNums[2]);
				$('.distribution-box[data-num="3"]').find('.meter').css({'transform':'scaleX('+scAmt2+')'})
			}
			
			// shut off interval
			if(distBoxNums[2] >= distBoxEnds[2]){
				clearInterval(distCount2);
			}
		
		}, 100);
	}, 1500)
	
	setTimeout(function(){	
		distCount3 = setInterval(function(){
			if(distBoxNums[3] < distBoxEnds[3]){
				distBoxNums[3] += 1;
				scAmt3 = (distBoxNums[3] / distBoxEnds[3]);
				$('.distribution-box[data-num="4"]').find('.num').text(distBoxNums[3]);
				$('.distribution-box[data-num="4"]').find('.meter').css({'transform':'scaleX('+scAmt3+')'})
			}
			
			// shut off interval
			if(distBoxNums[3] >= distBoxEnds[3]){
				clearInterval(distCount3);
			}
		
		}, 40);
	}, 2000)

	setTimeout(function(){	
		distCount4 = setInterval(function(){
			if(distBoxNums[4] < distBoxEnds[4]){
				distBoxNums[4] += 1;
				scAmt4 = (distBoxNums[4] / distBoxEnds[4]);
				$('.distribution-box[data-num="5"]').find('.num').text(distBoxNums[4]);
				$('.distribution-box[data-num="5"]').find('.meter').css({'transform':'scaleX('+scAmt4+')'})
			}
			
			// shut off interval
			if(distBoxNums[4] >= distBoxEnds[4]){
				clearInterval(distCount4);
			}
		
		}, 100);
	}, 2200)
		
	//$('.distribution-box').find('.meter').addClass('on');
}

function resetDistBoxes(){
	$('.distribution-box').each(function(i){
		$(this).find('.meter').removeClass('on');
		$(this).find('.num').text(0);
		distBoxNums[i] = 0;
		clearInterval(distCount0);
		clearInterval(distCount1);
		clearInterval(distCount2);
		clearInterval(distCount3);
		clearInterval(distCount4);
	})
}





//! SECTION: x11 TEAM

$('.team-btns').each(function(){
	if($(this).find('.social').length == 2){
		$(this).find('.social').css({'width':'50%'});
	}
	if($(this).find('.social').length == 3){
		$(this).find('.social').css({'width':'33%'});
	}
})

function updateTeamBoxes(){
	if(winW>768){
		tmpM = ($('.team-boxes').width() - $('.team-box').outerWidth()*3)/2;
		$('.team-box:nth-child(-n+3)').css({'margin-bottom':tmpM+'px'})
	} else {
		$('.team-box:nth-child(-n+3)').css({'margin-bottom':''})
	}
}





//! - SCROLL BASED ANIMATION

function isScrolledIntoView(elem, offset){
	viewDif = Number(offset);
	
    sT = Number($(document).scrollTop());
	vT = Number($(elem).offset().top)+viewDif;
	vB = sT+winH;
	vH = vT+$(elem).outerHeight()+winH;
	if((vT <= vB && vT >= sT) || (vT <= vB && vB <= vH)){
		return true;
	}
}
var doAnim = true;
$(window).scroll(function(){
	if(doAnim){
	$('.hasAnim').each(function(){
		
		// set offset if any
		if($(this).attr('data-animoffset')){animOffset = $(this).attr('data-animoffset');} else {animOffset = 0;}
		
		
		//! TURN ON ANIMATIONS
		
		if(isScrolledIntoView($(this), animOffset)){
			
			if(!$(this).hasClass('on')){
				//console.log($(this).attr('id')+' on');
				
				// add master class to section
				$(this).addClass('on');

				// specific animations
				if($(this).attr('id') == 'token'){
					dropTokens();
				}
				
				if($(this).attr('id') == 'risk'){
					openRiskGraphs();
				}
				
				if($(this).attr('id') == 'distribution'){
					openDistBoxes();
				}
				
				if($(this).attr('id') == 'roadmap'){
					$('.bluegrad-wrap').addClass('on')
				}
				
				

			}
			
			
			
		//! TURN OFF ANIMATIONS
		
		} else {
			if($(this).hasClass('on')){
				
				//console.log($(this).attr('id')+' off');
				$(this).removeClass('on');
				
				// turn off specific animations
				if($(this).attr('id') == 'token'){
					removeTokens();
				}
				
				if($(this).attr('id') == 'risk'){
					resetRiskGraphs();
				}
				
				if($(this).attr('id') == 'distribution'){
					resetDistBoxes();
				}
				
				if($(this).attr('id') == 'roadmap'){
					$('.bluegrad-wrap').removeClass('on')
				}		
				
			}
		}
	})
	}
})
$('.stopper').click(function(){
	if(doAnim == true){
		doAnim = false;
		$('section').removeClass('on');
	} else {
		doAnim = true;
	}
})





//! UPDATE SCALES


function updateScales(){
	$('.hasScale').each(function(){
		fullW = Number($(this).attr('data-width'));
		trgW = $(this).find('.sizer').width();
		scDif = Number(trgW/fullW);
		if(scDif > 0){
			TweenMax.set($(this).find('.willScale'), {scaleX:scDif, scaleY:scDif});
		}
	})	
}





//! SCROLL TO SECTION

$('.segue-text').each(function(){
	tmpH = Math.round($(this).find('p').width())+60;
	$(this).css({'height':tmpH+'px'})
	$(this).find('.txt').css({'width':tmpH+'px','transform':'rotate(90deg)'})
	
	$(this).click(function(){
		nxtsec = $(this).attr('data-next');
		trgSec = $('#'+nxtsec);
		if(winW>500){
			trgOffset = Number(trgSec.attr('data-offset'));
		} else {
			trgOffset = Number(trgSec.attr('data-mobile-offset'));
		}
		
		animScroll(trgSec, .75, trgOffset);
	})
})





//! ANIMATION: LST ROBOT COIN BOX

var totalIBoxCoins = 18;
var gap = 11;
var rgap = -5;
var r = 0;
var c = 0;
var cDels = [0,1,2,3,4,5];
var rowDel = 6;
shuffleArray(cDels);

for(i=0;i<totalIBoxCoins;i++){
	if(i>0 && i%6 == 0){r++; c=0;}
	
	randCoin = Math.round(Math.random());
	randX = -3+Math.floor(Math.random() * 6);
	randY = -3+Math.floor(Math.random() * 4);
	newDel = Number((r*rowDel)+cDels[c]);
	
	tmpCn = '<div class="coin" data-num="'+i+'" ';
	tmpCn += 'style="animation-delay:'+newDel+'s; z-index:'+newDel+'; ';
	tmpCn += 'left:'+(Number(c*gap)+Number(randX))+'px; ';
	tmpCn += 'top:'+(Number(r*rgap)+Number(randY))+'px;">'
	tmpCn += '<img src="/assets/images/v3/parts/smallcoin'+(randCoin+1)+'.png"></div>';	
	
	c++;
	
	$('.coin-box').append(tmpCn);
}






//! ANIMATION: STARS RANDOM TWINKLE

var starDel = .5;

$('.star-set:not(.special), .bluegrad-wrap').each(function(){
	$(this).find('.star').each(function(n){
		$(this).css({'animation-delay':-(n*starDel)+'s'})
	})
})





