var defaultMaterial = new THREE.MeshStandardMaterial({color: 0x331a00});
var radius = 3;

AFRAME.registerComponent('card', {
  schema: {
    position: {default: {x: 0, y: 0, z:0}, type: 'vec3'},
    index: {default: 0, type: 'number' }
  },

  init: function () {
    var el = this.el;
    var self = this;
    // Create geometry.
    this.geometry = new THREE.PlaneGeometry(.1, .2, 32)
    this.material = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide});

    // Create mesh.
    this.mesh = new THREE.Mesh(this.geometry);
    el.setObject3D('mesh', this.mesh);
    el.object3D.position.set(this.data.position.x +.005, this.data.position.y - .25, this.data.position.z);

    // iNaturalist doesn't allow crossorigin = anonymous/CORS, so we can't use them as a texture
    // https://stackoverflow.com/questions/34826748/issue-with-crossorigin-anonymous-failing-to-load-images
    // https://hacks.mozilla.org/2011/11/using-cors-to-load-webgl-textures-from-cross-domain-images/
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#what_requests_use_cors
    // if(observations[self.data.index].photos){
    //   var schema = {src: observations[self.data.index].photos[0].url, softmode: true}
    //   this.el.crossOrigin = 'anonymous';
    //   this.el.setAttribute('asset-on-demand', schema)
    // }

    el.object3D.lookAt(0, 2, 0)
    // this.el.object3D.rotation.y ;
    el.addEventListener('mouseenter', function () {
      el.object3D.scale.copy({x: 2.5, y: 2.5, z:2.5});
    });
    el.addEventListener('mouseleave', function () {
      el.object3D.scale.copy({x: 1, y: 1, z:1});
    });
    this.el.addEventListener('click', function () {
      displayObservationCard(self.data.index);
      el.setAttribute('animation', 'property: position; to: 0 0 0');
    });
  }
});
AFRAME.registerComponent('trelis', {
  schema: {
    numArch: {type: 'number', default: 0}
  },

  init: function () {
    const circleRadius = .005;
    const group = new THREE.Group();
    const extrudeSettings = { amount: radius+.5, bevelEnabled: false };
    const rotationAmount = ((Math.PI * 2) / this.data.numArch);

    for(var i = 0; i < this.data.numArch; i++){
      var circleShape = new THREE.Shape()
        .moveTo( 0, circleRadius )
        .quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 )
        .quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius )
        .quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 )
        .quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );

      var geometry = new THREE.ExtrudeGeometry( circleShape, extrudeSettings );
      var mesh = new THREE.Mesh( geometry, defaultMaterial );

      mesh.rotation.y = rotationAmount * i;
      mesh.position.set(0, .01, 0);

      if(i > 0){
        var geometry = new THREE.TorusGeometry( ((radius/this.data.numArch) * i) + .5, 0.005, 8, 100);
        var torus = new THREE.Mesh( geometry, defaultMaterial );
        torus.rotation.x = Math.PI / 2;
        torus.position.set(0, .01, 0);
        group.add( torus );
      }
      group.add( mesh );

    }
    var geometry = new THREE.TorusGeometry( .6, 0.005, 8, this.data.numArch);
    var torus = new THREE.Mesh( geometry, defaultMaterial );
    torus.rotation.x = Math.PI / 2;
    torus.position.set(0, 2.5, 0);
    // group.add( torus );
    this.el.setObject3D('mesh', group);
  }
});
AFRAME.registerComponent('scale-on-mouseenter', {
  schema: {
    to: {default: {x: 2.5, y: 2.5, z:2.5}, type: 'vec3'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    this.el.addEventListener('click', function () {
      el.object3D.scale.copy(data.to);
    });
  }
});
AFRAME.registerComponent('arch', {
  schema: {
    rotation: {type: 'number', default: 0},
    cards: {type: 'array', default:[]}
  },
  init: function () {
    var h = 2 + (.1 * Math.random());
    const group2 = new THREE.Group();
    const curve = new THREE.EllipseCurve(
      0,  0,            // ax, aY
      radius, radius,           // xRadius, yRadius
      0,  Math.PI,  // aStartAngle, aEndAngle
      false,            // aClockwise
      Math.PI/2                // aRotation
    );

    var points = curve.getPoints( 250 );
    var rootPoints = [];

    for(var j = 0; j < 6; j++){
      rootPoints.push([]);
      var path = "";
      for(var k = 0; k < points.length; k+=1){
        var i = Math.floor(k);
        if(i > 0){
          path += ", ";
        }

        points[i].z = noise(i/20, j, (this.data.rotation*2)) + ((.1 * j) - (2.5 * .1)) + (Math.sin(((j*4*this.data.rotation) + i)/10)*.2);
        // var x = points[i].x + noise(i/5, j, (this.data.rotation*2))/2
        var x = points[i].x;

        path += x  + " " + points[i].y + " " + points[i].z;
        rootPoints[j].push({x: x, y:points[i].y , z: points[i].z});
      }

      var line = document.createElement('a-entity');
      var sch = {lineWidth: 2, path: path, color: "#331a00", lineWidthStyler: "1 - p + .5"};

      line.setAttribute('meshline',sch);
      this.el.appendChild(line);

    }
    for(var i = 0; i < this.data.cards.length; i++){
      // var randomPoint = points[Math.floor(Math.random() * 70) + 10];
      var randomPoint = rootPoints[i%6][Math.floor((i/this.data.cards.length)*100) + 20];
      var cardEl = document.createElement('a-entity');
      var sch = {position: randomPoint, rotation: this.data.rotation, index: this.data.cards[i]};

      cardEl.setAttribute('card', sch);
      this.el.appendChild(cardEl);
    }

    this.el.setAttribute('geometry-merger', {preserveOriginal: false})
    this.el.object3D.rotation.y = this.data.rotation;

  },
});
