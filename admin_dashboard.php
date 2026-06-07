<?php
// admin_dashboard.php
require_once __DIR__ . '/inc/auth.php';
require_once __DIR__ . '/inc/db_config.php';
$loggedIn = is_admin_logged_in();

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Admin Dashboard - RescueForce</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="assets/styles.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    /* small admin styles */
    body { font-family:Segoe UI,Arial;background:#f4f6fb;color:#111;padding:18px }
    .wrap{max-width:1100px;margin:0 auto}
    .top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px}
    .card{background:#fff;padding:14px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.06)}
    .grid {display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
    .section{margin-bottom:18px}
    .btn {background:#2d8f6f;color:#fff;padding:8px 12px;border-radius:8px;border:none;cursor:pointer}
    .btn-danger{background:#e35b5b}
    table{width:100%;border-collapse:collapse}
    th, td{padding:8px;border-bottom:1px solid #eee;text-align:left}
    .small{font-size:0.9rem;color:#666}
    .actions button{margin-right:8px}
    @media(max-width:900px){ .grid{grid-template-columns:repeat(1,1fr)} }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <h1>Admin Dashboard</h1>
      <?php if($loggedIn): ?>
        <div>
          <a href="admin_add_animal.php" style="margin-right:8px"><button class="btn">Add Animal</button></a>
          <a href="?logout=1"><button class="btn btn-danger">Logout</button></a>
        </div>
      <?php else: ?>
        <div>
          <a href="admin_add_animal.php"><button class="btn">Admin Login</button></a>
        </div>
      <?php endif; ?>
    </div>

    <?php
    if (!$loggedIn): 
    ?>
      <div class="card">
        <h3>Admin access required</h3>
        <p class="small">Please login from <a href="admin_add_animal.php">admin_add_animal.php</a> first. This dashboard requires the same admin session.</p>
      </div>
    <?php
      exit;
    endif;
    ?>

    <div id="flash" style="margin-bottom:12px;"></div>

    <!-- top summary cards -->
    <div class="grid">
      <div class="card">
        <h3 id="totalAnimals">—</h3>
        <div class="small">Total animals in gallery</div>
      </div>
      <div class="card">
        <h3 id="totalReports">—</h3>
        <div class="small">Total reports submitted</div>
      </div>
      <div class="card">
        <h3 id="totalAdoptions">—</h3>
        <div class="small">Total adoption requests</div>
      </div>
    </div>

    <!-- chart + recent -->
    <div class="section card">
      <h3>Animals added (last 6 months)</h3>
      <canvas id="animalsChart" height="100"></canvas>
    </div>

    <div class="section card">
      <h3>Recent activity</h3>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:320px">
          <h4>Recent Animals</h4>
          <div id="recentAnimals" class="small">Loading...</div>
        </div>
        <div style="flex:1;min-width:320px">
          <h4>Recent Reports</h4>
          <div id="recentReports" class="small">Loading...</div>
        </div>
      </div>
    </div>

    <!-- Map Section -->
    <div class="section card">
      <h3>Reported Animals Map</h3>
      <p class="small">Visual overview of where animals have been reported.</p>
      <div id="admin-map" style="height: 400px; width: 100%; border-radius: 8px; z-index: 1;"></div>
    </div>

    <!-- Adoption Management -->
    <div class="section card">
      <h3>Manage Adoption Requests</h3>
      <p class="small">Approve or reject adoption requests. Approved requests set status to <code>approved</code>.</p>
      <div id="adoptionArea">Loading adoption requests...</div>
    </div>

  </div>

<script>
// helper to show flash
function showFlash(msg, type='info') {
  const f = document.getElementById('flash');
  f.innerHTML = `<div style="padding:10px;border-radius:6px;background:${type==='error'?'#ffdddd':'#ddffdd'};color:#111">${msg}</div>`;
  setTimeout(()=> f.innerHTML = '', 5000);
}

// Fetch stats + populate UI
async function loadAdminStats() {
  try {
    const res = await fetch('api/get_admin_stats.php', {cache:'no-store'});
    if (!res.ok) throw new Error('Stats failed');
    const json = await res.json();
    document.getElementById('totalAnimals').textContent = json.total_animals ?? 0;
    document.getElementById('totalReports').textContent = json.total_reports ?? 0;
    document.getElementById('totalAdoptions').textContent = json.total_adoptions ?? 0;

    // Chart: labels + data (months)
    const ctx = document.getElementById('animalsChart').getContext('2d');
    const chartLabels = json.months || [];
    const chartData = json.month_counts || [];

    // destroy existing chart if any
    if (window.animalsChart instanceof Chart) window.animalsChart.destroy();

    window.animalsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Animals added',
          data: chartData,
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { precision:0 } }
        }
      }
    });

    // populate recent animals & reports
    const ra = document.getElementById('recentAnimals');
    ra.innerHTML = json.recent_animals_html || '—';
    const rr = document.getElementById('recentReports');
    rr.innerHTML = json.recent_reports_html || '—';
  } catch (err) {
    console.error(err);
    showFlash('Unable to load stats: '+err.message, 'error');
  }
}

// load adoption requests and render table
async function loadAdoptions() {
  try {
    const res = await fetch('api/get_adoptions.php', {cache:'no-store'});
    if (!res.ok) throw new Error('Failed to load adoptions');
    const rows = await res.json();
    const area = document.getElementById('adoptionArea');
    if (!Array.isArray(rows) || rows.length === 0) {
      area.innerHTML = '<p>No adoption requests yet.</p>';
      return;
    }
    let html = `<table><thead><tr><th>Id</th><th>Name</th><th>Email</th><th>Phone</th><th>Pet Type</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>`;
    rows.forEach(r => {
      html += `<tr>
        <td>${r.id}</td>
        <td>${escapeHtml(r.applicant_name)}</td>
        <td>${escapeHtml(r.email)}</td>
        <td>${escapeHtml(r.phone||'—')}</td>
        <td>${escapeHtml(r.pet_type||'—')}</td>
        <td>${escapeHtml(r.created_at)}</td>
        <td><strong>${escapeHtml(r.status)}</strong></td>
        <td class="actions">
          ${r.status === 'pending' ? `<button onclick="takeAction(${r.id}, 'approved')" class="btn">Approve</button>
            <button onclick="takeAction(${r.id}, 'rejected')" class="btn btn-danger">Reject</button>` : `<button onclick="takeAction(${r.id}, 'pending')" class="btn">Mark pending</button>`}
        </td>
      </tr>`;
    });
    html += `</tbody></table>`;
    area.innerHTML = html;
  } catch (err) {
    console.error(err);
    document.getElementById('adoptionArea').innerHTML = '<p>Error loading adoption requests.</p>';
  }
}

async function takeAction(id, action) {
  if (!confirm(`Are you sure you want to set status = ${action} for request #${id}?`)) return;
  try {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('action', action);
    const res = await fetch('api/adoption_action.php', { method: 'POST', body: fd });
    const j = await res.json();
    if (j.success) {
      showFlash(j.msg || 'Updated', 'info');
      loadAdoptions();
      loadAdminStats(); // refresh summary numbers
    } else {
      showFlash('Action failed: '+(j.msg||'unknown'), 'error');
    }
  } catch (err) {
    console.error(err);
    showFlash('Network error', 'error');
  }
}

function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function initAdminMap() {
  const mapEl = document.getElementById('admin-map');
  if (!mapEl) return;
  
  const map = L.map('admin-map').setView([20.5937, 78.9629], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  try {
    const res = await fetch('api/get_reports.php');
    if(res.ok) {
      const reports = await res.json();
      const bounds = [];
      reports.forEach(r => {
        if(r.latitude && r.longitude) {
          const marker = L.marker([r.latitude, r.longitude]).addTo(map);
          marker.bindPopup(`<b>${escapeHtml(r.type)}</b><br>${escapeHtml(r.location)}<br>Urgency: ${r.urgency}`);
          bounds.push([r.latitude, r.longitude]);
        }
      });
      if(bounds.length > 0) {
        map.fitBounds(bounds, {padding: [30, 30]});
      }
    }
  } catch(e) {
    console.error("Map load failed", e);
  }
}

document.addEventListener('DOMContentLoaded', function(){
  loadAdminStats();
  loadAdoptions();
  initAdminMap();
});
</script>
</body>
</html>
