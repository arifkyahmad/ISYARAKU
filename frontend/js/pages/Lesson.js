// ===== Konfigurasi =====
let practiceBest = null; // stores best practice result for current question
const HOME_URL    = "Home.html";     // sesuaikan path relatif ke halaman Home
const LESSON_NAME = "Kata Sapaan";   // tampil di popup: "Kamu Lulus Belajar ..."
let earnedStars   = 3;               // 0-3, bisa dihitung dari jawaban benar nanti

const steps = ["video", "practice", "quiz"]; 
const TOTAL_STEPS = steps.length;      

// State Soal & Level
let levelId = null;
let daftarSoal = [];
let soalAktif = 0;

// Hook opsional per sesi: dipanggil saat sesi tampil / ditinggalkan.
const stepHooks = {
  video: {
    onLeave() { pauseVideo(); },
  },
  practice: {
    onEnter() { practiceBest = null; startCamera(); },
    onLeave() { console.log("practiceBest", practiceBest); simpanProgresUser(); stopCamera(); },
  },
  quiz: { onLeave() { document.getElementById("quizVideo").pause(); } },
};

// ===== Elemen =====
const progressEl      = document.querySelector(".progress");
const progressFill    = document.getElementById("progressFill");
const backBtn         = document.getElementById("backBtn");
const nextBtn         = document.getElementById("nextBtn");
const skipBtn         = document.getElementById("skipBtn");
const video           = document.getElementById("lessonVideo");
const feedback        = document.getElementById("feedback");
// Accessibility: expose feedback changes to assistive technologies
if (feedback) {
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
}
const videoCaptionEl  = document.getElementById("videoCaption");
const practiceTitleEl = document.getElementById("practiceTitle");
const stageEl         = document.getElementById("stage");

let current = 0;

// ===== Progres Level =====
function perbaruiProgresLevel(selesaiSemua = false) {
  if (!progressFill || !progressEl) return;
  const totalSoal = daftarSoal.length;
  if (totalSoal === 0) {
    progressFill.style.width = "0%";
    progressEl.setAttribute("aria-valuenow", 0);
    return;
  }

  const totalPoin = totalSoal * 3;
  let percent = 0;

  if (selesaiSemua) {
    percent = 100;
  } else {
    // Tahap selesai di soal aktif: video=0, practice=1, quiz=2
    const tahapSelesai = Math.max(0, Math.min(current, 2));
    const poinTerisi = (soalAktif * 3) + tahapSelesai;
    percent = Math.round((poinTerisi / totalPoin) * 100);
  }

  progressFill.style.width = percent + "%";
  progressEl.setAttribute("aria-valuenow", percent);
}

// ===== Navigasi sesi =====
function showStep(index) {
  const prevName = steps[current];
  if (prevName && stepHooks[prevName]?.onLeave) stepHooks[prevName].onLeave();

  current = Math.max(0, Math.min(index, steps.length - 1));

  document.querySelectorAll(".step").forEach((el) => {
    el.hidden = el.dataset.step !== steps[current];
  });

  // Di langkah video (current === 0), tombol kembali nonaktif (tidak bisa mundur ke soal sebelumnya jika soalAktif > 0)
  // Back button disabled only on the very first step of the first question
  backBtn.disabled = (soalAktif === 0 && current === 0);

  nextBtn.setAttribute("aria-label", current === steps.length - 1 ? "Selesai" : "Lanjut");

  perbaruiProgresLevel();

  const name = steps[current];
  if (stepHooks[name]?.onEnter) stepHooks[name].onEnter();
}


function prevStep() {
  if (current > 0) {
    // Move to previous stage within the same question
    showStep(current - 1);
    return;
  }
  // At the first stage of a question, move to the previous question's quiz stage if possible
  if (soalAktif > 0) {
    soalAktif--;
    // Render the newly active question (loads template, resets camera and feedback)
    renderSoalAktif();
    // Show the last stage (quiz) of the previous question
    showStep(steps.length - 1);
    return;
  }
  // No previous step or question to go back to
}

function nextStep() {
  if (current === steps.length - 1) {
    selesaiQuiz();
    return;
  }
  showStep(current + 1);
}

