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
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));

  const closeMenu = () => {
    button?.setAttribute('aria-expanded', 'false');
    button?.setAttribute('aria-label', 'Open menu');
    menu?.setAttribute('aria-hidden', 'true');
    menu?.setAttribute('inert', '');
    menu?.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  button?.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu?.setAttribute('aria-hidden', String(!open));
    if (open) menu?.removeAttribute('inert');
    else menu?.setAttribute('inert', '');
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

  if (navLinks.length) {
    const sections = navLinks
      .map((link) => document.getElementById(link.dataset.navLink || ''))
      .filter((section): section is HTMLElement => Boolean(section));

    let frame: number | undefined;
    const updateActiveSection = () => {
      frame = undefined;
      const headerHeight = header?.offsetHeight || 0;
      const readingLine = window.scrollY + headerHeight + window.innerHeight * 0.28;
      const active = sections.reduce<HTMLElement | undefined>((current, section) => {
        return section.offsetTop <= readingLine ? section : current;
      }, undefined);

      navLinks.forEach((link) => {
        if (active && link.dataset.navLink === active.id) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const scheduleActiveSection = () => {
      if (frame !== undefined) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', scheduleActiveSection, { passive: true });
    window.addEventListener('resize', scheduleActiveSection);
  }
}

function createAutoAdvance(
  advance: () => void,
  interval: number | (() => number),
  reducedMotion: boolean,
) {
  let timer: number | undefined;
  let temporarilyPaused = false;
  let stopped = false;
  const delay = () => (typeof interval === 'function' ? interval() : interval);

  const clear = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
  };

  const tick = () => {
    advance();
    timer = window.setTimeout(tick, delay());
  };

  const start = () => {
    if (reducedMotion || temporarilyPaused || stopped || timer !== undefined) return;
    timer = window.setTimeout(tick, delay());
  };

  return {
    start,
    // A deliberate choice ends the tour: once the person picks a stage, the
    // rotation never restarts (hover-resume included).
    stop() {
      stopped = true;
      clear();
    },
    pauseTemporarily() {
      temporarilyPaused = true;
      clear();
    },
    resumeTemporarily() {
      temporarilyPaused = false;
      start();
    },
  };
}

function initialiseFrictionRotator() {
  const rotator = document.querySelector<HTMLElement>('[data-frictions]');
  if (!rotator) return;

  const question = rotator.querySelector<HTMLElement>('[data-friction-question]');
  const answer = rotator.querySelector<HTMLElement>('[data-friction-answer]');
  const choices = Array.from(rotator.querySelectorAll<HTMLButtonElement>('[data-friction-choice]'));
  const announcer = rotator.querySelector<HTMLElement>('[data-friction-announcer]');
  if (!question || !answer || !choices.length) return;

  let active = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const select = (index: number, announce = false) => {
    active = (index + choices.length) % choices.length;
    const selected = choices[active];
    question.textContent = selected.dataset.question || '';
    answer.textContent = selected.dataset.answer || '';
    choices.forEach((choice, choiceIndex) => {
      if (choiceIndex === active) choice.setAttribute('aria-current', 'true');
      else choice.removeAttribute('aria-current');
    });
    if (announce && announcer) {
      announcer.textContent = `${question.textContent} ${answer.textContent}`;
    }
  };

  const rotation = createAutoAdvance(() => select(active + 1), 4000, reducedMotion);

  choices.forEach((choice, index) => {
    choice.addEventListener('click', () => {
      select(index, true);
    });
    choice.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      select(active + (event.key === 'ArrowRight' ? 1 : -1), true);
      choices[active].focus();
    });
  });

  rotator.addEventListener('mouseenter', rotation.pauseTemporarily);
  rotator.addEventListener('mouseleave', rotation.resumeTemporarily);
  rotator.addEventListener('focusin', rotation.pauseTemporarily);
  rotator.addEventListener('focusout', rotation.resumeTemporarily);
  select(0);
  rotation.start();
}

function initialiseWalkthrough() {
  const walkthrough = document.querySelector<HTMLElement>('[data-walkthrough]');
  if (!walkthrough) return;

  const tabs = Array.from(walkthrough.querySelectorAll<HTMLButtonElement>('[data-walkthrough-tab]'));
  const panels = Array.from(walkthrough.querySelectorAll<HTMLElement>('[data-walkthrough-panel]'));
  const heading = walkthrough.querySelector<HTMLElement>('.heading-wrap');
  const stage = walkthrough.querySelector<HTMLElement>('[data-walkthrough-stage]');
  const frame = walkthrough.querySelector<HTMLElement>('[data-walkthrough-frame]');
  const desktop = walkthrough.querySelector<HTMLElement>('.desktop-walkthrough');
  const tabRail = walkthrough.querySelector<HTMLElement>('[data-walkthrough-tabs]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;

  const select = (index: number) => {
    active = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel, panelIndex) => {
      const selected = panelIndex === active;
      panel.hidden = !selected;
      panel.classList.toggle('active', selected);
    });
  };

  // Calm, even rotation; a manual pick hands control over for good.
  const rotation = createAutoAdvance(() => select(active + 1), 5500, reducedMotion);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      rotation.stop();
      select(index);
    });
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      rotation.stop();
      const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(next);
      tabs[next].focus();
    });
  });

  walkthrough.addEventListener('mouseenter', rotation.pauseTemporarily);
  walkthrough.addEventListener('mouseleave', rotation.resumeTemporarily);
  walkthrough.addEventListener('focusin', rotation.pauseTemporarily);
  walkthrough.addEventListener('focusout', rotation.resumeTemporarily);
  select(0);
  rotation.start();

  if (!stage || !frame) return;

  const fit = () => {
    if (!window.matchMedia('(min-width: 64rem)').matches) {
      desktop?.classList.remove('scroll-fallback');
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
        - (body?.offsetHeight ?? 0)
        - 56,
    );
    const availableWidth = stage.clientWidth - 64;
    const naturalWidth = frame.offsetWidth || 1;
    const naturalHeight = frame.offsetHeight || 1;
    const scale = Math.min(0.92, availableWidth / naturalWidth, availableHeight / naturalHeight);
    const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;

    if (safeScale < 0.55) {
      desktop?.classList.add('scroll-fallback');
      frame.style.removeProperty('transform');
      stage.style.height = `${naturalHeight}px`;
      return;
    }

    desktop?.classList.remove('scroll-fallback');
    frame.style.transform = `scale(${safeScale})`;
    stage.style.height = `${naturalHeight * safeScale}px`;
  };

  fit();
  const observer = new ResizeObserver(fit);
  observer.observe(stage);
  observer.observe(frame);
  if (heading) observer.observe(heading);
  if (tabRail) observer.observe(tabRail);
  if (body) observer.observe(body);
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

