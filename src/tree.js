import * as d3 from "d3";
import p5 from 'p5';

// https://d3js.org/d3-quadtree/ v2.0.0 Copyright 2020 Mike Bostock
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i((t=t||self).d3=t.d3||{})}(this,function(t){"use strict";function i(t,i,n,e){if(isNaN(i)||isNaN(n))return t;var r,s,h,o,a,u,l,_,f,c=t._root,x={data:e},y=t._x0,d=t._y0,v=t._x1,p=t._y1;if(!c)return t._root=x,t;for(;c.length;)if((u=i>=(s=(y+v)/2))?y=s:v=s,(l=n>=(h=(d+p)/2))?d=h:p=h,r=c,!(c=c[_=l<<1|u]))return r[_]=x,t;if(o=+t._x.call(null,c.data),a=+t._y.call(null,c.data),i===o&&n===a)return x.next=c,r?r[_]=x:t._root=x,t;do{r=r?r[_]=new Array(4):t._root=new Array(4),(u=i>=(s=(y+v)/2))?y=s:v=s,(l=n>=(h=(d+p)/2))?d=h:p=h}while((_=l<<1|u)==(f=(a>=h)<<1|o>=s));return r[f]=c,r[_]=x,t}function n(t,i,n,e,r){this.node=t,this.x0=i,this.y0=n,this.x1=e,this.y1=r}function e(t){return t[0]}function r(t){return t[1]}function s(t,i,n){var s=new h(null==i?e:i,null==n?r:n,NaN,NaN,NaN,NaN);return null==t?s:s.addAll(t)}function h(t,i,n,e,r,s){this._x=t,this._y=i,this._x0=n,this._y0=e,this._x1=r,this._y1=s,this._root=void 0}function o(t){for(var i={data:t.data},n=i;t=t.next;)n=n.next={data:t.data};return i}var a=s.prototype=h.prototype;a.copy=function(){var t,i,n=new h(this._x,this._y,this._x0,this._y0,this._x1,this._y1),e=this._root;if(!e)return n;if(!e.length)return n._root=o(e),n;for(t=[{source:e,target:n._root=new Array(4)}];e=t.pop();)for(var r=0;r<4;++r)(i=e.source[r])&&(i.length?t.push({source:i,target:e.target[r]=new Array(4)}):e.target[r]=o(i));return n},a.add=function(t){const n=+this._x.call(null,t),e=+this._y.call(null,t);return i(this.cover(n,e),n,e,t)},a.addAll=function(t){var n,e,r,s,h=t.length,o=new Array(h),a=new Array(h),u=1/0,l=1/0,_=-1/0,f=-1/0;for(e=0;e<h;++e)isNaN(r=+this._x.call(null,n=t[e]))||isNaN(s=+this._y.call(null,n))||(o[e]=r,a[e]=s,r<u&&(u=r),r>_&&(_=r),s<l&&(l=s),s>f&&(f=s));if(u>_||l>f)return this;for(this.cover(u,l).cover(_,f),e=0;e<h;++e)i(this,o[e],a[e],t[e]);return this},a.cover=function(t,i){if(isNaN(t=+t)||isNaN(i=+i))return this;var n=this._x0,e=this._y0,r=this._x1,s=this._y1;if(isNaN(n))r=(n=Math.floor(t))+1,s=(e=Math.floor(i))+1;else{for(var h,o,a=r-n||1,u=this._root;n>t||t>=r||e>i||i>=s;)switch(o=(i<e)<<1|t<n,(h=new Array(4))[o]=u,u=h,a*=2,o){case 0:r=n+a,s=e+a;break;case 1:n=r-a,s=e+a;break;case 2:r=n+a,e=s-a;break;case 3:n=r-a,e=s-a}this._root&&this._root.length&&(this._root=u)}return this._x0=n,this._y0=e,this._x1=r,this._y1=s,this},a.data=function(){var t=[];return this.visit(function(i){if(!i.length)do{t.push(i.data)}while(i=i.next)}),t},a.extent=function(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]},a.find=function(t,i,e){var r,s,h,o,a,u,l,_=this._x0,f=this._y0,c=this._x1,x=this._y1,y=[],d=this._root;for(d&&y.push(new n(d,_,f,c,x)),null==e?e=1/0:(_=t-e,f=i-e,c=t+e,x=i+e,e*=e);u=y.pop();)if(!(!(d=u.node)||(s=u.x0)>c||(h=u.y0)>x||(o=u.x1)<_||(a=u.y1)<f))if(d.length){var v=(s+o)/2,p=(h+a)/2;y.push(new n(d[3],v,p,o,a),new n(d[2],s,p,v,a),new n(d[1],v,h,o,p),new n(d[0],s,h,v,p)),(l=(i>=p)<<1|t>=v)&&(u=y[y.length-1],y[y.length-1]=y[y.length-1-l],y[y.length-1-l]=u)}else{var w=t-+this._x.call(null,d.data),N=i-+this._y.call(null,d.data),g=w*w+N*N;if(g<e){var A=Math.sqrt(e=g);_=t-A,f=i-A,c=t+A,x=i+A,r=d.data}}return r},a.remove=function(t){if(isNaN(s=+this._x.call(null,t))||isNaN(h=+this._y.call(null,t)))return this;var i,n,e,r,s,h,o,a,u,l,_,f,c=this._root,x=this._x0,y=this._y0,d=this._x1,v=this._y1;if(!c)return this;if(c.length)for(;;){if((u=s>=(o=(x+d)/2))?x=o:d=o,(l=h>=(a=(y+v)/2))?y=a:v=a,i=c,!(c=c[_=l<<1|u]))return this;if(!c.length)break;(i[_+1&3]||i[_+2&3]||i[_+3&3])&&(n=i,f=_)}for(;c.data!==t;)if(e=c,!(c=c.next))return this;return(r=c.next)&&delete c.next,e?(r?e.next=r:delete e.next,this):i?(r?i[_]=r:delete i[_],(c=i[0]||i[1]||i[2]||i[3])&&c===(i[3]||i[2]||i[1]||i[0])&&!c.length&&(n?n[f]=c:this._root=c),this):(this._root=r,this)},a.removeAll=function(t){for(var i=0,n=t.length;i<n;++i)this.remove(t[i]);return this},a.root=function(){return this._root},a.size=function(){var t=0;return this.visit(function(i){if(!i.length)do{++t}while(i=i.next)}),t},a.visit=function(t){var i,e,r,s,h,o,a=[],u=this._root;for(u&&a.push(new n(u,this._x0,this._y0,this._x1,this._y1));i=a.pop();)if(!t(u=i.node,r=i.x0,s=i.y0,h=i.x1,o=i.y1)&&u.length){var l=(r+h)/2,_=(s+o)/2;(e=u[3])&&a.push(new n(e,l,_,h,o)),(e=u[2])&&a.push(new n(e,r,_,l,o)),(e=u[1])&&a.push(new n(e,l,s,h,_)),(e=u[0])&&a.push(new n(e,r,s,l,_))}return this},a.visitAfter=function(t){var i,e=[],r=[];for(this._root&&e.push(new n(this._root,this._x0,this._y0,this._x1,this._y1));i=e.pop();){var s=i.node;if(s.length){var h,o=i.x0,a=i.y0,u=i.x1,l=i.y1,_=(o+u)/2,f=(a+l)/2;(h=s[0])&&e.push(new n(h,o,a,_,f)),(h=s[1])&&e.push(new n(h,_,a,u,f)),(h=s[2])&&e.push(new n(h,o,f,_,l)),(h=s[3])&&e.push(new n(h,_,f,u,l))}r.push(i)}for(;i=r.pop();)t(i.node,i.x0,i.y0,i.x1,i.y1);return this},a.x=function(t){return arguments.length?(this._x=t,this):this._x},a.y=function(t){return arguments.length?(this._y=t,this):this._y},t.quadtree=s,Object.defineProperty(t,"__esModule",{value:!0})});