// Menangani selesainya sesi quiz: pindah ke soal berikutnya atau selesai level
function selesaiQuiz() {
  if (soalAktif < daftarSoal.length - 1) {
    soalAktif++;
    current = 0;
    stopCamera();
    perbaruiProgresLevel();
    renderSoalAktif();
    showStep(0);
  } else {
    // Soal terakhir selesai: tampilkan pesan level selesai tanpa navigasi baru dulu
    tampilkanLevelSelesai();
  }
}

// Tampilkan pesan level selesai saat semua soal selesai
function tampilkanLevelSelesai() {
  stopCamera();
  perbaruiProgresLevel(true);
  if (stageEl) {
    stageEl.innerHTML = `
      <div class="card" style="padding: 2.5rem 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <h2 style="font-size: 1.5rem; color: var(--ink);">Selamat! Level Selesai</h2>
        <p style="color: var(--ink); max-width: 28rem; line-height: 1.5;">Kamu telah menyelesaikan semua soal pada level ini.</p>
        <button type="button" class="skip-btn" style="max-width: 14rem; margin-top: 1rem; background: var(--purple-700); color: var(--white);" onclick="window.location.href='${HOME_URL}'">Kembali ke Beranda</button>
      </div>
    `;
  }
  if (backBtn) backBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
}

// Tampilkan pesan jika level tidak ditemukan atau terjadi kendala
function tampilkanPesanError(pesan) {
  stopCamera();
  if (stageEl) {
    stageEl.innerHTML = `
      <div class="card" style="padding: 2.5rem 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <h2 style="font-size: 1.3rem; color: var(--ink);">${pesan}</h2>
        <button type="button" class="skip-btn" style="max-width: 14rem; margin-top: 1rem; background: var(--purple-700); color: var(--white);" onclick="window.location.href='${HOME_URL}'">Kembali ke Beranda</button>
      </div>
    `;
  }
  if (backBtn) backBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
}

// Render data soal aktif ke tampilan materi video, praktik, dll.
function renderSoalAktif() {
  const soal = daftarSoal[soalAktif];
  if (!soal) return;

  const kataLabel = soal.kata || "Materi";

  // Label caption video materi
  if (videoCaptionEl) {
    videoCaptionEl.textContent = `Video Isyarat “${kataLabel}”`;
  }

  // Label judul pada sesi praktik
  if (practiceTitleEl) {
    practiceTitleEl.textContent = `Sekarang saatnya Kamu mencoba “${kataLabel}”!`;
  }

  // Update video jika url_path tersedia, jika kosong jangan putar video
  if (video) {
    pauseVideo();
    if (soal.url_path) {
      video.src = soal.url_path;
      video.load();
    } else {
      video.removeAttribute("src");
      video.load();
    }
  }

  // Reset kamera, feedback praktik, dan muat template untuk soal aktif
  stopCamera();
  showFeedbackCustom("idle", "");
  muatTemplateSoalAktif();
}

backBtn.addEventListener("click", prevStep);
nextBtn.addEventListener("click", nextStep);
skipBtn.addEventListener("click", nextStep);

// Keyboard: panah kiri/kanan untuk pindah sesi
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" && current < steps.length - 1) nextStep();
  if (e.key === "ArrowLeft" && !backBtn.disabled) prevStep();
});

// ===== Video =====
function pauseVideo() {
  if (video && !video.paused) video.pause();
}

// ===== Elemen Praktik CV =====
const cameraVideo   = document.getElementById("cameraFeed");
const cameraOverlay = document.getElementById("cameraOverlay");
const cameraCtx     = cameraOverlay ? cameraOverlay.getContext("2d") : null;

// Garis ruas jari untuk visualisasi skeleton (sama seperti uji-huruf.html)
const HAND_LINES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17]
];

const HANDS_VERSION = "0.4.1675469240";
const cvState = {
  cameraOn: false,
  aspect: 4 / 3,
  cur: null,
  stream: null,
  templateAktif: null,
  templateLoading: false,
  animationId: null,
  sending: false,
  hasilPertama: false,
  timeoutId: null
};
let hands = null;

