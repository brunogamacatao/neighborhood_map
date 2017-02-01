/**
 * This is the map module.
 * This module handle Google Maps API calls.
 */

// This is my hometown
var MY_CITY = {
  center: {lat: -7.1985198, lng: -35.8817803},
  zoom: 14
};

define(['data', 'underscore'], function(data, _) {
  /**
   * Here we define a Map class. 
   * A map contains a reference to the data module, a handler to a GMap object 
   * and an array of markers.
   */
  var Map = function() {
    this.data = data;
    this.map = null;
    this.markers = [];
  };

  /**
   * This method initializes the map and renders it to a div.
   * It also creates markers, for each one of the points of intereset defined on
   * app's data.
   */
  Map.prototype.init = function() {
    this.map = new google.maps.Map(document.getElementById('map'), MY_CITY);

    _.each(this.data.pointsOfInterest, function(pi) {
      pi.marker = new google.maps.Marker({
        title: pi.name,
        position: pi.position,
        map: this.map,
        animation: google.maps.Animation.DROP
      });   
    }.bind(this));
  };

  /**
   * An utility method to display a marker. 
   * @param index The marker index on the markers array.
   */
  Map.prototype.showMarker = function(index) {
    this.data.pointsOfInterest[index].marker.setMap(this.map);
  };

  /**
   * An utility method to hide a marker. 
   * @param index The marker index on the markers array.
   */
  Map.prototype.hideMarker = function(index) {
    this.data.pointsOfInterest[index].marker.setMap(null);
  };

  /**
   * This method add a click listener to all makers. The default GMaps click
   * listener in enhanced to add the point of interest and maker itself as 
   * parameters.
   *
   * The listener function signature should be: (pi, evt), where:
   * pi - The point of intereset
   * evt - The click event
   */
  Map.prototype.setMarkersClickListener = function(listener) {
    _.each(this.data.pointsOfInterest, function(pi) {
      pi.marker.addListener('click', function(event) {
        listener(pi, event);
      }.bind(this));
    }.bind(this));
  };

  return Map;
});