console.log('Ready!')

$('.signinform').hide()
$('.signupform').hide()

$(document).ready(function(){
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
})
