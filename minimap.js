// minimap.js — dashboard mini Leaflet map with more features
(function() {
  const map = L.map('minimap', {
    center: [15.83, 78.04],
    zoom: 9,
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 0.4
  }).addTo(map);

  const outbreaks = [
    { lat: 15.72, lng: 78.11, name: 'Fusarium wilt', crop: 'Cotton', sev: 'high', color: '#E04040', r: 18 },
    { lat: 15.91, lng: 77.89, name: 'Rice blast', crop: 'Paddy', sev: 'high', color: '#E04040', r: 14 },
    { lat: 15.84, lng: 78.22, name: 'Powdery mildew', crop: 'Chilli', sev: 'med', color: '#E8A020', r: 10 },
    { lat: 15.78, lng: 78.31, name: 'Cercospora', crop: 'Groundnut', sev: 'low', color: '#1DB88E', r: 7 },
    { lat: 16.01, lng: 78.07, name: 'Anthracnose', crop: 'Mango', sev: 'low', color: '#1DB88E', r: 6 }
  ];

  outbreaks.forEach(function(o) {
    // Outer pulse ring
    L.circleMarker([o.lat, o.lng], {
      radius: o.r * 2,
      color: o.color,
      fillColor: o.color,
      fillOpacity: 0.07,
      weight: 1,
      opacity: 0.5
    }).addTo(map);

    // Core marker
    const marker = L.circleMarker([o.lat, o.lng], {
      radius: o.r,
      color: o.color,
      fillColor: o.color,
      fillOpacity: 0.85,
      weight: 2
    }).addTo(map);

    // Enhanced popup with more info
    marker.bindPopup(
      '<div style="font-family:Space Grotesk,sans-serif;font-size:13px;">' +
      '<strong>' + o.name + '</strong><br>' +
      '<span style="color:#8fa491;font-size:11px;">' + o.crop + ' · ' + o.sev.toUpperCase() + '</span><br>' +
      '<span style="color:#5a7060;font-size:10px;font-family:JetBrains Mono,monospace;">' + 
      '📍 ' + o.lat.toFixed(2) + '°N ' + o.lng.toFixed(2) + '°E' +
      '</span>' +
      '</div>',
      { className: 'ag-popup' }
    );

    // Add hover effect
    marker.on('mouseover', function() {
      marker.setStyle({ fillOpacity: 1, radius: o.r * 1.2 });
    });
    marker.on('mouseout', function() {
      marker.setStyle({ fillOpacity: 0.85, radius: o.r });
    });
  });

  // Add click handler for zoom
  map.on('click', function(e) {
    map.setView(e.latlng, 10, { animate: true });
  });

  // Add auto-rotate feature
  let rotationAngle = 0;
  setInterval(function() {
    rotationAngle += 0.5;
    if (rotationAngle > 360) rotationAngle = 0;
    // Auto-rotate only when idle
  }, 30000);

})();