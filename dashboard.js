// dashboard.js — Enhanced dashboard functionality
(function() {
  // Simulate real-time disease alerts
  const diseaseList = document.getElementById('diseaseList');
  if (diseaseList) {
    setInterval(function() {
      // Randomly update alert times
      const items = diseaseList.querySelectorAll('.disease-item');
      items.forEach(function(item) {
        const timeEl = item.querySelector('.disease-time');
        if (timeEl && Math.random() < 0.05) {
          const minutes = Math.floor(Math.random() * 120) + 1;
          timeEl.textContent = minutes + 'm ago';
        }
      });
    }, 10000);
  }

  // Simulate soil moisture updates
  const soilList = document.getElementById('soilList');
  if (soilList) {
    setInterval(function() {
      const rows = soilList.querySelectorAll('.soil-row');
      rows.forEach(function(row) {
        const pctEl = row.querySelector('.soil-pct');
        const fillEl = row.querySelector('.soil-bar-fill');
        const statusEl = row.querySelector('.soil-status');
        
        if (pctEl && fillEl && statusEl && Math.random() < 0.1) {
          const currentPct = parseInt(pctEl.textContent);
          const change = (Math.random() - 0.5) * 4;
          const newPct = Math.max(10, Math.min(95, currentPct + change));
          
          pctEl.textContent = Math.round(newPct) + '%';
          fillEl.style.width = newPct + '%';
          
          // Update status
          let status, statusClass;
          if (newPct > 55) {
            status = 'Optimal';
            statusClass = 'ok';
          } else if (newPct > 35) {
            status = 'Monitor';
            statusClass = 'warn';
          } else {
            status = 'Irrigate';
            statusClass = 'danger';
          }
          
          statusEl.textContent = status;
          statusEl.className = 'soil-status ' + statusClass;
          pctEl.className = 'soil-pct ' + statusClass;
          fillEl.className = 'soil-bar-fill ' + statusClass;
        }
      });
    }, 15000);
  }

  // Add keyboard shortcuts for dashboard
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'r') {
      location.reload();
    }
    if (e.key === 'd' && !e.ctrlKey) {
      window.location.href = 'detect.html';
    }
    if (e.key === 's' && !e.ctrlKey) {
      window.location.href = 'soil.html';
    }
    if (e.key === 'm' && !e.ctrlKey) {
      window.location.href = 'map.html';
    }
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      toggleQuickModal();
    }
  });

  // Add live connection status indicator
  const statusIndicator = document.querySelector('.nav-status');
  if (statusIndicator) {
    setInterval(function() {
      if (Math.random() < 0.3) {
        statusIndicator.style.opacity = '0.7';
        setTimeout(function() {
          statusIndicator.style.opacity = '1';
        }, 500);
      }
    }, 20000);
  }

  // --- NEW FEATURE FUNCTIONS ---

  // Crop Risk Estimator
  window.calculateCropRisk = function() {
    const crop = document.getElementById('calcCrop')?.value || 'Cotton';
    const acres = parseFloat(document.getElementById('calcAcres')?.value) || 5;
    const sev = parseFloat(document.getElementById('calcSev')?.value) || 0.30;

    const cropData = {
      'Cotton': { yieldPerAcre: 12, msp: 7000 },
      'Paddy': { yieldPerAcre: 25, msp: 2300 },
      'Chilli': { yieldPerAcre: 15, msp: 18000 },
      'Groundnut': { yieldPerAcre: 10, msp: 6300 },
      'Mango': { yieldPerAcre: 30, msp: 4500 }
    };

    const c = cropData[crop] || cropData['Cotton'];
    const totalYieldLoss = (acres * c.yieldPerAcre * sev).toFixed(1);
    const totalFinLoss = Math.round(totalYieldLoss * c.msp);
    const sprayCost = acres * 1200;
    const roi = (totalFinLoss / Math.max(1, sprayCost)).toFixed(1);

    const elLoss = document.getElementById('resYieldLoss');
    const elFin = document.getElementById('resFinancialLoss');
    const elRoi = document.getElementById('resSprayROI');

    if (elLoss) elLoss.textContent = totalYieldLoss + ' Quintals';
    if (elFin) elFin.textContent = '₹' + totalFinLoss.toLocaleString('en-IN');
    if (elRoi) elRoi.textContent = roi + 'x Saved';
  };

  // Severity Filter for Alerts
  window.filterDashboardAlerts = function(sev, el) {
    const tabs = document.querySelectorAll('#diseaseFilterTabs .filter-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');

    const items = document.querySelectorAll('#diseaseList .disease-item');
    items.forEach(item => {
      const itemSev = item.getAttribute('data-sev');
      if (sev === 'all' || itemSev === sev) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  };

  // Quick Action Modal Toggle
  window.toggleQuickModal = function() {
    const modal = document.getElementById('quickModal');
    if (modal) {
      modal.classList.toggle('open');
    }
  };

  // Export Data CSV
  window.exportDataCSV = function() {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Zone,Latitude,Longitude,Disease,Severity,Moisture_Pct,Timestamp\n"
      + "Kurnool North,15.72,78.11,Fusarium wilt,High,72%,2026-08-27 17:00\n"
      + "Nandyal Belt,15.91,77.89,Rice blast,High,45%,2026-08-27 17:00\n"
      + "Allagadda South,15.84,78.22,Powdery mildew,Med,23%,2026-08-27 17:00\n"
      + "Yemmiganur,15.78,78.31,Cercospora,Low,61%,2026-08-27 17:00\n"
      + "Adoni East,16.01,78.07,Anthracnose,Low,38%,2026-08-27 17:00\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agricrop_intelligence_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Run initial calculation
  setTimeout(window.calculateCropRisk, 300);

  console.log('🚀 AgriCrop Dashboard initialized');
  console.log('📊 Monitoring 8 soil zones');
  console.log('🔍 Tracking 5 active outbreaks');
  console.log('⌨️ Keyboard shortcuts: d=detect, s=soil, m=map, Ctrl+K=menu, Ctrl+R=reload');
})();