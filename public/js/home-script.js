console.log('Ready!')

$('.signinform').hide()
$('.signupform').hide()
$('.update_container').hide()
$('.updateuser').hide()
$('.list_lessons').hide()

$(document).ready(function(){

	$('.imagebtn').attr('value', Math.random())

	$('.signin').on('click', function(){
		console.log('signin clicked')
		$('.signupform').hide()
		$('.signinform').show()
	})
	$('.signup').on('click', function(){
		console.log('signup clicked')
		$('.signinform').hide()
		$('.signupform').show()
	})

	$('.imagebtn').on('click', function(){
		console.log('signup clicked')
		randval = Math.random()
		$('.imagebtn').attr('value', randval)
		$('.profileimage').attr('src', 'https://api.adorable.io/avatars/' + randval)
	})

	$('.updatebtn').on('click', function(){
		console.log('udate container clicked')
		$('.update_container').toggle()
	})

	$('.userbutton').on('click', function(){
		console.log('udate container clicked')
		$('.adduser').toggle()
	})

	$('.updateusersbutton').on('click', function(){
		console.log('udate container clicked')
		$('.updateuser').show()
	})

	$('.quizsubmit').on('click', function(){
		$('.nextbtn').trigger("click")
	})


	$('.lesson_btn').on('click', function(){
		$('.list_lessons').toggle("click")
	})

	if($('.prevbtn').attr('value')==="0"){
		console.log('first page')
		$('.prevbtn').hide()
	}

	if($('.nextbtn').attr('last')==="true"){
		console.log('last page')
		$('.nextbtn').hide()
	}

})
	
