/* =========================================================================
   DATA TEMA HARRY POTTER
   ========================================================================= */
const themes = {
  "Gryffindor": {
    sidebar_bg: "#1c1214",
    card_bg: "#2b181b",
    border_color: "#4a252b",
    text_main: "#f5e6d3",
    text_muted: "#c4a482",
    accent: "#e5c07b",
    content_bg: "rgba(229, 192, 123, 0.04)"
  },
  "Slytherin": {
    sidebar_bg: "#111c16",
    card_bg: "#16281e",
    border_color: "#234230",
    text_main: "#d8f3e5",
    text_muted: "#9ac2ac",
    accent: "#2ecc71",
    content_bg: "rgba(46, 204, 113, 0.04)"
  },
  "Ravenclaw": {
    sidebar_bg: "#111622",
    card_bg: "#1a2236",
    border_color: "#2c3b5e",
    text_main: "#e0eafc",
    text_muted: "#9bb1d0",
    accent: "#61afef",
    content_bg: "rgba(97, 175, 239, 0.04)"
  },
  "Hufflepuff": {
    sidebar_bg: "#1d1a12",
    card_bg: "#2e291a",
    border_color: "#473e27",
    text_main: "#fcf5e5",
    text_muted: "#d4c59d",
    accent: "#f1c40f",
    content_bg: "rgba(241, 196, 15, 0.04)"
  }
};

const sanskritTerms = [
  "Prathama (Pertama)",
  "Dwitiya (Kedua)",
  "Tritiya (Ketiga)",
  "Caturthi (Keempat)",
  "Panchami (Kelima)",
  "Shashthi (Keenam)",
  "Saptami (Ketujuh)"
];

function getSanskritVersion(index) {
  if (index < sanskritTerms.length) {
    return sanskritTerms[index];
  }
  return `Versi ke-${index + 1}`;
}

/* =========================================================================
   MANAJEMEN AKUN & LOCALSTORAGE (BERSIH DARI DATA DEFAULT)
   ========================================================================= */
const STORAGE_KEY_USERS = "aksara_users_db";
const STORAGE_KEY_CURRENT = "aksara_current_user";

// Data in-memory sesi aktif
let currentUser = null;
let appData = {
  profile: {
    emoji: "✒️",
    name: "Tamu",
    bio: "Penzair Sastra Nusantara",
    theme: "Gryffindor"
  },
  repos: {},
  trash: {}
};

// State form rintis bait
let newBaitsCount = 2;

function initUserDatabase() {
  let users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || "{}");
  let activeUser = localStorage.getItem(STORAGE_KEY_CURRENT);

  // Jika belum ada akun login, tampilkan modal pendaftaran/masuk
  if (!activeUser || !users[activeUser]) {
    currentUser = null;
    appData = {
      profile: {
        emoji: "✒️",
        name: "Pengunjung",
        bio: "Silakan Masuk atau Buat Akun",
        theme: "Gryffindor"
      },
      repos: {},
      trash: {}
    };
    openAuthModal('register');
  } else {
    currentUser = activeUser;
    appData = users[currentUser];
  }
}

function saveAppData() {
  if (!currentUser) return;
  let users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || "{}");
  users[currentUser] = appData;
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  renderSidebarIndices();
}

