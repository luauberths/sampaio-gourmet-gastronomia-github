const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
    const nameInput = document.getElementById('full-name');
    const phoneInput = document.getElementById('phone');
    const eventTypeInput = document.getElementById('event-type');
    const eventDateInput = document.getElementById('event-date');
    const dateHint = document.getElementById('date-hint');
    const updateDateAvailability = () => {
        const hasRequiredDetails = nameInput.value.trim() !== ''
            && phoneInput.value.trim() !== ''
            && eventTypeInput.value !== '';
        eventDateInput.disabled = !hasRequiredDetails;
        if (!hasRequiredDetails) eventDateInput.value = '';
        if (dateHint) dateHint.style.display = hasRequiredDetails ? 'none' : 'block';
    };
    nameInput.addEventListener('input', updateDateAvailability);
    phoneInput.addEventListener('input', updateDateAvailability);
    eventTypeInput.addEventListener('change', updateDateAvailability);
    quoteForm.addEventListener('submit', event => {
        event.preventDefault();
        const fullName = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const eventType = eventTypeInput.value;
        const eventDate = eventDateInput.value;
        const guestCount = document.getElementById('guest-count').value;
        const city = document.getElementById('city').value.trim();
        const notes = document.getElementById('notes').value.trim();
        const formattedDate = eventDate ? eventDate.split('-').reverse().join('/') : '';
        const messageLines = [
            '*Solicitação de Orçamento - Sampaio Gourmet*',
            '',
            `*Nome:* ${fullName}`,
            `*Telefone:* ${phone}`,
            `*Tipo de Evento:* ${eventType}`,
            `*Data do Evento:* ${formattedDate}`,
            `*Nº de Convidados:* ${guestCount} pessoas`,
            `*Cidade:* ${city}`
        ];
        if (notes) messageLines.push(`*Observações:* ${notes}`);
        const message = `${messageLines.join('\n')}\n`;
        const whatsappNumber = '5511966884935';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}
