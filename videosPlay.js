class ScrollVideo {
  constructor(elem) {
    this.elem = elem;
    this.video = this.elem.querySelector('video');
    this.videoDuration = 0.001;
    this.canvas = this.elem.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.seeked = true;
  }
  setVideoDuration() {
    this.videoDuration = this.video.duration;
  }
  init() {
    this.video.oncanplay = this.loop();
    this.video.currentTime = 0.001;
    this.initObserver();
  }
  loop() {
    requestAnimationFrame(() => this.loop());

    if (this.seeked) {
      this.seeked = false;
      const { scrollHeight, clientHeight, scrollTop } = document.body;
      const maxScroll = scrollHeight - clientHeight;
      const scrollProgress = scrollTop / Math.max(maxScroll, 1);
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;

      if (!isNaN(this.video.duration)) {
        this.video.currentTime = this.video.duration * scrollProgress;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }
  }
  initObserver() {
    this.video.addEventListener('seeked', () => (this.seeked = true));
  }
}
const heroSection = document.getElementById('hero');
const component = document.getElementById('canvas-wrapper');
const player = document.getElementById('fake-player');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const firstVideo = document.getElementById('firstVideo');
const secondVideo = document.getElementById('secondVideo');
const logoContainer = document.getElementById('logo-container');
const secondVideoContainer = document.getElementById('second-video-container');
const text = document.getElementById('text-container');
const scrollableElement = document.body;

const newComponent = new ScrollVideo(component);
newComponent.init();

firstVideo.addEventListener('timeupdate', firstVideoPlay);
secondVideo.addEventListener('timeupdate', videoProgress);

function togglePlayPause() {
  playButton.classList.toggle('hidden');
  pauseButton.classList.toggle('hidden');
}

function playVideo() {
  secondVideo.play();
  togglePlayPause();
}

function pauseVideo() {
  secondVideo.pause();
  togglePlayPause();
}

function videoProgress() {
  const duration = secondVideo.duration;
  const time = secondVideo.currentTime;
  const progressValue = Math.floor((time / duration) * 100);

  player.style.background = `conic-gradient(
        #4d5bf9 ${progressValue * 3.6}deg,
        #cadcff ${progressValue * 3.6}deg
    )`;
}

function elementVisible(ele, value) {
  ele.style.visibility = value;
}

function firstVideoPlay() {
  const duration = firstVideo.duration;
  const time = firstVideo.currentTime;

  const currentTime = Number.parseFloat(duration - time).toFixed(0);

  if (currentTime > 8) {
    elementVisible(logoContainer, 'hidden');
    logoContainer.classList.remove('animate__fadeIn', 'logo');
    elementVisible(text, 'hidden');
    text.classList.remove('animate__fadeIn', 'text');
  } else if (currentTime <= 8 && currentTime >= 7) {
    elementVisible(logoContainer, 'visible');
    logoContainer.classList.add('animate__fadeIn', 'logo');
    elementVisible(text, 'hidden');
    text.classList.remove('animate__fadeIn', 'text');
  } else {
    elementVisible(text, 'visible');
    text.classList.add('animate__fadeIn', 'text');
  }
}
