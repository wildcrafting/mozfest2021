import p5 from 'p5';
const PDFDocument = require('pdfkit');
var blobStream = require('blob-stream');
import * as Tree from "./tree.js";


function Artifact(basket, biomes){

  var canvasID;
  var display = false;

  var canvasWidth;

  var artifactSketch =  async function (p){
    var radialIncrement = (Math.PI * 2) / 7;
    var radius;
    var currentNumBiomes = 0;
    var tree;

    p.setup = async function() {
      p.frameRate(24);
      p.textSize(12);

      var elem = document.getElementById("artifact-container");
      var dimensions = elem.clientWidth > 600? 600: elem.clientWidth;
      canvasWidth = dimensions+50;
      var canvas = p.createCanvas(dimensions+50, dimensions+50);

      tree = new Tree.Tree(p);
      canvasID = canvas.id('artifactCanvas')
      radius = (p.width - 50)/2;
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
          // p.rect(p.width/2, p.height/2, 120, 50)


          p.textAlign(CENTER, CENTER);
          p.fill(0)
          p.push();
            p.translate(x, y)
            p.rotate(i - (Math.PI * 1.5));
            p.text(biome, 0, 0);
          p.pop();
          // var displayText = "You collected " + basket.length + " cards \nfrom " + Object.keys(biomes).length + " realm(s)."
          // p.text(displayText, p.width/2, p.height/2);

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

    var outerElem = document.getElementById('overlay-container-all-cards')
    var width = outerElem.clientWidth;
    var height = outerElem.clientHeight;
    var margin = width > 600 ? 100 : 50;
    var imageMargin = width > 600 ? margin : 10;
    var quoteFontSize = width > 600 ? 16 : 12;
    var plantPath = width > 600 ? 'M105.4,105.9h-6.3c0,12.2,9.9,22.2,22.2,22.2v14.3c0,0.9,0.7,1.6,1.6,1.6h3.2c0.9,0,1.6-0.7,1.6-1.6v-14.3 C127.6,115.9,117.7,105.9,105.4,105.9z M143.4,99.6c-8.3,0-15.5,4.6-19.3,11.4c2.7,3,4.8,6.6,5.8,10.6c11.2-1.1,19.9-10.5,19.9-22 H143.4z' : 'M56.5,56.6h-6.3c0,12.2,9.9,22.2,22.2,22.2v14.3c0,0.9,0.7,1.6,1.6,1.6h3.2c0.9,0,1.6-0.7,1.6-1.6V78.8 C78.7,66.6,68.8,56.6,56.5,56.6z M94.4,50.3c-8.3,0-15.5,4.6-19.3,11.4c2.7,3,4.8,6.6,5.8,10.6c11.2-1.1,19.9-10.5,19.9-22H94.4z';
    var contentWidth = width < 400 ? width - (margin * 2) : 400;
    var textX = (width - contentWidth) / 2;
    var y = (height - contentWidth) / 2;
    const doc = new PDFDocument({
      size: [width,height],
      margins : { // by default, all are 72
          top: margin,
         bottom:margin,
          left: margin,
        right: margin
      }
    });
    var stream = doc.pipe(blobStream());
    var forPDF = document.getElementById('forPDF');
    var ctx = forPDF.getContext('2d');

    doc.font("Helvetica");
    doc.rect(0, 0, width, height).fill("#FFFBEB");
    doc.moveTo(0, 0);
    doc.fillColor("#000000")
    // cover
    doc.fontSize(36).text('wildcrafting', {width: contentWidth, align: 'left'});
    doc.fontSize(16).text("Your collection of cards, telling us of the plants that underpin MozFest 2021.", {width: contentWidth, align: 'left'});
    doc.moveDown()
    doc.fontSize(12).text(" An exhibit by Ulu Mills, Devika Singh, Cathryn Ploehn, and Jessica Liu.", {width: contentWidth, align: 'left'});
    doc.moveDown();

    var canvas = document.getElementById("artifactCanvas");
    var image = canvas.toDataURL("image/png");
    doc.image(new Buffer.from(image.replace('data:image/png;base64,',''), 'base64'), {fit: [canvasWidth, canvasWidth], align: 'center', valign: 'center', x: imageMargin}); // this will decode your base64 to a new buffer

    var quote = '"It has to do with the realization that we are all beings on the same earth, and that we all need the same things to flourish. Water, for example. When I pay attention to how birds interact with water, or how mosses interact with water, or how lichens interact with water, I feel a kinship with them. I know what a cold drink of water feels like, but what would it be like to drink water over my entire body, as a lichen does? Kinship also comes from our reciprocal relationship with other species. Sitting here, you can get a whiff of ripe wild strawberries off the hillside. They are fulfilling their responsibility to us, and we will fulfill our responsibility to them. Those berries provide us with food and medicine, and in reciprocity, we perhaps unwittingly disperse their seeds and tend their habitat so they can continue to thrive. It’s like a family: we help each other out." \n\n Dr. Robin Wall Kimmerer'

    doc.addPage();
    doc.rect(0, 0, width, height).fill("#FFFBEB");
    doc.moveTo(0, 0);
    doc.fillColor("#000000");
    doc.fontSize(quoteFontSize).text(`${quote}`, {width: contentWidth, align: 'left', oblique: true});

    for(var i = 0; i < basket.length; i++){

      doc.addPage();
      doc.rect(0, 0, width, height).fill("#FFFBEB");
      doc.moveTo(margin, margin);
      doc.fillColor("#000000")
      doc.path(plantPath)
          .fill()
      doc.moveTo(0, margin);
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();

      var name = basket[i]["participant_name"] ? basket[i]["participant_name"] : "A MozFester";
      var plantName = basket[i]["preferred_common_name"] ? basket[i]["preferred_common_name"] : basket[i]["species_guess"];
      var description = basket[i]["description"] ? ", saying: \n\n" + basket[i]["description"] : ".";
      var string1 = name + " told us of " + plantName + description;

      var econame = basket[i]["econame"] ? "From the " + basket[i]["econame"] : "";
      var biome = basket[i]["biome"] ? "in the realm " + basket[i]["biome"] : "";

      var string2  = econame + biome;

      // var stringHeight = doc.heightOfString(runningString + newString, {width: contentWidth});

      doc.fontSize(quoteFontSize).text(`${string1}`, {
        width: contentWidth,
        align: 'left',
        x: 0
      });
      doc.moveDown();

      doc.fontSize(12).text(`${string2}`, {
        width: contentWidth,
        align: 'left',
        x: 0,
        oblique: true
      });
      doc.moveDown();



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