function Leaf(p, pos, isContent, contentIndex) {
  this.pos = pos || p.createVector(p.random(p.width), p.random(p.height));
  this.reached = false;
  this.age = 100;
  this.content = isContent;
  this.contentIndex = contentIndex;
  // this.nutrient = nutrientScape.getNutrientAt(this.pos.x, this.pos.y)

  this.show = function() {
      p.fill(0);
      p.ellipse(this.pos.x, this.pos.y, 2, 2)
  }
}

function Branch(p, parent, pos, direction, id) {
  this.pos = pos;
  this.parent = parent;
  this.dir = direction;
  this.origDir = this.dir.copy();
  this.count = 0;
  this.len = 1;
  this.id = id;
  this.children = {};
  this.lifeforce = 1;
  this.radius = .5;
  this.lastDist = 0;
  this.color = 50;

  this.reset = function(){
    this.dir = this.origDir.copy();
    this.count = 0;
  }

  this.next = function(id){
    var nextDir = p5.Vector.mult(this.dir, this.len)
    var nextPos = p5.Vector.add(this.pos, nextDir);
    var next = new Branch(p, this, nextPos, this.dir.copy(), id);
    this.children[id] = next;
    // this.lifeforce += nutrientScape.getNutrientAt(nextPos.x, nextPos.y);
    return next;
  }

  this.show = function() {
    if(this.parent != null){
      this.reset();
      var c = this.color;
      if(!(Object.keys(this.children).length === 0)){
        var r = 0;
        for(var ch in this.children){
          r +=  Math.pow(this.children[ch].radius, 1);
          if(this.children[ch].color < c){
            c = this.children[ch].color;
          }
        }
        this.radius = 0.5;

        this.color = c;

      }
      p.strokeWeight(Math.min(this.radius, 7));
      p.stroke(this.color)
      p.line(this.pos.x,this.pos.y, this.parent.pos.x, this.parent.pos.y)
    } else {
      // p.fill(0)
      // p.ellipse(this.pos.x,this.pos.y, 5, 5)
    }
  }

  this.getPos = function(){
    return this.pos;
  }
}


