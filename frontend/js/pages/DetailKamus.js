const params = new URLSearchParams(window.location.search);
const word = params.get('word')?.trim() || 'Guru';
const category = params.get('category')?.trim() || 'Sekolah';
const steps = ['video', 'practice', 'quiz'];

const progress = document.querySelector('.progress');
const progressFill = document.getElementById('progressFill');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');
const video = document.getElementById('lessonVideo');
const quizVideo = document.getElementById('quizVideo');
const cameraFeed = document.getElementById('cameraFeed');
const cameraStatus = document.getElementById('cameraStatus');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');

let currentStep = 0;
let cameraStream = null;
let cameraRequest = 0;

document.title = `${word} | Detail Kamus IsyaraKu`;
document.getElementById('videoCaption').textContent = `Video Isyarat “${word}”`;
document.getElementById('quizQuestion').textContent = `Isyarat apakah untuk “${word}”?`;

const otherWords = ['Guru', 'Kelas', 'Buku', 'Pensil', 'Murid', 'Sekolah'];
const answers = [word, ...otherWords.filter((item) => item.toLocaleLowerCase('id') !== word.toLocaleLowerCase('id'))]
  .slice(0, 3);

answers.forEach((answer, index) => {
  const option = document.createElement('button');
  option.className = 'quiz-option';
  option.type = 'button';
  option.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
  option.dataset.answer = String(answer.toLocaleLowerCase('id') === word.toLocaleLowerCase('id'));
  option.addEventListener('click', () => {
    quizOptions.querySelectorAll('.quiz-option').forEach((item) => {
      item.classList.remove('is-selected');
      item.removeAttribute('data-state');
    });

    option.classList.add('is-selected');
    const isCorrect = option.dataset.answer === 'true';
    option.dataset.state = isCorrect ? 'correct' : 'wrong';
    quizFeedback.textContent = isCorrect ? 'Tepat!' : `Belum tepat. Jawabannya: ${word}.`;
  });
  quizOptions.append(option);
});

function stopCamera() {
  cameraRequest += 1;
  cameraStream?.getTracks().forEach((track) => track.stop());
  cameraStream = null;
  cameraFeed.srcObject = null;
}

async function startCamera() {
  cameraStatus.hidden = false;

  if (!navigator.mediaDevices?.getUserMedia) {
    cameraStatus.textContent = 'Browser ini tidak mendukung akses kamera. Kamu tetap bisa melanjutkan.';
    return;
  }

  const requestId = ++cameraRequest;
  cameraStatus.textContent = 'Meminta izin akses kamera...';

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
    cameraStatus.textContent = error.name === 'NotAllowedError'
      ? 'Akses kamera ditolak. Izinkan akses kamera atau lanjutkan tanpa praktik.'
      : `Kamera tidak dapat dibuka: ${error.message}`;
  }
}

function showStep(index) {
  if (steps[currentStep] === 'video') video.pause();
  if (steps[currentStep] === 'quiz') quizVideo.pause();
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
  if (steps[currentStep] === 'quiz') quizVideo.currentTime = 0;
}

function finishLesson() {
  quizFeedback.textContent = `Selesai! Kamu telah mempelajari ${word}.`;
  nextBtn.disabled = true;
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
