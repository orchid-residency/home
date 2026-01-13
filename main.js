// main.js — Orchid Residency cinematic intro behavior
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('intro-video');
  if (!video) return;
  const videoContainer = document.getElementById('video-container');
  const homeUi = document.getElementById('home-ui');
  const registerBtn = document.getElementById('register-btn');
  const navRegister = document.getElementById('nav-register');

  // Prevent scrolling while the intro video is playing
  document.body.classList.add('no-scroll');

  // Helper: try to snapshot the last frame of the video into an image and set as bg
  function captureVideoFrame() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || window.innerWidth;
      canvas.height = video.videoHeight || window.innerHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      return dataURL;
    } catch (err) {
      // Cross-origin video will fail to draw to canvas -> return null.
      console.warn('Could not capture video frame (CORS?).', err);
      return null;
    }
  }

  const titleOverlay = document.getElementById('title-overlay');

  // When video ends: capture frame, show title overlay for 2s, then navigate to home.html
  function onVideoEnded() {
    const dataURL = captureVideoFrame();

    // Fade out the video element while keeping the captured background visible
    videoContainer.classList.add('fade-out');

    // Show centered title overlay
    if (titleOverlay) {
      titleOverlay.classList.add('visible');
      titleOverlay.removeAttribute('aria-hidden');
    }

    // After 2.5 seconds, navigate to the homepage
    setTimeout(() => {
      try { video.pause(); } catch(e){}
      video.style.display = 'none';
      window.location.href = 'home.html';
    }, 2500);
  }

  // Wire up CTA buttons (hero + sticky) to navigate to the register page
  const heroRegister = document.getElementById('hero-register-btn');
  const stickyCta = document.getElementById('sticky-cta');
  function goToRegister() { window.location.href = 'register.html'; }
  if (registerBtn) registerBtn.addEventListener('click', goToRegister);
  if (heroRegister) heroRegister.addEventListener('click', goToRegister);
  if (stickyCta) stickyCta.addEventListener('click', goToRegister);
  if (navRegister) navRegister.addEventListener('click', goToRegister);

  video.addEventListener('ended', onVideoEnded);

  // Ensure video element exists
  if (!video) return;

  // Fallback: sometimes autoplay may not start; try to play on first touch
  function attemptPlay() {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // playing
      }).catch(() => {
        // user gesture required; wait for one
        const startHandler = () => {
          video.play().catch(()=>{});
          document.removeEventListener('touchstart', startHandler);
          document.removeEventListener('click', startHandler);
        };
        document.addEventListener('touchstart', startHandler, { once: true });
        document.addEventListener('click', startHandler, { once: true });
      });
    }
  }
  attemptPlay();

  // helper exposed for development
  function openRegisterPage() { window.location.href = 'register.html'; }

  // Close-any helpers removed (no modal behavior on index)


  // Prevent scrolling when modal is closed (main screen has no-scroll)
  // Allow scrolling inside modal iframe (iframe handles its own scroll)

  // Safety: if the video is already ended (e.g., short debug video), trigger end handler
  if (video.ended) onVideoEnded();

  // For development: expose some helpers
  window._orchid = { openRegisterPage };
});