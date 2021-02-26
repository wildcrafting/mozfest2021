(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var defaultMaterial = new THREE.MeshStandardMaterial({
  color: 0x331a00
});
var radius = 3;
AFRAME.registerComponent('card', {
  schema: {
    position: {
      "default": {
        x: 0,
        y: 0,
        z: 0
      },
      type: 'vec3'
    },
    index: {
      "default": 0,
      type: 'number'
    }
  },
  init: function init() {
    var el = this.el;
    var self = this; // Create geometry.

    this.geometry = new THREE.PlaneGeometry(.1, .2, 32);
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    }); // Create mesh.

    this.mesh = new THREE.Mesh(this.geometry);
    el.setObject3D('mesh', this.mesh);
    el.object3D.position.set(this.data.position.x + .005, this.data.position.y - .25, this.data.position.z); // iNaturalist doesn't allow crossorigin = anonymous/CORS, so we can't use them as a texture
    // https://stackoverflow.com/questions/34826748/issue-with-crossorigin-anonymous-failing-to-load-images
    // https://hacks.mozilla.org/2011/11/using-cors-to-load-webgl-textures-from-cross-domain-images/
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#what_requests_use_cors
    // if(observations[self.data.index].photos){
    //   var schema = {src: observations[self.data.index].photos[0].url, softmode: true}
    //   this.el.crossOrigin = 'anonymous';
    //   this.el.setAttribute('asset-on-demand', schema)
    // }

    el.object3D.lookAt(0, 2, 0); // this.el.object3D.rotation.y ;

    el.addEventListener('mouseenter', function () {
      el.object3D.scale.copy({
        x: 2.5,
        y: 2.5,
        z: 2.5
      });
    });
    el.addEventListener('mouseleave', function () {
      el.object3D.scale.copy({
        x: 1,
        y: 1,
        z: 1
      });
    });
    this.el.addEventListener('click', function () {
      displayObservationCard(self.data.index);
      el.setAttribute('animation', 'property: position; to: 0 0 0');
    });
  }
});
AFRAME.registerComponent('trelis', {
  schema: {
    numArch: {
      type: 'number',
      "default": 0
    }
  },
  init: function init() {
    var circleRadius = .005;
    var group = new THREE.Group();
    var extrudeSettings = {
      amount: radius + .5,
      bevelEnabled: false
    };
    var rotationAmount = Math.PI * 2 / this.data.numArch;

    for (var i = 0; i < this.data.numArch; i++) {
      var circleShape = new THREE.Shape().moveTo(0, circleRadius).quadraticCurveTo(circleRadius, circleRadius, circleRadius, 0).quadraticCurveTo(circleRadius, -circleRadius, 0, -circleRadius).quadraticCurveTo(-circleRadius, -circleRadius, -circleRadius, 0).quadraticCurveTo(-circleRadius, circleRadius, 0, circleRadius);
      var geometry = new THREE.ExtrudeGeometry(circleShape, extrudeSettings);
      var mesh = new THREE.Mesh(geometry, defaultMaterial);
      mesh.rotation.y = rotationAmount * i;
      mesh.position.set(0, .01, 0);

      if (i > 0) {
        var geometry = new THREE.TorusGeometry(radius / this.data.numArch * i + .5, 0.005, 8, 100);
        var torus = new THREE.Mesh(geometry, defaultMaterial);
        torus.rotation.x = Math.PI / 2;
        torus.position.set(0, .01, 0);
        group.add(torus);
      }

      group.add(mesh);
    }

    var geometry = new THREE.TorusGeometry(.6, 0.005, 8, this.data.numArch);
    var torus = new THREE.Mesh(geometry, defaultMaterial);
    torus.rotation.x = Math.PI / 2;
    torus.position.set(0, 2.5, 0); // group.add( torus );

    this.el.setObject3D('mesh', group);
  }
});
AFRAME.registerComponent('scale-on-mouseenter', {
  schema: {
    to: {
      "default": {
        x: 2.5,
        y: 2.5,
        z: 2.5
      },
      type: 'vec3'
    }
  },
  init: function init() {
    var data = this.data;
    var el = this.el;
    this.el.addEventListener('click', function () {
      el.object3D.scale.copy(data.to);
    });
  }
});
AFRAME.registerComponent('arch', {
  schema: {
    rotation: {
      type: 'number',
      "default": 0
    },
    cards: {
      type: 'array',
      "default": []
    }
  },
  init: function init() {
    var h = 2 + .1 * Math.random();
    var group2 = new THREE.Group();
    var curve = new THREE.EllipseCurve(0, 0, // ax, aY
    radius, radius, // xRadius, yRadius
    0, Math.PI, // aStartAngle, aEndAngle
    false, // aClockwise
    Math.PI / 2 // aRotation
    );
    var points = curve.getPoints(250);
    var rootPoints = [];

    for (var j = 0; j < 6; j++) {
      rootPoints.push([]);
      var path = "";

      for (var k = 0; k < points.length; k += 1) {
        var i = Math.floor(k);

        if (i > 0) {
          path += ", ";
        }

        points[i].z = noise(i / 20, j, this.data.rotation * 2) + (.1 * j - 2.5 * .1) + Math.sin((j * 4 * this.data.rotation + i) / 10) * .2; // var x = points[i].x + noise(i/5, j, (this.data.rotation*2))/2

        var x = points[i].x;
        path += x + " " + points[i].y + " " + points[i].z;
        rootPoints[j].push({
          x: x,
          y: points[i].y,
          z: points[i].z
        });
      }

      var line = document.createElement('a-entity');
      var sch = {
        lineWidth: 2,
        path: path,
        color: "#331a00",
        lineWidthStyler: "1 - p + .5"
      };
      line.setAttribute('meshline', sch);
      this.el.appendChild(line);
    }

    for (var i = 0; i < this.data.cards.length; i++) {
      // var randomPoint = points[Math.floor(Math.random() * 70) + 10];
      var randomPoint = rootPoints[i % 6][Math.floor(i / this.data.cards.length * 100) + 20];
      var cardEl = document.createElement('a-entity');
      var sch = {
        position: randomPoint,
        rotation: this.data.rotation,
        index: this.data.cards[i]
      };
      cardEl.setAttribute('card', sch);
      this.el.appendChild(cardEl);
    }

    this.el.setAttribute('geometry-merger', {
      preserveOriginal: false
    });
    this.el.object3D.rotation.y = this.data.rotation;
  }
});

},{}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var entities = _interopRequireWildcard(require("./entities.js"));

