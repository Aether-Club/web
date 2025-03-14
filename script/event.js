function createEvent(date, title, description) {
    let event = document.createElement('div');
    event.className = 'event-card';

    let eventDate = document.createElement('div');
    eventDate.className = 'event-date';
    eventDate.innerHTML = date;

    let eventInfo = document.createElement('div');
    eventInfo.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>`;

    event.appendChild(eventDate);
    event.appendChild(eventInfo);
    return event;
}

let eventContainer = document.querySelector('.event-cards');
fetch('script/events.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(event => {
            const card = createEvent(event.date, event.name, event.description);
            eventContainer.appendChild(card);
        });
    });