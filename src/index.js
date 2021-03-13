var observations = [];
var basket = [];
// var biomes = {"Afrotropical":1, "Australasia":1, "Indo-Malayan":1, "Nearctic":1, "Neotropical":1, "Oceania":1, "Palearctic":1};
var biomes = {};

import * as entities from './entities.js';
import * as search from './search.js';
import * as openClose from './open-close-events.js'
// import * as map from './google-maps.js';

var drawArches = () => {
  var sceneEl = document.querySelector('a-scene');
  var numArch = 10;
  var rotationLvl = (Math.PI * 2) / numArch;
  //
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

  // var trelisEl = document.createElement('a-entity');
  // trelisEl.setAttribute('trelis', {numArch: 13});
  // sceneEl.appendChild(trelisEl);

};


$( document ).ready(function() {
  // listener({lat: 123, lng: 123})

  entities.entities(observations, basket, biomes);
  openClose.splashScreen();

  var getData = search.airtableSearch(observations);
  getData.then((d) => {
    drawArches();
  });

});
