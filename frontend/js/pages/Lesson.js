// ===== Konfigurasi =====
const HOME_URL    = "Home.html";     // sesuaikan path relatif ke halaman Home
const LESSON_NAME = "Kata Sapaan";   // tampil di popup: "Kamu Lulus Belajar ..."
let earnedStars   = 7;               // 0-3, bisa dihitung dari jawaban benar nanti

const steps = ["video", "practice", "video", "practice", "video", "practice", "quiz"]; 
const TOTAL_STEPS = steps.length;      

// Hook opsional per sesi: dipanggil saat sesi tampil / ditinggalkan.
const stepHooks = {
  video: {
    onLeave() { pauseVideo(); },
  },
  practice: {
    onEnter() { startCamera(); },
    onLeave() { stopCamera(); },
  },
};

// ===== Elemen =====
const progressEl   = document.querySelector(".progress");
const progressFill = document.getElementById("progressFill");
const backBtn      = document.getElementById("backBtn");
const nextBtn      = document.getElementById("nextBtn");
const skipBtn      = document.getElementById("skipBtn");
const video        = document.getElementById("lessonVideo");
const feedback     = document.getElementById("feedback");
const cameraFeed   = document.getElementById("cameraFeed");
const cameraStatus = document.getElementById("cameraStatus");

let current = 0;
let cameraStream = null;
let cameraRequest = 0;

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

function stopCamera() {
  cameraRequest += 1;
  cameraStream?.getTracks().forEach((track) => track.stop());
  cameraStream = null;
  cameraFeed.srcObject = null;
}

async function startCamera() {
  cameraStatus.hidden = false;

  if (!navigator.mediaDevices?.getUserMedia) {
    cameraStatus.textContent = "Browser ini tidak mendukung akses kamera. Kamu tetap bisa melanjutkan.";
    return;
  }

  const requestId = ++cameraRequest;
  cameraStatus.textContent = "Meminta izin akses kamera...";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    if (requestId !== cameraRequest) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    cameraStream = stream;
    cameraFeed.srcObject = stream;
    cameraStatus.hidden = true;
  } catch (error) {
    if (requestId !== cameraRequest) return;
    cameraStatus.hidden = false;
    cameraStatus.textContent = error.name === "NotAllowedError"
      ? "Akses kamera ditolak. Izinkan akses kamera atau lanjutkan tanpa praktik."
      : `Kamera tidak dapat dibuka: ${error.message}`;
  }
}

// ===== Feedback praktik =====
// state: "correct" | "wrong" | "idle"
function showFeedback(state) {
  feedback.dataset.state = state;
  feedback.textContent = { correct: "Tepat!", wrong: "Coba lagi!", idle: "" }[state];
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
window.addEventListener("pagehide", stopCamera);

//pindah ke home setelah selesai belajar
function finishLesson() {
  const params = new URLSearchParams({
    complete: "1",
    lesson: LESSON_NAME,
    stars: earnedStars,
  });
  window.location.href = `${HOME_URL}?${params}`;
}
