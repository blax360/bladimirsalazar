const SOUNDS = {
    select: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8c8a73467.mp3?filename=click-button-140881.mp3',
    start: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c6a442.mp3?filename=interface-124464.mp3',
    loading: 'https://cdn.pixabay.com/download/audio/2024/01/08/audio_206293d2c0.mp3?filename=robot-brokenloading-sound-effect-206293.mp3'
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
        audio.volume = 0.3;
        audio.play().catch(console.error);
    }
}