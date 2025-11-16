(function() {
  const TITLE_EL = document.querySelector('title') || (() => {
      const t = document.createElement('title');
      document.head.appendChild(t);
      return t;
  })();

  const blockFaviconChange = link => {
    if (!link) return false;
    const rel = (link.getAttribute('rel') || '').toLowerCase();
    return rel === 'icon' || rel === 'shortcut icon';
  };

  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if (name === 'href' && blockFaviconChange(this)) {
      console.warn('Blocked favicon change attempt:', this, value);
      return;
    }
    if (this === TITLE_EL && name === 'textContent') {
      console.warn('Blocked title change via setAttribute');
      return;
    }
    return originalSetAttribute.call(this, name, value);
  };

  Object.defineProperty(HTMLLinkElement.prototype, 'rel', {
    set(newRel) {
      if (blockFaviconChange(this)) {
        console.warn('Blocked favicon rel change attempt:', newRel);
        return;
      }
      this.setAttribute('rel', newRel);
    },
    get() {
      return this.getAttribute('rel');
    }
  });

  Object.defineProperty(document, 'title', {
    configurable: false,
    enumerable: true,
    get() {
      return TITLE_EL.textContent;
    },
    set(newTitle) {
      console.warn('Blocked document.title change:', newTitle);
    }
  });
})();
