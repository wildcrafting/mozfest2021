var inat_data = ["species_guess", "place_guess"];

var observations = [];
var basket = [];

import * as entities from './entities.js';
import * as search from './search.js';

var hideObservationCard = () => {$("#overlay-container").animate({top:"100vh"});}

var displayObservationCard = (index) => {
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

var drawArches = () => {
  var sceneEl = document.querySelector('a-scene');
  var numArch = 10;
  var rotationLvl = (Math.PI * 2) / numArch;

  for(var i = 0; i < numArch; i++){
    var d = [];
    for(var j = i; j < observations.length; j += numArch){
      d.push(j);
    }
    var schema = {rotation: rotationLvl * i, cards: d};
    var entityEl = document.createElement('a-entity');

    entityEl.setAttribute('arch', schema);
    sceneEl.appendChild(entityEl);
  }

  var trelisEl = document.createElement('a-entity');
  trelisEl.setAttribute('trelis', {numArch: 13});
  sceneEl.appendChild(trelisEl);

};


function setup(){

  $('#close,#overlay-container').on("click", () => { hideObservationCard() })
  $('#overlay').on("click", (e) => { e.preventDefault(); return false; })
  // sample data
  // for(var k = 0; k < 500; k++){
  //   observations.push({val: k});
  // }

  // real data
  var getData = search.airtableSearch(observations);
  getData.then((d) => {
    drawArches();
    // shp("wwf_terr_ecos").then(async (geojson) => {
    //   // drawArches();
    //   console.log("loaded")
    //   var turfPolygons = [];
    //   for(var j = 0; j < observations.length; j++){
    //     var pt = false;
    //     if(observations[j].location){
    //       pt = observations[j].location.split(",");
    //       pt = [parseFloat(pt[0]), parseFloat(pt[1])]
    //       pt = turf.point(pt);
    //       console.log(pt)
    //     } else if(observations[j].place_ids.length > 0){
    //       // await new Promise( (resolve, reject) => {
    //       //           var place = observations[j].place_ids[observations[j].place_ids.length-1];
    //       //           console.log(place)
    //       //           resolve();
    //       //           // $.ajax({
    //       //           //     url: "https://api.inaturalist.org/v1/places/" + place,
    //       //           //     success: function(data) {
    //       //           //       pt = data.results.location.split(",");
    //       //           //       pt = [parseFloat(pt[0]), parseFloat(pt[1])]
    //       //           //       pt = turf.point(pt);
    //       //           //       resolve();
    //       //           //     }
    //       //           // });
    //       //       });
    //     }
    //
    //     if(pt){
    //
    //       for(var i = 0; i < geojson.features.length; i++){
    //         if(!turfPolygons[i]){
    //           turfPolygons.push(turf.polygon(geojson.features[i].geometry.coordinates[0]));
    //         }
    //         console.log(turfPolygons[i]);
    //
    //         var inside = turf.booleanPointInPolygon(pt, turfPolygons[i]);
    //         if(inside){
    //           console.log(observations[j].place_guess)
    //           console.log(geojson.features[i].properties)
    //           observations[j].bioregion = geojson.features[i].properties.ECO_NAME;
    //         }
    //
    //       }
    //     }
    //   }
    // });
  });


}

setup();
