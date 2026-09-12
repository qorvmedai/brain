'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* =============================================
     CONFIGURATION — Edit these values
     ============================================= */
  const CONFIG = window.SITE_CONFIG || {
    PURCHASE_URL: '#purchase',
    META_PIXEL_ID: '',
    GA_ID: '',
    GTM_ID: '',
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =============================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================= */
  const initScrollReveals = () => {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const staggerEls = document.querySelectorAll('.reveal-stagger');

    if (prefersReducedMotion) {
      revealEls.forEach(el => el.classList.add('reveal--visible'));
      staggerEls.forEach(el => {
        el.classList.add('reveal--visible');
        Array.from(el.children).forEach(child => child.classList.add('reveal--visible'));
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));

    // Stagger children
    const staggerObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = Array.from(entry.target.children);
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 100}ms`;
            child.classList.add('reveal--visible');
          });
          entry.target.classList.add('reveal--visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    staggerEls.forEach(el => staggerObserver.observe(el));
  };

  /* =============================================
     STICKY NAVIGATION
     ============================================= */
  const initStickyNav = () => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('nav--scrolled', window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  /* =============================================
     SMOOTH SCROLL
     ============================================= */
  const initSmoothScroll = () => {
    const navEl = document.getElementById('nav');
    const navHeight = navEl ? navEl.offsetHeight : 72;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href');
      if (id === '#' || id === '#purchase') {
        // For purchase links, redirect to CONFIG.PURCHASE_URL
        if (id === '#purchase' && CONFIG.PURCHASE_URL && CONFIG.PURCHASE_URL !== '#purchase') {
          e.preventDefault();
          window.location.href = CONFIG.PURCHASE_URL;
          return;
        }
        return;
      }

      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        closeMobileNav();
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  };

  /* =============================================
     FAQ ACCORDION
     ============================================= */
  const initAccordion = () => {
    const accordion = document.querySelector('.accordion');
    if (!accordion) return;

    accordion.addEventListener('click', (e) => {
      const trigger = e.target.closest('.accordion__trigger');
      if (!trigger) return;

      const item = trigger.closest('.accordion__item');
      if (!item) return;

      const content = item.querySelector('.accordion__content');
      const isActive = item.classList.contains('accordion__item--active');

      if (isActive) {
        item.classList.remove('accordion__item--active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('accordion__item--active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  };

  /* =============================================
     MOBILE NAVIGATION
     ============================================= */
  let mobileNavOpen = false;

  const closeMobileNav = () => {
    if (!mobileNavOpen) return;
    const mobileNav = document.getElementById('mobile-nav');
    const toggleBtn = document.querySelector('.nav__toggle');
    if (mobileNav) {
      mobileNav.classList.remove('nav__mobile--active');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('nav__toggle--active');
    }
    document.body.style.overflow = '';
    mobileNavOpen = false;
  };

  const openMobileNav = () => {
    const mobileNav = document.getElementById('mobile-nav');
    const toggleBtn = document.querySelector('.nav__toggle');
    if (mobileNav) {
      mobileNav.classList.add('nav__mobile--active');
      mobileNav.setAttribute('aria-hidden', 'false');
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.classList.add('nav__toggle--active');
    }
    document.body.style.overflow = 'hidden';
    mobileNavOpen = true;
  };

  const initMobileNav = () => {
    const toggleBtn = document.querySelector('.nav__toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      mobileNavOpen ? closeMobileNav() : openMobileNav();
    });

    // Close when clicking a link inside mobile nav
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
      mobileNav.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          closeMobileNav();
        }
        // Close when clicking the backdrop (not on a link)
        if (e.target === mobileNav) {
          closeMobileNav();
        }
      });
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavOpen) closeMobileNav();
    });
  };

  /* =============================================
     PSYCHOLOGY FRAMEWORK ANIMATION
     ============================================= */
  const initFramework = () => {
    const framework = document.querySelector('.framework');
    if (!framework) return;

    const nodes = framework.querySelectorAll('.framework__node');
    if (nodes.length === 0) return;

    if (prefersReducedMotion) {
      nodes.forEach(n => n.classList.add('framework__node--active'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          nodes.forEach((node, i) => {
            setTimeout(() => node.classList.add('framework__node--active'), i * 300);
          });
          obs.unobserve(framework);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(framework);
  };

  /* =============================================
     HERO BOOK PARALLAX (Desktop Only)
     ============================================= */
  const initHeroParallax = () => {
    if (prefersReducedMotion || window.innerWidth <= 1024) return;

    const hero = document.querySelector('.hero');
    const book = document.getElementById('hero-book');
    if (!hero || !book) return;

    let ticking = false;

    hero.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const mx = (e.clientX - cx) / (rect.width / 2);
          const my = (e.clientY - cy) / (rect.height / 2);

          book.style.transform = `perspective(1000px) translate3d(${mx * 5}px, ${my * 5}px, 0) rotateY(${mx * 2}deg) rotateX(${-my * 2}deg)`;
          book.style.transition = 'transform 0.1s ease-out';
          ticking = false;
        });
        ticking = true;
      }
    });

    hero.addEventListener('mouseleave', () => {
      book.style.transform = 'perspective(1000px) translate3d(0,0,0) rotateY(0deg) rotateX(0deg)';
      book.style.transition = 'transform 0.5s ease-out';
    });
  };

  /* =============================================
     STICKY MOBILE CTA
     ============================================= */
  const initStickyCTA = () => {
    const stickyCta = document.getElementById('sticky-cta');
    const hero = document.getElementById('hero');
    const finalCta = document.getElementById('final-cta');
    if (!stickyCta || !hero) return;

    // Remove the hidden attribute so CSS controls display
    stickyCta.removeAttribute('hidden');

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.innerWidth >= 768) {
            stickyCta.classList.remove('sticky-cta--visible');
            ticking = false;
            return;
          }

          const heroBottom = hero.getBoundingClientRect().bottom;
          let nearFinal = false;

          if (finalCta) {
            nearFinal = finalCta.getBoundingClientRect().top < window.innerHeight;
          }

          if (heroBottom < 0 && !nearFinal) {
            stickyCta.classList.add('sticky-cta--visible');
          } else {
            stickyCta.classList.remove('sticky-cta--visible');
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  };

  /* =============================================
     CTA CLICK TRACKING
     ============================================= */
  const initTracking = () => {
    // Meta Pixel
    if (CONFIG.META_PIXEL_ID) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
      n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', CONFIG.META_PIXEL_ID);
      window.fbq('track', 'PageView');
      window.fbq('track', 'ViewContent', {
        content_name: 'Brain Seduction',
        content_type: 'product',
        value: 5000,
        currency: 'NGN'
      });
    }

    // GTM
    if (CONFIG.GTM_ID) {
      const s = document.createElement('script');
      s.src = `https://www.googletagmanager.com/gtm.js?id=${CONFIG.GTM_ID}`;
      s.async = true;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    }

    // CTA clicks
    document.addEventListener('click', (e) => {
      const cta = e.target.closest('[data-track-cta], .btn--primary');
      if (!cta) return;

      // Fire tracking events
      if (CONFIG.META_PIXEL_ID && typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', { content_name: 'Brain Seduction' });
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'initiate_checkout', {
          event_category: 'ecommerce',
          event_label: 'Brain Seduction CTA'
        });
      }

      // Navigate to purchase URL if configured
      if (CONFIG.PURCHASE_URL && CONFIG.PURCHASE_URL !== '#purchase') {
        e.preventDefault();
        window.location.href = CONFIG.PURCHASE_URL;
      }
    });
  };

  /* =============================================
     INITIALIZE ALL
     ============================================= */
  initScrollReveals();
  initStickyNav();
  initSmoothScroll();
  initAccordion();
  initMobileNav();
  initFramework();
  initHeroParallax();
  initStickyCTA();
  initTracking();
});
