const settingsForm = document.getElementById('accountSettingsForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const settingsMessage = document.getElementById('settingsMessage');
const saveButton = document.getElementById('saveChanges');

function showSettingsMessage(message, isSuccess = false) {
  settingsMessage.textContent = message;
  settingsMessage.classList.toggle('is-success', isSuccess);
}

document.querySelectorAll('.password-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const input = document.getElementById(toggle.dataset.passwordTarget);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    toggle.setAttribute(
      'aria-label',
      `${isHidden ? 'Sembunyikan' : 'Tampilkan'} ${input.id === 'password' ? 'password' : 'konfirmasi password'}`
    );
    toggle.querySelector('img').src = `../assets/img/${isHidden ? 'view' : 'hide'}.png`;
  });
});

async function loadAccountSettings() {
  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (error) {
    if (error.message === 'Auth session missing!') {
      showSettingsMessage('Silakan masuk untuk mengubah pengaturan akun.');
      saveButton.disabled = true;
      return;
    }

    showSettingsMessage(`Gagal memuat akun: ${error.message}`);
    return;
  }

  if (!user) {
    showSettingsMessage('Silakan masuk untuk mengubah pengaturan akun.');
    saveButton.disabled = true;
    return;
  }

  const { data: profile, error: profileError } = await supabaseClient
    .from('akun')
    .select('nama')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    showSettingsMessage(`Gagal memuat profil: ${profileError.message}`);
    return;
  }

  fullNameInput.value = profile?.nama
    || user.user_metadata?.full_name
    || user.user_metadata?.name
    || user.user_metadata?.nama
    || '';
  emailInput.value = user.email || '';
}

settingsForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showSettingsMessage('');

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!fullName || !email) {
    showSettingsMessage('Nama lengkap dan email wajib diisi.');
    return;
  }

  if (!emailInput.checkValidity()) {
    showSettingsMessage('Masukkan alamat email yang valid.');
    return;
  }

  if (password && password !== confirmPasswordInput.value) {
    showSettingsMessage('Konfirmasi password belum sesuai.');
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = 'Menyimpan...';

  try {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError) {
      showSettingsMessage(`Gagal memverifikasi akun: ${userError.message}`);
      return;
    }

    if (!user) {
      showSettingsMessage('Silakan masuk untuk mengubah pengaturan akun.');
      return;
    }

    const userUpdates = {
      data: {
        ...user.user_metadata,
        full_name: fullName,
        name: fullName,
        nama: fullName
      }
    };

    if (email !== user.email) userUpdates.email = email;
    if (password) userUpdates.password = password;

    const { error: updateError } = await supabaseClient.auth.updateUser(userUpdates);
    if (updateError) {
      showSettingsMessage(`Gagal menyimpan perubahan akun: ${updateError.message}`);
      return;
    }

    const { error: profileError } = await supabaseClient
      .from('akun')
      .upsert({ id: user.id, nama: fullName }, { onConflict: 'id' });

    if (profileError) {
      showSettingsMessage(`Data akun diperbarui, tetapi profil gagal disimpan: ${profileError.message}`);
      return;
    }

    if (email !== user.email) {
      showSettingsMessage('Perubahan tersimpan. Periksa email baru untuk mengonfirmasi alamat email.', true);
    } else {
      showSettingsMessage('Perubahan berhasil disimpan.', true);
    }

    passwordInput.value = '';
    confirmPasswordInput.value = '';
  } catch (error) {
    showSettingsMessage(`Gagal menyimpan perubahan: ${error.message}`);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Simpan Perubahan';
  }
});

loadAccountSettings();
