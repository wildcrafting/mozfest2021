
  var splashScreen = () => {
    // //on page load, start splash screen
    $("#wordmark").delay(3000).fadeIn(1000).delay(3000).fadeOut(1000);
    //after 5s, fade out title, fade in instructions, load gmaps in bg
    $("#intro-1").css("display", "flex").hide().delay(8500).fadeIn(1000);

    //after clicking button, fade element
    $("#next").click(function() {
      $(".loading-bg").fadeOut(1000);
    });

  }

  export {splashScreen}
