;(function () {
  'use strict'

  function attachPreviewListeners() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'skip:preview-go-back') {
        window.history.back()
      }
      if (event.data.type === 'skip:preview-go-forward') {
        window.history.forward()
      }
      if (event.data.type === 'skip:preview-refresh') {
        window.location.replace(window.location.href)
      }
      if (event.data.type === 'skip:preview-go-to') {
        window.history.pushState({}, '', event.data.url)
      }
    })

    window.addEventListener('popstate', () => {
      window.top.postMessage(
        {
          type: 'preview:navigate-pop',
          url: String(window.location.pathname),
        },
        '*',
      )
    })

    const originalPushState = window.history.pushState

    window.history.pushState = function (data, title, url) {
      originalPushState.call(this, data, title, url)
      window.top.postMessage(
        {
          type: 'preview:navigate-push',
          url: String(window.location.pathname),
        },
        '*',
      )
    }

    const originalReplaceState = window.history.replaceState

    window.history.replaceState = function (data, title, url) {
      originalReplaceState.call(this, data, title, url)
      window.top.postMessage(
        {
          type: 'preview:navigate-replace',
          url: String(window.location.pathname),
        },
        '*',
      )
    }
  }

  function isBadgeClosed() {
    return localStorage.getItem('skip-badge-closed') === 'true'
  }

  function createBadgeStyles() {
    const style = document.createElement('style')
    style.textContent = `
      .skip-badge {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 9999;
        background-color: #000;
        color: #fff;
        border-radius: 8px;
        padding: 8px 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        font-weight: 500;
        border: 1px solid #374151;
        animation: slideInFromBottomRight 0.5s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        cursor: pointer;
        transition: background-color 0.2s;
        text-decoration: none;
      }

      .skip-badge:hover {
        background-color: #1f1f1f;
      }

      .skip-badge img {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }

      .skip-badge-close {
        margin-left: 8px;
        width: 16px;
        height: 16px;
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
        padding: 0;
      }

      .skip-badge-close:hover {
        background-color: #374151;
      }

      .skip-badge.hidden {
        display: none;
      }

      @keyframes slideInFromBottomRight {
        from {
          transform: translate(20px, 20px);
          opacity: 0;
        }
        to {
          transform: translate(0, 0);
          opacity: 1;
        }
      }
    `
    document.head.appendChild(style)
  }

  function createBadgeElement() {
    const badge = document.createElement('div')
    badge.id = 'skip-badge'
    badge.className = 'skip-badge'

    badge.innerHTML = `
      <img src="/skip.png" alt="Skip" />
      <span>Criado com o Skip</span>
      <button class="skip-badge-close" aria-label="Fechar badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    `

    badge.addEventListener('click', openSkipWebsite)

    const closeButton = badge.querySelector('.skip-badge-close')
    closeButton?.addEventListener('click', closeBadge)

    return badge
  }

  function openSkipWebsite(event) {
    if (event.target.closest('.skip-badge-close')) {
      return
    }
    window.open('https://goskip.dev', '_blank')
  }

  function closeBadge(event) {
    event.stopPropagation()
    const badge = document.getElementById('skip-badge')
    if (badge) {
      badge.classList.add('hidden')
      localStorage.setItem('skip-badge-closed', 'true')
    }
  }

  function initSkipBadge() {
    var inIframe = window.self !== window.top
    if (isBadgeClosed() || inIframe) {
      return
    }

    createBadgeStyles()

    const badge = createBadgeElement()
    document.body.appendChild(badge)
  }

  function init() {
    attachPreviewListeners()
    initSkipBadge()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
