function initMap(loc) {
  const localsky = loc ? loc : { lat: 20.891111, lng: -156.504722 };
  // const localsky = loc;

  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: localsky,
      pov: {
        heading: 34,
        pitch: 10,
      },
      addressControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER,
      },
      linksControl: false,
      panControl: false,
      enableCloseButton: false,
      zoomControl: false,
      addressControl: false,
      motionTrackingControl: true,
      fullscreenControl: false,
      showRoadLabels: false,

    }
  );

}

export {initMap}
