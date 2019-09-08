class Song {
  constructor(src, name, cover, links) {
    this.src = src;
    this.name = name;
    this.cover = cover;
    this.links = links;
  }
}

class SongHtmlView {
  constructor(rootElement) {
    this.root = rootElement;
    const src = rootElement.getAttribute('data-source');
    const name = rootElement.getAttribute('data-name');
    const cover = rootElement.getAttribute('data-cover');
    const linksList = Array.prototype.slice.call(rootElement.querySelectorAll('.song-link'));
    const links = linksList.reduce((linksAcc, l) => {
      linksAcc.push({
        icon: l.querySelector('.social-icon').src,
        href: l.href,
      });
      return linksAcc;
    }, []);
    this.background = rootElement.querySelector('.song-active-background');
    this.background.style.cssText = `background-image: linear-gradient(rgba(0,0,0,.5) 0%, rgba(0,0,0,.5) 100%), url(${cover});`;
    this.playButton = rootElement.querySelector('.song-play-button');
    this.pauseButton = rootElement.querySelector('.song-pause-button');
    this.song = new Song(src, name, cover, links);
    this.isActive = false;
  }

  activate() {
    if (!this.isActive) {
      this.root.classList.add('song-active');
      this.playState();
      this.isActive = true;
    }
  }

  disable() {
    if (this.isActive) {
      this.root.classList.remove('song-active');
      this.pauseState();
      this.isActive = false;
    }
  }

  playState() {
    this.playButton.classList.add('song-button-hidden');
    this.pauseButton.classList.remove('song-button-hidden');
  }

  pauseState() {
    this.pauseButton.classList.add('song-button-hidden');
    this.playButton.classList.remove('song-button-hidden');
  }
}

class AudioPlayer {
  constructor(currentSong = null) {
   this.currentSong = currentSong;
  }

  changeSong(song) {
    this.currentSong = song;
  }
}

class AudioPlayerHtmlView {
  constructor(rootId) {
    const rootElement = document.querySelector(rootId);
    this.root = rootElement; 
    this.audio = rootElement.querySelector('#player-audio'); 
    this.name = rootElement.querySelector('#player-track-name');
    this.cover = rootElement.querySelector('#player-track-cover');
    this.links = rootElement.querySelector('#player-track-links');
    this.player = new AudioPlayer();
    this.isShown = this.root.classList.contains('player-active');
    this.currentSong = null;
  }

  changeSong(song) {
    if (this.currentSong) {
      this.currentSong.disable();
    }
    this.player.changeSong(song.song);
    this.currentSong = song;
    this.currentSong.activate();
    this.updateView(song.song);
  }

  updateView(song) {
    this.name.innerHTML = song.name;
    this.cover.src = song.cover;
    this.audio.src = song.src;
    while (this.links.firstChild) {
      this.links.firstChild.remove();
    }
    song.links.forEach((link) => {
      const linkElement = document.createElement('a');
      linkElement.href = link.href;
      linkElement.classList.add('social-link');
      const iconElement = document.createElement('img');
      iconElement.src = link.icon;
      iconElement.classList.add('social-icon');
      linkElement.appendChild(iconElement);
      this.links.appendChild(linkElement);
    });
    this.show();
  }

  show() {
    if (!this.isShown) {
      this.root.classList.add('player-active');
      this.isShown = true;
    }
  }

  hide() {
    if (this.isShown) {
      this.root.classList.remove('player-active');
      this.isShown = false;
    }
  }

  play(song) {
    if (!this.currentSong || this.currentSong !== song) {
      if (!this.audio.paused) {
        this.audio.pause();
      }
      this.changeSong(song);
    }
    this.audio.play();
  }
  
  pause() {
    this.audio.pause();
  }
}

function main() {
  const player = new AudioPlayerHtmlView('#player-container');
  const songs = document.querySelectorAll('.song');
  songs.forEach((s) => {
    const song = new SongHtmlView(s);
    song.playButton.addEventListener('click', () => {
      song.playState();
      player.play(song);
    });
    song.pauseButton.addEventListener('click', () => {
      song.pauseState();
      player.pause();
    });
  });
}

window.addEventListener('load', main);
