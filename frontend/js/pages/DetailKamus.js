const params = new URLSearchParams(window.location.search);
const id = params.get('id')?.trim();
const steps = ['video', 'practice'];
const BASE_VIDEO = 'https://ogozgbkfgdlzlfxbmrff.supabase.co/storage/v1/object/public/video/';

const progress = document.querySelector('.progress');
const progressFill = document.getElementById('progressFill');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');
const video = document.getElementById('lessonVideo');
const videoNotice = document.getElementById('videoNotice');
const videoCaption = document.getElementById('videoCaption');
const practiceTitle = document.getElementById('practiceTitle');
const cameraFeed = document.getElementById('cameraFeed');
const cameraOverlay = document.getElementById('cameraOverlay');
const cameraCtx = cameraOverlay ? cameraOverlay.getContext('2d') : null;
const cameraStatus = document.getElementById('cameraStatus');
const feedback = document.getElementById('feedback');

let currentStep = 0;

function getSupabase() {
  if (window.supabaseClient) return window.supabaseClient;
  if (typeof supabase !== "undefined" && typeof SUPABASE_URL !== "undefined" && typeof SUPABASE_PUBLISHABLE_KEY !== "undefined") {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    return window.supabaseClient;
  }
  return null;
}

function tampilkanError(pesan) {
  document.title = `${pesan} | Detail Kamus IsyaraKu`;
  const stage = document.getElementById('stage');
  if (stage) {
    stage.innerHTML = `
      <div class="card" style="padding: 2.5rem 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-inline: auto; width: calc(100% - 3.5rem);">
        <h1 style="font-size: 1.3rem; color: var(--purple-dark, #755584); margin: 0;">${pesan}</h1>
        <a href="Kamus.html" class="skip-btn" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; max-width: 14rem; margin-top: 1rem; background: var(--purple-dark, #755584); color: #fff; padding: 0.75rem 1.5rem; border-radius: 999px;">Kembali ke Kamus</a>
      </div>
    `;
  }
  const nav = document.querySelector('.nav');
  if (nav) nav.hidden = true;
}

async function muatDetailKamus() {
  if (!id) {
    tampilkanError('Kata tidak ditemukan');
    return;
  }

  const client = getSupabase();
  if (!client) {
    tampilkanError('Kata tidak ditemukan');
    return;
  }

  try {
    const { data: item, error } = await client
      .from('kamus')
      .select('id, kata, jenis, video(url_path)')
      .eq('id', id)
      .maybeSingle();

    if (error || !item) {
      tampilkanError('Kata tidak ditemukan');
      return;
    }

    const kata = item.kata || '';
    const jenisLabel = item.jenis === 'angka' ? 'Angka' : 'Huruf';

    document.title = `${kata} (${jenisLabel}) | Detail Kamus IsyaraKu`;
    if (videoCaption) {
      videoCaption.textContent = `Video Isyarat ${jenisLabel} “${kata}”`;
    }
    if (practiceTitle) {
      practiceTitle.textContent = `Sekarang saatnya Kamu mencoba “${kata}”!`;
    }

    let urlPath = null;
    if (item.video) {
      if (Array.isArray(item.video) && item.video.length > 0) {
        urlPath = item.video[0]?.url_path;
      } else if (typeof item.video === 'object') {
        urlPath = item.video.url_path;
      }
    }

    if (urlPath) {
      video.src = BASE_VIDEO + urlPath;
      video.hidden = false;
      if (videoNotice) videoNotice.hidden = true;
      video.load();
    } else {
      video.pause();
      video.removeAttribute('src');
      video.hidden = true;
      if (videoNotice) videoNotice.hidden = false;
    }
  } catch (_) {
    tampilkanError('Kata tidak ditemukan');
  }
}

// Garis ruas jari untuk visualisasi skeleton (sama seperti uji-huruf.html dan Lesson.js)
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

