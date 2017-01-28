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

  // Defines a binding handler to show display modals based on an observable 
  // value.
  ko.bindingHandlers.showModal = {
    init: function (element, valueAccessor) {},
    update: function (element, valueAccessor) {
      var value = valueAccessor();
      if (ko.utils.unwrapObservable(value)) {
        $(element).modal('show');
        // this is to focus input field inside dialog
        $('input', element).focus();
      } else {
        $(element).modal('hide');
      }
    }
  };  

  /**
   * Constructor of the PointsOfInterestModel class.
   * An PointsOfInterestModel object contains the following attributes:
   * - app: a reference to the map module;
   * - pointsOfInterest: an observable array of points of interest;
   * - filter: an observable string of the typed filter;
   * - pictures: an observable array of pictures;
   * - selectedPicture.url: an observable string of the selected picture URL;
   * - selectedPicture.caption: an observable string of the selected picture caption;
   * - errorMessage: an observable string of the error message;
   * - selectedPointOfInterest: a reference to the selected point of interest.
   *
   * The observable values are very important, because they are double binded
   * with the view. Every change made to then at the view, are reflected in the
   * model and vice-versa.
   */
  var PointsOfInterestModel = function(map) {
    that = this;
    this.map = map;
    this.filter = ko.observable('');
    this.pictures = ko.observableArray();
    this.errorMessage = ko.observable('');
    this.selectedPicture = {
      url: ko.observable(''),
      caption: ko.observable('')
    };
    this.selectedPointOfInterest = {
      name: ko.observable('')
    };

    this.pointsOfInterest = ko.computed(this.filterPointsOfInterest.bind(this));

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
    // If the filter is empty
    if (!this.filter()) {
      // Show all markers
      _.each(_.range(this.map.markers.length), this.map.showMarker.bind(this.map));
      // Return all the points of interests array
      return data.pointsOfInterest;
    } else {
      return ko.utils.arrayFilter(data.pointsOfInterest, function(point, i) {
        if (containsIgnoreCase(point.name, this.filter())) {
          this.map.showMarker(i); // Display the marker
          return true;
        } else {
          this.map.hideMarker(i); // Hide the marker
          return false;
        }
      }.bind(this));
    }
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
   */
  PointsOfInterestModel.prototype.clickOnPicture = function(picture) {
    // sets the state so the picture dialog can show it
    that.selectedPicture.url(picture.images.standard_resolution.url);
    that.selectedPicture.caption(picture.caption.text);
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
   * animation). If there's a previously selected point, it's animation is 
   * stopped.
   */
  PointsOfInterestModel.prototype.setSelectedPointOfInterest = function(point) {
    if (this.selectedPointOfInterest.marker) {
      this.selectedPointOfInterest.marker.setAnimation(null);
    }

    if (point) {
      this.selectedPointOfInterest.name(point.name);
      this.selectedPointOfInterest.marker = point.marker;
    }

    if (this.selectedPointOfInterest.marker) {
      this.selectedPointOfInterest.marker.setAnimation(google.maps.Animation.BOUNCE);
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