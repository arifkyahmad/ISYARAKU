// ===== Konfigurasi =====
const HOME_URL    = "Home.html";     // sesuaikan path relatif ke halaman Home
const LESSON_NAME = "Kata Sapaan";   // tampil di popup: "Kamu Lulus Belajar ..."
let earnedStars   = 3;               // 0-3, bisa dihitung dari jawaban benar nanti

const steps = ["video", "practice", "quiz"]; 
const TOTAL_STEPS = steps.length;      

// SEMENTARA, diganti data soal di sesi berikutnya
const KAMUS_ID_SEMENTARA = "46e24274-4c92-4e45-9b6b-d5fcef207bd0";

// Hook opsional per sesi: dipanggil saat sesi tampil / ditinggalkan.
const stepHooks = {
  video: {
    onLeave() { pauseVideo(); },
  },
  practice: {
    onEnter() { startCamera(); },
    onLeave() { stopCamera(); },
  },
  quiz: { onLeave() { document.getElementById("quizVideo").pause(); } },
};

// ===== Elemen =====
const progressEl   = document.querySelector(".progress");
const progressFill = document.getElementById("progressFill");
const backBtn      = document.getElementById("backBtn");
const nextBtn      = document.getElementById("nextBtn");
const skipBtn      = document.getElementById("skipBtn");
const video        = document.getElementById("lessonVideo");
const feedback     = document.getElementById("feedback");

let current = 0;

// ===== Navigasi sesi =====
function showStep(index) {
  const prevName = steps[current];
  if (prevName && stepHooks[prevName]?.onLeave) stepHooks[prevName].onLeave();

  current = Math.max(0, Math.min(index, steps.length - 1));

  document.querySelectorAll(".step").forEach((el) => {
    el.hidden = el.dataset.step !== steps[current];
  });

  const percent = Math.round(((current + 1) / TOTAL_STEPS) * 100);
  progressFill.style.width = percent + "%";
  progressEl.setAttribute("aria-valuenow", percent);

  backBtn.disabled = current === 0;
  nextBtn.setAttribute("aria-label", current === steps.length - 1 ? "Selesai" : "Lanjut");

  const name = steps[current];
  if (stepHooks[name]?.onEnter) stepHooks[name].onEnter();
}


const prevStep = () => showStep(current - 1);

function nextStep() {
  if (current === steps.length - 1) return finishLesson();
  showStep(current + 1);
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
  templateA: null,
  templateLoading: false,
  animationId: null,
  sending: false
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

// Muat template A sekali saja dari tabel template_pose
async function loadTemplateSekali() {
  if (cvState.templateA || cvState.templateLoading) return;
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
      .eq("kamus_id", KAMUS_ID_SEMENTARA)
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
        cvState.templateA = lm.titik;
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

  if (!cvState.templateA) {
    showFeedbackCustom("idle", "Memuat template...");
    return;
  }

  // Ambang hanya dari CV_CONFIG (melalui cv-core.js nilaiTingkat)
  const ambang = (typeof CV_CONFIG !== "undefined" && CV_CONFIG.ambang) ? CV_CONFIG.ambang : null;
  const d = distanceToTemplate(cvState.cur.lm, cvState.templateA, cvState.aspect);
  const tingkat = nilaiTingkat(d, ambang); // 'tepat' | 'hampir' | 'belum'

  if (tingkat === "tepat") {
    showFeedbackCustom("correct", "Tepat");
  } else if (tingkat === "hampir") {
    showFeedbackCustom("wrong", "Hampir");
  } else {
    showFeedbackCustom("wrong", "Belum");
  }
}

function onResults(res) {
  if (!cvState.cameraOn) return;
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

  // Muat template A di latar belakang sekali
  loadTemplateSekali();

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

// ===== Feedback praktik =====
// state: "correct" | "wrong" | "idle"
function showFeedback(state) {
  feedback.dataset.state = state;
  feedback.textContent = { correct: "Tepat!", wrong: "Coba lagi!", idle: "" }[state] || "";
}

function showFeedbackCustom(state, text) {
  if (!feedback) return;
  feedback.dataset.state = state;
  feedback.textContent = text;
}

const quizOptions = document.querySelectorAll(".quiz-option");
quizOptions.forEach((btn) => {
  btn.addEventListener("click", () => {
    quizOptions.forEach((b) => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
  });
});

// ===== Mulai =====
showStep(0);

//pindah ke home setelah selesai belajar
function finishLesson() {
  const params = new URLSearchParams({
    complete: "1",
    lesson: LESSON_NAME,
    stars: earnedStars,
  });
  window.location.href = `${HOME_URL}?${params}`;
}

