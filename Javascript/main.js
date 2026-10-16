const currentYear = document.getElementById('current-year');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const menuClose = document.getElementById('menu-close');

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks && menuClose) {
    let menuScrollPosition = 0;

    const closeMenu = () => {
        if (!navLinks.classList.contains('active-modal')) return;
        navLinks.classList.remove('active-modal');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.top = '';

        const scrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, menuScrollPosition);
        document.documentElement.style.scrollBehavior = scrollBehavior;
    };

    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', navLinks.id);

    menuToggle.addEventListener('click', () => {
        menuScrollPosition = window.scrollY;
        document.body.style.top = `-${menuScrollPosition}px`;
        navLinks.classList.add('active-modal');
        menuToggle.setAttribute('aria-expanded', 'true');
    });

    menuClose.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

(function enableDesktopPageTransitions() {
    if (!window.matchMedia('(min-width: 951px)').matches) return;
    if (document.getElementById('sampaio-desktop-page-transitions')) return;

    const style = document.createElement('style');
    style.id = 'sampaio-desktop-page-transitions';
    style.textContent = `
        @view-transition {
            navigation: auto;
        }

        @keyframes sampaio-page-leave {
            from { opacity: 1; transform: translateY(0); }
            to   { opacity: 0; transform: translateY(-6px); }
        }

        @keyframes sampaio-page-enter {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        ::view-transition-old(root) {
            animation: 180ms ease-in both sampaio-page-leave;
        }

        ::view-transition-new(root) {
            animation: 280ms cubic-bezier(.22, 1, .36, 1) both sampaio-page-enter;
        }

        @media (prefers-reduced-motion: reduce) {
            ::view-transition-old(root),
            ::view-transition-new(root) {
                animation-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
})();
