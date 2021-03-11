import p5 from 'p5';
const PDFDocument = require('pdfkit');
var blobStream = require('blob-stream');
import * as Tree from "./tree.js";


function Artifact(basket, biomes){

  var canvasID;
  var display = true;

  var artifactSketch =  async function (p){
    var radialIncrement = (Math.PI * 2) / 8;
    var radius;
    var currentNumBiomes = 0;
    var tree;

    p.setup = async function() {
      p.frameRate(24);
      p.textSize(12);

      var elem = document.getElementById("artifact-container");
      var dimensions = elem.clientWidth > 600? 600: elem.clientWidth;
      var canvas = p.createCanvas(dimensions+50, dimensions+50);

      tree = new Tree.Tree(p);
      canvasID = canvas.id('artifactCanvas')
      radius = (p.width - 200)/2;
    }

    p.draw = function() {
      if(display){
        p.background(255, 251, 235)
        p.stroke(0)
        p.noFill();
        p.ellipse(p.width/2, p.height/2, radius*2 - 50)

        var i = Math.PI * 1.5;
        var index = 1;
        for(var biome in biomes){
          var x = (radius * cos(i)) + p.width/2;
          var y = (radius * sin(i)) + p.height/2;

          if(index > currentNumBiomes){
            currentNumBiomes = index;
            tree.genLeaves(radius, i)
          }

          tree.grow()
          tree.show()

          index++;

          p.noStroke();
          p.rectMode(CENTER);
          p.fill(255, 251, 235)
          p.rect(p.width/2, p.height/2, 180, 50)


          p.textAlign(CENTER, CENTER);
          p.fill(0)
          p.push();
            p.translate(x, y)
            p.rotate(i - (Math.PI * 1.5));
            p.text(biome, 0, 0);
          p.pop();
          var displayText = "You've collected cards \nfrom " + Object.keys(biomes).length + " realm(s)."
          p.text(displayText, p.width/2, p.height/2);

          i += radialIncrement;
        }
      }
    }

  }
  this.show = () => {
    display = true;
  }
  this.hide = () => {
    display = false;
  }

  function downloadImage(url) {
    return new Promise((resolve, reject) => {
      let imageURL = url;
      var downloadedImg = new Image;
      downloadedImg.crossOrigin = "Anonymous";
      downloadedImg.src = imageURL;
      downloadedImg.addEventListener("load", () => {
        resolve(downloadedImg)
      }, false);
    })
  }

  this.exportCards = async () => {
    const doc = new PDFDocument;
    var stream = doc.pipe(blobStream());
    var forPDF = document.getElementById('forPDF');
    var ctx = forPDF.getContext('2d');

    var font = "../assets/Poppins-Regular.ttf"
    doc.font("Helvetica");
    // doc.font(font);

    doc.rect(0, 0, 612, 792).fill("#FFFBEB");
    doc.moveTo(0, 0);
    doc.fillColor("#000000")

    // cover
    doc.fontSize(42).text('wildcrafting', {width: 612, align: 'left', x: 0})
    doc.moveDown()
    doc.fontSize(30).text("The cards you collected from the exhibit that underpin MozFest 2021.")
    doc.moveDown()
    doc.fontSize(12).text(" A project by Ulu Mills, Devika Singh, Cathryn Ploehn, and Jessica Liu.")
    doc.moveDown();
    doc.moveDown();
    var canvas = document.getElementById("artifactCanvas");
    var image = canvas.toDataURL("image/png");
    var x = (612 - 400) / 2;
    var y = (792 - 400) / 2;
    doc.image(new Buffer.from(image.replace('data:image/png;base64,',''), 'base64'), {fit: [400, 400], align: 'center', valign: 'center', x: x}); // this will decode your base64 to a new buffer

    for(var i = 0; i < basket.length; i++){
      if(i % 4 == 0) {
        doc.addPage();
        doc.rect(0, 0, 612, 792).fill("#FFFBEB");
        doc.moveTo(0, 0);
        doc.fillColor("#000000")
      }

      // Once again we can't use images from iNat because of their CORS policy
      // var tag = "photo" + (i + 1);
      // var imgElem = document.getElementById(tag)
      // var imgElem = downloadImage(basket[i]["observation_photo_url"])
      // forPDF.height = imgElem.naturalHeight;
      // forPDF.width = imgElem.naturalWidth;
      // ctx.drawImage(imgElem, 0, 0);
      // var uri = forPDF.toDataURL('image/png')
      // doc.image(new Buffer(uri.replace('data:image/png;base64,',''), 'base64'), {fit: [100, 100], align: 'center', valign: 'center'});
      // doc.moveDown();

      // Add text
      var text = basket[i]["participant_name"] + " told us of " + basket[i]["preferred_common_name"];
      if(basket[i]["description"]) {
        text += ", saying: " + basket[i]["description"];
      }
      var textX = (612 - 400 )/ 2;
      doc.text(`${text}`, {
        width: 400,
        align: 'center',
        x: textX
      });
      doc.moveDown();
    }

    // finalize the PDF and end the stream
    doc.end();
    stream.on('finish', function() {
      const url = stream.toBlobURL('application/pdf');
      var a = document.createElement("a");
      a.href = url;
      a.download = "MMMMMMMmozFest.pdf";
      a.click();
    });

  };

  var sketch = new p5(artifactSketch,document.getElementById('artifact-container'));

}


export {Artifact}
