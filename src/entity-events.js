import * as Artifact from './cards-artifact.js';

var inat_data = ["preferred_common_name", "description", "photo", "participant_name", "biome", "econame"];
var cardHTML = '<div id="card-num" class="text-md m-3 font-light border-2 border-gray-400 bg-yellow-50 text-gray-700 max-w-lg w-full m-0.5 flex flex-col justify-items-center items-center"><div id="photo-container"><img id="photo"></div><i class="fal fa-seedling mt-2 text-xl text-gray-700"></i><div class="divider my-2 w-12 border-b border-gray-700"></div><div class="p-4 text-md font-light text-gray-700"><span id="participant_name" class="font-semibold"></span> told us of <span id="preferred_common_name" class="font-semibold"></span> <span id="description"></span></div><div class="divider my-8 w-12 border-b border-gray-700"></div><div class="p-4 text-md font-light text-gray-700">from the <br><span class="font-semibold" id="econame"></span><br> in the <span class="font-semibold" id="biome"></span> biome</div></div>'
var artifact;
var observations;

var currRealm = "";

// Card animations
var hideObservationCard = () => {$("#overlay-container").animate({top:"100vh"});}
var displayObservationCard = (index, observations, basket, biomes) => {

  // Update data
  basket.push(observations[index]);
  // console.log(observations[index])
  $("#counter").html(basket.length).addClass("ml-2")
  populateCard("#card", observations[index]);

  // update biomes
  var biome = observations[index]["biome"];
  if(biome){
    biomes[biome] = biomes[biome]? biomes[biome] + 1 : 1;
  }

  // if(biome != currRealm){
  //     listener(biome);
  // }

  listener(observations[index]["latLng"]) // ulu use these coordinates


  // new card
  var num = "card-num" + basket.length;
  var newCard = cardHTML.replace("card-num", num);
  var photoId = 'id="photo' + basket.length + '"';
      newCard = newCard.replace('id="photo"', photoId);

  $("#all-cards").append(newCard);
  num = "#" + num;
  populateCard(num, observations[index], basket.length);

  window.setTimeout(function(){
    $("#overlay-container").animate({top:0});
  },700);
}

var populateCard = (parent, observation, index) => {
  for(var j = 0; j < inat_data.length; j++){
    var tag = parent + " #" + inat_data[j];
    $(tag).html('');
    if(inat_data[j] == "photo"){
      var tag = index ? "#photo" + (index) : "#photo";

      if (observation.hasOwnProperty('observation_photo_attachment')) {
        $(tag).attr('src', observation["observation_photo_attachment"][0]["url"]);
      } else {
        $(tag).attr('src', observation["default_photo"]);
      }
    } else if (inat_data[j] == "participant_name") {
      if(observation[inat_data[j]]){
        $(tag).html(observation[inat_data[j]]);
      } else {
        $(tag).html("A MozFester")
      }
    } else if (inat_data[j] == "description") {
      if(observation[inat_data[j]]) {
        $(tag).html(', saying: <br><br>' + observation[inat_data[j]]);
      }
    } else {
      $(tag).html(observation[inat_data[j]]);
    }
  }
}

// Show all cards animations
var hideAllCards = () => {
  artifact.hide();
  $("#overlay-container-all-cards").animate({top:"100vh"});
};
var showAllCards = (basket) => {
  console.log("showAllCards")
  $("#overlay-container-all-cards").animate({top:0});
  artifact.show();
}

var init = (obs, basket, biomes) => {
  observations = obs;
  artifact = new Artifact.Artifact(basket, biomes);

  $('#close,#overlay-container').on("click", () => { hideObservationCard(); hideAllCards(); })
  $('#overlay').on("click", (e) => { e.preventDefault(); return false; })

  $("#view-cards").on("click", (e) => {
    showAllCards(basket);
  });

  $('#export').on("click", () => {
    artifact.exportCards();
  });

}



export {displayObservationCard,hideObservationCard,init}
