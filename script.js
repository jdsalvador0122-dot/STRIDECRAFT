/* script.js — StrideCraft */
(function () {
  /* ---------- Map photo flip ---------- */
  var angle = 0;
  var inner = document.getElementById('mapFlipInner');
  window.flipMap = function (direction) {
    angle += (direction === 'right') ? 180 : -180;
    inner.style.transform = 'rotateY(' + angle + 'deg)';
  };

  /* ---------- Job slots toggle ---------- */
  var toggleBtn = document.getElementById('jobSlotsBtn');
  var panel = document.getElementById('jobSlotsPanel');
  toggleBtn.addEventListener('click', function () {
    var open = !panel.hasAttribute('hidden');
    if (open) {
      panel.setAttribute('hidden', '');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('open');
    } else {
      panel.removeAttribute('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.classList.add('open');
    }
  });

  /* ---------- One image per job ----------
     Each job id maps to its own image. Change the file names here
     if yours are different. */
  var JOBS = {
    stock:    { title: 'Financial Analyst',                img: 'images/finance.jpg' },
    merch:    { title: 'Credit Analyst',                   img: 'images/credit.jpg' },
    cs:       { title: 'Investment Analyst',               img: 'images/investment.jpg' },
    social:   { title: 'Budget Analyst',                   img: 'images/budget.jpg' },
    cashier:  { title: 'Treasury Analyst',                 img: 'images/treasury.jpg' }
  };

  var modal = document.getElementById('jobModal');
  var modalTitle = document.getElementById('jobModalTitle');
  var modalFigure = document.getElementById('jobModalFigure');
  var modalImg = document.getElementById('jobModalImg');
  var modalCaption = document.getElementById('jobModalCaption');
  var lightbox = document.getElementById('lightbox');

  function closeModal() { modal.setAttribute('hidden', ''); document.body.style.overflow = ''; }
  function closeLightbox() { lightbox.setAttribute('hidden', ''); }

  document.querySelectorAll('.job-slot').forEach(function (slot) {
    slot.addEventListener('click', function () {
      var job = JOBS[slot.getAttribute('data-job')];
      if (!job) return;
      modalTitle.textContent = job.title;
      modalImg.setAttribute('src', job.img);
      modalImg.setAttribute('alt', job.title);
      modalCaption.textContent = job.title;
      modalFigure.setAttribute('data-full', job.img);
      modalFigure.setAttribute('data-caption', job.title);
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  document.getElementById('jobModalClose').addEventListener('click', closeModal);
  document.getElementById('jobModalBackdrop').addEventListener('click', closeModal);

  /* ---------- Lightbox: click the image to view it full-size ---------- */
  modalFigure.addEventListener('click', function () {
    var img = document.getElementById('lightboxImg');
    img.setAttribute('src', modalFigure.getAttribute('data-full'));
    img.setAttribute('alt', modalFigure.getAttribute('data-caption'));
    document.getElementById('lightboxCaption').textContent = modalFigure.getAttribute('data-caption');
    lightbox.removeAttribute('hidden');
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!lightbox.hasAttribute('hidden')) { closeLightbox(); return; }
    if (!modal.hasAttribute('hidden')) closeModal();
  });

  /* ---------- "View pair" product showcase ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('#collection .card'));
  var pm = document.getElementById('pairModal');
  var pStage = document.getElementById('pairStage');
  var pTilt = document.getElementById('pairTilt');
  var pImg = document.getElementById('pairImg');
  var pPh = document.getElementById('pairPh');
  var pInfo = document.getElementById('pairInfo');
  var pIndex = 0;

  document.getElementById('pairHint').textContent =
    window.matchMedia('(hover: none)').matches ? 'Drag to tilt' : 'Move your cursor to tilt';

  function fillPair(i) {
    var c = cards[i];
    var img = c.querySelector('.card-media img');
    var broken = !img || img.style.display === 'none' || (img.complete && img.naturalWidth === 0);
    document.getElementById('pairTag').textContent = c.querySelector('.tag').textContent;
    document.getElementById('pairName').textContent = c.querySelector('h3').textContent;
    document.getElementById('pairSub').textContent = c.querySelector('.sub').textContent;
    document.getElementById('pairDesc').textContent = c.querySelector('.desc').textContent;
    document.getElementById('pairPrice').textContent = c.querySelector('.price').firstChild.textContent;
    document.getElementById('pairCount').textContent = (i + 1) + ' / ' + cards.length;
    pImg.hidden = broken;
    pPh.hidden = !broken;
    if (!broken) {
      pImg.setAttribute('src', img.getAttribute('src'));
      pImg.setAttribute('alt', img.getAttribute('alt') || '');
    }
    // replay the "presents itself" animation
    [pImg, pInfo].forEach(function (el) {
      el.classList.add('swap'); void el.offsetWidth; el.classList.remove('swap');
    });
    resetTilt();
  }

  function openPair(i) {
    pIndex = i;
    fillPair(i);
    pm.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closePair() { pm.setAttribute('hidden', ''); document.body.style.overflow = ''; }
  function stepPair(d) { pIndex = (pIndex + d + cards.length) % cards.length; fillPair(pIndex); }

  function resetTilt() { pTilt.style.transform = 'rotateX(0deg) rotateY(0deg)'; }
  function tiltTo(e) {
    var r = pStage.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    pTilt.style.transform = 'rotateY(' + (x * 30) + 'deg) rotateX(' + (-y * 22) + 'deg)';
  }
  pStage.addEventListener('pointermove', tiltTo);
  pStage.addEventListener('pointerleave', resetTilt);
  pStage.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') resetTilt(); });

  cards.forEach(function (card, i) {
    var btn = card.querySelector('.view-btn');
    if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); openPair(i); });
    var media = card.querySelector('.card-media');
    if (media) { media.style.cursor = 'pointer'; media.addEventListener('click', function () { openPair(i); }); }
  });

  document.getElementById('pairClose').addEventListener('click', closePair);
  document.getElementById('pairBackdrop').addEventListener('click', closePair);
  document.getElementById('pairPrev').addEventListener('click', function () { stepPair(-1); });
  document.getElementById('pairNext').addEventListener('click', function () { stepPair(1); });
  document.getElementById('pairCta').addEventListener('click', closePair);
  document.addEventListener('keydown', function (e) {
    if (pm.hasAttribute('hidden')) return;
    if (e.key === 'Escape') closePair();
    else if (e.key === 'ArrowLeft') stepPair(-1);
    else if (e.key === 'ArrowRight') stepPair(1);
  });

  /* ---------- Founder showcase (footer photo) ---------- */
  var fModal = document.getElementById('founderModal');
  var fStage = document.getElementById('founderStage');
  var fTilt = document.getElementById('founderTilt');
  function openFounder() { fModal.removeAttribute('hidden'); document.body.style.overflow = 'hidden'; fTilt.style.transform = 'none'; }
  function closeFounder() { fModal.setAttribute('hidden', ''); document.body.style.overflow = ''; }
  document.getElementById('founderBtn').addEventListener('click', openFounder);
  document.getElementById('founderHint').addEventListener('click', openFounder);
  document.getElementById('founderClose').addEventListener('click', closeFounder);
  document.getElementById('founderBackdrop').addEventListener('click', closeFounder);
  document.getElementById('founderCta').addEventListener('click', closeFounder);
  fStage.addEventListener('pointermove', function (e) {
    var r = fStage.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    fTilt.style.transform = 'rotateY(' + (x * 30) + 'deg) rotateX(' + (-y * 22) + 'deg)';
  });
  fStage.addEventListener('pointerleave', function () { fTilt.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !fModal.hasAttribute('hidden')) closeFounder();
  });
})();