function applyTheme(themeName) {
  const t = themes[themeName] || themes["Gryffindor"];
  const root = document.documentElement;
  root.style.setProperty('--sidebar-bg', t.sidebar_bg);
  root.style.setProperty('--card-bg', t.card_bg);
  root.style.setProperty('--border-color', t.border_color);
  root.style.setProperty('--text-main', t.text_main);
  root.style.setProperty('--text-muted', t.text_muted);
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--content-bg', t.content_bg);

  const floatingBtn = document.getElementById('floating-toggle');
  if (floatingBtn) {
    floatingBtn.textContent = appData.profile.emoji || "✒️";
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  toast.innerHTML = `<span>📜</span><span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* =========================================================================
   MODAL & MULTI-AKUN LOGIKA
   ========================================================================= */
function switchAuthMode(mode) {
  const loginTab = document.getElementById('tab-login-btn');
  const regTab = document.getElementById('tab-reg-btn');
  const formLogin = document.getElementById('form-login');
  const formReg = document.getElementById('form-register');

  if (mode === 'login') {
    loginTab.classList.add('active');
    regTab.classList.remove('active');
    formLogin.style.display = 'block';
    formReg.style.display = 'none';
  } else {
    regTab.classList.add('active');
    loginTab.classList.remove('active');
    formLogin.style.display = 'none';
    formReg.style.display = 'block';
  }
}

function openAuthModal(mode = 'login') {
  switchAuthMode(mode);
  document.getElementById('auth-modal').classList.add('active');
}

function closeAuthModal() {
  if (!currentUser) {
    showToast("Silakan Masuk atau Buat Akun terlebih dahulu.");
    return;
  }
  document.getElementById('auth-modal').classList.remove('active');
}

function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('login-username').value.trim().toLowerCase();
  const p = document.getElementById('login-password').value;

  const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || "{}");
  if (!users[u] || users[u].password !== p) {
    showToast("⚠️ Nama pengguna atau kata sandi tidak cocok!");
    return;
  }

  currentUser = u;
  localStorage.setItem(STORAGE_KEY_CURRENT, currentUser);
  appData = users[currentUser];

  document.getElementById('auth-modal').classList.remove('active');
  document.getElementById('form-login').reset();
  showToast(`Selamat datang kembali, ${appData.profile.name}!`);
  bootApp();
}

function handleRegister(e) {
  e.preventDefault();
  const u = document.getElementById('reg-username').value.trim().toLowerCase();
  const fn = document.getElementById('reg-fullname').value.trim() || u;
  const th = document.getElementById('reg-theme').value;
  const p = document.getElementById('reg-password').value;

  if (u.length < 3) {
    showToast("⚠️ Username minimal 3 karakter!");
    return;
  }

  const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || "{}");
  if (users[u]) {
    showToast("⚠️ Akun dengan username ini sudah terdaftar. Silakan Masuk!");
    return;
  }

  // Akun baru dibuat dengan repositori dan tempat sampah yang KOSONG
  users[u] = {
    username: u,
    password: p,
    profile: {
      emoji: "✒️",
      name: fn,
      bio: "Penzair Sastra Nusantara",
      theme: th
    },
    repos: {},
    trash: {}
  };

  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  currentUser = u;
  localStorage.setItem(STORAGE_KEY_CURRENT, currentUser);
  appData = users[currentUser];

  document.getElementById('auth-modal').classList.remove('active');
  document.getElementById('form-register').reset();
  showToast(`Akun '${u}' berhasil dirintis! Selamat berkarya.`);
  bootApp();
}

/* =========================================================================
   SIDEBAR & NAVIGASI
   ========================================================================= */
function updateSidebarProfile() {
  const p = appData.profile;
  document.getElementById('sb-profile-title').textContent = `${p.emoji} ${p.name}`;
  document.getElementById('sb-profile-bio').textContent = p.bio;
  document.getElementById('sb-account-name').textContent = currentUser ? `Akun: @${currentUser}` : `Belum Masuk`;
  document.getElementById('floating-toggle').textContent = p.emoji;
}

function renderSidebarIndices() {
  const container = document.getElementById('sb-indeks-container');
  container.innerHTML = "";
  const repo = appData.repos || {};
  const keys = Object.keys(repo);

  if (keys.length === 0) {
    container.innerHTML = `<p class="sidebar-caption">Belum ada pustaka tersimpan.</p>`;
    return;
  }

  keys.forEach(titleKey => {
    const pData = repo[titleKey];
    const createdAt = (pData.commits[0].timestamp || "").split(" ")[0];
    const totalVers = pData.commits.length;
    const p = document.createElement('p');
    p.className = 'sidebar-caption';
    p.textContent = `📜 ${titleKey} (${createdAt} • ${totalVers}V)`;
    container.appendChild(p);
  });
}

function switchPage(pageKey) {
  document.querySelectorAll('.page-section').forEach(sec => sec.style.display = 'none');
  document.querySelectorAll('.nav-radio-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageKey);
  });

  const targetPage = document.getElementById(`page-${pageKey}`);
  if (targetPage) {
    targetPage.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (pageKey === 'pustaka-kawi') renderPustakaKawi();
  else if (pageKey === 'rintis-baru') renderRintisBaruInputs();
  else if (pageKey === 'revisi-diksi') renderRevisiDiksi();
  else if (pageKey === 'indeks-pustaka') renderIndeksPustaka();
  else if (pageKey === 'statistik') renderStatistik();
  else if (pageKey === 'sunting-profil') loadProfileForm();
  else if (pageKey === 'pralaya') renderPralaya();
}

/* =========================================================================
   1. HALAMAN: PUSTAKA KAWI
   ========================================================================= */
function renderPustakaKawi() {
  const container = document.getElementById('kawi-container');
  container.innerHTML = "";
  const repo = appData.repos || {};
  const keys = Object.keys(repo);

  if (keys.length === 0) {
    container.innerHTML = `
      <div class="st-info-box">
        Belum ada pustaka syair di dalam penyimpanan. Mari rintis karya pertamamu lewat menu sebelah!
      </div>
    `;
    return;
  }

  keys.forEach(titleKey => {
    const poetryData = repo[titleKey];
    const commits = poetryData.commits;
    const createdDate = commits[0].timestamp;
    const updatedDate = commits[commits.length - 1].timestamp;
    const latestCommit = commits[commits.length - 1];
    const tagsStr = (poetryData.tags || ["Umum"]).join(", ");
    const sanskritVer = getSanskritVersion(commits.length - 1);

    const expander = document.createElement('div');
    expander.className = 'expander-item';

    expander.innerHTML = `
      <div class="expander-header" onclick="toggleExpander(this)">
        <span>📜 ${titleKey} — (Stadia: ${sanskritVer} | Catatan: ${escapeHtml(latestCommit.title_version)})</span>
        <span class="arrow">▼</span>
      </div>
      <div class="expander-body">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div><strong>Tag Bahasa/Kategori:</strong> ${tagsStr}</div>
          <button class="btn btn-danger" onclick="movePoetryToTrash('${escapeJs(titleKey)}')">🗑️ Buang ke Pralaya</button>
        </div>

        <div style="background-color: var(--card-bg); padding: 8px 12px; border-radius: 6px; border-left: 3px solid var(--accent); font-size: 12px; color: var(--text-main); margin: 12px 0;">
          📅 <b>Dirintis:</b> ${createdDate} &nbsp;&nbsp;|&nbsp;&nbsp; 🔄 <b>Terakhir Disunting:</b> ${updatedDate} &nbsp;&nbsp;|&nbsp;&nbsp; 🏛️ <b>Fase:</b> ${sanskritVer}
        </div>

        <div class="tabs-header">
          <button class="tab-btn active" onclick="switchKawiTab(this, 'tab-preview-${escapeJs(titleKey)}')">📖 Pratinjau (Fase Terkini)</button>
          <button class="tab-btn" onclick="switchKawiTab(this, 'tab-history-${escapeJs(titleKey)}')">🕒 Riwayat Perubahan (Commit)</button>
        </div>

        <div id="tab-preview-${escapeJs(titleKey)}" class="tab-pane active">
          <h3 style="margin-top: 10px;">${escapeHtml(latestCommit.title_version)}</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 15px;">Pesan Commit Terakhir: "${escapeHtml(latestCommit.message)}"</p>
          <hr>
          <div class="poetry-box">${escapeHtml(latestCommit.content)}</div>
        </div>

        <div id="tab-history-${escapeJs(titleKey)}" class="tab-pane">
          <h3 style="margin: 12px 0;">Rekam Jejak Proses Kreatif</h3>
          <div class="history-list">
            ${renderCommitsHistoryHtml(commits)}
          </div>
        </div>
      </div>
    `;
    container.appendChild(expander);
  });
}

function renderCommitsHistoryHtml(commits) {
  let html = "";
  for (let i = commits.length - 1; i >= 0; i--) {
    const commit = commits[i];
    const revSanskrit = getSanskritVersion(i);
    html += `
      <div class="expander-item" style="margin-bottom: 8px;">
        <div class="expander-header" style="font-size: 13.5px; padding: 10px 14px;" onclick="toggleExpander(this)">
          <span>Commit #${i} [${revSanskrit}]: ${escapeHtml(commit.message)} (${commit.timestamp})</span>
          <span class="arrow">▼</span>
        </div>
        <div class="expander-body" style="padding: 12px 14px;">
          <p style="font-size: 12.5px; margin-bottom: 8px;"><strong>Sub-judul/Fase:</strong> ${escapeHtml(commit.title_version)}</p>
          <div style="background: rgba(0,0,0,0.4); padding: 10px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: pre-wrap; color: var(--text-main); border: 1px solid var(--border-color);">${escapeHtml(commit.content)}</div>
        </div>
      </div>
    `;
  }
  return html;
}

function switchKawiTab(btn, tabId) {
  const parent = btn.closest('.expander-body');
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

function movePoetryToTrash(titleKey) {
  if (!appData.repos[titleKey]) return;
  appData.trash[titleKey] = appData.repos[titleKey];
  delete appData.repos[titleKey];
  saveAppData();
  showToast(`Pustaka '${titleKey}' dilebur ke Pralaya (Tempat Sampah)!`);
  renderPustakaKawi();
}

/* =========================================================================
   2. HALAMAN: RINTIS PUSTAKA BARU
   ========================================================================= */
function renderRintisBaruInputs() {
  const container = document.getElementById('new-baits-container');
  const existingValues = [];
  container.querySelectorAll('textarea').forEach(t => existingValues.push(t.value));

  container.innerHTML = "";
  for (let i = 0; i < newBaitsCount; i++) {
    const val = existingValues[i] || "";
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <label class="form-label">Bait ke-${i + 1}</label>
      <textarea class="input-textarea" id="new-bait-${i}" rows="4" placeholder="Tulis isi bait ke-${i + 1} di sini...">${escapeHtml(val)}</textarea>
    `;
    container.appendChild(div);
  }
  document.getElementById('btn-rem-bait').disabled = (newBaitsCount <= 1);
}

