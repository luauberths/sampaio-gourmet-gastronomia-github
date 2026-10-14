const slides = document.querySelectorAll('.slide');
const titleStart = document.getElementById('title-start');
const titleEnd = document.getElementById('title-end');
const heroDescription = document.getElementById('hero-description');
const serviceItems = document.querySelectorAll('.service-item');

if (slides.length > 1) {
    let currentSlideIndex = 0;

    setInterval(() => {
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        slides[currentSlideIndex].classList.add('active');
    }, 3500);
}

if (titleStart && titleEnd && heroDescription) {
    const heroTitle = document.querySelector('.hero-title');

    const heroMessages = [
        {
            start: 'Sabores que tornam seus',
            end: 'momentos especiais...',
            description: 'Transformamos sua celebração em uma experiência inesquecível. Em casamentos ou grandes festas, fazemos cada instante ficar marcado na sua memória...'
        },
        {
            start: 'Detalhes que marcam',
            end: 'encontros inesquecíveis...',
            description: 'A excelência está no cuidado com cada detalhe, unindo sabor e sofisticação para traduzir a essência da sua comemoração...'
        },
        {
            start: 'Serviços pensados para',
            end: 'encantar seus convidados...',
            description: 'Do requinte de um brunch ao dinamismo de um coffee break ou buffet, criamos cardápios sob medida para encantar do início ao fim...'
        }
    ];

    const textElements = [
        titleStart,
        titleEnd,
        heroDescription
    ];

    let currentMessageIndex = 0;

    const updateHeroMessage = () => {
        const message = heroMessages[currentMessageIndex];

        titleStart.textContent = message.start;
        titleEnd.textContent = message.end;
        heroDescription.textContent = message.description;

        serviceItems.forEach((item, index) => {
            item.classList.toggle(
                'highlighted',
                index === currentMessageIndex
            );
        });
    };

    const ajustarAlturas = () => {
        if (!heroTitle) return;

        heroTitle.style.minHeight = '';
        heroDescription.style.minHeight = '';

        const minimoTitulo =
            parseFloat(getComputedStyle(heroTitle).minHeight) || 0;

        const minimoDescricao =
            parseFloat(getComputedStyle(heroDescription).minHeight) || 0;

        const textoOriginal = {
            start: titleStart.textContent,
            end: titleEnd.textContent,
            description: heroDescription.textContent
        };

        heroTitle.style.minHeight = '0px';
        heroDescription.style.minHeight = '0px';

        let maiorAlturaTitulo = 0;
        let maiorAlturaDescricao = 0;

        heroMessages.forEach(message => {
            titleStart.textContent = message.start;
            titleEnd.textContent = message.end;
            heroDescription.textContent = message.description;

            maiorAlturaTitulo = Math.max(
                maiorAlturaTitulo,
                heroTitle.scrollHeight
            );

            maiorAlturaDescricao = Math.max(
                maiorAlturaDescricao,
                heroDescription.scrollHeight
            );
        });

        titleStart.textContent = textoOriginal.start;
        titleEnd.textContent = textoOriginal.end;
        heroDescription.textContent = textoOriginal.description;

        heroTitle.style.minHeight =
            `${Math.ceil(Math.max(maiorAlturaTitulo, minimoTitulo))}px`;

        heroDescription.style.minHeight =
            `${Math.ceil(Math.max(maiorAlturaDescricao, minimoDescricao))}px`;
    };

    updateHeroMessage();

    ajustarAlturas();

    let resizeFrame = null;

    window.addEventListener('resize', () => {
        if (resizeFrame !== null) {
            cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = requestAnimationFrame(() => {
            ajustarAlturas();
            resizeFrame = null;
        });
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(ajustarAlturas);
    }

    setInterval(() => {
        textElements.forEach(element => {
            element.classList.add('fade-out');
        });

        setTimeout(() => {
            currentMessageIndex =
                (currentMessageIndex + 1) % heroMessages.length;

            updateHeroMessage();

            textElements.forEach(element => {
                element.classList.remove('fade-out');
            });
        }, 500);
    }, 3500);
}
