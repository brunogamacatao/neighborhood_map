/**
 * This module represents that app's data.
 */

define([], function() {
  /**
   * Our application data is an array of points of interest, each one of those
   * points contains a name, a geographic position (latitude and longitude) and
   * an Instragram username.
   */
  var pointsOfInterest = [
    {
      name: 'Picanha 200',
      position: {lat: -7.2146246, lng: -35.8793719},
      instagram: 'picanha200'
    },
    {
      name: 'Tabua de Carne',
      position: {lat: -7.2074555, lng: -35.8774411},
      instagram: 'tabuadecarnerest'
    },
    {
      name: 'Villa Chopp',
      position: {lat: -7.2126535, lng: -35.879384},
      instagram: 'villachoppcg'
    },
    {
      name: 'La Suissa',
      position: {lat: -7.2214683, lng: -35.8868872},
      instagram: 'lasuissa'
    },
    {
      name: 'Campina Grill',
      position: {lat: -7.1999168, lng: -35.8791087},
      instagram: 'campinagrill'
    },
    {
      name: 'Boi & Brasa',
      position: {lat: -7.2164849, lng: -35.8807736},
      instagram: 'boiebrasacampinagrande'
    },
  ];

  return {
    pointsOfInterest: pointsOfInterest
  };
});