// Menggambar skeleton tangan ke canvas overlay
function drawHand(lm) {
  if (!cameraCtx || !cameraOverlay) return;
  const w = cameraOverlay.width;
  const h = cameraOverlay.height;
  cameraCtx.clearRect(0, 0, w, h);
  cameraCtx.lineWidth = 3;
  cameraCtx.strokeStyle = "#4fd1a5";
  HAND_LINES.forEach(([a, b]) => {
    cameraCtx.beginPath();
    cameraCtx.moveTo(lm[a].x * w, lm[a].y * h);
    cameraCtx.lineTo(lm[b].x * w, lm[b].y * h);
    cameraCtx.stroke();
  });
  cameraCtx.fillStyle = "#ffffff";
  lm.forEach((p) => {
    cameraCtx.beginPath();
    cameraCtx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2);
    cameraCtx.fill();
  });
}

function clearHandCanvas() {
  if (cameraCtx && cameraOverlay) {
    cameraCtx.clearRect(0, 0, cameraOverlay.width, cameraOverlay.height);
  }
}

// Inisialisasi klien Supabase jika belum tersedia di window
function getSupabase() {
  if (window.supabaseClient) return window.supabaseClient;
  if (typeof supabase !== "undefined" && typeof SUPABASE_URL !== "undefined" && typeof SUPABASE_PUBLISHABLE_KEY !== "undefined") {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    return window.supabaseClient;
  }
  return null;
}

// Muat template pose per soal dari tabel template_pose berdasarkan kamus_id soal aktif
async function muatTemplateSoalAktif() {
  const soal = daftarSoal[soalAktif];
  if (!soal || !soal.kamus_id) {
    cvState.templateAktif = null;
    return;
  }
  cvState.templateAktif = null;
  cvState.templateLoading = true;
  try {
    const client = getSupabase();
    if (!client) {
      cvState.templateLoading = false;
      return;
    }
    const { data, error } = await client
      .from("template_pose")
      .select("landmark_data")
      .eq("kamus_id", soal.kamus_id)
      .maybeSingle();

    if (error) {
      cvState.templateLoading = false;
      return;
    }
    if (data && data.landmark_data) {
      let lm = data.landmark_data;
      if (typeof lm === "string") {
        try { lm = JSON.parse(lm); } catch (_) {}
      }
      if (lm && Array.isArray(lm.titik)) {
        cvState.templateAktif = lm.titik;
      }
    }
  } catch (_) {
    // Abaikan kegagalan jaringan/parse tanpa error console berlebih
  } finally {
    cvState.templateLoading = false;
  }
}

// Evaluasi frame saat tangan terdeteksi vs tidak terdeteksi
function evaluateFrame() {
  if (!cvState.cameraOn) return;

  // Syarat 5: Tangan belum terdeteksi -> tampilkan "Tangan belum terlihat"
  if (!cvState.cur || !cvState.cur.lm) {
    clearHandCanvas();
    showFeedbackCustom("idle", "Tangan belum terlihat");
    return;
  }

  // Gambar skeleton tangan
  drawHand(cvState.cur.lm);

  if (!cvState.templateAktif) {
    showFeedbackCustom("idle", cvState.templateLoading ? "Memuat template..." : "Template belum tersedia");
    return;
  }

  // Ambang hanya dari CV_CONFIG (melalui cv-core.js nilaiTingkat)
  const ambang = (typeof CV_CONFIG !== "undefined" && CV_CONFIG.ambang) ? CV_CONFIG.ambang : null;
  const d = distanceToTemplate(cvState.cur.lm, cvState.templateAktif, cvState.aspect);
  const tingkat = nilaiTingkat(d, ambang); // 'tepat' | 'hampir' | 'belum'

  // Update practiceBest hierarchy: tepat > hampir > belum
  if (tingkat === "tepat") {
    practiceBest = "tepat";
    showFeedbackCustom("correct", "Tepat");
  } else if (tingkat === "hampir") {
    if (practiceBest !== "tepat") practiceBest = "hampir";
    showFeedbackCustom("wrong", "Hampir");
  } else {
    if (!practiceBest) practiceBest = "belum";
    showFeedbackCustom("wrong", "Belum");
  }
}

function onResults(res) {
  if (!cvState.cameraOn) return;
  if (!cvState.hasilPertama) {
    cvState.hasilPertama = true;
    clearTimeout(cvState.timeoutId);
  }
  const lm = res.multiHandLandmarks && res.multiHandLandmarks[0];
  if (lm) {
    const label = (res.multiHandedness && res.multiHandedness[0]) ? res.multiHandedness[0].label : "Right";
    cvState.cur = { lm, label };
  } else {
    cvState.cur = null;
  }
  evaluateFrame();
}

