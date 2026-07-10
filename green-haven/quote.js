/* ============================================================
   Green Haven — Quote Multi-Step Form (quote.js)
   ============================================================ */

(function () {
  'use strict';

  const TOTAL_STEPS = 6;

  const stepLabels = [
    'Contact Information',
    'Home Details',
    'Home Size',
    'Pets',
    'Service Type',
    'Final Notes',
  ];

  let current = 1;

  /* ---- DOM refs ---- */
  const form      = document.getElementById('quote-form');
  const btnNext   = document.getElementById('btn-next');
  const btnPrev   = document.getElementById('btn-prev');
  const btnSubmit = document.getElementById('btn-submit');
  const bar       = document.getElementById('qp-bar');
  const label     = document.getElementById('qp-label');
  const errorBox  = document.getElementById('qp-error');
  const errorMsg  = document.getElementById('qp-error-msg');
  const thankyou  = document.getElementById('qp-thankyou');
  const progress  = document.getElementById('qp-progress');
  const qpCard    = document.querySelector('.qp-card');
  const summary   = document.getElementById('qp-summary');

  /* ---- Show a specific step ---- */
  function showStep(n) {
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const el = document.getElementById('step-' + i);
      if (el) el.classList.toggle('active', i === n);
    }
    current = n;
    updateProgress(n);
    updateNav(n);
    hideError();
    qpCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---- Progress bar + dots + label ---- */
  function updateProgress(step) {
    bar.style.width = ((step / TOTAL_STEPS) * 100) + '%';
    label.textContent = 'Step ' + step + ' of ' + TOTAL_STEPS + ' — ' + stepLabels[step - 1];

    document.querySelectorAll('.qp-progress__step').forEach(function (el) {
      var n = parseInt(el.dataset.step, 10);
      el.classList.toggle('active', n === step);
      el.classList.toggle('done',   n < step);
    });
  }

  /* ---- Show / hide nav buttons ---- */
  function updateNav(step) {
    btnPrev.style.display   = step === 1 ? 'none' : '';
    btnNext.style.display   = step < TOTAL_STEPS ? '' : 'none';
    btnSubmit.style.display = step === TOTAL_STEPS ? '' : 'none';
  }

  /* ---- Required-field validation for the current step ---- */
  function validateStep(step) {
    var panel = document.getElementById('step-' + step);
    if (!panel) return true;

    var required = panel.querySelectorAll('input[required], select[required]');
    for (var i = 0; i < required.length; i++) {
      var field = required[i];
      if (!field.value.trim()) {
        field.focus();
        field.style.borderColor = '#dc2626';
        field.addEventListener('input', function () {
          this.style.borderColor = '';
          hideError();
        }, { once: true });
        showError('Please fill in all required fields before continuing.');
        return false;
      }
      if (field.type === 'email' && !field.value.includes('@')) {
        field.focus();
        showError('Please enter a valid email address.');
        return false;
      }
    }
    return true;
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.style.display = 'flex';
    errorBox.style.animation = 'none';
    void errorBox.offsetWidth; /* reflow to restart shake animation */
    errorBox.style.animation = '';
  }

  function hideError() {
    errorBox.style.display = 'none';
  }

  /* ---- Counter buttons ---- */
  document.querySelectorAll('.counter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.dataset.target);
      if (!input) return;
      var min = parseInt(input.min, 10);
      var max = parseInt(input.max, 10);
      var val = parseInt(input.value, 10);

      if (btn.dataset.action === 'inc') val = Math.min(val + 1, max);
      if (btn.dataset.action === 'dec') val = Math.max(val - 1, min);

      input.value = val;

      var decBtn = btn.closest('.counter-input').querySelector('[data-action="dec"]');
      decBtn.style.opacity      = val <= min ? '.3' : '';
      decBtn.style.pointerEvents = val <= min ? 'none' : '';
    });
  });

  /* ---- Pets toggle ---- */
  var petYes     = document.getElementById('pets-yes');
  var petNo      = document.getElementById('pets-no');
  var petSection = document.getElementById('pet-count-section');

  function togglePets() {
    if (petSection) {
      petSection.style.display = (petYes && petYes.checked) ? 'block' : 'none';
    }
  }
  if (petYes) petYes.addEventListener('change', togglePets);
  if (petNo)  petNo.addEventListener('change', togglePets);

  /* ---- Next ---- */
  btnNext.addEventListener('click', function () {
    if (!validateStep(current)) return;
    if (current < TOTAL_STEPS) showStep(current + 1);
  });

  /* ---- Previous ---- */
  btnPrev.addEventListener('click', function () {
    if (current > 1) showStep(current - 1);
  });

  /* ---- Submit ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(current)) return;

    btnSubmit.disabled = true;
    btnSubmit.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Submitting…';

    // Builds the confirmation screen from what the user entered
    function showThankYou() {
      var name  = (document.getElementById('q-fname').value + ' ' + document.getElementById('q-lname').value).trim();
      var email = document.getElementById('q-email').value;
      var phone = document.getElementById('q-phone').value;
      var addr  = [
        document.getElementById('q-addr1').value,
        document.getElementById('q-addr2').value,
        document.getElementById('q-city').value,
        document.getElementById('q-province').value,
        document.getElementById('q-postal').value,
      ].filter(Boolean).join(', ');
      var beds  = document.getElementById('bedrooms').value;
      var baths = document.getElementById('full-baths').value;
      var cleanType = (document.querySelector('input[name="clean-type"]:checked') || {}).value || '—';
      var freq      = (document.querySelector('input[name="frequency"]:checked')  || {}).value || '—';

      summary.innerHTML =
        '<p><strong>Name:</strong> '    + name    + '</p>' +
        '<p><strong>Email:</strong> '   + email   + '</p>' +
        '<p><strong>Phone:</strong> '   + phone   + '</p>' +
        '<p><strong>Address:</strong> ' + addr    + '</p>' +
        '<p><strong>Home:</strong> '    + beds    + ' bedrooms · ' + baths + ' full baths</p>' +
        '<p><strong>Service:</strong> ' + cleanType + ' · ' + freq + '</p>';

      progress.style.display = 'none';
      qpCard.style.display   = 'none';
      thankyou.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Actually send the data to Netlify. FormData grabs every named field
    // across all steps (hidden steps are still in the DOM), including the
    // hidden form-name and honeypot. URL-encoded body — Netlify needs that.
    var body = new URLSearchParams(new FormData(form)).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Status ' + res.status);
        showThankYou();
      })
      .catch(function (err) {
        console.error('Quote submission failed:', err);
        btnSubmit.disabled = false;
        btnSubmit.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Submit My Request';
        showError('Something went wrong sending your request. Please try again, or call us at (604) 375-9391.');
      });
  });

  /* ---- Init ---- */
  showStep(1);

}());
