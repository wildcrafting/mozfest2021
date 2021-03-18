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
    var poppinsFont;

    // p.preload = function (){
      // poppinsFont = p.loadFont('../assets/Poppins-Regular.ttf');
    // }
    p.setup = async function() {
      p.frameRate(24);
      p.textSize(12);
      p.textFont(poppinsFont);

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
          p.rect(p.width/2, p.height/2, 120, 50)


          p.textAlign(CENTER, CENTER);
          p.fill(0)
          p.push();
            p.translate(x, y)
            p.rotate(i - (Math.PI * 1.5));
            p.text(biome, 0, 0);
          p.pop();
          var displayText = "You collected " + basket.length + " cards \nfrom " + Object.keys(biomes).length + " realm(s)."
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
    $("#export").prop("disabled", true);
    $("#export-text").html("exporting pdf");
    var outerElem = document.getElementById('overlay-container-all-cards')
    var width = outerElem.clientWidth;
    var height = outerElem.clientHeight;
    var margin = width > 600 ? 100 : 50;
    var imageMargin = width > 600 ? margin : 10;
    var quoteFontSize = width > 600 ? 16 : 12;
    var plantPath = width > 600 ? 'M143.5,95.6c-9.9,0-18.2,8.2-20.4,19.2c-3.6-7.5-10.4-12.6-18.2-12.6h-7.2v1.7c0,13.7,9.4,24.8,20.9,24.8h3.8v12.4 c0,0.5,0.4,0.8,0.8,0.8h1.7c0.5,0,0.8-0.4,0.8-0.8v-19h3.8c11.5,0,20.9-11.1,20.9-24.8v-1.7H143.5z M118.7,125.3 c-9.3,0-16.9-8.8-17.6-19.8h3.8c9.3,0,16.9,8.8,17.6,19.8H118.7L118.7,125.3z M129.7,118.7h-3.8c0.7-11.1,8.3-19.8,17.6-19.8h3.8 C146.6,109.9,139,118.7,129.7,118.7L129.7,118.7z' : 'M93.4,48.5c-9.9,0-18.2,8.2-20.4,19.2c-3.6-7.5-10.4-12.6-18.2-12.6h-7.2v1.7c0,13.7,9.4,24.8,20.9,24.8h3.8v12.4   c0,0.5,0.4,0.8,0.8,0.8h1.7c0.5,0,0.8-0.4,0.8-0.8v-19h3.8c11.5,0,20.9-11.1,20.9-24.8v-1.7H93.4z M68.6,78.2 c-9.3,0-16.9-8.8-17.6-19.8h3.8c9.3,0,16.9,8.8,17.6,19.8H68.6L68.6,78.2z M79.6,71.6h-3.8c0.7-11.1,8.3-19.8,17.6-19.8h3.8 C96.5,62.8,88.9,71.6,79.6,71.6L79.6,71.6z';
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
    var artifactImageWidth = canvasWidth > 500 ? 500 : canvasWidth;

    doc.font("Helvetica-Bold");
    doc.rect(0, 0, width, height).fill("#FFFBEB");
    doc.moveTo(0, 0);
    doc.fillColor("#000000")
    // cover
    doc.fontSize(36).text('wildcrafting', {width: contentWidth, align: 'left'});
    doc.font("Helvetica").fontSize(16).text("your collection of cards, telling us of the plants that underpin mozfest 2021.", {width: contentWidth, align: 'left'});
    doc.moveDown()
    doc.fontSize(12).text("an exhibit", {width: contentWidth, align: 'left', underline: true, link: "https://wildcrafting.github.io/mozfest2021/", continued : true}).fontSize(12).text(" by ulu mills, devika singh, cathryn ploehn, and jessica liu.", {underline: false});
    doc.moveDown();

    var canvas = document.getElementById("artifactCanvas");
    var image = canvas.toDataURL("image/png");
    doc.image(new Buffer.from(image.replace('data:image/png;base64,',''), 'base64'), {fit: [artifactImageWidth, artifactImageWidth], align: 'left', valign: 'bottom'}); // this will decode your base64 to a new buffer

    var quote = '"It has to do with the realization that we are all beings on the same earth, and that we all need the same things to flourish. Water, for example. When I pay attention to how birds interact with water, or how mosses interact with water, or how lichens interact with water, I feel a kinship with them. I know what a cold drink of water feels like, but what would it be like to drink water over my entire body, as a lichen does? Kinship also comes from our reciprocal relationship with other species. Sitting here, you can get a whiff of ripe wild strawberries off the hillside. They are fulfilling their responsibility to us, and we will fulfill our responsibility to them. Those berries provide us with food and medicine, and in reciprocity, we perhaps unwittingly disperse their seeds and tend their habitat so they can continue to thrive. It’s like a family: we help each other out." \n\n Dr. Robin Wall Kimmerer';
    quote = quote.toLowerCase();

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


      var name = "\n\n\n\n\n";
      name = basket[i]["participant_name"] ? name + basket[i]["participant_name"] + " told us of " : name + "a mozfest wildcrafter told us of ";
      var plantName = basket[i]["preferred_common_name"] ? basket[i]["preferred_common_name"].toLowerCase() : basket[i]["species_guess"].toLowerCase();
      var description = basket[i]["description"] ? '\n\n "' + basket[i]["description"].toLowerCase()  + '" \n\n\n': "\n\n";

      var econame = basket[i]["econame"] ? "from the " + basket[i]["econame"].toLowerCase(): "";
      var biome = basket[i]["biome"] ? " in the realm " + basket[i]["biome"].toLowerCase() : "";

      var measureString  = name + plantName + description + econame + biome;
      measureString = measureString.toLowerCase()

      // var stringHeight = doc.heightOfString(runningString + newString, {width: contentWidth});

      doc.fontSize(quoteFontSize).font("Helvetica").text(`${name}`, { width: contentWidth, align: 'left', x: 0 , continued: true}).font("Helvetica-Bold").text(`${plantName}`);
      doc.font("Helvetica-Oblique").text(`${description}`, { width: contentWidth, align: 'left', x: 0});
      doc.font("Helvetica").text(`${econame}`, { continued: true, width: contentWidth, align: 'left', x: 0}).font("Helvetica-Oblique").font("Helvetica-BoldOblique").text(`${biome}`, { width: contentWidth, align: 'left', x: 0});
      doc.moveDown();

      // doc.fontSize(12).text(`${string2}`, {
      //   width: contentWidth,
      //   align: 'left',
      //   x: 0,
      //   oblique: true
      // });
      // doc.moveDown();
      console.log(basket[i]["observation_photo_attachment"]);
      if(basket[i]["observation_photo_attachment"]){
        var imgElem = await downloadImage(basket[i]["observation_photo_attachment"][0]["url"])
        forPDF.height = imgElem.naturalHeight;
        forPDF.width = imgElem.naturalWidth;
        ctx.drawImage(imgElem, 0, 0);
        var uri = forPDF.toDataURL('image/png');
        var stringHeight = doc.heightOfString(measureString, {width: contentWidth})
        var imgHeight = (height - stringHeight) - (margin * 3);
        doc.image(new Buffer(uri.replace('data:image/png;base64,',''), 'base64'), {fit: [contentWidth, imgHeight], align: 'left', valign: 'top'});
        doc.moveDown();
      }



    }

    doc.addPage();
    doc.rect(0, 0, width, height).fill("#FFFBEB");
    doc.moveTo(0, 0);
    doc.fillColor("#000000");
    doc.path(plantPath)
        .fill()
    doc.moveTo(0, margin);
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(16).text("about the creators", {width: contentWidth, align: 'left'});
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12).text("ulu mills ", {width: contentWidth, align: 'left', continued: true}).font("Helvetica").fontSize(12).text("is a product designer at landed and a master’s candidate at carnegie mellon university. aloha@ulumills.com", {width: contentWidth, align: 'left'});
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12).text("devika singh ", {width: contentWidth, align: 'left', continued: true}).font("Helvetica").fontSize(12).text("is a product designer at linkedin and holds a MDes from carnegie mellon university. devika711@gmail.com", {width: contentWidth, align: 'left'});
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12).text("cathryn ploehn ", {width: contentWidth, align: 'left', continued: true}).font("Helvetica").fontSize(12).text("is an interaction designer and lecturer who holds a MDes from carnegie mellon university", {width: contentWidth, align: 'left'});
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12).text("jessica liu ", {width: contentWidth, align: 'left', continued: true}).font("Helvetica").fontSize(12).text("is a data person at landed. nsahn.liu@gmail.com", {width: contentWidth, align: 'left'});
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.font("Helvetica").fontSize(12).text("~ spring 2021", {width: contentWidth, align: 'left'});

    // finalize the PDF and end the stream
    doc.end();
    stream.on('finish', function() {
      const url = stream.toBlobURL('application/pdf');
      var a = document.createElement("a");
      a.href = url;
      a.download = "wildcrafting-booklet.pdf";
      a.click();
      $("#export").prop("disabled", false);
      $("#export-text").html("export as pdf");
    });
  };

  var sketch = new p5(artifactSketch,document.getElementById('artifact-container'));

}


export {Artifact}
