console.log('Ready!')

$('.signinform').hide()
$('.signupform').hide()
$('.update_container').hide()
$('.updateuser').hide()

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


	if($('.prevbtn').attr('value')==="0"){
		console.log('first page')
		$('.prevbtn').hide()
	}

		if($('.nextbtn').attr('last')==="true"){
		console.log('last page')
		$('.nextbtn').hide()
	}
})

