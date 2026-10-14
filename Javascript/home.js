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
    const textElements = [titleStart, titleEnd, heroDescription];
    let currentMessageIndex = 0;
    const updateHeroMessage = () => {
        const message = heroMessages[currentMessageIndex];
        titleStart.textContent = message.start;
        titleEnd.textContent = message.end;
        heroDescription.textContent = message.description;
        serviceItems.forEach((item, index) => {
            item.classList.toggle('highlighted', index === currentMessageIndex);
        });
    };
    updateHeroMessage();
    setInterval(() => {
        textElements.forEach(element => element.classList.add('fade-out'));
        setTimeout(() => {
            currentMessageIndex = (currentMessageIndex + 1) % heroMessages.length;
            updateHeroMessage();
            textElements.forEach(element => element.classList.remove('fade-out'));
        }, 500);
    }, 3500);
}
