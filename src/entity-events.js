var inat_data = ["species_guess", "description", "photo", "participant_name"];
var hideObservationCard = () => {$("#overlay-container").animate({top:"100vh"});}

var displayObservationCard = (index, observations, basket) => {
  $("#overlay-container").animate({top:0});
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
}

$('#close,#overlay-container').on("click", () => { hideObservationCard() })
$('#overlay').on("click", (e) => { e.preventDefault(); return false; })

export {displayObservationCard,hideObservationCard}
