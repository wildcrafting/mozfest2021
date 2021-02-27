var inat_data = ["species_guess", "place_guess"];
var hideObservationCard = () => {$("#overlay-container").animate({top:"100vh"});}

var displayObservationCard = (index, observations, basket) => {
  $("#overlay-container").animate({top:0});
  basket.push(observations[index]);

  for(var j = 0; j < inat_data.length; j++){
    var tag = "#" + inat_data[j];
    $(tag).html('');

    if(inat_data[j] == "photos"){
      for(var k = 0; k < observations[index]["photos"].length; k++){
        $(tag).append('<img src="'+ observations[index]["photos"][k].url +'"/>');
      }
    } else {
      $(tag).html(observations[index][inat_data[j]]);
    }
  }
}

$('#close,#overlay-container').on("click", () => { hideObservationCard() })
$('#overlay').on("click", (e) => { e.preventDefault(); return false; })

export {displayObservationCard,hideObservationCard}
