const WAITLIST_ENDPOINT = String(
  import.meta.env.PUBLIC_WAITLIST_ENDPOINT
    || 'https://f3cde459.sibforms.com/serve/MUIFAPkIttg9_w9drKl1pUH19xvaHSB6th2O_Uk7AMjGv6Yks09ls0EtOJ6n5sYr_dL_TrtArIYmoXK4dIp-183Oxac9u5FLhBTU7DZX1lAwkdefJAlLv7e0yqZMIq_grAsEXXYEqFPnRr8llU_6kHz5oT1mLU6xrIyqIABJ9a6NgG8lPR-YTOe3vNY7_OOFVmmb_PYkuekUN62fXw==',
).trim();

const REQUEST_SUBMITTED_ENDPOINT = String(
  import.meta.env.PUBLIC_REQUEST_SUBMITTED_ENDPOINT
    || 'https://api.getmine.ai/access/v1/request-submitted',
).trim();

function initialiseNavigation() {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const button = document.querySelector<HTMLButtonElement>('[data-menu-button]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const menuLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-menu-link]'));
  const heroCta = document.getElementById('hero-cta');
  const headerCta = document.querySelector<HTMLElement>('[data-header-cta]');
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));

  const closeMenu = () => {
    button?.setAttribute('aria-expanded', 'false');
    button?.setAttribute('aria-label', 'Open menu');
    menu?.setAttribute('aria-hidden', 'true');
    menu?.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  button?.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu?.setAttribute('aria-hidden', String(!open));
    menu?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });

  menuLinks.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (heroCta && headerCta) {
    const observer = new IntersectionObserver(
      ([entry]) => headerCta.classList.toggle('visible', !entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(heroCta);
  }

  if (navLinks.length) {
    const sections = navLinks
      .map((link) => document.getElementById(link.dataset.navLink || ''))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]?.target.id;

        if (!active) return;
        navLinks.forEach((link) => {
          if (link.dataset.navLink === active) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      },
      { rootMargin: '-25% 0px -60%', threshold: [0, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
  }
}

function initialiseFrictionRotator() {
  const rotator = document.querySelector<HTMLElement>('[data-frictions]');
  if (!rotator) return;

  const question = rotator.querySelector<HTMLElement>('[data-friction-question]');
  const answer = rotator.querySelector<HTMLElement>('[data-friction-answer]');
  const tabs = Array.from(rotator.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  if (!question || !answer || !tabs.length) return;

  let active = 0;
  let timer: number | undefined;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const select = (index: number) => {
    active = (index + tabs.length) % tabs.length;
    const selected = tabs[active];
    question.textContent = selected.dataset.question || '';
    answer.textContent = selected.dataset.answer || '';
    tabs.forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', String(tabIndex === active));
      tab.tabIndex = tabIndex === active ? 0 : -1;
    });
  };

  const stop = () => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
  };
  const start = () => {
    if (reducedMotion || timer !== undefined) return;
    timer = window.setInterval(() => select(active + 1), 4000);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      select(index);
      stop();
      start();
    });
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      select(active + (event.key === 'ArrowRight' ? 1 : -1));
      tabs[active].focus();
    });
  });

  rotator.addEventListener('mouseenter', stop);
  rotator.addEventListener('mouseleave', start);
  rotator.addEventListener('focusin', stop);
  rotator.addEventListener('focusout', start);
  start();
}

function initialiseWalkthrough() {
  const walkthrough = document.querySelector<HTMLElement>('[data-walkthrough]');
  if (!walkthrough) return;

  const tabs = Array.from(walkthrough.querySelectorAll<HTMLButtonElement>('[data-walkthrough-tab]'));
  const panels = Array.from(walkthrough.querySelectorAll<HTMLElement>('[data-walkthrough-panel]'));
  const heading = walkthrough.querySelector<HTMLElement>('.heading-wrap');
  const stage = walkthrough.querySelector<HTMLElement>('[data-walkthrough-stage]');
  const frame = walkthrough.querySelector<HTMLElement>('[data-walkthrough-frame]');
  const tabRail = walkthrough.querySelector<HTMLElement>('[data-walkthrough-tabs]');

  const select = (index: number) => {
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel, panelIndex) => {
      const active = panelIndex === index;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(next);
      tabs[next].focus();
    });
  });

  if (!stage || !frame) return;

  const fit = () => {
    if (!window.matchMedia('(min-width: 64rem)').matches) {
      stage.style.removeProperty('height');
      frame.style.removeProperty('transform');
      return;
    }

    const availableHeight = Math.max(
      260,
      window.innerHeight
        - 74
        - (heading?.offsetHeight ?? 0)
        - (tabRail?.offsetHeight ?? 0)
        - 56,
    );
    const availableWidth = stage.clientWidth - 64;
    const naturalWidth = frame.offsetWidth || 1;
    const naturalHeight = frame.offsetHeight || 1;
    const scale = Math.min(0.92, availableWidth / naturalWidth, availableHeight / naturalHeight);
    const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;

    frame.style.transform = `scale(${safeScale})`;
    stage.style.height = `${naturalHeight * safeScale}px`;
  };

  fit();
  const observer = new ResizeObserver(fit);
  observer.observe(stage);
  observer.observe(frame);
  if (heading) observer.observe(heading);
  if (tabRail) observer.observe(tabRail);
  window.addEventListener('resize', fit);
}

function recordAnonymousSubmission() {
  void fetch(REQUEST_SUBMITTED_ENDPOINT, {
    method: 'POST',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    keepalive: true,
  }).catch(() => undefined);
}

function initialiseAccessForm() {
  const form = document.querySelector<HTMLFormElement>('[data-access-form]');
  if (!form) return;

  const input = form.querySelector<HTMLInputElement>('input[type="email"]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>('[role="status"]');
  const copy = document.querySelector<HTMLElement>('[data-form-copy]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  if (!input || !button || !status || !copy || !success) return;

  const submitLabel = button.textContent || 'Request beta access';
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    input.value = input.value.trim();
    input.removeAttribute('aria-invalid');
    status.textContent = '';

    if (!input.validity.valid) {
      input.setAttribute('aria-invalid', 'true');
      status.textContent = 'Enter a valid email address.';
      input.focus();
      return;
    }

    button.disabled = true;
    button.textContent = 'Requesting access…';

    try {
      // These are Brevo's own field names. The honeypot must remain present
      // and empty: automated submissions fill it, visitors never see it.
      const body = new FormData();
      body.append('EMAIL', input.value);
      body.append('email_address_check', '');
      body.append('locale', 'en');
      const response = await fetch(WAITLIST_ENDPOINT, { method: 'POST', body });

      if (response.status === 429) {
        status.textContent = 'Too many attempts. Please wait a moment and try again.';
        return;
      }
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);

      recordAnonymousSubmission();
      copy.hidden = true;
      form.hidden = true;
      success.hidden = false;
      success.querySelector<HTMLElement>('h1')?.focus();
    } catch {
      status.textContent = 'We couldn’t submit your beta access request. Please try again.';
    } finally {
      button.disabled = false;
      button.textContent = submitLabel;
    }
  });
}

initialiseNavigation();
initialiseFrictionRotator();
initialiseWalkthrough();
initialiseAccessForm();
