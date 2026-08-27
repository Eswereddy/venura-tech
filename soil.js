// soil.js — Enhanced soil monitoring JavaScript
(function() {
const zones = [
  { name: 'Kurnool North', pct: 72, status: 'ok', badge: 'Optimal', temp: 34, hum: 58, evap: 8.4, crop: 'Cotton', coord: '15.83°N 78.04°E' },
  { name: 'Nandyal Belt', pct: 45, status: 'warn', badge: 'Monitor', temp: 36, hum: 49, evap: 11.2, crop: 'Paddy', coord: '15.48°N 78.48°E' },
  { name: 'Allagadda South', pct: 23, status: 'danger', badge: 'Irrigate now', temp: 38, hum: 41, evap: 14.7, crop: 'Groundnut', coord: '15.14°N 78.57°E' },
  { name: 'Yemmiganur', pct: 61, status: 'ok', badge: 'Optimal', temp: 33, hum: 61, evap: 7.9, crop: 'Chilli', coord: '15.76°N 77.49°E' },
  { name: 'Adoni East', pct: 38, status: 'warn', badge: 'Monitor', temp: 37, hum: 45, evap: 12.1, crop: 'Sunflower', coord: '15.63°N 77.27°E' },
  { name: 'Nandikotkur', pct: 54, status: 'ok', badge: 'Optimal', temp: 34, hum: 55, evap: 9.0, crop: 'Maize', coord: '15.86°N 78.26°E' },
  { name: 'Pattikonda', pct: 29, status: 'danger', badge: 'Irrigate now', temp: 39, hum: 38, evap: 15.3, crop: 'Sorghum', coord: '15.39°N 77.59°E' },
  { name: 'Kodumur', pct: 67, status: 'ok', badge: 'Optimal', temp: 33, hum: 60, evap: 8.1, crop: 'Cotton', coord: '15.68°N 77.98°E' }
];

const grid = document.getElementById('soilGrid');
if (grid) {
  zones.forEach(function(z) {
    const col = z.status === 'ok' ? 'var(--green)' : z.status === 'warn' ? 'var(--amber)' : 'var(--red)';
    const bg = z.status === 'ok' ? 'rgba(29,184,142,0.12)' : z.status === 'warn' ? 'rgba(232,160,32,0.12)' : 'rgba(224,64,64,0.12)';
    grid.innerHTML += `
    <div class="soil-card" data-status="${z.status}">
      <div class="soil-card-header">
        <div class="soil-card-zone">${z.name}</div>
        <span class="soil-card-badge ${z.status}">${z.badge}</span>
      </div>
      <div class="soil-card-value" style="color:${col}">${z.pct}%</div>
      <div class="soil-card-label">Current soil moisture · ${z.crop}</div>
      <div class="soil-card-bar-track">
        <div class="soil-card-bar-fill" style="width:${z.pct}%;background:${col};border-radius:4px;height:8px;"></div>
      </div>
      <div class="soil-forecast-row">
        <span><i class="fas fa-thermometer-half"></i> ${z.temp}°C</span>
        <span><i class="fas fa-water"></i> ${z.hum}% RH</span>
        <span><i class="fas fa-arrow-down"></i> −${z.evap}% / 6h</span>
      </div>
      <div style="margin-top:8px;font-family:var(--mono);font-size:10px;color:var(--text3);">${z.coord}</div>
    </div>`;
  });
}

// Chart.js moisture trend
const canvas = document.getElementById('moistureChart');
if (canvas) {
  const hours = ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'];
  const actual = [76, 75, 74, 73, 74, 71, 68, 65, 67, 70, 72, 73];
  const forecast = [76, 75, 74, 73, 74, 72, 69, 66, 68, 71, 72, 74];

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [
        {
          label: 'Actual moisture %',
          data: actual,
          borderColor: '#1DB88E',
          backgroundColor: 'rgba(29,184,142,0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#1DB88E'
        },
        {
          label: 'Regression forecast %',
          data: forecast,
          borderColor: '#E8A020',
          backgroundColor: 'transparent',
          borderDash: [5,4],
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#8fa491', font: { family: 'Space Grotesk', size: 12 }, boxWidth: 20 }
        },
        tooltip: {
          backgroundColor: 'rgba(17,24,17,0.96)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          bodyFont: { family: 'Space Grotesk' }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5a7060', font: { family: 'JetBrains Mono', size: 10 } }
        },
        y: {
          min: 55, max: 85,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5a7060', font: { family: 'JetBrains Mono', size: 10 }, callback: v => v + '%' }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });
}

// Add auto-refresh simulation
setInterval(function() {
  const randomZone = zones[Math.floor(Math.random() * zones.length)];
  const change = (Math.random() - 0.5) * 2;
  randomZone.pct = Math.max(10, Math.min(95, randomZone.pct + change));
}, 30000);

// --- NEW FEATURE FUNCTIONS FOR SOIL PAGE ---

window.filterSoilZones = function(status, el) {
  const tabs = document.querySelectorAll('#soilFilterTabs .filter-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  const cards = document.querySelectorAll('#soilGrid .soil-card');
  cards.forEach(card => {
    const cardStatus = card.getAttribute('data-status');
    if (status === 'all' || cardStatus === status) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};

window.calculateIrrigation = function() {
  const zoneStr = document.getElementById('irrZone')?.value || '';
  const currentPct = zoneStr.includes('23%') ? 23 : zoneStr.includes('29%') ? 29 : zoneStr.includes('38%') ? 38 : 45;
  const targetPct = parseFloat(document.getElementById('irrTarget')?.value) || 70;
  const texture = document.getElementById('irrSoilType')?.value || 'Black Cotton';

  const deficit = Math.max(0, targetPct - currentPct);
  const textureMult = texture === 'Black Cotton' ? 300 : texture === 'Red Loam' ? 250 : 200;
  
  const volumeLiters = Math.round(deficit * textureMult);
  const pumpRateGPH = 5000; // 5000 Liters per hour pump
  const hoursDecimal = volumeLiters / pumpRateGPH;
  const hrs = Math.floor(hoursDecimal);
  const mins = Math.round((hoursDecimal - hrs) * 60);

  const elDef = document.getElementById('resIrrDeficit');
  const elVol = document.getElementById('resIrrVolume');
  const elRun = document.getElementById('resIrrRuntime');

  if (elDef) elDef.textContent = deficit + '% Deficit';
  if (elVol) elVol.textContent = volumeLiters.toLocaleString('en-IN') + ' Liters / Acre';
  if (elRun) elRun.textContent = (hrs > 0 ? hrs + ' hrs ' : '') + mins + ' mins';
};

window.exportSoilLogsCSV = function() {
  let csv = "Zone,Moisture_Pct,Status,Temp_C,Humidity_RH,Evaporation_6h,Crop,Coordinates\n";
  zones.forEach(z => {
    csv += `"${z.name}",${z.pct}%,${z.badge},${z.temp}°C,${z.hum}%,-${z.evap}%,${z.crop},"${z.coord}"\n`;
  });
  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "soil_moisture_intelligence_log.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.toggleIoTPump = function(btn, zoneName) {
  const isActive = btn.classList.contains('active');
  const shortName = zoneName.split(' ')[0];
  const statusEl = document.getElementById('status-' + shortName);

  if (isActive) {
    btn.classList.remove('active');
    btn.textContent = 'STANDBY';
    if (statusEl) statusEl.textContent = 'Flow Rate: 0 L/min · Valve Closed';
  } else {
    btn.classList.add('active');
    btn.textContent = 'PUMP ON';
    if (statusEl) statusEl.textContent = 'Flow Rate: 46 L/min · Pressure: 2.2 bar';
  }
};

// Initial run
setTimeout(window.calculateIrrigation, 300);
})();