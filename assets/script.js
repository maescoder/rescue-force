// assets/script.js
// Combined front-end script for Pet Rescue Center
// - fetches DB counter and animates it
// - loads admin-added animals from api/get_animals.php and appends to the slider (mixed gallery)
// - handles report form submission via fetch
// - handles adoption form submission via fetch (on adoption.php)
// - chat widget helpers
// - defensive: will not error if parts of the page are missing

/* ========== COUNTER (fetch from API + animate) ========== */
async function fetchRescuedCount() {
  try {
    const res = await fetch('api/get_stats.php', { cache: 'no-store' });
    if (!res.ok) {
      console.warn('get_stats failed', res.status);
      return;
    }
    const json = await res.json();
    const target = parseInt(json.rescued_count || 0, 10);
    animateCounterTo(target);
  } catch (err) {
    console.error('Could not load rescued count:', err);
  }
}

let displayedCount = 0;
let counterInterval = null;

function animateCounterTo(target) {
  const counterEl = document.getElementById('counter');
  if (!counterEl) return;

  clearInterval(counterInterval);

  // if target is the same or less, set directly
  if (target <= displayedCount) {
    displayedCount = target;
    counterEl.textContent = displayedCount;
    return;
  }

  const duration = 900; // total duration of animation in ms
  const steps = 30;
  const stepTime = Math.max(10, Math.floor(duration / steps));
  const diff = target - displayedCount;
  const stepVal = Math.ceil(diff / steps);

  counterInterval = setInterval(() => {
    displayedCount += stepVal;
    if (displayedCount >= target) {
      displayedCount = target;
      clearInterval(counterInterval);
    }
    counterEl.textContent = displayedCount;
  }, stepTime);
}

