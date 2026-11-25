// Device capability, not window width: a narrow Mac/Windows window can install.
// iPadOS can identify as a Mac; touch support distinguishes that case.
(() => {
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const ua = navigator.userAgent || '';
  const windows = /Win/i.test(platform) || /Windows/i.test(ua);
  const ipad = /Mac/i.test(platform) && navigator.maxTouchPoints > 1;
  const mobile = !windows && (navigator.userAgentData?.mobile === true
    || /Android|iPhone|iPad|iPod/i.test(ua) || ipad);
  document.documentElement.dataset.deviceClass = mobile ? 'mobile' : 'desktop';
})();
