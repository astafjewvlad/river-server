class Song {
  constructor(src, name, cover, links) {
    this.src = src;
    this.name = name;
    this.cover = cover;
    this.links = links;
  }
}

class SongHtmlView {
  constructor(src, name, cover, links, controlElements, container) {
    const backgroundDivCss = 'background-image:'
      + 'linear-gradient(rgba(0,0,0,.5) 0%, rgba(0,0,0,.5) 100%),'
      + `url(${cover});`;

    this.song = new Song(src, name, cover, links);
    this.controlElements = controlElements;
    this.controlElements.backgroundDiv.style.cssText = backgroundDivCss;
    this.container = container;
    this.isActive = false;
    this.controlElements.coverDiv.addEventListener('click', () => {
      this.container.classList.add('song-popup');
      document.body.classList.add('body-stopped-y');
    });
    this.controlElements.closeButton.addEventListener('click', () => {
      this.container.classList.remove('song-popup');
      document.body.classList.remove('body-stopped-y');
    });
  }

  setPlayer(player) {
    this.player = player;
    this.controlElements.playButton.addEventListener('click', () => {
      player.play(this.song);
    });
    this.controlElements.pauseButton.addEventListener('click', () => {
      player.pause();
    });
    this.player.addEventListener('changeSong', (e) => {
      if (e.detail === this.song && !this.isActive) {
        this.activeState();
      } else if (this.isActive) {
        this.disableState();
      }
    });
  }

  activeState() {
    this.container.classList.add('song-active');
    this.playHandler = () => this.playState();
    this.pauseHandler = () => this.pauseState();
    this.player.addEventListener('play', this.playHandler);
    this.player.addEventListener('pause', this.pauseHandler);
    this.isActive = true;
  }

  disableState() {
    this.container.classList.remove('song-active');
    this.player.removeEventListener('play', this.playHandler);
    this.player.removeEventListener('pause', this.pauseHandler);
    this.pauseState();
    this.isActive = false;
  }

  playState() {
    this.controlElements.playButton.classList.add('song-button-hidden');
    this.controlElements.pauseButton.classList.remove('song-button-hidden');
  }

  pauseState() {
    this.controlElements.pauseButton.classList.add('song-button-hidden');
    this.controlElements.playButton.classList.remove('song-button-hidden');
  }
}

class SongHtmlViewParser {
  static parse(container) {
    return new SongHtmlView(
      container.getAttribute('data-source'),
      container.getAttribute('data-name'),
      container.getAttribute('data-cover'),
      this.parseLinks(container),
      {
        playButton: container.querySelector('.song-play-button'),
        pauseButton: container.querySelector('.song-pause-button'),
        closeButton: container.querySelector('.song-close-button'),
        coverDiv: container.querySelector('.song-cover'),
        backgroundDiv: container.querySelector('.song-active-background'),
      },
      container,
    );
  }

  static parseLinks(container) {
    const linksList = Array.prototype
      .slice
      .call(container.querySelectorAll('.song-link'));
    return linksList.reduce((linksAcc, l) => {
      linksAcc.push({
        icon: l.querySelector('.social-icon').src,
        href: l.href,
      });
      return linksAcc;
    }, []);
  }
}

class AudioPlayer {
  constructor(player) {
    this.audio = player;
  }

  changeSong(song) {
    this.currentSong = song;
    const changeSongEvent = new CustomEvent('changeSong', {
      detail: this.currentSong,
    });
    this.audio.dispatchEvent(changeSongEvent);
  }

  play(song) {
    if (!this.currentSong || this.currentSong !== song) {
      if (!this.audio.paused) {
        this.audio.pause();
      }
      this.changeSong(song);
    }
    this.audio.play();
    const playEvent = new CustomEvent('play', { detail: this.currentSong });
    this.audio.dispatchEvent(playEvent);
  }

  pause() {
    this.audio.pause();
    const pauseEvent = new CustomEvent('pause');
    this.audio.dispatchEvent(pauseEvent);
  }

  addEventListener(event, callback) {
    this.audio.addEventListener(event, callback);
  }

  removeEventListener(event, callback) {
    this.audio.removeEventListener(event, callback);
  }
}

class AudioPlayerHtmlView {
  constructor(controlElements, container) {
    this.container = container;
    this.controlElements = controlElements;
    this.isShown = this.container.classList.contains('player-active');
  }

  setPlayer(player) {
    this.player = player;
    this.player.addEventListener('changeSong', (e) => {
      this.updateView(e.detail);
    });
  }

  updateView(song) {
    this.controlElements.audio.src = song.src;
    (() => {
      this.hide();
      setTimeout(() => {
        this.controlElements.name.innerHTML = song.name;
        this.controlElements.cover.src = song.cover;
        while (this.controlElements.links.firstChild) {
          this.controlElements.links.firstChild.remove();
        }
        song.links.forEach((link) => {
          const linkElement = document.createElement('a');
          linkElement.href = link.href;
          linkElement.classList.add('social-link');
          const iconElement = document.createElement('img');
          iconElement.src = link.icon;
          iconElement.classList.add('social-icon');
          linkElement.appendChild(iconElement);
          this.controlElements.links.appendChild(linkElement);
          this.show();
        });
      }, 300);
    })();
  }

  show() {
    if (!this.isShown) {
      this.container.classList.add('player-active');
      document.body.classList.add('body-player-showed');
      this.isShown = true;
    }
  }

  hide() {
    if (this.isShown) {
      this.container.classList.remove('player-active');
      document.body.classList.remove('body-player-showed');
      this.isShown = false;
    }
  }
}

class AudioPlayerHtmlViewParser {
  static parse(container) {
    return new AudioPlayerHtmlView(
      {
        audio: container.querySelector('#player-audio'),
        name: container.querySelector('#player-track-name'),
        cover: container.querySelector('#player-track-cover'),
        links: container.querySelector('#player-track-links'),
      },
      container
    );
  }
}

function main() {
  const playerContainer = document.querySelector('#player-container');
  const playerView = AudioPlayerHtmlViewParser.parse(playerContainer);
  const player = new AudioPlayer(playerView.controlElements.audio);
  playerView.setPlayer(player);
  const songs = document.querySelectorAll('.song');
  songs.forEach((song) => {
    const songView = SongHtmlViewParser.parse(song);
    songView.setPlayer(player);
  });
}

window.addEventListener('load', main);
