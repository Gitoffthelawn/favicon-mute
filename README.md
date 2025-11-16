# ![image](icon_64.png) FaviconMute

FaviconMute a simple browser extension that prevents web apps from changing the
favicon and title to display notifications. No more distracting notifications.

Firefox Add-Ons: [Favicon-Mute](https://addons.mozilla.org/firefox/addon/favicon-mute/)

## How It Works

When you use FaviconMute, it locks the favicon to the original one of the
website you are visiting, preventing dynamic changes. Websites may try to
update the favicon (for example, showing a notification icon), but FaviconMute
ensures the icon remains the same throughout your session.

```js
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
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