function addBaitToNew() {
  newBaitsCount++;
  renderRintisBaruInputs();
}

function removeBaitFromNew() {
  if (newBaitsCount > 1) {
    newBaitsCount--;
    renderRintisBaruInputs();
  }
}

function saveNewPoetry() {
  const title = document.getElementById('new-poetry-title').value.trim();
  const tagsInput = document.getElementById('new-poetry-tags').value.trim();
  const commitMsg = document.getElementById('new-poetry-commit').value.trim() || "Initial commit: draf awal pustaka";

  const baits = [];
  for (let i = 0; i < newBaitsCount; i++) {
    const el = document.getElementById(`new-bait-${i}`);
    if (el && el.value.trim()) {
      baits.push(el.value.trim());
    }
  }

  const fullContent = baits.join("\n\n");

  if (!title || !fullContent) {
    showToast("⚠️ Judul pustaka dan minimal satu bait syair tidak boleh kosong!");
    return;
  }

  if (appData.repos[title] || appData.trash[title]) {
    showToast("⚠️ Judul pustaka ini sudah ada di penyimpanan atau Pralaya. Gunakan nama lain.");
    return;
  }

  const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : ["Umum"];
  const now = formatCurrentDateTime();

  appData.repos[title] = {
    tags: tags,
    commits: [
      {
        timestamp: now,
        title_version: "Prathama (Draf Awal)",
        content: fullContent,
        message: commitMsg
      }
    ]
  };

  saveAppData();
  showToast(`Pustaka syair '${title}' berhasil dirintis dan di-commit!`);

  document.getElementById('new-poetry-title').value = "";
  document.getElementById('new-poetry-tags').value = "";
  document.getElementById('new-poetry-commit').value = "Initial commit: draf awal pustaka";
  newBaitsCount = 2;
  renderRintisBaruInputs();

  switchPage('pustaka-kawi');
}