function initialiseInviteFriend() {
  const instances = Array.from(
    document.querySelectorAll<HTMLElement>('[data-invite-friend]'),
  );
  if (!instances.length) return;

  // The modal locks the page scroll while open; restored on every close path.
  const lockScroll = () => {
    document.documentElement.style.overflow = 'hidden';
  };
  const unlockScroll = () => {
    document.documentElement.style.overflow = '';
  };

  // Panels are portalled to <body> when opened, so they can no longer be found
  // by querying inside their instance — this keeps the pairing.
  const panelOf = new WeakMap<HTMLElement, HTMLElement>();
  instances.forEach((instance) => {
    const panel = instance.querySelector<HTMLElement>('[data-invite-panel]');
    if (panel) panelOf.set(instance, panel);
  });

  const closeInstance = (instance: HTMLElement, restoreFocus = false) => {
    const trigger = instance.querySelector<HTMLButtonElement>('[data-invite-trigger]');
    const panel = panelOf.get(instance);
    if (!trigger || !panel || panel.hidden) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    unlockScroll();
    if (restoreFocus) trigger.focus();
  };

  const closeAll = (except?: HTMLElement) => {
    instances.forEach((instance) => {
      if (instance !== except) closeInstance(instance);
    });
  };

  instances.forEach((instance) => {
    const trigger = instance.querySelector<HTMLButtonElement>('[data-invite-trigger]');
    const panel = instance.querySelector<HTMLElement>('[data-invite-panel]');
    const message = instance.querySelector<HTMLTextAreaElement>('[data-invite-message]');
    const copyButton = instance.querySelector<HTMLButtonElement>('[data-invite-copy]');
    const announcer = instance.querySelector<HTMLElement>('[data-invite-announcer]');
    if (!trigger || !panel || !message || !copyButton) return;

    const resizeMessage = () => {
      message.style.height = 'auto';
      message.style.height = `${Math.max(message.scrollHeight, 120)}px`;
    };

    const fallbackCopy = () => {
      const fallback = document.createElement('textarea');
      fallback.value = message.value;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.opacity = '0';
      document.body.append(fallback);
      fallback.select();
      const legacyDocument = document as unknown as {
        execCommand(commandId: string): boolean;
      };
      legacyDocument.execCommand('copy');
      fallback.remove();
    };

    trigger.addEventListener('click', () => {
      const opening = panel.hidden;
      closeAll(instance);
      panel.hidden = !opening;
      trigger.setAttribute('aria-expanded', String(opening));
      if (!opening) {
        unlockScroll();
        return;
      }
      // Portal to <body>: any positioned ancestor (the beta card's wrapper is
      // one) would otherwise trap the fixed overlay beneath the nav.
      if (panel.parentElement !== document.body) document.body.append(panel);
      lockScroll();
      resizeMessage();
      message.focus();
      message.select();
    });

    // Backdrop and the × both dismiss, returning focus to the trigger.
    instance.querySelectorAll<HTMLElement>('[data-invite-dismiss]').forEach((dismiss) => {
      dismiss.addEventListener('click', () => closeInstance(instance, true));
    });

    panel.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'textarea, button:not([hidden]), a[href]:not([hidden])',
        ),
      ).filter((element) => !element.hasAttribute('disabled'));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    message.addEventListener('input', () => {
      resizeMessage();
    });

    copyButton.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(message.value);
      } catch {
        fallbackCopy();
      }

      copyButton.textContent = 'Copied';
      if (announcer) announcer.textContent = 'Message copied';
      window.setTimeout(() => {
        copyButton.textContent = 'Copy message';
      }, 1800);
    });
  });

  document.addEventListener('pointerdown', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    instances.forEach((instance) => {
      // The panel is portalled out of the instance, so it must be tested too.
      const panel = panelOf.get(instance);
      if (instance.contains(target) || panel?.contains(target)) return;
      closeInstance(instance);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = instances.find((instance) => panelOf.get(instance)?.hidden === false);
    if (open) closeInstance(open, true);
  });

}

function initialiseAccessForm() {
  const form = document.querySelector<HTMLFormElement>('[data-access-form]');
  if (!form) return;

  const input = form.querySelector<HTMLInputElement>('input[type="email"]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>('[role="status"]');
  const copy = document.querySelector<HTMLElement>('[data-form-copy]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const submittedEmail = success?.querySelector<HTMLElement>('[data-submitted-email]');
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
      if (submittedEmail) submittedEmail.textContent = input.value;
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
initialiseInviteFriend();
initialiseAccessForm();
