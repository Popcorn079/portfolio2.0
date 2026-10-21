/**
 * Andrew G. Manangan Portfolio Script
 * Features:
 * - Web Audio mechanical click synthesis
 * - Draggable & scroll-reactive mechanical scrollbar
 * - Command Palette (Cmd/Ctrl + K) with fuzzy search
 * - Dark/Light theme toggle
 * - Blueprint grid mode toggle
 * - Active section scroll spy
 * - Quick inquiry form with mailto trigger & toast notifications
 * - GitHub activity heatmap generator
 * - Project filter tabs
 */

// Sound Synthesizer via Web Audio API
class SoundFx {
  constructor() {
    this.audioCtx = null;
    this.enabled = localStorage.getItem('andrew_sound_enabled') !== 'false';
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.06);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('andrew_sound_enabled', this.enabled);
    if (this.enabled) this.playPop();
    return this.enabled;
  }
}

const sfx = new SoundFx();

// Global Toast Manager
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');
  sfx.playPop();

  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Copy to Clipboard
function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg);
  }).catch(() => {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(successMsg);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management
  const html = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('andrew_theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      sfx.playClick();
      const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', nextTheme);
      localStorage.setItem('andrew_theme', nextTheme);
      updateThemeIcon(nextTheme);
      showToast(`Switched to ${nextTheme} theme`);
    });
  }

  function updateThemeIcon(theme) {
    const moonIcon = document.getElementById('icon-moon');
    const sunIcon = document.getElementById('icon-sun');
    if (moonIcon && sunIcon) {
      if (theme === 'light') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      } else {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
      }
    }
  }

  // 2. Grid Blueprint Mode Management
  const gridSwitch = document.getElementById('grid-mode');
  const gridOverlay = document.getElementById('grid-overlay');
  const savedGrid = localStorage.getItem('andrew_grid') !== 'false';

  if (gridSwitch && gridOverlay) {
    gridSwitch.checked = savedGrid;
    if (savedGrid) {
      gridOverlay.classList.remove('opacity-0');
      gridOverlay.classList.add('opacity-100');
    } else {
      gridOverlay.classList.remove('opacity-100');
      gridOverlay.classList.add('opacity-0');
    }

    gridSwitch.addEventListener('change', () => {
      sfx.playClick();
      const isChecked = gridSwitch.checked;
      localStorage.setItem('andrew_grid', isChecked);
      if (isChecked) {
        gridOverlay.classList.remove('opacity-0');
        gridOverlay.classList.add('opacity-100');
        showToast('Blueprint grid enabled');
      } else {
        gridOverlay.classList.remove('opacity-100');
        gridOverlay.classList.add('opacity-0');
        showToast('Blueprint grid disabled');
      }
    });
  }

  // 3. Sound Toggle Management
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIconActive = document.getElementById('icon-sound-on');
  const soundIconMuted = document.getElementById('icon-sound-off');

  function updateSoundUI(enabled) {
    if (soundIconActive && soundIconMuted) {
      if (enabled) {
        soundIconActive.classList.remove('hidden');
        soundIconMuted.classList.add('hidden');
      } else {
        soundIconActive.classList.add('hidden');
        soundIconMuted.classList.remove('hidden');
      }
    }
  }

  updateSoundUI(sfx.enabled);

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const enabled = sfx.toggle();
      updateSoundUI(enabled);
      showToast(enabled ? 'Mechanical sounds enabled' : 'Sounds muted');
    });
  }

  // 4. Attach click sounds to interactive items
  document.querySelectorAll('a, button, input[type="checkbox"], .portfolio-card, .stack-badge').forEach(el => {
    el.addEventListener('click', () => {
      sfx.playClick();
    });
  });

  // 5. Active Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY;
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 160;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // 6. Mechanical Scrollbar Control
  const track = document.getElementById('mechanical-track');
  const thumb = document.getElementById('mechanical-thumb');
  let isDragging = false;

  function updateScrollbarThumb() {
    if (!track || !thumb || isDragging) return;
    const scrollH = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollH <= 0) return;

    const progress = window.scrollY / scrollH;
    const trackH = track.clientHeight;
    const thumbH = thumb.clientHeight;
    const maxTop = trackH - thumbH;
    const topPos = Math.max(0, Math.min(progress * maxTop, maxTop));

    thumb.style.transform = `translate(-50%, ${topPos}px)`;
  }

  window.addEventListener('scroll', updateScrollbarThumb, { passive: true });
  window.addEventListener('resize', updateScrollbarThumb);
  updateScrollbarThumb();

  if (track && thumb) {
    function scrollToTrackPosition(clientY) {
      const rect = track.getBoundingClientRect();
      const trackH = track.clientHeight;
      const thumbH = thumb.clientHeight;
      const offsetY = clientY - rect.top - (thumbH / 2);
      const maxTop = trackH - thumbH;
      const clampedY = Math.max(0, Math.min(offsetY, maxTop));
      const percentage = clampedY / maxTop;

      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: percentage * scrollH,
        behavior: isDragging ? 'auto' : 'smooth'
      });
    }

    thumb.addEventListener('mousedown', (e) => {
      isDragging = true;
      sfx.playClick();
      e.preventDefault();
    });

    track.addEventListener('click', (e) => {
      if (e.target === thumb) return;
      scrollToTrackPosition(e.clientY);
      sfx.playClick();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      scrollToTrackPosition(e.clientY);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        updateScrollbarThumb();
      }
    });

    // Touch support for mobile/tablet
    thumb.addEventListener('touchstart', (e) => {
      isDragging = true;
      sfx.playClick();
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      scrollToTrackPosition(e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
      updateScrollbarThumb();
    });
  }

  // 7. Command Palette (Cmd + K / Ctrl + K)
  const cmdBackdrop = document.getElementById('cmd-palette');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');
  const cmdOpenButtons = document.querySelectorAll('[data-open-cmd]');
  const cmdCloseBtn = document.getElementById('cmd-close');

  function openCommandPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.add('open');
    sfx.playPop();
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
      filterCommands('');
    }
  }

  function closeCommandPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove('open');
    sfx.playClick();
  }

  cmdOpenButtons.forEach(btn => btn.addEventListener('click', openCommandPalette));
  if (cmdCloseBtn) cmdCloseBtn.addEventListener('click', closeCommandPalette);

  if (cmdBackdrop) {
    cmdBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdBackdrop) {
        closeCommandPalette();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdBackdrop && cmdBackdrop.classList.contains('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === 'Escape' && cmdBackdrop && cmdBackdrop.classList.contains('open')) {
      closeCommandPalette();
    }
  });

  function filterCommands(query) {
    if (!cmdList) return;
    const items = cmdList.querySelectorAll('.cmd-item');
    const q = query.toLowerCase().trim();

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      filterCommands(e.target.value);
    });
  }

  // Command Palette Item Actions
  if (cmdList) {
    cmdList.addEventListener('click', (e) => {
      const item = e.target.closest('.cmd-item');
      if (!item) return;

      const action = item.getAttribute('data-action');
      closeCommandPalette();

      if (action === 'goto') {
        const target = item.getAttribute('data-target');
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (action === 'copy-email') {
        copyToClipboard('andrewmanangan6@gmail.com', 'Email copied: andrewmanangan6@gmail.com');
      } else if (action === 'open-github') {
        window.open('https://github.com/Popcorn079', '_blank');
      } else if (action === 'toggle-theme') {
        if (themeToggleBtn) themeToggleBtn.click();
      } else if (action === 'toggle-grid') {
        if (gridSwitch) {
          gridSwitch.checked = !gridSwitch.checked;
          gridSwitch.dispatchEvent(new Event('change'));
        }
      } else if (action === 'toggle-sound') {
        if (soundToggleBtn) soundToggleBtn.click();
      }
    });
  }

  // 8. Interactive Quick Contact Form
  const quickContactForm = document.getElementById('quick-contact-form');
  const quickMessage = document.getElementById('quick-message');

  if (quickContactForm && quickMessage) {
    function submitQuickMessage() {
      const msg = quickMessage.value.trim();
      if (!msg) {
        showToast('Please type a short note first.');
        quickMessage.focus();
        return;
      }

      sfx.playPop();
      const subject = encodeURIComponent('Opportunity / Connection via Portfolio');
      const body = encodeURIComponent(`Hi Andrew,\n\n${msg}\n\nSent from your portfolio quick-contact form.`);
      window.location.href = `mailto:andrewmanangan6@gmail.com?subject=${subject}&body=${body}`;

      showToast('Opening your email client... Thank you!');
      quickMessage.value = '';
    }

    quickContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitQuickMessage();
    });

    quickMessage.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        submitQuickMessage();
      }
    });
  }

  // 9. Copy Email Button in Hero & Footer
  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard('andrewmanangan6@gmail.com', 'Email copied: andrewmanangan6@gmail.com');
    });
  });

  // 10. Generate simulated GitHub Heatmap
  const ghGrid = document.getElementById('github-heatmap');
  if (ghGrid) {
    const levels = ['gh-0', 'gh-0', 'gh-1', 'gh-1', 'gh-2', 'gh-2', 'gh-3', 'gh-4'];
    let htmlContent = '';
    // Generate 7 rows x 28 columns = 196 cells
    for (let i = 0; i < 196; i++) {
      // Create realistic clustering pattern
      const rand = Math.random();
      let level = 'gh-0';
      if (rand > 0.45) level = 'gh-1';
      if (rand > 0.70) level = 'gh-2';
      if (rand > 0.88) level = 'gh-3';
      if (rand > 0.96) level = 'gh-4';
      htmlContent += `<div class="github-cell ${level}" title="Contribution count on active day"></div>`;
    }
    ghGrid.innerHTML = htmlContent;
  }

  // 11. Project Category Filter
  const projectFilters = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  projectFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      projectFilters.forEach(b => {
        b.classList.remove('bg-foreground', 'text-background', 'font-semibold');
        b.classList.add('bg-secondary', 'text-muted-foreground');
      });
      btn.classList.remove('bg-secondary', 'text-muted-foreground');
      btn.classList.add('bg-foreground', 'text-background', 'font-semibold');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 12. Calculate Fortnights / Age or Uptime
  const fortnightsEl = document.getElementById('fortnights-counter');
  if (fortnightsEl) {
    // Arbitrary anchor date representing undergraduate engineering journey start
    const startDate = new Date('2022-08-15');
    const today = new Date();
    const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const fortnights = (diffDays / 14).toFixed(3);
    fortnightsEl.textContent = fortnights;
  }

  // 13. Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
