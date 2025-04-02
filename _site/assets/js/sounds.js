const SOUNDS = {
    select: '/assets/sounds/select.mp3',
    hover: 'https://cdn.pixabay.com/download/audio/2022/03/17/audio_9a11737c67.mp3?filename=ping-82822.mp3',
    power: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0f8bfa3b6.mp3?filename=ping-126347.mp3'
};

const audioElements = {};

// Preload sounds
Object.entries(SOUNDS).forEach(([key, url]) => {
    const audio = new Audio();
    audio.src = url;
    audio.preload = 'auto';
    audioElements[key] = audio;
});

function playSound(soundName) {
    const audio = audioElements[soundName];
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.2;
        audio.play().catch(console.error);
    }
}

// Add event listeners for arcade-style sound effects
document.addEventListener('DOMContentLoaded', () => {
    // Button hover sounds
    document.querySelectorAll('.retro-button, .quest-link, .nav-container a').forEach(element => {
        element.addEventListener('mouseenter', () => playSound('hover'));
        element.addEventListener('click', () => playSound('select'));
    });
    
    // Special elements with click sound
    document.querySelectorAll('.theme-toggle, .skill').forEach(element => {
        element.addEventListener('click', () => playSound('power'));
    });
});