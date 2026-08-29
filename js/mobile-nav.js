/**
 * SIAR Mobile Navigation & Floating Thumb-Dock Controller
 * Provides smooth, thumb-friendly mobile navigation across all pages.
 */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    injectMobileNavComponents();
    setupMobileDrawerEvents();
  });

  function injectMobileNavComponents() {
    const headerNav = document.querySelector('.header-nav .nav-inner');
    if (!headerNav) return;

    // 1. Add Hamburger Button to Header if not already present
    if (!document.getElementById('btnMobileMenuToggle')) {
      const btnToggle = document.createElement('button');
      btnToggle.id = 'btnMobileMenuToggle';
      btnToggle.className = 'mobile-menu-btn';
      btnToggle.setAttribute('aria-label', 'Toggle Navigation Menu');
      btnToggle.setAttribute('title', 'Menu');
      btnToggle.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      `;
      headerNav.appendChild(btnToggle);
    }

    // 2. Add Mobile Slide-Out Drawer & Overlay if not present
    if (!document.getElementById('mobileNavDrawer')) {
      const currentPath = window.location.pathname;
      const isCurrent = (name) => currentPath.endsWith(name) || (name === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')));

      const drawerOverlay = document.createElement('div');
      drawerOverlay.id = 'mobileDrawerOverlay';
      drawerOverlay.className = 'mobile-drawer-overlay';

      const drawer = document.createElement('div');
      drawer.id = 'mobileNavDrawer';
      drawer.className = 'mobile-nav-drawer';
      drawer.innerHTML = `
        <div class="drawer-header">
          <div class="brand-logo">
            <div class="brand-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <span class="brand-text" style="font-size: 1.25rem;">SIAR</span>
          </div>
          <button id="btnDrawerClose" class="btn-icon" style="width: 36px; height: 36px;" aria-label="Close Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <div class="drawer-links-group">
          <div class="drawer-group-title">Platform & Apps</div>
          <a href="index.html" class="drawer-nav-link ${isCurrent('index.html') ? 'active' : ''}">
            <span class="link-icon">🏠</span> Showcase & Features
          </a>
          <a href="guide.html" class="drawer-nav-link ${isCurrent('guide.html') ? 'active' : ''}">
            <span class="link-icon">📘</span> User & Operations Guide
          </a>
          <a href="packages.html" class="drawer-nav-link ${isCurrent('packages.html') ? 'active' : ''}">
            <span class="link-icon">📦</span> Package Center (APKs, Repos)
          </a>
          <a href="plugins.html" class="drawer-nav-link ${isCurrent('plugins.html') ? 'active' : ''}">
            <span class="link-icon">🧩</span> Plugin Marketplace
          </a>
          <a href="offline.html" class="drawer-nav-link ${isCurrent('offline.html') ? 'active' : ''}">
            <span class="link-icon">📡</span> Offline Survival Portal
          </a>
        </div>

        <div class="drawer-links-group">
          <div class="drawer-group-title">Engine & Protocol Tools</div>
          <a href="docs.html" class="drawer-nav-link ${isCurrent('docs.html') ? 'active' : ''}">
            <span class="link-icon">📖</span> Developer Hub & API Docs
          </a>
          <a href="simulator.html" class="drawer-nav-link ${isCurrent('simulator.html') ? 'active' : ''}">
            <span class="link-icon">🔬</span> WASM Mesh Simulation Lab
          </a>
          <a href="verify.html" class="drawer-nav-link ${isCurrent('verify.html') ? 'active' : ''}">
            <span class="link-icon">🛡️</span> SLSA Supply Chain Verifier
          </a>
          <a href="infra.html" class="drawer-nav-link ${isCurrent('infra.html') ? 'active' : ''}">
            <span class="link-icon">🌐</span> Global Edge Infrastructure
          </a>
          <a href="pipeline.html" class="drawer-nav-link ${isCurrent('pipeline.html') ? 'active' : ''}">
            <span class="link-icon">🚀</span> CI/CD Release Pipeline
          </a>
        </div>

        <div class="drawer-links-group">
          <div class="drawer-group-title">Specifications & Blueprints</div>
          <a href="sys-arch/" class="drawer-nav-link" style="border-left-color: var(--siar-emerald-online);">
            <span class="link-icon">📑</span> System Architecture (mdBook)
          </a>
          <a href="roadmap.html" class="drawer-nav-link ${isCurrent('roadmap.html') ? 'active' : ''}">
            <span class="link-icon">🗺️</span> Roadmap & Tech Stack
          </a>
        </div>

        <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--siar-border-subtle); display: flex; gap: 8px;">
          <a href="https://github.com/irshadali5/siar" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="flex: 1; justify-content: center; font-size: 0.8rem;">
            GitHub Repo
          </a>
          <a href="packages.html" class="btn btn-primary btn-sm" style="flex: 1; justify-content: center; font-size: 0.8rem;">
            Get App
          </a>
        </div>
      `;

      document.body.appendChild(drawerOverlay);
      document.body.appendChild(drawer);
    }

    // 3. Add Mobile Floating Thumb-Dock if not present
    if (!document.getElementById('mobileBottomDock')) {
      const currentPath = window.location.pathname;
      const isHome = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/siar-site/') || currentPath.endsWith('/siar/');
      const isPkg = currentPath.includes('packages.html');
      const isDocs = currentPath.includes('docs.html');
      const isLab = currentPath.includes('simulator.html');
      const isArch = currentPath.includes('roadmap.html') || currentPath.includes('sys-arch');

      const dock = document.createElement('nav');
      dock.id = 'mobileBottomDock';
      dock.className = 'mobile-bottom-dock';
      dock.setAttribute('aria-label', 'Mobile Quick Navigation');
      dock.innerHTML = `
        <a href="index.html" class="dock-item ${isHome ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Home</span>
        </a>
        <a href="packages.html" class="dock-item ${isPkg ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
          <span>Packages</span>
        </a>
        <a href="docs.html" class="dock-item ${isDocs ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          <span>Docs</span>
        </a>
        <a href="simulator.html" class="dock-item ${isLab ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M19.8 18.4L14 10.67V6.5l1.4-1.4c.3-.3.1-.9-.3-.9H8.9c-.4 0-.6.6-.3.9L10 6.5v4.17L4.2 18.4c-.5.7 0 1.6.8 1.6h14c.8 0 1.3-.9.8-1.6z"/></svg>
          <span>WASM Lab</span>
        </a>
        <a href="sys-arch/" class="dock-item ${isArch ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          <span>Specs</span>
        </a>
      `;

      document.body.appendChild(dock);
    }
  }

  function setupMobileDrawerEvents() {
    const btnToggle = document.getElementById('btnMobileMenuToggle');
    const btnClose = document.getElementById('btnDrawerClose');
    const drawerOverlay = document.getElementById('mobileDrawerOverlay');
    const drawer = document.getElementById('mobileNavDrawer');

    if (!btnToggle || !drawerOverlay || !drawer) return;

    function openDrawer() {
      drawerOverlay.classList.add('open');
      drawer.classList.add('open');
      btnToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawerOverlay.classList.remove('open');
      drawer.classList.remove('open');
      btnToggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    btnToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (btnClose) {
      btnClose.addEventListener('click', closeDrawer);
    }

    drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when pressing ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }
})();