function showFeedbackCustom(state, text) {
  // cameraStatus hanya tampil sebelum kamera aktif (izin / not found)
  // setelah kamera aktif, feedback pill yang menampilkan state
  if (feedback) {
    feedback.dataset.state = state || 'idle';
    feedback.className = '';
    if (state) feedback.classList.add(`feedback-${state}`);
    feedback.textContent = text || '';
  }
}

async function muatTemplate() {
  if (!id) {
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
      .eq("kamus_id", id)
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

function evaluateFrame() {
  if (!cvState.cameraOn) return;

  if (!cvState.cur || !cvState.cur.lm) {
    clearHandCanvas();
    showFeedbackCustom("idle", "Tangan belum terlihat");
    return;
  }

  drawHand(cvState.cur.lm);

  if (!cvState.templateAktif) {
    showFeedbackCustom("idle", cvState.templateLoading ? "Memuat template..." : "Penilaian belum tersedia");
    return;
  }

  const ambang = (typeof CV_CONFIG !== "undefined" && CV_CONFIG.ambang) ? CV_CONFIG.ambang : null;
  const d = distanceToTemplate(cvState.cur.lm, cvState.templateAktif, cvState.aspect);
  const tingkat = nilaiTingkat(d, ambang);

  if (tingkat === "tepat") {
    showFeedbackCustom("correct", "Tepat!");
  } else if (tingkat === "hampir") {
    showFeedbackCustom("wrong", "Hampir");
  } else {
    showFeedbackCustom("wrong", "Belum ketemu");
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
  if (cameraFeed && cameraFeed.readyState >= 2 && !cvState.sending && hands) {
    cvState.sending = true;
    try {
      await hands.send({ image: cameraFeed });
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

  if (!cvState.templateAktif && !cvState.templateLoading) {
    muatTemplate();
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
    if (cameraStatus) cameraStatus.style.display = 'none';
    if (cameraFeed) {
      cameraFeed.srcObject = stream;
      await cameraFeed.play().catch(() => {});
      if (cameraFeed.readyState < 2) {
        await new Promise((r) => cameraFeed.addEventListener("loadeddata", r, { once: true }));
      }
      if (cameraOverlay) {
        cameraOverlay.width = cameraFeed.videoWidth || 640;
        cameraOverlay.height = cameraFeed.videoHeight || 480;
      }
      cvState.aspect = (cameraFeed.videoWidth && cameraFeed.videoHeight)
        ? (cameraFeed.videoWidth / cameraFeed.videoHeight)
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
  if (cameraFeed) {
    cameraFeed.srcObject = null;
  }
  if (cameraStatus) cameraStatus.style.display = 'grid';
  cvState.cur = null;
  cvState.sending = false;
  clearHandCanvas();
  showFeedbackCustom("idle", "");
}

function showStep(index) {
  if (steps[currentStep] === 'video') video.pause();
  if (steps[currentStep] === 'practice') stopCamera();

  currentStep = Math.max(0, Math.min(index, steps.length - 1));

  document.querySelectorAll('.step').forEach((step) => {
    step.hidden = step.dataset.step !== steps[currentStep];
  });

  const percent = Math.round(((currentStep + 1) / steps.length) * 100);
  progressFill.style.width = `${percent}%`;
  progress.setAttribute('aria-valuenow', String(percent));
  backBtn.hidden = currentStep === 0;
  nextBtn.textContent = currentStep === steps.length - 1 ? 'Selesai' : 'Lanjut';

  if (steps[currentStep] === 'practice') startCamera();
}

function finishLesson() {
  stopCamera();
  window.location.href = 'Kamus.html';
}

function nextStep() {
  if (currentStep === steps.length - 1) {
    finishLesson();
    return;
  }

  showStep(currentStep + 1);
}

backBtn.addEventListener('click', () => showStep(currentStep - 1));
nextBtn.addEventListener('click', nextStep);
skipBtn.addEventListener('click', nextStep);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' && currentStep < steps.length - 1) nextStep();
  if (event.key === 'ArrowLeft' && currentStep > 0) showStep(currentStep - 1);
});

window.addEventListener('pagehide', stopCamera);

showStep(0);
muatDetailKamus();
