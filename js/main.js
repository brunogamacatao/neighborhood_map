var pointsOfInterest = [
  {
    name: 'Picanha 200',
    position: {lat: -7.2146246, lng: -35.8793719}
  },
  {
    name: 'Tabua de Carne',
    position: {lat: -7.2074555, lng: -35.8774411}
  },
  {
    name: 'Villa Chopp',
    position: {lat: -7.2126535, lng: -35.879384}
  },
  {
    name: 'La Suissa',
    position: {lat: -7.2214683, lng: -35.8868872}
  },
  {
    name: 'Campina Grill',
    position: {lat: -7.1999168, lng: -35.8791087}
  },
  {
    name: 'Boi & Brasa',
    position: {lat: -7.2164849, lng: -35.8807736}
  },
];

var map = null;
var markers = [];

/*
 * This function will be loaded automatically when Google Maps api finished 
 * loading.
 */
function initMap() {
  var campinaGrande = {lat: -7.2146481, lng: -35.8703679};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: campinaGrande
  });

  for (var i = 0; i < pointsOfInterest.length; i++) {
    markers[i] = new google.maps.Marker({
      title: pointsOfInterest[i].name,
      position: pointsOfInterest[i].position,
      map: map,
    });
  }
}

function PointsOfInterestModel() {
  this.pointsOfInterest = ko.observableArray(pointsOfInterest.slice());
  this.filter = ko.observable("");

  this.filterPointsOfInterest = function() {
    this.pointsOfInterest.removeAll();

    for (var i = 0; i < pointsOfInterest.length; i++) {
      if (pointsOfInterest[i].name.toLowerCase().includes(this.filter().toLowerCase())) {
        this.pointsOfInterest.push(pointsOfInterest[i]);
        markers[i].setMap(map);
      } else {
        markers[i].setMap(null);
      }
    }
  };
}

ko.applyBindings(new PointsOfInterestModel());