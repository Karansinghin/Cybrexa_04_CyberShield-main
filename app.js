// ── CYBERSHIELD APP LOGIC ─────────────────────────────────────────────────
// Built by Siddharth Naik — Cybrexa Project 04 Capstone

let filteredNews = [...NEWS_DATA];
let monitorActive = true;
let monitorInterval;

// ── LIVE CLOCK ────────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('liveClock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// ── MODULE 1: NEWS AGGREGATOR ────────────────────────────────────────────
function renderNews(list) {
  const grid = document.getElementById('newsGrid');
  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = '<div style="font-family:var(--font-mono);color:var(--text-muted);padding:20px">No articles match your search.</div>';
    return;
  }
  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'news-card';
    div.innerHTML =
      '<span class="news-cat ' + item.category + '">' + item.category + '</span>' +
      '<div class="news-title">' + item.title + '</div>' +
      '<div class="news-summary">' + item.summary + '</div>' +
      '<div class="news-meta"><span>' + item.source + '</span><span>' + item.time + '</span></div>';
    grid.appendChild(div);
  });
}

function filterNews() {
  const search = document.getElementById('newsSearch').value.toLowerCase();
  const cat = document.getElementById('categoryFilter').value;
  filteredNews = NEWS_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search) || item.summary.toLowerCase().includes(search);
    const matchesCat = cat === 'all' || item.category === cat;
    return matchesSearch && matchesCat;
  });
  renderNews(filteredNews);
}

function refreshNews() {
  document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString().slice(0,5);
  renderNews(filteredNews);
}

// ── MODULE 2: THREAT ANALYTICS ───────────────────────────────────────────
function initCharts() {
  const categories = ['breach','malware','vulnerability','ransomware','phishing'];
  const counts = categories.map(c => NEWS_DATA.filter(n => n.category === c).length);
  const colors = ['#ff4060','#ff6b35','#ffa500','#ff0844','#c77dff'];

  new Chart(document.getElementById('threatChart'), {
    type: 'doughnut',
    data: {
      labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      datasets: [{ data: counts, backgroundColor: colors, borderColor: '#0d1b2a', borderWidth: 2 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#6a8a80', font: { family: 'Share Tech Mono', size: 10 } } }, title: { display: true, text: 'Threats by Category', color: '#00ffe7', font: { family: 'Orbitron', size: 12 } } }
    }
  });

  new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
      labels: ['6d ago','5d ago','4d ago','3d ago','2d ago','1d ago','Today'],
      datasets: [{
        label: 'Threat Activity',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: '#00ffe7', backgroundColor: 'rgba(0,255,231,0.1)',
        tension: 0.4, fill: true, pointBackgroundColor: '#00ffe7'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, title: { display: true, text: '7-Day Threat Trend', color: '#00ffe7', font: { family: 'Orbitron', size: 12 } } },
      scales: {
        x: { ticks: { color: '#6a8a80', font: { family: 'Share Tech Mono', size: 9 } }, grid: { color: 'rgba(0,255,231,0.06)' } },
        y: { ticks: { color: '#6a8a80', font: { family: 'Share Tech Mono', size: 9 } }, grid: { color: 'rgba(0,255,231,0.06)' } }
      }
    }
  });
}

// ── MODULE 3: LIVE MONITOR ───────────────────────────────────────────────
const MONITOR_EVENTS = [
  { sev: 'critical', text: 'Multiple failed login attempts detected from unusual IP range' },
  { sev: 'high', text: 'Outbound traffic spike to known malicious domain blocked' },
  { sev: 'medium', text: 'New CVE published affecting common web framework' },
  { sev: 'critical', text: 'Ransomware signature detected in email attachment — quarantined' },
  { sev: 'high', text: 'Suspicious PowerShell execution flagged on endpoint' },
  { sev: 'medium', text: 'Port scan activity detected from external source' },
  { sev: 'high', text: 'Phishing email campaign targeting finance department blocked' },
  { sev: 'critical', text: 'Unauthorized privilege escalation attempt detected' },
  { sev: 'medium', text: 'TLS certificate expiring within 7 days on production server' },
  { sev: 'high', text: 'Brute force attack detected on SSH port — IP blacklisted' },
  { sev: 'medium', text: 'Anomalous data exfiltration pattern detected and logged' },
  { sev: 'critical', text: 'Known malware hash matched in file upload — blocked' }
];

function addMonitorEvent() {
  const feed = document.getElementById('monitorFeed');
  const event = MONITOR_EVENTS[Math.floor(Math.random() * MONITOR_EVENTS.length)];
  const now = new Date();
  const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');

  const div = document.createElement('div');
  div.className = 'feed-item';
  div.innerHTML =
    '<span class="feed-time">' + time + '</span>' +
    '<span class="feed-sev ' + event.sev + '">' + event.sev.toUpperCase() + '</span>' +
    '<span class="feed-text">' + event.text + '</span>';

  feed.insertBefore(div, feed.firstChild);
  if (feed.children.length > 15) feed.removeChild(feed.lastChild);

  if (event.sev === 'critical') {
    const counter = document.getElementById('criticalCount');
    counter.textContent = parseInt(counter.textContent) + 1;
  }
  const threatCounter = document.getElementById('totalThreats');
  threatCounter.textContent = parseInt(threatCounter.textContent) + 1;
}