function Tree(p) {
  var thisObj = this;
  var min_dist = 10;

  this.leaves = [];
  this.branches = d3.quadtree()
    .x(function(d){return d.pos.x;})
    .y(function(d){return d.pos.y;});

  this.branchArr = [];
  this.generations = [];
  this.age = 0;
  this.message = "hi";
  this.reachedContent = [];
  this.sColor = d3.scalePow([0, 11], [0, 1]).exponent(2);
  this.root;

  // var loc = [[p.width-50, p.height-50], [50, 50], [p.width-50, 50], [50, p.height-50]];
  var loc = [[p.width/2, p.height/2]];
  for(var t = 0; t < loc.length;t++){
    thisObj.root = new Branch(p, null, p.createVector(loc[t][0], loc[t][1]), p.createVector(0, -1), t);
    console.log(thisObj.root)
    this.branches.add(this.root);
    this.branchArr.push(this.root);
  }

  // for(var i = 0; i < nutrientScape.contentPoints.length; i++){
  //   this.leaves.push(new Leaf(p, p.createVector(nutrientScape.contentPoints[i][0], nutrientScape.contentPoints[i][1]), true, i));
  // }

  this.genLeaves = function(radius, angle){

      var neg1 = Math.random() >= .5? -1: 1;
      var neg2 = Math.random() >= .5? -1: 1;

      for(var i = 0; i < 40; i++){
        var ang = (Math.random() * -.5) + .25 + angle;
        var x = (((100 * Math.random()) + (radius-130)) * cos(ang)) + p.width/2;
        var y = (((100 * Math.random()) + (radius-130)) * sin(ang)) + p.height/2;
        this.leaves.push(new Leaf(p, p.createVector(x, y)));
      }
  }


  this.grow = function() {

    var reached = [];
    var closestBranches = {};
    //
    // console.log(this.leaves.length)
    for(var i = 0; i < this.leaves.length; i++){
      var leaf = this.leaves[i];
      var closest = this.branches.find(leaf.pos.x, leaf.pos.y);
      var d = 1000;

      if(closest){
        var newDir = p5.Vector.sub(leaf.pos, closest.pos);
        newDir.normalize()
        closest.dir.add(newDir)
        closest.count++;
        closestBranches[closest.id] = closest;

        var d = p5.Vector.dist(closest.pos, leaf.pos);
      }
      if(((!leaf.content && (leaf.age < 1)) || d <= min_dist)){
        if(leaf.content){
          if(!leaf.reached && tutorial) { tutorial.placeContent(leaf.contentIndex); }
          leaf.reached = true;
        } else {
          reached.push(i);
        }
        if(d <= min_dist){
          if(!isNaN(leaf.nutrient)){
            closest.color = this.sColor(leaf.nutrient+2);
          }
        }
      }
      // leaf.age--;
    }

    for(var j = reached.length-1; j > 0; j--){
      this.leaves.splice(reached[j], 1);
    }

    for(var br in closestBranches){
      var branch = closestBranches[br];
      branch.dir.div(branch.count);
        var len = this.branchArr.length;
        var child = branch.next(len);
        // console.log(abs(branch.dir.x) + abs(branch.dir.y));
        // console.log(child.pos);
        this.branches.add(child);
        this.branchArr.push(child)


    }

    var toRemove = [];

  }

  this.show = function(){
    for(var i = 0; i < this.branchArr.length; i++){
      this.branchArr[i].show();
    }
    // for(var i = 0; i < this.leaves.length; i++){
    //   this.leaves[i].show();
    // }
  }

}

export {Tree}
