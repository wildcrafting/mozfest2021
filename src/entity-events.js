import * as Artifact from './cards-artifact.js';

var inat_data = ["preferred_common_name", "description", "photo", "participant_name", "biome", "econame"];
var cardHTML = '<div id="card-num" class="text-md m-3 font-light border-2 border-gray-400 bg-yellow-50 text-gray-700 w-48 m-0.5 max-h-96 flex flex-col justify-items-center items-center"><div id="photo-container"><img id="photo"></div><i class="fal fa-seedling mt-2 text-xl text-gray-700"></i><div class="divider my-2 w-12 border-b border-gray-700"></div><div class="p-3 text-md font-light text-gray-700"><span id="participant_name" class="font-semibold"></span> told us of <span id="species_guess" class="font-semibold"></span>, saying: <span id="description"></span></div><div class="divider my-8 w-12 border-b border-gray-700"></div></div>'
var artifact;


// Card animations
var hideObservationCard = () => {$("#overlay-container").animate({top:"100vh"});}
var displayObservationCard = (index, observations, basket) => {
  basket.push(observations[index]);
  $("#counter").html(basket.length).addClass("ml-2")
  populateCard("#card", observations[index]);

  // new card
  var num = "card-num" + basket.length;
  var newCard = cardHTML.replace("card-num", num)
  $("#all-cards").append(newCard);
  num = "#" + num;
  populateCard(num, observations[index]);

  window.setTimeout(function(){
    $("#overlay-container").animate({top:0});
  },700);
}

var populateCard = (parent, observation) => {
  for(var j = 0; j < inat_data.length; j++){
    var tag = parent + " #" + inat_data[j];
    $(tag).html('');

    if(inat_data[j] == "photo"){
       if (observation.hasOwnProperty('observation_photo_url')) {
        $(tag).attr('src', observation["observation_photo_url"]);
        // $("#photo-container").style.backgroundImage="url(" + observation["observation_photo_url"] + ")";
       } else {
        $(tag).attr('src', observation["default_photo"]);
        // $("#photo-container").style.backgroundImage="url(" + observation["default_photo"] + ")";
      }
    } else {
      $(tag).html(observation[inat_data[j]]);
    }
  }
}

// Show all cards animations
var hideAllCards = () => {$("#overlay-container-all-cards").animate({top:"100vh"})};
var showAllCards = (basket) => {
  $("#overlay-container-all-cards").animate({top:0});
}

var init = (basket) => {
  var artifact = new Artifact.Artifact(basket);
  console.log(Artifact);


  $('#close,#overlay-container').on("click", () => { hideObservationCard(); hideAllCards(); })
  $('#overlay').on("click", (e) => { e.preventDefault(); return false; })

  $("#view-cards").on("click", () => { showAllCards(basket); });

  $('#export').on("click", () => {
    artifact.exportCards();
  });

}



export {displayObservationCard,hideObservationCard,init}