async function loopCv() {
  if (!cvState.cameraOn) return;
  if (cameraVideo && cameraVideo.readyState >= 2 && !cvState.sending && hands) {
    cvState.sending = true;
    try {
      await hands.send({ image: cameraVideo });
    } catch (_) {
      // Loop error ditangani tenang tanpa unhandled error
    }
    cvState.sending = false;
  }
  if (cvState.cameraOn) {
    cvState.animationId = requestAnimationFrame(loopCv);
  }
}

async function startCamera() {
  if (cvState.cameraOn) return;
  showFeedbackCustom("idle", "Menyiapkan kamera...");

  // Pastikan template untuk soal aktif dimuat
  if (!cvState.templateAktif && !cvState.templateLoading) {
    muatTemplateSoalAktif();
  }

  try {
    if (typeof Hands === "undefined") {
      showFeedbackCustom("wrong", "Library pendeteksi tangan tidak tersedia");
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showFeedbackCustom("wrong", "Akses kamera tidak didukung di browser ini");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
      audio: false
    });

    cvState.stream = stream;
    if (cameraVideo) {
      cameraVideo.srcObject = stream;
      await cameraVideo.play().catch(() => {});
      if (cameraVideo.readyState < 2) {
        await new Promise((r) => cameraVideo.addEventListener("loadeddata", r, { once: true }));
      }
      if (cameraOverlay) {
        cameraOverlay.width = cameraVideo.videoWidth || 640;
        cameraOverlay.height = cameraVideo.videoHeight || 480;
      }
      cvState.aspect = (cameraVideo.videoWidth && cameraVideo.videoHeight)
        ? (cameraVideo.videoWidth / cameraVideo.videoHeight)
        : (4 / 3);
    }

    if (!hands) {
      hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${HANDS_VERSION}/${file}`
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5,
        selfieMode: false
      });
      hands.onResults(onResults);
    }

    cvState.cameraOn = true;
    cvState.timeoutId = setTimeout(() => {
      if (!cvState.hasilPertama && cvState.cameraOn) {
        stopCamera();
        showFeedbackCustom("wrong", "Pendeteksi tangan gagal dimuat. Periksa koneksi, atau lanjut tanpa kamera.");
      }
    }, 15000);
    showFeedbackCustom("idle", "Tangan belum terlihat");
    loopCv();
  } catch (err) {
    // Syarat 6: Kamera ditolak/tidak ada: tampilkan pesan, tanpa error di Console
    let pesan = "Kamera tidak dapat diakses";
    if (err && err.name === "NotAllowedError") {
      pesan = "Izin kamera ditolak. Silakan izinkan akses kamera di browser.";
    } else if (err && err.name === "NotFoundError") {
      pesan = "Kamera tidak ditemukan. Pastikan webcam terpasang.";
    } else if (err && err.name === "NotReadableError") {
      pesan = "Kamera sedang digunakan oleh aplikasi lain.";
    }
    showFeedbackCustom("wrong", pesan);
  }
}

function stopCamera() {
  clearTimeout(cvState.timeoutId);
  cvState.timeoutId = null;
  cvState.hasilPertama = false;
  cvState.cameraOn = false;
  if (cvState.animationId) {
    cancelAnimationFrame(cvState.animationId);
    cvState.animationId = null;
  }
  if (cvState.stream) {
    cvState.stream.getTracks().forEach((track) => track.stop());
    cvState.stream = null;
  }
  if (cameraVideo) {
    cameraVideo.srcObject = null;
  }
  cvState.cur = null;
  cvState.sending = false;
  clearHandCanvas();
  showFeedbackCustom("idle", "");
}

// Save practice result to Supabase when leaving practice stage
async function simpanProgresUser() {
  // Snapshot values before any await so they reflect the question being left
  const capturedPracticeBest = practiceBest;
  const capturedCameraOn = cvState.cameraOn;
  // Get current question data
  const soal = daftarSoal[soalAktif];
  if (!soal) return;
  const soal_level_id = soal.soal_level_id;

  const client = getSupabase();
  if (!client) {
    console.warn("Supabase client not available, cannot save progress");
    return;
  }

  // Get authenticated user
  let authRes;
  try {
    authRes = await client.auth.getUser();
  } catch (e) {
    console.warn("Error fetching auth user", e);
    return;
  }
  const user = authRes?.data?.user;
  if (!user) {
    console.warn("User not logged in, skipping progress save");
    return;
  }
  const akun_id = user.id;

  // Determine payload based on practiceBest and camera state
  let payload = null;
  if (capturedPracticeBest !== null && capturedCameraOn) {
    payload = { akun_id, soal_level_id, status_3tingkat: capturedPracticeBest, flag_review: false };
  } else if (capturedPracticeBest === null && !capturedCameraOn) {
    // Camera error or denied
    payload = { akun_id, soal_level_id, status_3tingkat: "belum", flag_review: true };
  } else {
    // practiceBest null but camera worked (no hand detected) – do not save
    return;
  }

  try {
    const { error } = await client.from("progres_user").upsert(payload, { onConflict: "akun_id,soal_level_id" });
    if (error) {
      console.warn("Failed to upsert progress", error.message);
    }
  } catch (e) {
    console.warn("Exception during progress upsert", e);
  }
}

// ===== Feedback praktik =====
// state: "correct" | "wrong" | "idle"
function showFeedback(state) {
  feedback.dataset.state = state;
  feedback.textContent = { correct: "Tepat!", wrong: "Coba lagi!", idle: "" }[state] || "";
}

function showFeedbackCustom(state, text) {
  if (!feedback) return;
  // Update visual state via data attribute and CSS class for styling
  feedback.dataset.state = state;
  // Ensure previous state class is removed
  feedback.className = '';
  if (state) feedback.classList.add(`feedback-${state}`);
  // Update the visible text
  feedback.textContent = text;
}

const quizOptions = document.querySelectorAll(".quiz-option");
quizOptions.forEach((btn) => {
  btn.addEventListener("click", () => {
    quizOptions.forEach((b) => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
  });
});

// ===== Inisialisasi Level & Soal =====
async function muatLevelDanSoal() {
  const urlParams = new URLSearchParams(window.location.search);
  levelId = urlParams.get("level");

  // Syarat 2: Baca parameter level dari URL. Kalau kosong: tampilkan "Level tidak ditemukan", jangan error di Console
  if (!levelId || !levelId.trim()) {
    tampilkanPesanError("Level tidak ditemukan");
    return;
  }

  const client = getSupabase();
  if (!client) {
    tampilkanPesanError("Koneksi ke database gagal");
    return;
  }

  try {
    // Syarat 3: Query soal_level join kamus left join video order by urutan
    const { data, error } = await client
      .from("soal_level")
      .select("id, urutan, kamus_id, kamus(id, kata, jenis, video(url_path))")
      .eq("level_id", levelId)
      .order("urutan", { ascending: true });

    if (error) {
      tampilkanPesanError("Gagal memuat data soal");
      return;
    }

    if (!data || data.length === 0) {
      tampilkanPesanError("Tidak ada soal pada level ini");
      return;
    }

    // Mapping tiap soal membawa soal_level_id, kamus_id, kata, url_path
    daftarSoal = data.map((item) => {
      const k = item.kamus || {};
      let urlPath = null;
      if (k.video) {
        if (Array.isArray(k.video) && k.video[0]) {
          urlPath = k.video[0].url_path;
        } else if (typeof k.video === "object") {
          urlPath = k.video.url_path;
        }
      }
      return {
        soal_level_id: item.id,
        kamus_id: item.kamus_id || k.id,
        kata: k.kata || "",
        jenis: k.jenis || "",
        url_path: urlPath || null,
      };
    });

    soalAktif = 0;
    perbaruiProgresLevel();
    renderSoalAktif();
    showStep(0);
  } catch (_) {
    tampilkanPesanError("Terjadi kendala saat memuat soal");
  }
}

// ===== Mulai =====
muatLevelDanSoal();

// Pindah ke home setelah selesai belajar
function finishLesson() {
  const params = new URLSearchParams({
    complete: "1",
    lesson: LESSON_NAME,
    stars: earnedStars,
  });
  window.location.href = `${HOME_URL}?${params}`;
}

