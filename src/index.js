var observations = [];
var basket = [];

import * as entities from './entities.js';
import * as search from './search.js';


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

  // real data
  var getData = search.airtableSearch(observations);
  getData.then((d) => {
    entities.entities(observations, basket);
    drawArches();
  });


}

setup();
