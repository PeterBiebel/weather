$(document).ready(function() {
	console.log("loading client-side js");

/*$('.forecast-detail').click((e) => {
	console.log('hello');
	console.log($(e.target).parent().find('.day').html());
	console.log(e.target);
	$(this).toggleClass('active');


});*/
$('.current h2, .minute h2, .forecast h2').click( function(){
	console.log($(this).text());
	$(this).parent().toggleClass('disappear');


});


$('.forecast').on("click", ".forecast-detail", function(){
     console.log($(this).text());
     $(this).toggleClass('active')
});








});

//write all jquery in here


