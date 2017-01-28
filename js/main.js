/**
 * This is the main script of the application. We are using RequireJS to 
 * manage dependencies.
 */

// App's contants
var GOOGLE_MAPS_KEY = 'AIzaSyDTxQG4TxbzI9ueOIftlsiSmUVvJNyD2VQ';
var INSTRAGRAM_API = 'http://localhost:3000/api/';

// The dependencies config. We tell where vendor dependencies are stored.
requirejs.config({
  shim : {
    'bootstrap': { 'deps':['jquery'] }
  },
  paths: {
    async: '../bower_components/requirejs-plugins/src/async',
    async: '../bower_components/requirejs-plugins/src/async',
    knockout: '../bower_components/knockout/dist/knockout',
    jquery: '../bower_components/jquery/dist/jquery.min',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
    underscore: '../bower_components/underscore/underscore-min'
  }
});

// A general error callback, in case of any dependency could not be loaded.
// This callback should only be called if the Google Maps API is not available.
requirejs.onError = function(error) {
  // This error manipulates the DOM directly, because this is called if the 
  // dependencies could not be loaded (ie. not jQuery nor Knockout).
  if (error.toString().includes('googleapis')) {
    document.getElementById('map').innerHTML='<h3>It was not possible to load '+
      'the Google Maps API. Probably it was due to a connection problem. ' + 
      'Please check your connection and try again.</h3>';
  } else { // Maybe, it's another error, so display a generic error message
    document.getElementById('map').innerHTML = "<h3>An error occurred while " + 
      "trying to load some app's dependencies. Probably it's a connection " + 
      "problem. Please, check your connection and try again.";
  }
};

// The application itself starts here
requirejs([
  'bootstrap', 
  'async!https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_KEY,
  'jquery',
  'map',
  'model',
  ], function(bootstrap, gmaps, $, Map, PointsOfInterestModel) {
    // We instantiate a map and initialize it
    var map = new Map();
    map.init(); // The initialization must happen here, because, the GMap is 
                // already loaded.

    // Init the UI model and link it with the map
    // The model is responsible for representing the UI state and changing it.
    var model = new PointsOfInterestModel(map);

    // An utility function called whenever a marker is selected
    function selectPointOfInterest(point) {
      // We clean the picture gallery
      model.setPictures([]);
      model.setSelectedPointOfInterest(point); // Set the selected pi

      // We add a callback to unset the selected marker when the dialog is closed
      $("#galleryModal").on("hidden.bs.modal", function () {
        model.setSelectedPointOfInterest(null);
      });

      // This function is called if the image server could not be reached
      function handleError() {
        $('#galleryModal').modal('hide');
        model.displayError('Could not connect to the pictures server. ' + 
                           'Please check your connection and try again.');        
      }

      // Perform an AJAX request to retrieve the marker's images
      $.ajax({
        url: INSTRAGRAM_API + point.instagram,
        dataType: 'json',
        type: 'GET',
        success: function(data) { // In case the server returned data
          if (data.status === 'error') { // This data still can be an error
            handleError(); // So, let's handle this error
          } else { // If everything is fine
            model.setPictures(data.items); // Let's display the pictures
          }
        },
        error: handleError // Errors can happen
      });
    };

    // Now that we have a pretty selectMarker function, let's call it when

    // The user clicks on a marker
    map.setMarkersClickListener(function(pointOfInterest) {
      selectPointOfInterest(pointOfInterest);
    });

    // The user clicks on a point of interest (that list on the left side)
    model.onClickOnPointsOfInterest(function(pointOfInterest) {
      selectPointOfInterest(pointOfInterest);
    });
  }
);
