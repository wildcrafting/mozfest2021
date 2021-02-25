/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	    throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * Asset OnDemand component for A-Frame.
	 */
	AFRAME.registerComponent('asset-on-demand', {

	    schema: {
	        src: {
	            default: '',
	            type: 'string'
	        },
	        type: {
	            default: 'img',
	            oneOf: [
	            'img', 'audio', 'video'
	            ]
	        },
	        attributes: {
	            default: '',
	            parse: function (value) {
	                return value.split(",").map(function (item) {
	                    return item.split(":");
	                });
	            }
	        },
	        component: {
	            default: 'material',
	            type: 'string'
	        },
	        componentattr: {
	            default: '',
	            parse: function(value) {
	                var kvPair = null;

	                if (value != '') {
	                    var pairs = value.split(",");

	                    kvPair = pairs && pairs.length > 0 ? {} : null;

	                    for (var i=0; i < pairs.length; i++) {
	                        var tmpArr = pairs[i].split(":");
	                        kvPair[tmpArr[0]] = tmpArr[1];
	                    }
	                }

	                return kvPair;
	            }
	        },
	        assetattr: {
	            default: 'src',
	            type: 'string'
	        },
	        fallback: {
	            default: '',
	            type: 'asset'
	        },
	        addevent: {
	            default: 'play',
	            type: 'array'
	        },
	        removeevent: {
	            default: 'pause',
	            type: 'array'
	        },
	        softmode: {
	            default: false,
	            type: 'boolean'
	        }
	    },

	    multiple: false,

	    init: function () {

	        this.attachAsset = this.attachAsset.bind(this);
	        this.detachAsset = this.detachAsset.bind(this);
	        this.reloadAsset = this.reloadAsset.bind(this);
	        this.loadAsset = this.loadAsset.bind(this);

	        this.assetID = this.guid();

	        // Create Asset Element
	        var assetBucket = document.querySelector("a-assets");
	        var asset = document.createElement(this.data.type);
	        this.assetElement = assetBucket.appendChild(asset);
					this.assetElement.crossOrigin = 'anonymous';
	        // Set Asset Element Attributes
	        if (this.data.attributes && this.data.attributes != '' && this.data.attributes.length > 0) {
	            for (var i = 0; i < this.data.attributes.length; i++) {
	                this.assetElement.setAttribute(this.data.attributes[i][0], this.data.attributes[i][1]);
	            }
	        }

	        // Set Asset id
	        this.assetElement.setAttribute("id", this.assetID);
	    },

	    update: function (oldData) {

	        this.componentObj = {};

	        if (this.data.componentattr) {
	            this.componentObj = this.data.componentattr;
	        }

	        // Remove previously added EventListeners
	        if (oldData && (oldData.addevent && oldData.removeevent)) {
	            this.removeEventListeners(oldData);
	        }

	        this.addEventListeners();

	        // Attach the Fallback/Default-Asset
	        this.attachDefault();

	        // If softmode - already set the source to load the asset
	        if (this.data.softmode) {
	            this.assetElement.setAttribute("src", this.data.src);
	        }

	    },

	    addEventListeners: function () {
	        // Add Attach-EventListeners
	        for (var i = 0; i < this.data.addevent.length; i++) {
	            this.el.addEventListener(this.data.addevent[i], this.loadAsset);
	        }

	        // Add Detach-EventListeners
	        for (var i = 0; i < this.data.removeevent.length; i++) {
	            this.el.addEventListener(this.data.removeevent[i], this.detachAsset);
	        }
	    },

	    removeEventListeners: function(oldData) {
	        for (var i = 0; i < oldData.addevent.length; i++) {
	            this.el.removeEventListener(oldData.addevent[i], this.loadAsset);
	        }

	        for (var i = 0; i < oldData.removeevent.length; i++) {
	            this.el.removeEventListener(oldData.removeevent[i], this.detachAsset);
	        }
	    },

	    remove: function () {

	        // Remove EventListeners
	        for (var i = 0; i < this.data.addevent.length; i++) {
	            this.el.removeEventListener(this.data.addevent[i], this.loadAsset);
	        }

	        for (var i = 0; i < this.data.removeevent.length; i++) {
	            this.el.removeEventListener(this.data.removeevent[i], this.detachAsset);
	        }

	        // TODO: What is the expected behaviour? Remove the Source or not?
	        //this.detachAsset();
	    },

	    loadAsset: function () {

	        // Load the Asset (if not previously done
	        if (!this.data.softmode) {
	            this.assetElement.setAttribute("src", this.data.src);
	        }

	        // Attach the Asset after Loading
	        if (this.assetElement.complete) {
	            this.attachAsset();
	        } else {
	            this.assetElement.addEventListener("load", this.attachAsset);
	            this.assetElement.addEventListener("error", this.reloadAsset);
	        }
	    },

	    attachAsset: function () {
	        // Attach the Asset
	        this.componentObj[this.data.assetattr] = "#" + this.assetID;

	        this.attach();
	    },

	    detachAsset: function () {

	        // Completely remove Asset when not in softmode
	        if (this.assetElement && !this.data.softmode) {
	            this.assetElement.removeEventListener("load", this.attachAsset);
	            this.assetElement.removeEventListener("error", this.reloadAsset);
	            this.assetElement.setAttribute("src", "");
	        }

	        // Force THEE.JS to wipe out that texture of the memory
	        if (this.el.object3DMap.mesh.material.map) {
	            this.el.object3DMap.mesh.material.map.dispose();
	        }

	        // Remove the Component
	        // this.el.removeAttribute(this.data.component);

	        // Attach the default
	        this.attachDefault();

	    },

	    attachDefault: function () {
	        // Attach the default entity
	        if (this.data.fallback != '') {
	            this.componentObj[this.data.assetattr] = this.data.fallback;
	        }
	        this.attach();
	    },

	    attach: function() {
	        if (this.componentObj && Object.keys(this.componentObj).length > 0) {
	            AFRAME.utils.entity.setComponentProperty(this.el, this.data.component, this.componentObj);
	        }
	    },

	    reloadAsset: function () {

	        // Detach Asset and try again in 1 Second
	        this.detachAsset();
	        window.setTimeout(this.loadAsset, 1000);

	    },

	    guid: function () {
	        return "a" + this.guidPart() + this.guidPart() + '-' + this.guidPart() + '-' + this.guidPart() + '-' +
	            this.guidPart() + '-' + this.guidPart() + this.guidPart() + this.guidPart();
	    },

	    guidPart: function () {
	        return Math.floor((1 + Math.random()) * 0x10000)
	            .toString(16)
	            .substring(1);
	    }
	});


/***/ }
/******/ ]);
