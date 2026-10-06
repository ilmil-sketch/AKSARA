from datetime import datetime, timedelta
import json
import os
import streamlit as st

# Konfigurasi Halaman
st.set_page_config(
    page_title="Aksara - Pustaka Sastra Nusantara", page_icon="📜", layout="wide"
)

# File penyimpanan lokal sederhana
DB_FILE = "poet_repository.json"


def load_data():
  if os.path.exists(DB_FILE):
    try:
      with open(DB_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        if not isinstance(data, dict):
          data = {}
    except Exception:
      data = {}
  else:
    data = {}

  if "profile" not in data:
    data["profile"] = {
        "emoji": "✒️",
        "name": "Noir",
        "bio": "Penzair & Developer",
        "theme": "Gryffindor",
    }
  if "theme" not in data["profile"]:
    data["profile"]["theme"] = "Gryffindor"

  if "repos" not in data:
    old_repos = {k: v for k, v in data.items() if k != "profile" and k != "trash"}
    data["repos"] = old_repos if old_repos else {}

  if "trash" not in data:
    data["trash"] = {}

  return data


def save_data(data):
  with open(DB_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)


# Inisialisasi Data Global di Session State
if "app_data" not in st.session_state:
  st.session_state.app_data = load_data()

profile = st.session_state.app_data["profile"]

# --- PALET WARNA TEMA HARRY POTTER ---
themes = {
    "Gryffindor": {
        "sidebar_bg": "#1c1214",
        "card_bg": "#2b181b",
        "border_color": "#4a252b",
        "text_main": "#f5e6d3",
        "text_muted": "#c4a482",
        "accent": "#e5c07b",
        "content_bg": "rgba(229, 192, 123, 0.04)",
    },
    "Slytherin": {
        "sidebar_bg": "#111c16",
        "card_bg": "#16281e",
        "border_color": "#234230",
        "text_main": "#d8f3e5",
        "text_muted": "#9ac2ac",
        "accent": "#2ecc71",
        "content_bg": "rgba(46, 204, 113, 0.04)",
    },
    "Ravenclaw": {
        "sidebar_bg": "#111622",
        "card_bg": "#1a2236",
        "border_color": "#2c3b5e",
        "text_main": "#e0eafc",
        "text_muted": "#9bb1d0",
        "accent": "#61afef",
        "content_bg": "rgba(97, 175, 239, 0.04)",
    },
    "Hufflepuff": {
        "sidebar_bg": "#1d1a12",
        "card_bg": "#2e291a",
        "border_color": "#473e27",
        "text_main": "#fcf5e5",
        "text_muted": "#d4c59d",
        "accent": "#f1c40f",
        "content_bg": "rgba(241, 196, 15, 0.04)",
    },
}

current_theme_name = profile.get("theme", "Gryffindor")
t = themes.get(current_theme_name, themes["Gryffindor"])

# --- INJEKSI CSS STABIL, ESTETIK, & TOMBOL FLOATING POJOK KIRI BAWAH ---
st.markdown(
    f"""
    <style>
        .stApp {{
            background-color: #0d0d12;
        }}
        /* Warna Sidebar */
        [data-testid="stSidebar"] {{
            background-color: {t['sidebar_bg']};
            color: {t['text_main']};
        }}
        [data-testid="stSidebar"] .stMarkdown, 
        [data-testid="stSidebar"] label, 
        [data-testid="stSidebar"] .stRadio div {{
            color: {t['text_main']} !important;
        }}
        .aksara-logo {{
            text-align: center;
            margin-bottom: 10px;
        }}
        .sidebar-card {{
            background-color: {t['card_bg']};
            padding: 14px;
            border-radius: 8px;
            border: 1px solid {t['border_color']};
            margin-bottom: 15px;
        }}
        .sidebar-title {{
            font-size: 16px !important;
            font-weight: 800 !important;
            color: {t['accent']} !important;
            letter-spacing: 0.8px;
            margin-bottom: 10px !important;
        }}
        
        /* Sinkronisasi Area Utama (Main) */
        h1, h2, h3 {{
            color: {t['accent']} !important;
        }}
        hr {{
            border-color: {t['border_color']} !important;
        }}
        .poetry-box {{
            padding: 25px 30px; 
            border-left: 4px solid {t['accent']}; 
            background-color: {t['content_bg']}; 
            border-radius: 6px; 
            white-space: pre-wrap; 
            font-family: monospace; 
            font-size: 15px; 
            line-height: 1.8; 
            margin-bottom: 35px; 
            color: {t['text_main']};
            border-top: 1px solid {t['border_color']};
            border-right: 1px solid {t['border_color']};
            border-bottom: 1px solid {t['border_color']};
        }}

        /* Styling Floating Button Estetik di Pojok Kiri Bawah */
        .floating-toggle-container {{
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 999999;
        }}
        .floating-toggle-btn {{
            background-color: {t['card_bg']}; 
            color: {t['accent']}; 
            border: 1px solid {t['border_color']}; 
            width: 46px;
            height: 46px;
            border-radius: 50%; 
            cursor: pointer; 
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            transition: transform 0.2s ease, background-color 0.2s ease;
        }}
        .floating-toggle-btn:hover {{
            transform: scale(1.1);
            background-color: {t['border_color']};
        }}
    </style>
""",
    unsafe_allow_html=True,
)


def get_sanskrit_version(index):
  sanskrit_terms = [
      "Prathama (Pertama)",
      "Dwitiya (Kedua)",
      "Tritiya (Ketiga)",
      "Caturthi (Keempat)",
      "Panchami (Kelima)",
      "Shashthi (Keenam)",
      "Saptami (Ketujuh)",
  ]
  if index < len(sanskrit_terms):
    return sanskrit_terms[index]
  return f"Versi ke-{index + 1}"


if "jumlah_bait" not in st.session_state:
  st.session_state.jumlah_bait = 2

repo = st.session_state.app_data["repos"]
trash = st.session_state.app_data["trash"]

# --- SIDEBAR SECTION ---
with st.sidebar:
  st.markdown(
      f"""
        <div class="sidebar-card aksara-logo" style="padding-top: 15px; padding-bottom: 15px;">
            <h1 style="margin: 0; color: {t['text_main']}; font-size: 28px;">📜 Aksara</h1>
            <p style="font-size: 18px; color: {t['accent']}; margin: 6px 0 0 0; letter-spacing: 3px;">ꦲꦏ꧀ꦱꦫ</p>
        </div>
    """,
      unsafe_allow_html=True,
  )

  st.markdown(
      f"""
        <div class="sidebar-card" style="text-align: center;">
            <h4 style="margin: 0; color: {t['accent']};">{profile['emoji']} {profile['name']}</h4>
            <p style="font-size: 12px; margin: 4px 0 0 0; color: {t['text_muted']};">{profile['bio']}</p>
        </div>
    """,
      unsafe_allow_html=True,
  )

  st.markdown('<div class="sidebar-card">', unsafe_allow_html=True)
  st.markdown(
      '<p class="sidebar-title">🧭 NAVIGASI UTAMA</p>', unsafe_allow_html=True
  )
  menu = st.radio(
      "Navigasi Menu",
      [
          "Pustaka Kawi",
          "Rintis Pustaka Baru",
          "Revisi Diksi",
          "Indeks Pustaka",
          "Statistik Produktivitas",
          "Sunting Profil",
          "Pralaya",
      ],
      label_visibility="collapsed",
  )
  st.markdown("</div>", unsafe_allow_html=True)

  st.markdown('<div class="sidebar-card">', unsafe_allow_html=True)
  st.markdown(
      '<p class="sidebar-title">📂 INDEKS PUSTAKA</p>', unsafe_allow_html=True
  )

  if repo:
    for title_key, p_data in repo.items():
      created_at = p_data["commits"][0]["timestamp"].split(" ")[0]
      total_vers = len(p_data["commits"])
      st.sidebar.caption(f"📜 {title_key} ({created_at} • {total_vers}V)")
  else:
    st.caption("Belum ada pustaka tersimpan.")
  st.markdown("</div>", unsafe_allow_html=True)

  st.caption("v1.0.0 • Pustaka Sastra Nusantara")

# --- SKRIP JAVASCRIPT UNTUK TOMBOL FLOATING KIRI BAWAH ---
st.markdown(
    f"""
    <div class="floating-toggle-container">
        <button class="floating-toggle-btn" onclick="
            const triggerBtn = parent.document.querySelector('[data-testid=\\'collapsedControl\\']') || 
                               parent.document.querySelector('button[kind=\\'header\\']');
            if (triggerBtn) {{
                triggerBtn.click();
            }} else {{
                const altBtn = parent.document.querySelector('section[data-testid=\\'stSidebar\\'] ~ div button');
                if (altBtn) altBtn.click();
            }}
        " title="Buka/Tutup Sidebar">{profile['emoji']}</button>
    </div>
""",
    unsafe_allow_html=True,
)

# -------------------------------------------------------------------------
# 1. HALAMAN: PUSTAKA KAWI
# -------------------------------------------------------------------------
if menu == "Pustaka Kawi":
  st.title("📂 Pustaka Kawi — Pengelolaan Naskah & Riwayat")
  st.markdown(
      "Kelola riwayat fase, pindahkan pustaka ke Pralaya, dan telusuri rekam"
      " jejak commit versinya di sini."
  )
  st.markdown("---")

  if not repo:
    st.info(
        "Belum ada pustaka syair di dalam penyimpanan. Mari rintis karya"
        " pertamamu lewat menu sebelah!"
    )
  else:
    for title_key, poetry_data in repo.items():
      commits = poetry_data["commits"]
      created_date = commits[0]["timestamp"]
      updated_date = commits[-1]["timestamp"]
      latest_commit = commits[-1]
      tags_str = ", ".join(poetry_data.get("tags", ["Umum"]))
      sanskrit_ver = get_sanskrit_version(len(commits) - 1)

      with st.expander(
          f"📜 {title_key} — (Stadia: {sanskrit_ver} | Catatan:"
          f" {latest_commit['title_version']})"
      ):
        col1, col2 = st.columns([3, 1])
        with col1:
          st.markdown(f"**Tag Bahasa/Kategori:** {tags_str}")
        with col2:
          if st.button("🗑️ Buang ke Pralaya", key=f"del_{title_key}"):
            trash[title_key] = repo.pop(title_key)
            save_data(st.session_state.app_data)
            st.success(
                f"Pustaka '{title_key}' dilebur ke Pralaya (Tempat Sampah),"
                " Noir!"
            )
            st.rerun()

        st.markdown(
            f"""
                <div style="background-color: {t['card_bg']}; padding: 8px 12px; border-radius: 6px; border-left: 3px solid {t['accent']}; font-size: 12px; color: {t['text_main']}; margin: 10px 0;">
                    📅 <b>Dirintis:</b> {created_date} &nbsp;&nbsp;|&nbsp;&nbsp; 🔄 <b>Terakhir Disunting:</b> {updated_date} &nbsp;&nbsp;|&nbsp;&nbsp; 🏛️ <b>Fase:</b> {sanskrit_ver}
                </div>
                """,
            unsafe_allow_html=True,
        )

        tab_content, tab_history = st.tabs(
            ["📖 Pratinjau (Fase Terkini)", "🕒 Riwayat Perubahan (Commit)"]
        )

        with tab_content:
          st.markdown(f"### {latest_commit['title_version']}")
          st.text(f"Pesan Commit Terakhir: \"{latest_commit['message']}\"")
          st.markdown("---")
          st.markdown(
              f"<div class='poetry-box'>{latest_commit['content']}</div>",
              unsafe_allow_html=True,
          )

        with tab_history:
          st.markdown("### Rekam Jejak Proses Kreatif")
          for i, commit in enumerate(reversed(commits)):
            commit_idx = len(commits) - 1 - i
            rev_sanskrit = get_sanskrit_version(commit_idx)
            with st.expander(
                f"Commit #{commit_idx} [{rev_sanskrit}]: {commit['message']}"
                f" ({commit['timestamp']})"
            ):
              st.write(f"**Sub-judul/Fase:** {commit['title_version']}")
              st.code(commit["content"], language="text")

# -------------------------------------------------------------------------
# 2. HALAMAN: RINTIS PUSTAKA BARU
# -------------------------------------------------------------------------
elif menu == "Rintis Pustaka Baru":
  st.title("✍️ Rintis Pustaka Syair Baru")
  st.markdown(
      "Mulai lembaran naskah baru untuk karyamu. Susun bait demi bait secara"
      " terstruktur."
  )

  title = st.text_input("Judul Pustaka Syair", autocomplete="off")
  tags_input = st.text_input(
      "Tag (pisahkan dengan koma, misal: Indonesia, Javanese, Sanskrit)",
      autocomplete="off",
  )

  st.markdown("---")
  st.markdown("### 📝 Penyusunan Bait Syair")

  col_btn1, col_btn2 = st.columns([1, 4])
  with col_btn1:
    if st.button("➕ Tambah Bait", key="btn_add_new"):
      st.session_state.jumlah_bait += 1
      st.rerun()
  with col_btn2:
    if (
        st.session_state.jumlah_bait > 1
        and st.button("➖ Kurangi Bait", key="btn_rem_new")
    ):
      st.session_state.jumlah_bait -= 1
      st.rerun()

  bait_inputs = []

  with st.form("new_poetry_form"):
    for i in range(st.session_state.jumlah_bait):
      b_content = st.text_area(
          f"Bait ke-{i+1}",
          key=f"bait_new_{i}",
          height=100,
          placeholder=f"Tulis isi bait ke-{i+1} di sini...",
      )
      bait_inputs.append(b_content)

    st.markdown("---")
    initial_message = st.text_input(
        "Pesan Commit Pertama",
        value="Initial commit: draf awal pustaka",
        autocomplete="off",
    )

    submit_button = st.form_submit_button("Inisialisasi & Simpan Pustaka")

    if submit_button:
      full_content = "\n\n".join([b.strip() for b in bait_inputs if b.strip()])

      if not title or not full_content:
        st.error(
            "Judul pustaka dan minimal satu bait syair tidak boleh kosong,"
            " Noir!"
        )
      elif title in repo or title in trash:
        st.error(
            "Judul pustaka ini sudah ada di penyimpanan atau Pralaya. Gunakan"
            " nama lain."
        )
      else:
        tags = [t.strip() for t in tags_input.split(",")] if tags_input else ["Umum"]
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        repo[title] = {
            "tags": tags,
            "commits": [
                {
                    "timestamp": timestamp,
                    "title_version": "Prathama (Draf Awal)",
                    "content": full_content,
                    "message": initial_message,
                }
            ],
        }
        save_data(st.session_state.app_data)
        st.session_state.jumlah_bait = 2
        st.success(f"Pustaka syair '{title}' berhasil dirintis dan di-commit!")

# -------------------------------------------------------------------------
# 3. HALAMAN: REVISI DIKSI
# -------------------------------------------------------------------------
elif menu == "Revisi Diksi":
  st.title("✏️ Perbarui Diksi & Revisi Pustaka")
  st.markdown(
      "Pilih judul pustaka di bawah ini untuk menyunting bait demi bait secara"
      " terstruktur."
  )
  st.markdown("---")

  if not repo:
    st.info("Belum ada pustaka yang bisa direvisi di dalam penyimpanan.")
  else:
    for t_name, t_data in repo.items():
      t_latest = t_data["commits"][-1]
      curr_sanskrit = get_sanskrit_version(len(t_data["commits"]) - 1)

      with st.expander(f"📝 {t_name} (Fase Terkini: {curr_sanskrit})"):
        col_ebtn1, col_ebtn2 = st.columns([1, 4])
        with col_ebtn1:
          if st.button("➕ Tambah Bait", key=f"add_edit_{t_name}"):
            st.session_state[f"j_bait_{t_name}"] = (
                st.session_state.get(f"j_bait_{t_name}", 2) + 1
            )
            st.rerun()
        with col_ebtn2:
          if (
              st.session_state.get(f"j_bait_{t_name}", 2) > 1
              and st.button("➖ Kurangi Bait", key=f"rem_edit_{t_name}")
          ):
            st.session_state[f"j_bait_{t_name}"] -= 1
            st.rerun()

        if f"j_bait_{t_name}" not in st.session_state:
          existing_baits = t_latest["content"].split("\n\n")
          st.session_state[f"j_bait_{t_name}"] = max(len(existing_baits), 2)

        edit_baits = []
        current_baits = t_latest["content"].split("\n\n")

        with st.form(key=f"edit_form_{t_name}"):
          new_title_version = st.text_input(
              "Catatan Fase / Sub-judul",
              value=t_latest["title_version"],
              autocomplete="off",
          )

          num_boxes = st.session_state[f"j_bait_{t_name}"]
          for i in range(num_boxes):
            default_val = (
                current_baits[i] if i < len(current_baits) else ""
            )
            b_val = st.text_area(
                f"Bait ke-{i+1}",
                value=default_val,
                key=f"edit_b_{t_name}_{i}",
                height=100,
            )
            edit_baits.append(b_val)

          commit_msg = st.text_input(
              "Pesan Commit (Contoh: 'ganti bait kedua pakai diksi sanskerta')",
              autocomplete="off",
          )

          submitted = st.form_submit_button(
              f"Simpan Perubahan Pustaka '{t_name}'"
          )
          if submitted:
            full_new_content = "\n\n".join(
                [b.strip() for b in edit_baits if b.strip()]
            )

            if not full_new_content:
              st.error("Isi bait syair tidak boleh kosong, Noir!")
            else:
              if not commit_msg:
                commit_msg = f"Update pada {datetime.now().strftime('%Y-%m-%d %H:%M')}"

              next_sanskrit = get_sanskrit_version(len(t_data["commits"]))
              new_commit = {
                  "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                  "title_version": (
                      new_title_version
                      if new_title_version
                      else f"Revisi {next_sanskrit}"
                  ),
                  "content": full_new_content,
                  "message": commit_msg,
              }

              repo[t_name]["commits"].append(new_commit)
              save_data(st.session_state.app_data)
              st.success(
                  f"Perubahan untuk pustaka '{t_name}' berhasil disimpan ke"
                  " dalam rekam jejak!"
              )
              st.rerun()

