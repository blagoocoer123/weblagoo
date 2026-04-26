function getRandomPosition(rectangle, size) {
  const edge = Math.floor(Math.random() * 4);
  const max_x = rectangle.clientWidth - size;
  const max_y = rectangle.clientHeight - size;
  const offset = size * 2;

  switch (edge) {
    case 0:
      return {
        x: Math.floor(Math.random() * max_x),
        y: -offset,
      };
    case 1:
      return {
        x: rectangle.clientWidth + offset,
        y: Math.floor(Math.random() * max_y),
      };
    case 2:
      return {
        x: Math.floor(Math.random() * max_x),
        y: rectangle.clientHeight + offset,
      };
    case 3:
    default:
      return {
        x: -offset,
        y: Math.floor(Math.random() * max_y),
      };
  }
}

function createRandomCircle(rectangleElement) {
  const rectangle = rectangleElement;
  const circle = document.createElement("div");
  const size = Math.floor(Math.random() * 200) + 50;
  const position = getRandomPosition(rectangle, size);
  const duration = 5 + Math.random() * 5;
  const finalPosition = getRandomPosition(rectangle, size);

  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.left = `${position.x}px`;
  circle.style.top = `${position.y}px`;
  circle.style.backgroundColor = "rgba(100, 200, 255, 0.6)"; // Мягкий голубой
  circle.style.position = "absolute";
  circle.style.borderRadius = "50%";
  circle.style.filter = "blur(50px)";
  circle.style.zIndex = "-1";

  const animation = circle.animate(
    [
      { left: `${position.x}px`, top: `${position.y}px` },
      { left: `${finalPosition.x}px`, top: `${finalPosition.y}px` },
    ],
    {
      duration: duration * 1000,
      iterations: 1,
      easing: "linear",
    }
  );

  animation.onfinish = () => {
    circle.remove();
    createRandomCircle(rectangleElement);
  };

  rectangle.appendChild(circle);
}

function createRandomCircles(rectangleElement) {
  const numberOfCircles = Math.floor(Math.random() * 15) + 10; // Увеличил с 10+1 до 15+10

  for (let i = 0; i < numberOfCircles; i++) {
    createRandomCircle(rectangleElement);
  }
}

const rectangleElement = document.querySelector(".rectangle");
const spotifyPlayerElement = document.querySelector(".spotifyplayer");
const rectangle2Element = document.querySelector(".rectangle-right");

createRandomCircles(rectangleElement);
createRandomCircles(spotifyPlayerElement);
createRandomCircles(rectangle2Element);

document.addEventListener("DOMContentLoaded", function () {
  const videoElement = document.querySelector(".background-video video");
  const sourceElement = document.createElement("source");

  sourceElement.setAttribute("src", "media/73e345f9d334f51cad2509e6e97f85a6_720w.mp4");
  sourceElement.setAttribute("type", "video/mp4");

  videoElement.appendChild(sourceElement);
  videoElement.load();
});

const expandButton = document.getElementById('expand-button');
const arrow = expandButton.querySelector('.arrow');
const container = document.querySelector('.container');
const rectangleRight = document.querySelector('.rectangle-right');
const rectangleButton = document.querySelector('.rectangle-button');

let expanded = false;

expandButton.addEventListener('click', () => {
  expanded = !expanded;
  arrow.classList.toggle('rotate');
  container.classList.toggle('move-left');
  rectangleRight.classList.toggle('show');
  rectangleButton.classList.toggle('move-right');
});

// Enter screen
const enterScreen = document.getElementById('enter-screen');
enterScreen.addEventListener('click', () => {
  enterScreen.classList.add('fade-out');
  container.style.display = 'flex';
  
  setTimeout(() => {
    enterScreen.style.display = 'none';
    // Start music
    const audio = document.getElementById('audio-element');
    audio.play().catch(() => {});
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  }, 500);
});


// Audio Player
const audio = document.getElementById('audio-element');
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const progressBar = document.querySelector('.progress-bar');
const volumeBar = document.querySelector('.volume-bar');
const timeCurrent = document.querySelector('.time-current');
const timeTotal = document.querySelector('.time-total');
const volumePercent = document.querySelector('.volume-percent');
const trackTitle = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');

const tracks = [
  { src: 'song/wokeup.mp3', title: 'wokeup', artist: 'blagoo' },
  { src: 'song/stopplayin.mp3', title: 'stopplayin', artist: 'blagoo' }
];

let currentTrack = 0;
let targetVolume = 0.75;
let isSeeking = false;

// Set initial volume
audio.volume = targetVolume;

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  audio.load();
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Check if audio is playing and update icon
audio.addEventListener('play', () => {
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'block';
});

audio.addEventListener('pause', () => {
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
});

// Try to autoplay
document.addEventListener('DOMContentLoaded', () => {
  audio.play().catch(() => {
    // Autoplay blocked
  });
});

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

// Fade out/in function
function fadeVolume(fadeOut, callback) {
  if (isSeeking) return; // Don't fade during seek
  
  const step = targetVolume / 10;
  let currentStep = 0;
  
  const fadeInterval = setInterval(() => {
    if (isSeeking) {
      clearInterval(fadeInterval);
      return;
    }
    
    if (fadeOut) {
      audio.volume = Math.max(0, targetVolume - (step * currentStep));
      currentStep++;
      
      if (audio.volume <= 0.01) {
        clearInterval(fadeInterval);
        audio.volume = 0;
        if (callback) callback();
        // Fade back in
        fadeVolume(false);
      }
    } else {
      audio.volume = Math.min(targetVolume, step * currentStep);
      currentStep++;
      
      if (audio.volume >= targetVolume - 0.01) {
        clearInterval(fadeInterval);
        audio.volume = targetVolume;
      }
    }
  }, 50);
}

