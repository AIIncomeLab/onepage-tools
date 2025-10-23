(function () {
  const AD_CONFIG = {
    client: 'ca-pub-1521190837181685',
    slotTop: '',
    slotBottom: ''
  };

  const ensureAdSenseScript = () => {
    if (!AD_CONFIG.client) return;
    if (document.querySelector('script[data-adsbygoogle]')) return;
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('data-adsbygoogle', 'true');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(AD_CONFIG.client)}`;
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', queueAdSlots);
    document.head.appendChild(script);
  };

  const queueAdSlots = () => {
    if (!AD_CONFIG.client) return;
    if (!window.adsbygoogle) return;
    document.querySelectorAll('ins.adsbygoogle').forEach((slot) => {
      if (slot.dataset.adsbygoogleStatus === 'done') return;
      window.adsbygoogle.push({ });
      slot.dataset.adsbygoogleStatus = 'done';
    });
  };

  const createAdSlot = (position) => {
    const wrapper = document.createElement('div');
    wrapper.className = `ad ad-${position}`;
    const slotId = position === 'top' ? AD_CONFIG.slotTop : AD_CONFIG.slotBottom;

    if (AD_CONFIG.client && slotId) {
      const label = document.createElement('div');
      label.className = 'ad-label';
      label.textContent = '广告';
      wrapper.appendChild(label);

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', AD_CONFIG.client);
      ins.setAttribute('data-ad-slot', slotId);
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');

      wrapper.appendChild(ins);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'muted ad-placeholder';
      placeholder.textContent = '在 assets/layout.js 中设置 AD_CONFIG 以显示 AdSense 广告';
      wrapper.appendChild(placeholder);
    }
    return wrapper;
  };

  const injectHeader = () => {
    const placeholder = document.querySelector('[data-site-header]');
    if (!placeholder) return;

    const pageTitle = placeholder.dataset.title || '';
    const showPageHeading = placeholder.dataset.heading !== 'false' && pageTitle;
    const note = placeholder.dataset.note || '';

    const brandLink = placeholder.dataset.brandHref || '/';
    const brandTitle = placeholder.dataset.brandTitle || '在线工具箱';
    const brandSubtitle =
      placeholder.dataset.brandSubtitle || '纯前端 · 免登录 · 隐私友好';

    placeholder.innerHTML = '';

    const brand = document.createElement('div');
    brand.className = 'site-header__brand';
    brand.innerHTML = [
      `<a class="site-header__logo" href="${brandLink}">${brandTitle}</a>`,
      `<div class="muted site-header__subtitle">${brandSubtitle}</div>`
    ].join('');
    placeholder.appendChild(brand);

    placeholder.appendChild(createAdSlot('top'));

    if (showPageHeading) {
      const heading = document.createElement('h1');
      heading.className = 'site-header__heading';
      heading.textContent = pageTitle;
      placeholder.appendChild(heading);

      if (note) {
        const sub = document.createElement('div');
        sub.className = 'muted site-header__note';
        sub.textContent = note;
        placeholder.appendChild(sub);
      }
    } else if (note) {
      const sub = document.createElement('div');
      sub.className = 'muted site-header__note';
      sub.textContent = note;
      placeholder.appendChild(sub);
    }
  };

  const injectFooter = () => {
    const placeholder = document.querySelector('[data-site-footer]');
    if (!placeholder) return;

    const year = new Date().getFullYear();
    const links = placeholder.dataset.links || '';

    placeholder.innerHTML = '';
    placeholder.appendChild(document.createElement('hr'));
    placeholder.appendChild(createAdSlot('bottom'));

    const info = document.createElement('div');
    info.className = 'muted site-footer__meta';
    info.innerHTML =
      links ||
      `© ${year} · <a href="/privacy.html">隐私与政策</a> · <a href="/">更多工具</a>`;
    placeholder.appendChild(info);
  };

  document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectFooter();
    ensureAdSenseScript();
    queueAdSlots();
  });
})();