# -------------------------------------------------------------------------
# 4. HALAMAN: INDEKS PUSTAKA
# -------------------------------------------------------------------------
elif menu == "Indeks Pustaka":
  st.title("📜 Indeks Pustaka — Lembaran Syair")
  st.markdown(
      "Pilih dan klik judul pustaka di bawah ini untuk membaca keseluruhan"
      " baitnya dengan nyaman."
  )
  st.markdown("---")

  if not repo:
    st.info(
        "Belum ada pustaka syair tersimpan. Mari rintis karya pertamamu lewat"
        " menu Rintis Pustaka Baru!"
    )
  else:
    for title_key, poetry_data in repo.items():
      commits = poetry_data["commits"]
      latest_commit = commits[-1]
      tags_str = ", ".join(poetry_data.get("tags", ["Umum"]))
      sanskrit_ver = get_sanskrit_version(len(commits) - 1)

      with st.expander(f"📜 {title_key} (Stadia: {sanskrit_ver})"):
        st.markdown(
            f"<p style='color: {t['text_muted']}; font-size: 13px; margin-top: 0;'>"
            f"<i>{latest_commit['title_version']}</i> &nbsp;•&nbsp; Tag:"
            f" {tags_str}</p>",
            unsafe_allow_html=True,
        )
        st.markdown(
            f"<div class='poetry-box'>{latest_commit['content']}</div>",
            unsafe_allow_html=True,
        )

