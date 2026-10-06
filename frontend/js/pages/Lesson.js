// ===== Konfigurasi =====
const HOME_URL    = "Home.html";     // sesuaikan path relatif ke halaman Home
const LESSON_NAME = "Kata Sapaan";   // tampil di popup: "Kamu Lulus Belajar ..."
let earnedStars   = 3;               // 0-3, bisa dihitung dari jawaban benar nanti

const steps = ["video", "practice", "quiz"]; 
const TOTAL_STEPS = steps.length;      

// Hook opsional per sesi: dipanggil saat sesi tampil / ditinggalkan.
const stepHooks = {
  video: {
    onLeave() { pauseVideo(); },
  },
  practice: {
    // onEnter() { startCamera(); },
    // onLeave() { stopCamera(); },
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

//pindah ke home setelah selesai belajar
function finishLesson() {
  const params = new URLSearchParams({
    complete: "1",
    lesson: LESSON_NAME,
    stars: earnedStars,
  });
  window.location.href = `${HOME_URL}?${params}`;
}

