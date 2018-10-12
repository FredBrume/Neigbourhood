(function($) {

  let locationList = [{
      name: 'Brooklyn Museum',
      address: '200 Eastern Pkwy, Brooklyn, NY 11238'
    }, {
      name: 'Empire State Building',
      address: '350 5th Ave, New York, NY 10118'
    }, {
      name: 'Statue of liberty',
      address: 'New York, NY 10004'
    }, {
      name: 'Rockefeller Center',
      address: '45 Rockefeller Plaza, New York, NY 10111'
    },
    {
      name: 'Brooklyn Bridge',
      address: 'Brooklyn Bridge, New York, NY 10038'
    },
    {
      name: 'Time Square',
      address: '45 Rockefeller Plaza, New York, NY 10111'
    },
    {
      name: 'World Trade Center',
      address: '285 Fulton St, New York, NY 10007'
    },
  ];

  let navStatus = false;


  function closeSidePage() {
    $('.menuContent').animate({
      left: '-265px'
    }, 100);
  }

  function openSidePage() {
    $('.menuContent').animate({
      left: '0px'
    }, 100);
  }

  $('#menu').click(function() {
    if (!navStatus) {
      closeSidePage();
      navStatus = true;
    } else {

      openSidePage()
      navStatus = false;
    }

  });

  var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};

  let MapViewModel = function() {

    let map
    let geocoder;
    let self = this;

    self.location = ko.observableArray([]);
    self.searchText = ko.observable();

    for (let i = 0; i < locationList.length; ++i) {
      self.location.push(new Location(locationList[i]));
    }

    this.initMap = function() {

      map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(40.7060855, -73.99686429999997),
        styles: styles,
        mapTypeId: "roadmap",
        zoom: 12
      });

      this.displayMarker(this.getAddresses());
    }

    this.getAddresses = function() {
      return locationList.map(function(location) {
        return location;
      });
    }

    this.filterLocations = ko.computed(function() {

      let filter = self.searchText();
      if (!filter) {
        return self.location();

      } else {
        return ko.utils.arrayFilter(this.location(), function(location) {
          return stringStartsWith(location.name().toLowerCase(), filter.toLowerCase());

        });
      }

    }, self);

    this.displayMarker = function(locations) {

      geocoder = new google.maps.Geocoder();

      for (let i = 0; i < locations.length; ++i) {
        geocoder.geocode({
          'address': locations[i].address

        }, function(result, status) {

          if (status == google.maps.GeocoderStatus.OK) {
            let latitude = result[0].geometry.location.lat();
            let longitude = result[0].geometry.location.lng()

            let marker = new google.maps.Marker({
              position: new google.maps.LatLng(latitude, longitude),
              title: locations[i].name,
              animation: google.maps.Animation.DROP,
              address: locations[i].address,
              map: map
            });

            let infoWindow = new google.maps.InfoWindow({
              content: locations[i].address,
            });

            marker.addListener('click', function() {
              infoWindow.open(map, marker);
            });
          }

        });
      }
    }

    this.initMap();

  }

  let Location = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
  }

  let Geo = function(lat, long) {
    this.lat = lat;
    this.long = long;
  }

  ko.applyBindings(new MapViewModel());

})(jQuery);
