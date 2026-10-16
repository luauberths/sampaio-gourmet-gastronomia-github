const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
    const nameInput = document.getElementById('full-name');
    const phoneInput = document.getElementById('phone');
    const eventTypeInput = document.getElementById('event-type');
    const eventDateInput = document.getElementById('event-date');
    const guestCountInput = document.getElementById('guest-count');
    const cityInput = document.getElementById('city');
    const menuTypeInput = document.getElementById('menu-type');
    const dateHint = document.getElementById('date-hint');

    // Use a data local (não UTC) para respeitar o dia do usuário.
    const updateMinimumDate = () => {
        const earliestDate = new Date();
        earliestDate.setHours(12, 0, 0, 0);
        earliestDate.setDate(earliestDate.getDate() + 5);
        const year = earliestDate.getFullYear();
        const month = String(earliestDate.getMonth() + 1).padStart(2, '0');
        const day = String(earliestDate.getDate()).padStart(2, '0');
        eventDateInput.min = `${year}-${month}-${day}`;
    };

    const updateDateAvailability = () => {
        const hasRequiredDetails = nameInput.value.trim() !== ''
            && phoneInput.value.trim() !== ''
            && eventTypeInput.value !== '';
        updateMinimumDate();
        eventDateInput.disabled = !hasRequiredDetails;
        if (!hasRequiredDetails) eventDateInput.value = '';
        if (dateHint) dateHint.style.display = hasRequiredDetails ? 'none' : 'block';
    };

    nameInput.addEventListener('input', updateDateAvailability);
    phoneInput.addEventListener('input', updateDateAvailability);
    eventTypeInput.addEventListener('change', updateDateAvailability);
    eventDateInput.addEventListener('focus', updateMinimumDate);
    eventDateInput.addEventListener('input', () => eventDateInput.setCustomValidity(''));
    guestCountInput.addEventListener('input', () => {
        if (Number(guestCountInput.value) > 300) guestCountInput.value = '300';
    });
    updateDateAvailability();

    quoteForm.addEventListener('submit', event => {
        event.preventDefault();
        updateMinimumDate();
        // Impede o envio mesmo se a página ficou aberta durante uma virada de dia.
        if (eventDateInput.value < eventDateInput.min) {
            eventDateInput.setCustomValidity('Selecione uma data com pelo menos 5 dias de antecedência.');
            eventDateInput.reportValidity();
            return;
        }
        eventDateInput.setCustomValidity('');

        const fullName = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const eventType = eventTypeInput.value;
        const eventDate = eventDateInput.value;
        const guestCount = guestCountInput.value;
        const city = cityInput.value;
        const menuType = menuTypeInput.value;
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
            `*Cidade:* ${city}`,
            `*Tipo de Cardápio:* ${menuType}`
        ];
        if (notes) messageLines.push(`*Observações:* ${notes}`);
        const message = `${messageLines.join('\n')}\n`;
        const whatsappNumber = '5511966884935';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}
