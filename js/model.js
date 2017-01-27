/**
 * This module defines the model (according to the MVC architecture). A model 
 * should represent the UI state, and should proxy the communication between
 * the UI and the other parts of the system.
 */

define(['knockout', 'data', 'underscore', 'jquery'], function(ko, data, _, $) {
  // The number of columns to display in the pictures gallery
  var GALLERY_COLS = 4;
  // A workaround to access the correct this in nested click bindings
  var that = null;

  /**
   * Constructor of the PointsOfInterestModel class.
   * An PointsOfInterestModel object contains the following attributes:
   * - app: a reference to the map module;
   * - pointsOfInterest: an observable array of points of interest;
   * - filter: an observable string of the typed filter;
   * - pictures: an observable array of pictures;
   * - selectedPictureUrl: an observable string of the selected picture URL;
   * - selectedPictureCaption: an observable string of the selected picture caption;
   * - errorMessage: an observable string of the error message;
   * - selectedMarker: a reference to the selected marker.
   *
   * The observable values are very important, because they are double binded
   * with the view. Every change made to then at the view, are reflected in the
   * model and vice-versa.
   */
  var PointsOfInterestModel = function(map) {
    that = this;
    this.map = map;
    this.pointsOfInterest = ko.observableArray(data.pointsOfInterest.slice());
    this.filter = ko.observable("");
    this.pictures = ko.observableArray();
    this.selectedPictureUrl = ko.observable("");
    this.selectedPictureCaption = ko.observable("");
    this.errorMessage = ko.observable("");
    this.selectedMarker = null;

    ko.applyBindings(this);
  };

  // An utility function to check if a substring if contained in a string, 
  // ingonring the case. This is used by the filter.
  function containsIgnoreCase(str, substr) {
    if (str === null || str === undefined || substr === null || substr === undefined) {
      return false;
    }

    return str.toLowerCase().includes(substr.toLowerCase());
  }

  /**
   * This method is called when the filter button in clicked, it filters the
   * points of interest displayed, both in the map and in the list.
   */
  PointsOfInterestModel.prototype.filterPointsOfInterest = function() {
    this.pointsOfInterest.removeAll(); // Remove all the points from the list

    _.each(data.pointsOfInterest, function(pi, i) {
      if (containsIgnoreCase(pi.name, this.filter())) { // If the names match
        this.pointsOfInterest.push(pi); // Add the point to the list
        this.map.showMarker(i); // Display the marker
      } else { // if the names does not match
        this.map.hideMarker(i); // Hide the marker
      }
    }.bind(this));
  };

  /**
   * This method is called when a maker (or point of interest) is clicked. It
   * sets up the image data to be displayed by the gallery dialog. The image
   * should be organized in rows, as the CSS components that are being used 
   * require that divs containing at most four thumbnail elements are created.
   */
  PointsOfInterestModel.prototype.setPictures = function(pictures) {
    this.pictures.removeAll(); // clean the pictures array
    var row = []; // create an empty row array

    _.each(pictures, function(p, i) {
      if ((i > 0) && (i % GALLERY_COLS == 0)) { // if we already filled a row
        this.pictures.push({row: row}); // add this row to the pictures array
        row = []; // initializes a new row
      }

      p.index = i; // this index is important for further identification
      row.push(p); // add this picture to the current row
    }.bind(this));

    if (row.length > 0) { // If there's an incomplete row left
      this.pictures.push({row: row}); // Add it to the gallery
    }
  };

  /**
   * This method is called when a picture of the gallery if clicked.
   * It will gather the information necessary to display the picture modal.
   */
  PointsOfInterestModel.prototype.displayPicture = function(pictureIndex) {
    // By the picture index, we could know it's row and column
    var row = Math.floor(pictureIndex / GALLERY_COLS);
    var col = pictureIndex % GALLERY_COLS;

    // and, access the picture itself
    var picture = this.pictures()[row].row[col];

    // sets the state so the picture dialog can show it
    this.selectedPictureUrl(picture.images.standard_resolution.url);
    this.selectedPictureCaption(picture.caption.text);
  };

  /**
   * Method called to display a fancy error modal dialog.
   */
  PointsOfInterestModel.prototype.displayError = function(errorMessage) {
    this.errorMessage(errorMessage);
    $('#errorModal').modal('show');
  };

  /**
   * This method sets the selected marker and animates it (a cool bouncing 
   * animation). If there's a previously selected marker, it's animation is 
   * stopped.
   */
  PointsOfInterestModel.prototype.setSelectedMarker = function(marker) {
    if (this.selectedMarker) {
      this.selectedMarker.setAnimation(null);
    }

    this.selectedMarker = marker;

    if (this.selectedMarker) {
      this.selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  /**
   * Method called when a point of interest is clicked. It will trigger the call
   * of onClickOnPointsOfInterestCallback if it is defined.
   */
  PointsOfInterestModel.prototype.clickOnPointsOfInterest = function(pi) {
    if (that.onClickOnPointsOfInterestCallback) {
      var idx = _.indexOf(data.pointsOfInterest, pi);
      that.onClickOnPointsOfInterestCallback(pi, idx);
    }
  };

  /**
   * A method to set the onClickOnPointsOfInterestCallback. So, Whenever a point
   * of interest is clicked, this callback will be triggered. 
   */
  PointsOfInterestModel.prototype.onClickOnPointsOfInterest = function(callback) {
    this.onClickOnPointsOfInterestCallback = callback;
  };

  return PointsOfInterestModel;
});