/* =========================================================================
   3. HALAMAN: REVISI DIKSI
   ========================================================================= */
const revisiBaitCounts = {};

function renderRevisiDiksi() {
  const container = document.getElementById('revisi-container');
  container.innerHTML = "";
  const repo = appData.repos || {};
  const keys = Object.keys(repo);

  if (keys.length === 0) {
    container.innerHTML = `<div class="st-info-box">Belum ada pustaka yang bisa direvisi di dalam penyimpanan.</div>`;
    return;
  }

  keys.forEach(tName => {
    const tData = repo[tName];
    const commits = tData.commits;
    const tLatest = commits[commits.length - 1];
    const currSanskrit = getSanskritVersion(commits.length - 1);

    const currentBaits = tLatest.content.split("\n\n");
    if (revisiBaitCounts[tName] === undefined) {
      revisiBaitCounts[tName] = Math.max(currentBaits.length, 2);
    }

    const expander = document.createElement('div');
    expander.className = 'expander-item';
    expander.innerHTML = `
      <div class="expander-header" onclick="toggleExpander(this)">
        <span>📝 ${tName} (Fase Terkini: ${currSanskrit})</span>
        <span class="arrow">▼</span>
      </div>
      <div class="expander-body">
        <div class="flex-row-gap" style="margin-bottom: 15px;">
          <button class="btn btn-outline" onclick="changeRevisiBaitCount('${escapeJs(tName)}', 1)">➕ Tambah Bait</button>
          <button class="btn btn-outline" onclick="changeRevisiBaitCount('${escapeJs(tName)}', -1)">➖ Kurangi Bait</button>
        </div>

        <div class="form-group">
          <label class="form-label">Catatan Fase / Sub-judul</label>
          <input type="text" class="input-text" id="revisi-sub-${escapeJs(tName)}" value="${escapeHtml(tLatest.title_version)}">
        </div>

        <div id="revisi-baits-list-${escapeJs(tName)}" style="display:flex; flex-direction:column; gap:12px; margin-bottom:15px;">
          ${renderRevisiBaitInputs(tName, currentBaits)}
        </div>

        <div class="form-group">
          <label class="form-label">Pesan Commit (Contoh: 'ganti bait kedua pakai diksi sanskerta')</label>
          <input type="text" class="input-text" id="revisi-msg-${escapeJs(tName)}" placeholder="Tulis catatan revisi...">
        </div>

        <button class="btn btn-accent" onclick="saveRevisiCommit('${escapeJs(tName)}')">Simpan Perubahan Pustaka '${tName}'</button>
      </div>
    `;
    container.appendChild(expander);
  });
}