function startMonitor() {
  monitorInterval = setInterval(addMonitorEvent, 3000);
}

function toggleMonitor() {
  monitorActive = !monitorActive;
  const btn = document.getElementById('monitorToggle');
  const status = document.getElementById('monitorStatus');
  if (monitorActive) {
    startMonitor();
    btn.textContent = 'Pause';
    status.textContent = 'LIVE — Monitoring active';
  } else {
    clearInterval(monitorInterval);
    btn.textContent = 'Resume';
    status.textContent = 'PAUSED — Monitoring stopped';
  }
}

// ── MODULE 4: IP & SOURCE INTEL ──────────────────────────────────────────
const IP_DATABASE = {
  '8.8.8.8':       { country: 'United States', flag: '🇺🇸', isp: 'Google LLC', city: 'Mountain View, CA', risk: 'safe', org: 'Google Public DNS' },
  '1.1.1.1':       { country: 'United States', flag: '🇺🇸', isp: 'Cloudflare Inc', city: 'San Francisco, CA', risk: 'safe', org: 'Cloudflare DNS' },
  '45.33.32.156':  { country: 'United States', flag: '🇺🇸', isp: 'Linode LLC', city: 'Newark, NJ', risk: 'suspicious', org: 'Linode Hosting' }
};

function lookupIP() {
  const ip = document.getElementById('ipInput').value.trim();
  const resultDiv = document.getElementById('ipResult');

  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div style="font-family:var(--font-mono);color:var(--danger)">⚠ Invalid IP address format.</div>';
    return;
  }

  let data = IP_DATABASE[ip];
  if (!data) {
    // Simulate data for unknown IPs deterministically based on IP
    const hash = ip.split('.').reduce((a,b) => a + parseInt(b), 0);
    const countries = [
      { country: 'Germany', flag: '🇩🇪' }, { country: 'Russia', flag: '🇷🇺' },
      { country: 'China', flag: '🇨🇳' }, { country: 'Brazil', flag: '🇧🇷' },
      { country: 'India', flag: '🇮🇳' }, { country: 'United Kingdom', flag: '🇬🇧' }
    ];
    const c = countries[hash % countries.length];
    data = {
      country: c.country, flag: c.flag,
      isp: 'Unknown ISP (' + (hash % 999) + ')',
      city: 'Unknown City',
      risk: hash % 3 === 0 ? 'suspicious' : 'safe',
      org: 'Generic Hosting Provider'
    };
  }

  resultDiv.style.display = 'block';
  resultDiv.innerHTML =
    '<div class="ip-header">' +
      '<span class="ip-flag">' + data.flag + '</span>' +
      '<span class="ip-addr">' + ip + '</span>' +
      '<span class="ip-risk ' + data.risk + '">' + (data.risk === 'safe' ? '✓ SAFE' : '⚠ SUSPICIOUS') + '</span>' +
    '</div>' +
    '<div class="ip-result-grid">' +
      '<div class="ip-field"><div class="ip-field-label">Country</div><div class="ip-field-val">' + data.country + '</div></div>' +
      '<div class="ip-field"><div class="ip-field-label">City</div><div class="ip-field-val">' + data.city + '</div></div>' +
      '<div class="ip-field"><div class="ip-field-label">ISP</div><div class="ip-field-val">' + data.isp + '</div></div>' +
      '<div class="ip-field"><div class="ip-field-label">Organization</div><div class="ip-field-val">' + data.org + '</div></div>' +
    '</div>';
}

function quickIP(ip) {
  document.getElementById('ipInput').value = ip;
  lookupIP();
}

// ── MODULE 5: KNOWLEDGE HUB / GLOSSARY ───────────────────────────────────
function renderGlossary(list) {
  const grid = document.getElementById('glossaryGrid');
  grid.innerHTML = '';
  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'glossary-item';
    div.innerHTML = '<div class="gloss-term">' + item.term + '</div><div class="gloss-def">' + item.def + '</div>';
    grid.appendChild(div);
  });
}

function filterGlossary() {
  const search = document.getElementById('glossarySearch').value.toLowerCase();
  const filtered = GLOSSARY_DATA.filter(item =>
    item.term.toLowerCase().includes(search) || item.def.toLowerCase().includes(search)
  );
  renderGlossary(filtered);
}

// ── INIT ──────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  renderNews(NEWS_DATA);
  initCharts();
  renderGlossary(GLOSSARY_DATA);
  startMonitor();

  document.getElementById('totalNews').textContent = NEWS_DATA.length;
  document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString().slice(0,5);

  // Seed a few initial monitor events
  for (let i = 0; i < 3; i++) setTimeout(addMonitorEvent, i * 400);
});
