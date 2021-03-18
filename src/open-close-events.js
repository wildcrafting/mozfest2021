
  var splashScreen = () => {
    //on page load, start splash screen
    $("#intro-1 #intro-2").css("display", "flex").hide();
    $("#intro-1").delay(6000).fadeIn(1000);
    $("#wordmark").fadeIn(1000).delay(3000).fadeOut(1000);
    //after 5s, fade out title, fade in instructions, load gmaps in bg


    //after clicking button, fade element
    $("#next-1").click(function() {
      $("#intro-1").fadeOut(1000);
      $("#intro-2").delay(1500).fadeIn(1000);
    });

    //after clicking button, fade element
    $("#next-2").click(function() {
      $(".loading-bg").fadeOut(1000);
    });

  }

  export {splashScreen}