function renderRevisiBaitInputs(tName, currentBaits) {
  let html = "";
  const count = revisiBaitCounts[tName];
  for (let i = 0; i < count; i++) {
    const defaultVal = (i < currentBaits.length) ? currentBaits[i] : "";
    html += `
      <div class="form-group">
        <label class="form-label">Bait ke-${i + 1}</label>
        <textarea class="input-textarea" id="revisi-bait-${escapeJs(tName)}-${i}" rows="4">${escapeHtml(defaultVal)}</textarea>
      </div>
    `;
  }
  return html;
}

function changeRevisiBaitCount(tName, delta) {
  const cur = revisiBaitCounts[tName] || 2;
  const next = cur + delta;
  if (next >= 1) {
    revisiBaitCounts[tName] = next;
    renderRevisiDiksi();
  }
}

function saveRevisiCommit(tName) {
  const repo = appData.repos;
  if (!repo[tName]) return;

  const subTitle = document.getElementById(`revisi-sub-${tName}`).value.trim();
  let commitMsg = document.getElementById(`revisi-msg-${tName}`).value.trim();

  const count = revisiBaitCounts[tName] || 2;
  const editBaits = [];

  for (let i = 0; i < count; i++) {
    const el = document.getElementById(`revisi-bait-${tName}-${i}`);
    if (el && el.value.trim()) {
      editBaits.push(el.value.trim());
    }
  }

  const fullNewContent = editBaits.join("\n\n");
  if (!fullNewContent) {
    showToast("⚠️ Isi bait syair tidak boleh kosong!");
    return;
  }

  const now = formatCurrentDateTime();
  if (!commitMsg) {
    commitMsg = `Update pada ${now.slice(0, 16)}`;
  }

  const nextSanskrit = getSanskritVersion(repo[tName].commits.length);
  const newCommit = {
    timestamp: now,
    title_version: subTitle ? subTitle : `Revisi ${nextSanskrit}`,
    content: fullNewContent,
    message: commitMsg
  };

  repo[tName].commits.push(newCommit);
  saveAppData();
  showToast(`Perubahan untuk pustaka '${tName}' berhasil disimpan!`);
  renderRevisiDiksi();
}