# -------------------------------------------------------------------------
# 5. HALAMAN: STATISTIK PRODUKTIVITAS
# -------------------------------------------------------------------------
elif menu == "Statistik Produktivitas":
  st.title("📊 Statistik & Kontribusi Menulis")
  st.markdown(
      "Visualisasi kontribusi harian dan rekam jejak produktivitas penzair."
  )
  st.markdown("---")

  contribution_counts = {}
  total_poems = len(repo)
  total_commits = 0

  for data in repo.values():
    for commit in data["commits"]:
      total_commits += 1
      commit_date = commit["timestamp"].split(" ")[0]
      contribution_counts[commit_date] = (
          contribution_counts.get(commit_date, 0) + 1
      )

  st.subheader("🟩 Poetry Contributions (Aktivitas Harian)")

  today = datetime.now().date()
  days_to_show = 35
  start_date = today - timedelta(days=days_to_show - 1)

  boxes_html = ""
  current_iter_date = start_date
  while current_iter_date <= today:
    date_str = current_iter_date.strftime("%Y-%m-%d")
    count = contribution_counts.get(date_str, 0)

    if count == 0:
      box_color = "#161b22"
      border_color = "#30363d"
    elif count == 1:
      box_color = "#0e4429"
      border_color = "#006d32"
    elif count == 2:
      box_color = "#006d32"
      border_color = "#26a641"
    else:
      box_color = "#26a641"
      border_color = "#39d353"

    boxes_html += (
        f"<div title='{date_str}: {count} commit' style='width: 15px;"
        f" height: 15px; background-color: {box_color}; border: 1px solid"
        f" {border_color}; border-radius: 3px; display: inline-block; margin:"
        f" 2px;'></div>"
    )
    current_iter_date += timedelta(days=1)

  heatmap_wrapper = f"""
    <div style="background-color: #0d1117; padding: 20px; border-radius: 8px; border: 1px solid #30363d; max-width: 100%;">
        <div style="font-size: 14px; color: #8b949e; margin-bottom: 12px;">Aktivitas 35 hari terakhir</div>
        <div>{boxes_html}</div>
        <div style="font-size: 11px; color: #8b949e; margin-top: 10px;">Less &nbsp; <div style='width: 10px; height: 10px; background-color: #161b22; display: inline-block; border-radius: 2px;'></div> <div style='width: 10px; height: 10px; background-color: #0e4429; display: inline-block; border-radius: 2px;'></div> <div style='width: 10px; height: 10px; background-color: #006d32; display: inline-block; border-radius: 2px;'></div> <div style='width: 10px; height: 10px; background-color: #26a641; display: inline-block; border-radius: 2px;'></div> &nbsp; More</div>
    </div>
    """

  st.markdown(heatmap_wrapper, unsafe_allow_html=True)

  st.markdown("---")

  st.subheader("📈 Ringkasan Produktivitas")
  col1, col2 = st.columns(2)
  with col1:
    st.metric(
        label="Total Pustaka Syair",
        value=f"{total_poems} Judul",
        delta="Karya Tersimpan",
    )
  with col2:
    st.metric(
        label="Total Proses Revisi (Commit)",
        value=f"{total_commits} Kali",
        delta="Perjalanan Diksi",
    )

