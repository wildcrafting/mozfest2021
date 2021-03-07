import p5 from 'p5';

function Artifact(basket){

  var canvasID;

  var artifactSketch =  async function (p){
    p.setup = async function() {
      p.frameRate(24);
      var elem = document.getElementById("card-overlay");
      var canvas = p.createCanvas(elem.clientWidth, elem.clientHeight);
      canvasID = canvas.id('artifactCanvas')
      console.log(p)
    }

    p.draw = function() {

      p.background(0)
    }

  }

  this.exportCards = () => {

    var canvas = document.getElementById("artifactCanvas");
    var img = canvas.toDataURL("image/png");

    document.write('<img src="'+img+'"/>');

  };

  var sketch = new p5(artifactSketch,document.getElementById('artifact-container'));

}


export {Artifact}
