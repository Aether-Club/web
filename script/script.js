function redirect(link) {
    window.open(link, '_blank');
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrolled = window.scrollY;
    const maxScroll = window.innerHeight * 0.5;

    if (scrolled > 0) {
        header.classList.add('scrolled');
        const progress = Math.min(scrolled / maxScroll, 1);

        const logo = header.querySelector('.logo');
        const aurora = header.querySelector('.aurora');

        logo.style.transform = `
            scale(${1 - progress * 0.2}) 
            translateY(${progress * 20}px) 
            rotate(${progress * 5}deg)
        `;

        aurora.style.opacity = 1 - progress;
        aurora.style.transform = `scale(${1 + progress * 0.3})`;

        header.style.opacity = 1 - (progress * 0.2);
    } else {
        header.classList.remove('scrolled');
        header.style.opacity = 1;
        const logo = header.querySelector('.logo');
        const aurora = header.querySelector('.aurora');
        logo.style.transform = 'scale(1) translateY(0) rotate(0)';
        aurora.style.opacity = 1;
        aurora.style.transform = 'scale(1)';
    }
});

document.querySelector('.logo').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav-container');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 0.2)';
        nav.style.padding = '0.5rem 0';
    } else {
        nav.style.background = 'var(--nav-bg)';
        nav.style.padding = '1rem 0';
    }
});

setInterval(() => {
    const header = document.querySelector('.header');
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    header.appendChild(star);

    setTimeout(() => star.remove(), 4000);
}, 2000);

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0.2s';
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.animationPlayState = 'paused';
    observer.observe(section);
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

links.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

function createCard(avatarSrc, name, role, stat) {
    let card = document.createElement('div');
    card.className = 'member-card';

    let avatar = document.createElement('div');
    avatar.className = 'member-avatar';
    avatar.style.backgroundImage = `url('${avatarSrc}')`;

    let info = document.createElement('div');
    info.className = 'member-info';
    info.innerHTML = `
    <h3 class="member-name">${name}</h3>
    <p class="member-role">${role}</p>
    <div class="member-stats">
        <div class="stat">
            <div class="stat-value">${stat[0]}</div>
            <div class="stat-label">Create</div>
        </div>
        <div class="stat">
            <div class="stat-value">${stat[1]}</div>
            <div class="stat-label">Code</div>
        </div>
        <div class="stat">
            <div class="stat-value">${stat[2]}</div>
            <div class="stat-label">Design</div>
        </div>
    </div>`
    card.appendChild(avatar);
    card.appendChild(info);
    return card;
}

let memberContainer = document.querySelector('.members-grid');
fetch('script/members.json')
    .then(response => response.json())
    .then(members => {
        members.forEach(member => {
            const stat = [member.stats.create, member.stats.code, member.stats.design];
            const card = createCard(member.avatar, member.name, member.role, stat);
            memberContainer.appendChild(card);
        });
        
        document.querySelectorAll('.member-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
                card.querySelector('.member-info').style.transform = `translateZ(40px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                card.querySelector('.member-info').style.transform = 'translateZ(0)';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = '0.1s transform ease';
                card.querySelector('.member-info').style.transition = '0.1s transform ease';
            });
        });
    });

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

// quit, it works i guess
function getClosestEvents(currentDate, events) {
    let closestEvents = [];

    closestEvents = events.filter(event => {
        const eventDate = event.statedDate;
        const eventTimestamp = eventDate[2] * 10000 + eventDate[1] * 100 + eventDate[0];
        const currentTimestamp = currentDate[2] * 10000 + currentDate[1] * 100 + currentDate[0];
        
        return eventTimestamp >= currentTimestamp;
    });

    closestEvents.sort((a, b) => {
        const dateA = a.statedDate;
        const dateB = b.statedDate;
        
        if (dateA[2] !== dateB[2]) return dateA[2] - dateB[2];
        if (dateA[1] !== dateB[1]) return dateA[1] - dateB[1];
        return dateA[0] - dateB[0];
    });

    return closestEvents;
}

let eventContainer = document.querySelector('.event-cards');
fetch('script/events.json')
    .then(response => response.json())
    .then(events => {
        const now = new Date();
        const date = [now.getDate(), now.getMonth() + 1, now.getFullYear()];

        const closestEvents = getClosestEvents(date, events);
        console.log(closestEvents);
        
        closestEvents.forEach(event => {
            const card = createEvent(event.date, event.name, event.description);
            eventContainer.appendChild(card);
        });
    });