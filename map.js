// map.js — Enhanced full map with more features
(function() {
const outbreaks = [
  {
    lat: 15.72, lng: 78.11, name: 'Fusarium wilt', crop: 'Cotton', sev: 'high',
    color: '#E04040', r: 22, area: '14 km²', spread: 'Spreading NE at ~0.8km/day',
    moisture: '45% (stressed)', detected: '2 hours ago',
    reco: 'Apply Carbendazim 50% WP immediately. Isolate affected rows. Coordinate with neighbors.'
  },
  {
    lat: 15.91, lng: 77.89, name: 'Rice blast', crop: 'Paddy', sev: 'high',
    color: '#E04040', r: 18, area: '9 km²', spread: 'Contained — perimeter held',
    moisture: '38% (dry)', detected: '18 min ago',
    reco: 'Tricyclazole 75% WP at 0.6g/L. Drain fields temporarily. Inspect neighboring paddies.'
  },
  {
    lat: 15.84, lng: 78.22, name: 'Powdery mildew', crop: 'Chilli', sev: 'med',
    color: '#E8A020', r: 13, area: '3 km²', spread: 'Early stage — isolated patch',
    moisture: '61% (ok)', detected: '41 min ago',
    reco: 'Wettable Sulphur 80% at 2.5g/L. Improve air circulation. Early action can prevent spread.'
  },
  {
    lat: 15.78, lng: 78.31, name: 'Cercospora leaf spot', crop: 'Groundnut', sev: 'low',
    color: '#1DB88E', r: 9, area: '1 km²', spread: 'Stable — monitoring mode',
    moisture: '67% (ok)', detected: '1 hour ago',
    reco: 'Mancozeb 75% WP at 2g/L as preventive spray. Monitor for 48 hours.'
  },
  {
    lat: 16.01, lng: 78.07, name: 'Anthracnose', crop: 'Mango', sev: 'low',
    color: '#1DB88E', r: 8, area: '0.8 km²', spread: 'Single tree cluster',
    moisture: '72% (ok)', detected: '2 hours ago',
    reco: 'Copper oxychloride 50% WP at 3g/L. Remove infected fruit. No immediate spread risk.'
  }
];

const map = L.map('fullmap', {
  center: [15.83, 78.04],
  zoom: 10,
  zoomControl: true,
  attributionControl: false
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  opacity: 0.45
}).addTo(map);

// Add scale control
L.control.scale({ position: 'bottomright' }).addTo(map);

// Coordinate display
map.on('mousemove', function(e) {
  document.getElementById('coordDisplay').textContent =
    e.latlng.lat.toFixed(4) + '°N · ' + e.latlng.lng.toFixed(4) + '°E';
});

let markers = [];

function renderMarkers(filter) {
  markers.forEach(function(m) { 
    if (m.outer) map.removeLayer(m.outer); 
    if (m.inner) map.removeLayer(m.inner); 
    if (m.circle) map.removeLayer(m.circle);
    if (m.halo) map.removeLayer(m.halo);
  });
  markers = [];

  let visible = outbreaks.filter(function(o) {
    if (filter === 'all') return true;
    if (filter === 'high') return o.sev === 'high';
    if (filter === 'med') return o.sev === 'high' || o.sev === 'med';
    return true;
  });

  document.getElementById('markerCount').textContent = visible.length + ' outbreak zone' + (visible.length !== 1 ? 's' : '');

  visible.forEach(function(o) {
    // Add halo effect
    const halo = L.circleMarker([o.lat, o.lng], {
      radius: o.r * 3,
      color: o.color,
      fillColor: o.color,
      fillOpacity: 0.03,
      weight: 1,
      opacity: 0.3,
      className: 'outbreak-pulse'
    }).addTo(map);

    // Outer ring
    const outer = L.circleMarker([o.lat, o.lng], {
      radius: o.r * 1.8,
      color: o.color,
      fillColor: o.color,
      fillOpacity: 0.08,
      weight: 1,
      opacity: 0.4
    }).addTo(map);

    // Inner core
    const inner = L.circleMarker([o.lat, o.lng], {
      radius: o.r,
      color: o.color,
      fillColor: o.color,
      fillOpacity: 0.85,
      weight: 2
    }).addTo(map);

    // Add click handler
    inner.on('click', function() {
      const panel = document.getElementById('infoPanel');
      panel.classList.add('show');
      const sevColor = o.sev === 'high' ? '#E04040' : o.sev === 'med' ? '#E8A020' : '#1DB88E';
      document.getElementById('infoPanelContent').innerHTML =
        '<div style="font-size:10px;font-family:JetBrains Mono,monospace;color:#5a7060;text-transform:uppercase;margin-bottom:6px;">' + o.sev.toUpperCase() + ' SEVERITY</div>' +
        '<div class="info-panel-name">' + o.name + '</div>' +
        '<div class="info-panel-crop">' + o.crop + ' · ' + o.lat.toFixed(2) + '°N ' + o.lng.toFixed(2) + '°E</div>' +
        '<div class="info-row"><span>Area affected</span><strong>' + o.area + '</strong></div>' +
        '<div class="info-row"><span>Status</span><strong>' + o.spread + '</strong></div>' +
        '<div class="info-row"><span>Soil moisture</span><strong>' + o.moisture + '</strong></div>' +
        '<div class="info-row"><span>Detected</span><strong>' + o.detected + '</strong></div>' +
        '<div class="info-reco"><strong style="color:#1DB88E;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Recommended action</strong><br><br>' + o.reco + '</div>' +
        '<button class="btn-whatsapp" onclick="shareWhatsAppAlert(\'' + o.name + '\', \'' + o.crop + '\', \'' + o.area + '\', \'' + o.reco.replace(/'/g, "\\'") + '\')"><i class="fab fa-whatsapp"></i> Broadcast Alert via WhatsApp</button>';
      
      // Center map on marker
      map.setView([o.lat, o.lng], 12, { animate: true });
    });

    // Enhanced hover effect
    inner.on('mouseover', function() {
      inner.bindTooltip(
        '<strong>' + o.name + '</strong><br>' +
        '<span style="color:#8fa491;font-size:11px;">' + o.crop + ' · ' + o.sev.toUpperCase() + ' · ' + o.area + '</span><br>' +
        '<span style="color:#5a7060;font-size:10px;font-family:JetBrains Mono,monospace;">' + 
        o.lat.toFixed(2) + '°N ' + o.lng.toFixed(2) + '°E' +
        '</span>',
        { className: 'ag-tooltip', permanent: false, direction: 'top' }
      ).openTooltip();
      
      // Highlight
      inner.setStyle({ radius: o.r * 1.3 });
      outer.setStyle({ radius: o.r * 2.2 });
    });

    inner.on('mouseout', function() {
      inner.closeTooltip();
      inner.setStyle({ radius: o.r });
      outer.setStyle({ radius: o.r * 1.8 });
    });

    markers.push({ outer, inner, halo });
  });
}

renderMarkers('all');

// Filter buttons
function setFilter(f) {
  ['all','high','med'].forEach(function(k) {
    document.getElementById('filter-' + k).classList.remove('active');
  });
  document.getElementById('filter-' + f).classList.add('active');
  renderMarkers(f);
}

// Map Search Zone Function
window.searchMapZone = function() {
  const query = (document.getElementById('mapSearch')?.value || '').toLowerCase().trim();
  if (!query) return;

  const match = outbreaks.find(o => 
    o.name.toLowerCase().includes(query) || 
    o.crop.toLowerCase().includes(query)
  );

  if (match) {
    map.setView([match.lat, match.lng], 12, { animate: true });
  }
};

// WhatsApp Broadcast Share Function
window.shareWhatsAppAlert = function(name, crop, area, reco) {
  const text = `🚨 *AGRICROP OUTBREAK ALERT* 🚨\n\n` +
    `*Disease:* ${name}\n` +
    `*Crop Affected:* ${crop}\n` +
    `*Area Spread:* ${area}\n\n` +
    `*Recommended Farmer Action:*\n${reco}\n\n` +
    `_Sent via AgriCrop Geospatial Intelligence Platform (AP Zone 3)_`;
  
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.key === '1') setFilter('all');
  if (e.key === '2') setFilter('high');
  if (e.key === '3') setFilter('med');
  if (e.key === 'r') map.setView([15.83, 78.04], 10, { animate: true });
});

// Add double-click zoom to feature
map.on('dblclick', function(e) {
  map.setView(e.latlng, map.getZoom() + 1, { animate: true });
});

// Export functions globally
window.setFilter = setFilter;
})();