(() => {
    const mobileQuery = window.matchMedia('(max-width: 950px)');
    const sectionContainer = document.getElementById('mobile-sections');
    if (!sectionContainer) return;

    const sectionPages = [
        { file: 'cardapios.html', id: 'cardapios' },
        { file: 'orcamento.html', id: 'orcamento' },
        { file: 'sobre.html', id: 'sobre' },
        { file: 'parceiros.html', id: 'parceiros' }
    ];
    const pageIds = new Map(sectionPages.map(page => [page.file, page.id]));
    const redirectStorageKey = 'sampaioMobileDestination';
    const initialMobileLoad = mobileQuery.matches;
    let sectionsPromise;
    let initialLoadHandled = false;
    let navigationRequested = false;
    let redirectDestination = null;

    function scrollToTop() {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        root.style.scrollBehavior = previousScrollBehavior;
    }

    if (initialMobileLoad) {
        history.scrollRestoration = 'manual';
        try {
            redirectDestination = sessionStorage.getItem(redirectStorageKey);
            sessionStorage.removeItem(redirectStorageKey);
        } catch {}
        if (!sectionPages.some(page => page.id === redirectDestination)) {
            redirectDestination = null;
        }
        if (!redirectDestination) {
            if (location.hash) {
                history.replaceState(history.state, '', location.pathname + location.search);
            }
            scrollToTop();
        }
    }

    async function loadSections() {
        if (sectionsPromise) return sectionsPromise;
        sectionsPromise = (async () => {
            const pages = await Promise.all(sectionPages.map(async page => {
                const response = await fetch(page.file);
                if (!response.ok) throw new Error(`Não foi possível carregar ${page.file}`);
                const documentPage = new DOMParser().parseFromString(await response.text(), 'text/html');
                const content = documentPage.querySelector('main');
                if (!content) throw new Error(`Conteúdo não encontrado em ${page.file}`);
                content.id = page.id;
                return content;
            }));
            sectionContainer.replaceChildren(...pages);
            await import('./quote.js');
        })().catch(error => {
            sectionsPromise = undefined;
            console.error('Erro ao carregar as seções do site:', error);
            sectionContainer.textContent = 'Não foi possível carregar todas as seções. Recarregue a página.';
            throw error;
        });
        return sectionsPromise;
    }

    function navigateToSection(id, updateHistory = true) {
        const target = document.getElementById(id);
        if (!target) return;
        if (updateHistory) {
            history.replaceState({ mobileSection: id }, '', id === 'home' ? 'index.html' : `#${id}`);
        }
        requestAnimationFrame(() => requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }));
    }

    async function initializeMobile() {
        if (!mobileQuery.matches) return;
        await loadSections();
        if (!initialMobileLoad || initialLoadHandled) return;
        initialLoadHandled = true;
        if (navigationRequested) return;
        if (redirectDestination) {
            navigateToSection(redirectDestination, false);
        } else {
            scrollToTop();
        }
    }

    document.addEventListener('click', async event => {
        if (!mobileQuery.matches) return;
        const link = event.target.closest('a[href]');
        if (!link) return;
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin) return;
        const pageFile = url.pathname.split('/').pop() || 'index.html';
        const destination = pageIds.get(pageFile) || (pageFile === 'index.html' ? 'home' : null);
        if (!destination) return;
        event.preventDefault();
        navigationRequested = true;
        try {
            await loadSections();
            navigateToSection(destination);
        } catch {
            location.href = link.href;
        }
    });

    window.addEventListener('popstate', () => {
        if (!mobileQuery.matches) return;
        navigationRequested = true;
        loadSections().then(() => {
            navigateToSection(decodeURIComponent(location.hash.slice(1)) || 'home', false);
        }).catch(() => {});
    });
    mobileQuery.addEventListener('change', () => initializeMobile().catch(() => {}));
    initializeMobile().catch(() => {});
})();
