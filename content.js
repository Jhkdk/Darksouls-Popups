const pastTenseMap = {
    "send": "sent",
    "click": "clicked",
    "submit":"submitted",
    "save": "saved",
    "delete": "deleted",
    "create": "created",
    "upload": "uploaded",
    "download": "downloaded",
    "submit": "submitted",
    "like": "liked",
    "edit": "edited",
    "open": "opened",
    "close": "closed",
    "play": "played",
    "pause": "paused",
    "copy": "copied",
    "cut": "cut",
    "move": "moved",
    "refresh": "refreshed",
    "reply": "replied",
    "forward": "forwarded"
};

const googleTabs = [
"ALL", "VIDEOS", "IMAGES", "SHOPPING", "FORUMS", "WEB", "BOOKS", "NEWS", "FLIGHTS", "FINANCE", "NEARBY", "DEALS", "FOR YOU"
];

function handleInteractable(event) {
    const el = getInteractiveElement(event);
    if (!el) return;

    let name = getElementName(el, event);
    if (!name) return;

    triggerEffects(name);
    logInteraction(name);
    if (el.tagName === 'A' && el.href) {
        event.preventDefault();
        setTimeout(() => {
            window.location.href = el.href;
        }, 6000); // wait for bar + audio
    }
}

function getInteractiveElement(event) {
    return event.target.closest('button, a, input, [role="button"], [contenteditable="true"]');
}

function getElementName(el, event) {
    let name = el.innerText?.trim()?.toLowerCase() || el.title?.toLowerCase() || el.value?.toLowerCase();

    if (event.type === 'keydown') {
        if (event.key !== 'Enter') return null;
        if (!name) name = "sent message";
    }
    name = convertToPastTense(name);
    if (googleTabs.includes(name.toUpperCase().trim())) {
        name = `switched to ${name}`;
    }
    return name.toUpperCase();
}

function convertToPastTense(name) {
    Object.keys(pastTenseMap).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        name = name.replace(regex, pastTenseMap[word]);
    });
    return name;
}

function triggerEffects(name) {
    bar(name);
    playDeathSound();
}

function logInteraction(name) {
    console.log(`${name} interacted`);
}

document.body.addEventListener('click', handleInteractable);
document.body.addEventListener('keydown', handleInteractable);

// Preload audio once
const deathAudio = new Audio(browser.runtime.getURL('Sounds/elden-ring-death.mp3'));
deathAudio.preload = 'auto';

// Optional: prevent spamming
let lastPlayed = 0;
const COOLDOWN_MS = 500; // half a second

// Play the audio
function playDeathSound() {
    deathAudio.currentTime = 0;
    deathAudio.play().catch(err => console.log(err));
}

//the bar is fine
function bar(inputted_text) {
    const bar = document.createElement('div');
    bar.style.position = 'fixed';
    bar.style.top = '50%';
    bar.style.left = '0';
    bar.style.width = '100%';
    bar.style.height = '10vh';
    bar.style.transform = 'translateY(-50%)';
    bar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0) 100%)';
    bar.style.display = 'flex';
    bar.style.alignItems = 'center';
    bar.style.justifyContent = 'center';
    bar.style.fontSize = '5vh';
    bar.style.fontFamily = 'Agmena, serif';
    bar.style.color = '#ffc937'; // gold text
    bar.style.zIndex = '9999';
    bar.style.opacity = '0';
    bar.style.transition = 'opacity 0.5s';
 
    const shadow = document.createElement('div');
    shadow.style.lineHeight = '1';
    shadow.textContent = inputted_text;
    shadow.style.position = 'absolute';
    shadow.style.top = '50%';
    shadow.style.left = '50%';
    shadow.style.transform = 'translate(-50%, -50%) scaleX(1.09)'; // horizontally stretched
    shadow.style.color = 'rgba(255, 201, 55, 0.3)'; // slightly transparent
    shadow.style.fontSize = '5vh';
    shadow.style.fontFamily = 'Agmena, serif';
    shadow.style.zIndex = '-1';

    bar.append(shadow, document.createTextNode(inputted_text));
    document.body.appendChild(bar);

    requestAnimationFrame(() => {
        bar.style.opacity = '1';
    });

    setTimeout(() => {
        bar.style.opacity = '0';
        bar.addEventListener('transitionend', () => bar.remove());
    }, 1500);
}


