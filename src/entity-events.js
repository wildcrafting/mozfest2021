var inat_data = ["species_guess", "description", "photo", "participant_name"];
var hideObservationCard = () => {$("#overlay-container").animate({top:"100vh"});}

var displayObservationCard = (index, observations, basket) => {
  basket.push(observations[index]);
  for(var j = 0; j < inat_data.length; j++){
    var tag = "#" + inat_data[j];
    $(tag).html('');

    if(inat_data[j] == "photo"){
      // for(var k = 0; k < observations.length; k++){
       if (observations[index].hasOwnProperty('observation_photo_url')) {
        $('#photo').attr('src', observations[index]["observation_photo_url"]);
       } else {
        $('#photo').attr('src', observations[index]["default_photo"]);
      }
      // }
    } else {
      $(tag).html(observations[index][inat_data[j]]); 
    }
  }
  window.setTimeout(function(){
  $("#overlay-container").animate({top:0});
},700);
}

$('#close,#overlay-container').on("click", () => { hideObservationCard() })
$('#overlay').on("click", (e) => { e.preventDefault(); return false; })

export {displayObservationCard,hideObservationCard}



// Open and close events

$( document ).ready(function() {
  console.log( "ready!" );
//on page load, start splash screen
$("#wordmark").delay(3000).fadeIn(1000).delay(3000).fadeOut(1000);
  //after 5s, fade out title, fade in instructions, load gmaps in bg
  $("#intro-1").css("display", "flex").hide().delay(8500).fadeIn(1000);

//after clicking button, fade element
$("#next").click(function() {
  $(".loading-bg").fadeOut(1000);
});

  //end jquery
});