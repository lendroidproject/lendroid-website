var mobile = false;
var mobileBreak = 900;
if($(window).width() <= mobileBreak){mobile = true;}
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var path;
function freezePage(){$('body').css({'width':'100%','height':'100%','overflow':'hidden'});}
function unfreezePage(){$('body').css({'width':'','height':'','overflow':''});}





//! WINDOW RESIZE

var winW;
var winH;
$(window).resize(function(){
	winW = $(window).width();
	winH = $(window).height();
	console.log(winW);
})





//! SIGNUP DROP DOWN

var signupOpen = false;

$('.mailing-list-btn').click(function(){
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
	TweenMax.to($('#main').find('.signup-form'), .5, {delay:.5, opacity:1, 'display':'block'})
}
function closeSignup(){	
	signupOpen = false;
	$('.mailing-list-btn').find('.icon').removeClass('flip')
	TweenMax.to('.mailing-list-drop', .5, {top:-165, ease:Expo.easeInOut})
	TweenMax.to($('#main').find('.signup-form'), .3, {opacity:0, 'display':'block'})
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
	menuOpen = true;
	freezePage();
	$('#globalMenu').addClass('open');
	TweenMax.to('.menufill', .3, {opacity:1, 'display':'block'})
	
	// open big box
	TweenMax.set('.menubg', {scaleX:0, scaleY:0, 'display':'block'})
	TweenMax.to('.menubg', .75, {scaleX:1, scaleY:1, opacity:1, ease:Elastic.easeOut, easeParams:[1,2]})

	// open menu contents
	TweenMax.set('.menu-contents', {opacity:1, 'display':'block'})
	
	// animate lines into X
	//TweenMax.to($('.menuLines'), .75, {delay:.2, right:10, ease:Expo.easeOut});
	TweenMax.to($('.menuLines .top'), .75, {delay:.1, rotation:-45, top:0, 'backgroundColor':'#2f4ffd', ease:Expo.easeOut})
	TweenMax.to($('.menuLines .mid'), .2, {delay:.3, opacity:0})
	TweenMax.to($('.menuLines .bottom'), .75, {delay:.1, rotation:45, top:0, 'backgroundColor':'#2f4ffd', ease:Expo.easeOut})	
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
	//TweenMax.to($('.menuLines'), .75, {right:0, ease:Expo.easeOut});
	TweenMax.to($('.menuLines .top'), .75, {rotation:0, top:-9, 'backgroundColor':'#fff', ease:Expo.easeOut})
	TweenMax.to($('.menuLines .mid'), .2, {delay:.2, opacity:1})
	TweenMax.to($('.menuLines .bottom'), .75, {rotation:0, top:9, 'backgroundColor':'#fff', ease:Expo.easeOut})	
}







//! FORM SUBMIT

var formSent = false;
var formURL = $('.signup-form').attr('action');

$('.signup-form').submit(function(){
	if(validateForm($(this))){
		sendForm();
	}
	return false;
});

function sendForm(){

// animation actions

var formData = $('.signup-form').serialize();

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
		$('input[name="EMAIL"]').val('');
		TweenMax.to('.thanks', .5, {'opacity':1, 'display':'block'})
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
		$('.signup-form').addClass('error');
		return false;
	}
}

$('input').focus(function(){
	TweenMax.to('.thanks', .5, {'opacity':0, 'display':'none'});
	$('.signup-form').removeClass('error');
	formSent = false;	
})






freezePage();
$(window).on('load', function(){
	$(window).resize();
	TweenMax.to('#loader', .5, {delay:.2, opacity:0, 'display':'none', onComplete:function(){
		unfreezePage();
	}});
})





