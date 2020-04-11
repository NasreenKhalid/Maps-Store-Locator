window.onload = () => {};

var map;
var markers = [];
var infoWindow;

function initMap() {
  var losAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 11,
    mapTypeId: "roadmap",
  });

  infoWindow = new google.maps.InfoWindow({
    // content: document.getElementById("infobox"),
    // boxStyle: {
    //   background:
    //     "url('https://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
    //   opacity: 0.9,
    //   width: "1300px",
    //   border: "3px solid red",
    // },
  });
  searchStores();
  // showStoresMarkers();
  // setOnClickListener();
}

function searchStores() {
  var foundStores = [];
  var zipCode = document.getElementById("zip-code-input").value;
  console.log(zipCode);
  if (zipCode) {
    for (var store of stores) {
      var postal = store["address"]["postalCode"].substring(0, 5);
      if (postal == zipCode) {
        foundStores.push(store);
      }
    }
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  // console.log(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach(function (element, index) {
    element.addEventListener("click", function () {
      new google.maps.event.trigger(markers[index], "click");
    });
  });

  // for (var [index, storeElements] of storeElements.entries()) {
  //   console.log(storeElements);
  //   storeElements.addEventListener("click",createTrigger (index) {

  //   });
  // }
}

function displayStores(stores) {
  var storesHtml = "";
  for (var [index, store] of stores.entries()) {
    var address = store["addressLines"];
    var phone = store["phoneNumber"];
    storesHtml += `<div class="store-container">
    <div class="store-container-background"> 
    <div class="store-info-container">
      <div class="store-address">
        <span>${address[0]}</span>
        <span>${address[1]}</span>
      </div>
      <div class="store-phone-number">${phone}</div>
    </div>
    <div class="store-number-container">
      <div class="store-number">${index + 1}</div>
    </div>
  </div>
</div>`;

    document.querySelector(".stores-list").innerHTML = storesHtml;
    // console.log(store);
    // console.log("geh");
  }
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var [index, store] of stores.entries()) {
    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );
    var name = store["name"];
    var address = store["addressLines"][0];
    var openStatusText = store["openStatusText"];
    var phoneNumber = store["phoneNumber"];
    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatusText, phoneNumber, index + 1);
  }
  map.fitBounds(bounds);
}

function createMarker(
  latlng,
  name,
  address,
  openStatusText,
  phoneNumber,
  index
) {
  var html = `
  <div class="store-info-window">
  <div class="store-info-name">
${name}  
  </div>
  <div class="store-info-status">
  ${openStatusText}
  </div>
  <div class="store-info-address">
  <div class="circle">
  <i class="fas fa-location-arrow"></i></div>
  ${address}
  </div>
  <div class="store-info-phone">
  <div class="circle">
  <i class="fas fa-phone-alt"></i>
  </div>
  ${phoneNumber}
  </div>

  </div>
  `;

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString(),
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    },
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
  console.log(markers);
}
