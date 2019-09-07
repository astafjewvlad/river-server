class Song {
  constructor(src, name, cover, links, html) {
    this.src = src;
    this.name = name;
    this.cover = cover;
    this.links = links;
    this.html = html;
  }
}

function initSong(containerElement) {
  const src = containerElement.getAttribute('data-source');
  const cover = containerElement.querySelector('.song-cover').src;
  const name = containerElement.querySelector('.song-name').textContent;
  const links = [];
  containerElement.querySelectorAll('.song-link').forEach((l) => {
    links.push({
      icon: l.querySelector('.social-icon').src,
      href: l.href
    });
  });
  return new Song(src, name, cover, links, containerElement);
}

function initPlayer(containerId) {
  const container = document.querySelector(containerId);
  return {
    audio: container.querySelector('#player-audio'), 
    cover: container.querySelector('.player-track-cover'),
    name: container.querySelector('.player-track-name'),
    links: container.querySelector('.player-track-links'),
    currentSong: null,
    changeSong (newSong) {
      if (!this.audio.paused) {
        this.audio.pause();
      }
      this.audio.src = newSong.src;  
      this.cover.src = newSong.cover; 
      this.name.innerHTML = newSong.name;
      while (this.links.firstChild) {
        this.links.firstChild.remove();
      }
      newSong.links.forEach((link) => {
        const linkElement = document.createElement('a');
        linkElement.href = link.href;
        linkElement.classList.add('social-link');
        const iconElement = document.createElement('img');
        iconElement.src = link.icon;
        iconElement.classList.add('social-icon');
        linkElement.appendChild(iconElement);
        this.links.appendChild(linkElement);
      });
      this.currentSong = newSong;
      this.audio.play();
    }
  }
}

function main() {
  const player = initPlayer('.player');
  const songs = document.querySelectorAll('.song');
  songs.forEach((s) => {
    const song = initSong(s);
    const songBackgroundDiv = s.querySelector('.song-active-background');
    songBackgroundDiv.style.cssText = `background-image: linear-gradient(rgba(0,0,0,.5) 0%, rgba(0,0,0,.5) 100%), url(${song.cover});`;
    const playButton = s.querySelector('.song-play-button');
    playButton.addEventListener('click', () => {
      if (player.currentSong) {
        player.currentSong.html.classList.remove('song-active');
      }
      player.changeSong(song);
      s.classList.add('song-active');
      document.querySelector('.player-container').classList.add('player-active');
    });
  });
}

window.addEventListener('load', main);