/* ========== MIXED GALLERY: load admin-added animals and append to slider ========== */
async function loadDynamicAnimals() {
  try {
    const res = await fetch('api/get_animals.php', { cache: 'no-store' });
    if (!res.ok) {
      console.warn('get_animals failed', res.status);
      return;
    }

    const animals = await res.json();
    if (!Array.isArray(animals) || animals.length === 0) return;

    const slider = document.querySelector('.slider-container');
    if (!slider) return;

    // Collect existing image srcs to try to avoid duplicates (simple check)
    const existingSrcs = new Set();
    slider.querySelectorAll('img').forEach(img => {
      if (img.src) {
        // convert to relative path if same origin
        try {
          const u = new URL(img.src, location.href);
          existingSrcs.add(u.pathname.replace(/^\/+/, '')); // remove leading slash
        } catch (e) {
          existingSrcs.add(img.src);
        }
      }
    });

    animals.forEach(a => {
      // if image path already exists among static items, skip adding duplicate
      const imagePath = a.image_path ? a.image_path.trim() : '';
      const normalized = imagePath.replace(/^\.\//, '').replace(/^\/+/, ''); // remove leading ./ or /
      if (imagePath && existingSrcs.has(normalized)) {
        // skip duplicate
        return;
      }

      const div = document.createElement('div');
      div.className = 'slide-item';

      // compose tooltip: prefer story, show name/species
      const infoParts = [];
      if (a.name) infoParts.push(a.name);
      if (a.species) infoParts.push(a.species);
      if (a.story) infoParts.push(a.story);
      const infoText = infoParts.join(' — ');
      div.setAttribute('data-info', infoText || 'Rescued animal');

      const img = document.createElement('img');
      img.alt = a.name ? a.name : (a.species ? a.species : 'Rescue');
      img.loading = 'lazy';
      // fallback placeholder if no image_path
      img.src = imagePath ? imagePath : 'assets/images/placeholder.jpg';

      // consistent inline sizing (CSS handles most, but set minimal here)
      img.style.width = '200px';
      img.style.height = '200px';
      img.style.objectFit = 'cover';

      div.appendChild(img);
      slider.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading dynamic animals:', err);
  }
}

/* ========== REPORT FORM (rescueForm) handler ========== */
async function initRescueForm() {
  const form = document.getElementById('rescueForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const fd = new FormData(form);

    // client-side basic validation
    if (!fd.get('location') || !fd.get('contact') || !fd.get('rescuer')) {
      alert('Please fill required fields: Location, Contact, Rescuer Name.');
      return;
    }

    // optional prompt (keeps your original UX)
    try {
      const isOnWay = (prompt("Are you on your way to rescue? (yes/no)") || '').toLowerCase();
      if (isOnWay === 'yes') {
        alert('Thank you! Your prompt action to rescue is appreciated.');
      } else {
        alert('Thank you! We will inform the nearest rescue team to assist.');
      }
    } catch (err) {
      // prompt could be blocked — ignore
    }

    try {
      const res = await fetch(form.action || 'report_submit.php', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      alert(data.msg || (data.success ? 'Submitted' : 'Error submitting'));
      if (data.success) form.reset();
    } catch (err) {
      console.error('Report submit failed:', err);
      alert('Network error — please try again.');
    }
  });
}

/* ========== ADOPTION FORM handler (works on adoption.php) ========== */
function initAdoptionForm() {
  const form = document.getElementById('adoptionForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const fd = new FormData(form);

    // basic validation
    if (!fd.get('fullName') || !fd.get('email')) {
      alert('Please provide name and email.');
      return;
    }

    try {
      const res = await fetch(form.action || 'adoption_submit.php', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      alert(data.msg || (data.success ? 'Submitted' : 'Error submitting'));
      if (data.success) form.reset();
    } catch (err) {
      console.error('Adoption submit failed:', err);
      alert('Network error — please try again.');
    }
  });
}

/* ========== CHAT WIDGET helpers (toggle, reply) ========== */
function toggleChat() {
  const box = document.getElementById('chat-box');
  if (!box) return;
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function getChatReply(msg) {
  if (!msg) return "Hi — how can we help you?";
  msg = msg.toLowerCase();
  if (msg.includes('adopt')) {
    return "To adopt a pet, click the 'Go to adoption page' button or visit the Adoption section!";
  }
  if (msg.includes('report') || msg.includes('animal in need')) {
    return "You can report an animal in need using the 'Report an Animal in Need' form on this page.";
  }
  if (msg.includes('volunteer')) {
    return "Thank you for your interest! Please contact us via the form or email to become a volunteer.";
  }
  if (msg.includes('location') || msg.includes('where')) {
    return "You can find rescue centres on the map section above.";
  }
  if (msg.includes('contact')) {
    return "You can contact us using the form or through our social media links.";
  }
  if (msg.includes('donate')) {
    return "Thank you for your support! Donation options will be available soon.";
  }
  if (msg.includes('hello') || msg.includes('hi')) {
    return "Hello! How can we help you today?";
  }
  if (msg.includes('ngos')) {
    return "We work with NGOs like People for Animals, Blue Cross of India, and The Rescue Project.";
  }
  return "Thanks — we'll get back to you soon.";
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const chatHistory = document.getElementById('chatHistory');
  if (!input || !chatHistory) return;
  const userMsg = input.value.trim();
  if (!userMsg) return;

  // append user message
  chatHistory.innerHTML += `<div style="text-align:right;margin-bottom:6px;"><span style="background:#ff6b6b;padding:6px 10px;border-radius:8px 8px 0 8px;display:inline-block;color:#fff;">${escapeHtml(userMsg)}</span></div>`;
  input.value = '';

  const bot = getChatReply(userMsg);
  setTimeout(() => {
    chatHistory.innerHTML += `<div style="text-align:left;margin-bottom:10px;"><span style="background:#444;padding:6px 10px;border-radius:8px 8px 8px 0;display:inline-block;color:#fff;">${escapeHtml(bot)}</span></div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }, 300);
}

// small helper to prevent HTML injection in chat
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g,'&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ========== INITIALIZE on DOMContentLoaded ==========
   - fetch counter
   - load dynamic gallery (after static images)
   - attach form handlers if forms exist on the page
====================================================== */
document.addEventListener('DOMContentLoaded', function () {
  // Fetch and animate counter (if #counter exists)
  try { fetchRescuedCount(); } catch (e) { console.warn('fetchRescuedCount error', e); }

  // Load admin-added animals (mixed gallery)
  try { loadDynamicAnimals(); } catch (e) { console.warn('loadDynamicAnimals error', e); }

  // Attach rescue form handler (index page)
  try { initRescueForm(); } catch (e) { console.warn('initRescueForm error', e); }

  // Attach adoption form handler (adoption.php)
  try { initAdoptionForm(); } catch (e) { console.warn('initAdoptionForm error', e); }

  // wire chat button (if present)
  const chatBtn = document.querySelector('#chat-widget > button');
  if (chatBtn) chatBtn.addEventListener('click', toggleChat);

  // wire send button in chat (if present)
  const sendBtn = document.querySelector('#chat-box button');
  if (sendBtn) sendBtn.addEventListener('click', sendChat);

  // allow pressing Enter in chat input to send
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        sendChat();
      }
    });
  }
});