prevBtn.addEventListener('click', () => {
  fadeVolume(true, () => {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
  });
});

nextBtn.addEventListener('click', () => {
  fadeVolume(true, () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
  });
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    timeCurrent.textContent = formatTime(audio.currentTime);
    
    // Switch track 8 seconds before end to skip silence
    if (audio.duration - audio.currentTime <= 8 && !audio.switching) {
      audio.switching = true;
      fadeVolume(true, () => {
        currentTrack = (currentTrack + 1) % tracks.length;
        loadTrack(currentTrack);
        audio.play();
        audio.switching = false;
      });
    }
  }
});

audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  // This is now handled in timeupdate to avoid silence
  if (!audio.switching) {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
  }
});

progressBar.addEventListener('mousedown', () => {
  isSeeking = true;
});

progressBar.addEventListener('mouseup', () => {
  isSeeking = false;
});

progressBar.addEventListener('input', () => {
  const time = (progressBar.value / 100) * audio.duration;
  audio.currentTime = time;
});

volumeBar.addEventListener('input', () => {
  const volume = volumeBar.value / 100;
  audio.volume = volume;
  targetVolume = volume;
  volumePercent.textContent = `${volumeBar.value}%`;
});


// Discord copy to clipboard
const discordCopy = document.getElementById('discord-copy');
if (discordCopy) {
  discordCopy.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('b1agoo').then(() => {
      const originalTitle = discordCopy.getAttribute('title');
      discordCopy.setAttribute('title', 'Copied!');
      setTimeout(() => {
        discordCopy.setAttribute('title', originalTitle);
      }, 2000);
    });
  });
}


// Tabs functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const prevTabBtn = document.querySelector('.prev-tab');
const nextTabBtn = document.querySelector('.next-tab');

let currentTabIndex = 0;
const tabs = ['info', 'about'];

function switchTab(tabName) {
  const mediaInfo = document.getElementById('media-info');
  const mediaAbout = document.getElementById('media-about');
  
  // Fade out all media
  if (mediaInfo) mediaInfo.style.opacity = '0';
  if (mediaAbout) mediaAbout.style.opacity = '0';
  
  tabBtns.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  
  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
  const activeContent = document.getElementById(`${tabName}-tab`);
  
  if (activeBtn && activeContent) {
    activeBtn.classList.add('active');
    activeContent.classList.add('active');
  }
  
  currentTabIndex = tabs.indexOf(tabName);
  
  // Fade in corresponding media after tab switch
  setTimeout(() => {
    if (tabName === 'info' && mediaInfo) {
      mediaInfo.classList.add('active');
      mediaInfo.style.opacity = '1';
      if (mediaAbout) mediaAbout.classList.remove('active');
    } else if (tabName === 'about' && mediaAbout) {
      mediaAbout.classList.add('active');
      mediaAbout.style.opacity = '1';
      if (mediaInfo) mediaInfo.classList.remove('active');
    }
  }, 250);
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    switchTab(tabName);
  });
});

prevTabBtn.addEventListener('click', () => {
  currentTabIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
  switchTab(tabs[currentTabIndex]);
});

nextTabBtn.addEventListener('click', () => {
  currentTabIndex = (currentTabIndex + 1) % tabs.length;
  switchTab(tabs[currentTabIndex]);
});




// 3D card tilt effect - synchronized for all cards
setTimeout(() => {
  const rectangle = document.querySelector('.rectangle');
  const spotifyPlayer = document.querySelector('.spotifyplayer');
  const rectangleRight = document.querySelector('.rectangle-right');

  document.body.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    const rotateY = x * 15;
    const rotateX = -y * 15;
    
    const transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    if (rectangle) rectangle.style.transform = transform;
    if (spotifyPlayer) spotifyPlayer.style.transform = transform;
    if (rectangleRight && rectangleRight.classList.contains('show')) {
      rectangleRight.style.transform = transform;
    }
  });

  document.body.addEventListener('mouseleave', () => {
    const resetTransform = 'perspective(1000px) rotateX(0) rotateY(0)';
    if (rectangle) rectangle.style.transform = resetTransform;
    if (spotifyPlayer) spotifyPlayer.style.transform = resetTransform;
    if (rectangleRight) rectangleRight.style.transform = resetTransform;
  });
}, 1000);


// Protection from copying
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('copy', (e) => e.preventDefault());
document.addEventListener('cut', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => e.preventDefault());

// Disable F12, Ctrl+Shift+I, Ctrl+U
document.addEventListener('keydown', (e) => {
  if (e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.ctrlKey && e.key === 'U')) {
    e.preventDefault();
  }
});

// Console warning
console.log('%cСТОП!', 'color: red; font-size: 50px; font-weight: bold;');
console.log('%cЭто функция браузера для разработчиков. Если кто-то сказал тебе скопировать что-то сюда - это мошенничество!', 'font-size: 16px;');


// View counter - using Vercel serverless function
fetch('/api/views')
  .then(response => response.json())
  .then(data => {
    document.getElementById('view-count').textContent = data.views;
  })
  .catch(() => {
    document.getElementById('view-count').textContent = '???';
  });