/* =========================================================================
   4. HALAMAN: INDEKS PUSTAKA
   ========================================================================= */
function renderIndeksPustaka() {
  const container = document.getElementById('indeks-main-container');
  container.innerHTML = "";
  const repo = appData.repos || {};
  const keys = Object.keys(repo);

  if (keys.length === 0) {
    container.innerHTML = `<div class="st-info-box">Belum ada pustaka syair tersimpan. Mari rintis karya pertamamu lewat menu Rintis Pustaka Baru!</div>`;
    return;
  }

  keys.forEach(titleKey => {
    const poetryData = repo[titleKey];
    const commits = poetryData.commits;
    const latestCommit = commits[commits.length - 1];
    const tagsStr = (poetryData.tags || ["Umum"]).join(", ");
    const sanskritVer = getSanskritVersion(commits.length - 1);

    const expander = document.createElement('div');
    expander.className = 'expander-item';
    expander.innerHTML = `
      <div class="expander-header" onclick="toggleExpander(this)">
        <span>📜 ${titleKey} (Stadia: ${sanskritVer})</span>
        <span class="arrow">▼</span>
      </div>
      <div class="expander-body">
        <p style="color: var(--text-muted); font-size: 13px; margin-top: 0; margin-bottom: 12px;">
          <i>${escapeHtml(latestCommit.title_version)}</i> &nbsp;•&nbsp; Tag: ${tagsStr}
        </p>
        <div class="poetry-box">${escapeHtml(latestCommit.content)}</div>
      </div>
    `;
    container.appendChild(expander);
  });
}

/* =========================================================================
   5. HALAMAN: STATISTIK PRODUKTIVITAS
   ========================================================================= */
function renderStatistik() {
  const repo = appData.repos || {};
  const contributionCounts = {};
  let totalPoems = Object.keys(repo).length;
  let totalCommits = 0;

  Object.values(repo).forEach(data => {
    data.commits.forEach(commit => {
      totalCommits++;
      const dateStr = (commit.timestamp || "").split(" ")[0];
      if (dateStr) {
        contributionCounts[dateStr] = (contributionCounts[dateStr] || 0) + 1;
      }
    });
  });

  const boxesContainer = document.getElementById('contribution-heatmap-boxes');
  boxesContainer.innerHTML = "";

  const today = new Date();
  const daysToShow = 35;

  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const count = contributionCounts[dateStr] || 0;
    let boxColor = "#161b22";
    let borderColor = "#30363d";

    if (count === 1) {
      boxColor = "#0e4429";
      borderColor = "#006d32";
    } else if (count === 2) {
      boxColor = "#006d32";
      borderColor = "#26a641";
    } else if (count >= 3) {
      boxColor = "#26a641";
      borderColor = "#39d353";
    }

    const box = document.createElement('div');
    box.title = `${dateStr}: ${count} commit`;
    box.style.cssText = `width: 15px; height: 15px; background-color: ${boxColor}; border: 1px solid ${borderColor}; border-radius: 3px; display: inline-block; margin: 2px; cursor: pointer;`;
    boxesContainer.appendChild(box);
  }

  document.getElementById('metric-total-poems').textContent = `${totalPoems} Judul`;
  document.getElementById('metric-total-commits').textContent = `${totalCommits} Kali`;
}

