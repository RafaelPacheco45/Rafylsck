(() => {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (typeof entry.target.animate === 'function') {
        entry.target.animate([
          { opacity: .15, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 750, easing: 'cubic-bezier(.2,.7,.2,1)' });
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.startup-story,.startup-capabilities,.project-experience,.gallery-heading,.project-capture,.project-stage,.startup-contact').forEach(element => observer.observe(element));
})();