# -------------------------------------------------------------------------
# 6. HALAMAN: SUNTING PROFIL & TEMA ASRAMA
# -------------------------------------------------------------------------
elif menu == "Sunting Profil":
  st.title("👤 Pengaturan Profil & Asrama Penzair")
  st.markdown(
      "Sesuaikan identitas, pilihan emoji, bio, serta pilih Tema Asrama Hogwarts"
      " untuk mempercantik aplikasi."
  )
  st.markdown("---")

  emoji_options = ["✒️", "📜", "💻", "✨", "☕", "🌙", "🦉", "🎨", "🚀"]
  current_emoji = profile.get("emoji", "✒️")
  default_idx = (
      emoji_options.index(current_emoji)
      if current_emoji in emoji_options
      else 0
  )

  theme_options = list(themes.keys())
  current_theme = profile.get("theme", "Gryffindor")
  default_theme_idx = (
      theme_options.index(current_theme)
      if current_theme in theme_options
      else 0
  )

  with st.form("profile_form"):
    selected_emoji = st.selectbox(
        "Pilih Emoji Profil", emoji_options, index=default_idx
    )
    new_name = st.text_input(
        "Nama / Panggilan Penzair", value=profile["name"], autocomplete="off"
    )
    new_bio = st.text_input(
        "Bio Singkat", value=profile["bio"], autocomplete="off"
    )
    selected_theme = st.selectbox(
        "🏰 Pilih Tema Asrama (Warna)",
        theme_options,
        index=default_theme_idx,
    )

    save_profile = st.form_submit_button("Simpan Perubahan Profil & Tema")

    if save_profile:
      if not new_name:
        st.error("Nama penzair tidak boleh kosong, Noir!")
      else:
        profile["emoji"] = selected_emoji
        profile["name"] = new_name
        profile["bio"] = new_bio
        profile["theme"] = selected_theme

        save_data(st.session_state.app_data)
        st.success("Profil dan tema warna berhasil diperbarui!")
        st.rerun()