/* =========================================================================
   6. HALAMAN: SUNTING PROFIL & TEMA
   ========================================================================= */
function loadProfileForm() {
  const p = appData.profile;
  document.getElementById('edit-profile-emoji').value = p.emoji || "✒️";
  document.getElementById('edit-profile-name').value = p.name || "";
  document.getElementById('edit-profile-bio').value = p.bio || "";
  document.getElementById('edit-profile-theme').value = p.theme || "Gryffindor";
}

function handleSaveProfile(e) {
  e.preventDefault();
  const emoji = document.getElementById('edit-profile-emoji').value;
  const name = document.getElementById('edit-profile-name').value.trim();
  const bio = document.getElementById('edit-profile-bio').value.trim();
  const theme = document.getElementById('edit-profile-theme').value;

  if (!name) {
    showToast("⚠️ Nama penzair tidak boleh kosong!");
    return;
  }

  appData.profile.emoji = emoji;
  appData.profile.name = name;
  appData.profile.bio = bio;
  appData.profile.theme = theme;

  saveAppData();
  applyTheme(theme);
  updateSidebarProfile();

  showToast("Profil dan tema warna berhasil diperbarui!");
}

/* =========================================================================
   7. HALAMAN: PRALAYA (TEMPAT SAMPAH)
   ========================================================================= */
function renderPralaya() {
  const container = document.getElementById('pralaya-container');
  container.innerHTML = "";
  const trash = appData.trash || {};
  const keys = Object.keys(trash);

  if (keys.length === 0) {
    container.innerHTML = `<div class="st-info-box">Pralaya sunyi. Belum ada pustaka yang dilebur.</div>`;
    return;
  }

  keys.forEach(tKey => {
    const tVal = trash[tKey];
    const latestC = tVal.commits[tVal.commits.length - 1];

    const expander = document.createElement('div');
    expander.className = 'expander-item';
    expander.innerHTML = `
      <div class="expander-header" onclick="toggleExpander(this)">
        <span>🌪️ ${tKey} (Arsip Terlebur)</span>
        <span class="arrow">▼</span>
      </div>
      <div class="expander-body">
        <div class="flex-row-gap" style="margin-bottom: 15px;">
          <button class="btn btn-success" onclick="restoreFromTrash('${escapeJs(tKey)}')">♻️ Pulihkan Pustaka</button>
          <button class="btn btn-danger" onclick="deletePermanently('${escapeJs(tKey)}')">🔥 Musnahkan Permanen</button>
        </div>
        <div class="poetry-box">${escapeHtml(latestC.content)}</div>
      </div>
    `;
    container.appendChild(expander);
  });
}

function restoreFromTrash(tKey) {
  if (!appData.trash[tKey]) return;
  appData.repos[tKey] = appData.trash[tKey];
  delete appData.trash[tKey];
  saveAppData();
  showToast(`Pustaka '${tKey}' berhasil dipulihkan dari Pralaya!`);
  renderPralaya();
}

function deletePermanently(tKey) {
  if (!appData.trash[tKey]) return;
  delete appData.trash[tKey];
  saveAppData();
  showToast(`Pustaka '${tKey}' dimusnahkan secara permanen.`);
  renderPralaya();
}

/* =========================================================================
   UTILITY HELPERS
   ========================================================================= */
function toggleExpander(headerEl) {
  const item = headerEl.closest('.expander-item');
  item.classList.toggle('open');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJs(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function formatCurrentDateTime() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const ii = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`;
}

/* =========================================================================
   BOOTSTRAP & EVENT LISTENERS
   ========================================================================= */
function bootApp() {
  applyTheme(appData.profile.theme || "Gryffindor");
  updateSidebarProfile();
  renderSidebarIndices();
  switchPage('pustaka-kawi');
}

window.onload = function () {
  initUserDatabase();

  document.querySelectorAll('.nav-radio-item').forEach(item => {
    item.addEventListener('click', () => {
      switchPage(item.dataset.page);
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.add('collapsed');
      }
    });
  });

  const floatingBtn = document.getElementById('floating-toggle');
  floatingBtn.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
  });

  bootApp();
};