var search = _interopRequireWildcard(require("./search.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var inat_data = ["species_guess", "place_guess"];
var observations = [];
var basket = [];

var hideObservationCard = function hideObservationCard() {
  $("#overlay-container").animate({
    top: "100vh"
  });
};

var displayObservationCard = function displayObservationCard(index) {
  $("#overlay-container").animate({
    top: 0
  });
  basket.push(observations[index]);

  for (var j = 0; j < inat_data.length; j++) {
    var tag = "#" + inat_data[j];
    $(tag).html('');

    if (inat_data[j] == "photos") {
      for (var k = 0; k < observations[index]["photos"].length; k++) {
        $(tag).append('<img src="' + observations[index]["photos"][k].url + '"/>');
      }
    } else {
      $(tag).html(observations[index][inat_data[j]]);
    }
  }
};

var drawArches = function drawArches() {
  var sceneEl = document.querySelector('a-scene');
  var numArch = 10;
  var rotationLvl = Math.PI * 2 / numArch;

  for (var i = 0; i < numArch; i++) {
    var d = [];

    for (var j = i; j < observations.length; j += numArch) {
      d.push(j);
    }

    var schema = {
      rotation: rotationLvl * i,
      cards: d
    };
    var entityEl = document.createElement('a-entity');
    entityEl.setAttribute('arch', schema);
    sceneEl.appendChild(entityEl);
  }

  var trelisEl = document.createElement('a-entity');
  trelisEl.setAttribute('trelis', {
    numArch: 13
  });
  sceneEl.appendChild(trelisEl);
};

function setup() {
  $('#close,#overlay-container').on("click", function () {
    hideObservationCard();
  });
  $('#overlay').on("click", function (e) {
    e.preventDefault();
    return false;
  }); // sample data
  // for(var k = 0; k < 500; k++){
  //   observations.push({val: k});
  // }
  // real data

  var getData = search.airtableSearch(observations);
  getData.then(function (d) {
    console.log(d);
    drawArches(); // shp("wwf_terr_ecos").then(async (geojson) => {
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

},{"./entities.js":1,"./search.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.airtableSearch = airtableSearch;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function search(_x) {
  return _search.apply(this, arguments);
}

function _search() {
  _search = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(observations) {
    var searchPromise;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            searchPromise = new Promise( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        $.ajax({
                          url: "https://api.inaturalist.org/v1/observations?photos=true&project_id=97146&order=desc&order_by=created_at",
                          success: function success(data) {
                            observations = data.results;
                            resolve();
                          }
                        });

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3, _x4) {
                return _ref.apply(this, arguments);
              };
            }());
            return _context2.abrupt("return", searchPromise);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _search.apply(this, arguments);
}

function airtableSearch(_x2) {
  return _airtableSearch.apply(this, arguments);
}

function _airtableSearch() {
  _airtableSearch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(observations) {
    var airtablePromise;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            airtablePromise = new Promise(function (resolve, reject) {
              $.ajax({
                url: "https://api.airtable.com/v0/appIRHtaHUcrpPCvK/Observation?api_key=keyQSVeKTIgDnDvgT",
                success: function success(data) {
                  for (var i = 0; i < data.records.length; i++) {
                    observations.push(data.records[i].fields);
                  }

                  resolve(observations);
                }
              });
            });
            return _context3.abrupt("return", airtablePromise);

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _airtableSearch.apply(this, arguments);
}

},{}]},{},[2]);