# -------------------------------------------------------------------------
# 7. HALAMAN: PRALAYA (TEMPAT SAMPAH)
# -------------------------------------------------------------------------
elif menu == "Pralaya":
  st.title("🌪️ Pralaya — Peleburan & Arsip Terhapus")
  st.markdown(
      "Pustaka yang telah dilebur tersimpan di sini. Kamu dapat memulihkannya"
      " kembali ke panteon atau memusnahkannya secara permanen."
  )
  st.markdown("---")

  if not trash:
    st.info("Pralaya sunyi. Belum ada pustaka yang dilebur.")
  else:
    for t_key, t_val in list(trash.items()):
      latest_c = t_val["commits"][-1]
      with st.expander(f"🌪️ {t_key} (Arsip Terlebur)"):
        col_r1, col_r2 = st.columns(2)
        with col_r1:
          if st.button("♻️ Pulihkan Pustaka", key=f"restore_{t_key}"):
            repo[t_key] = trash.pop(t_key)
            save_data(st.session_state.app_data)
            st.success(f"Pustaka '{t_key}' berhasil dipulihkan dari Pralaya!")
            st.rerun()
        with col_r2:
          if st.button("🔥 Musnahkan Permanen", key=f"perm_del_{t_key}"):
            del trash[t_key]
            save_data(st.session_state.app_data)
            st.warning(f"Pustaka '{t_key}' dimusnahkan secara permanen.")
            st.rerun()

        st.markdown(
            f"<div class='poetry-box'>{latest_c['content']}</div>",
            unsafe_allow_html=True,
        )