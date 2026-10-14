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
const cameraStatus = document.getElementById('cameraStatus');

let currentStep = 0;
let cameraStream = null;
let cameraRequest = 0;

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
