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
      this.fullscreenState();
    });
    this.controlElements.closeButton.addEventListener('click', () => {
      this.thumbnailState();
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

  fullscreenState() {
    this.container.classList.add('song-popup');
    document.body.classList.add('body-stopped-y');
  }

  thumbnailState() {
    this.container.classList.remove('song-popup');
    document.body.classList.remove('body-stopped-y');
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
        backgroundDiv: container.querySelector('.song-popup-background'),
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

  setPlaylist(playlist) {
    this.playlist = playlist;
    const changePlaylistEvent = new CustomEvent('changePlaylist', {
      detail: this.playlist,
    });
    this.audio.dispatchEvent(changePlaylistEvent);
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
      if (this.playlistHandler) {
        this.audio.removeEventListener('ended', this.playlistHandler);
      }
      this.changeSong(song);
      this.playlistHandler = () => {
        if (this.playlist) {
          const currentPosition = this.playlist.indexOf(this.currentSong);
          const isFound = (index) => index > -1;
          if (isFound(currentPosition)) {
            const isNotLast = (index, length) => index < length - 1;
            const next = (isNotLast(currentPosition, this.playlist.length)) 
              ? currentPosition + 1
              : 0;
            this.play(this.playlist[next]);
          }
        }
      };
    }
    this.audio.addEventListener('ended', this.playlistHandler);
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
          this.controlElements.cover.addEventListener('click', () => {
            const currentPopup = document.querySelector('.song-popup');
            if (currentPopup) {
              currentPopup.classList.remove('song-popup');
            }
            const activeSong = document.querySelector('.song-active');
            activeSong.classList.add('song-popup');
          });
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

class ItemPlaylistHtmlView {
  constructor(song, player) {
    this.song = song;
    this.player = player;
  }

  make() {
    this.container = document.createElement('div');
    this.container.classList.add('pl--item');
    this.container.appendChild(this.makeCover());
    this.container.appendChild(this.makeName());
    this.container.appendChild(this.makePlayButton());
    this.container.appendChild(this.makePauseButton());
    this.player.addEventListener('changeSong', (e) => {
      if (e.detail === this.song) {
        this.container.classList.add('pl-i--active');
        this.playerPlayHandler = () => {
          this.container.classList.add('pl-i--playing');
        };
        this.playerPauseHandler = () => {
          this.container.classList.remove('pl-i--playing');
        };
        this.player.addEventListener('play', this.playerPlayHandler);
        this.player.addEventListener('pause', this.playerPauseHandler);
        this.isActive = true;
      } else if (this.isActive) {
        this.player.removeEventListener('play', this.playerPlayHandler);
        this.player.removeEventListener('pause', this.playerPauseHandler);
        this.container.classList.remove('pl-i--active');
        this.container.classList.remove('pl-i--playing');
        this.isActive = false;
      }
    });

    return this.container;
  }

  makeCover() {
    const coverImg = document.createElement('img');
    coverImg.classList.add('pl-i--cover');
    coverImg.src = this.song.cover;
    return coverImg;
  }

  makeName() {
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('pl-i--name');
    nameDiv.innerHTML = this.song.name;
    return nameDiv;
  }

  makePlayButton() {
    const playButton = document.createElement('button');
    playButton.classList.add('pl-i--btn');
    playButton.classList.add('pl-i--play-btn');
    const playIcon = document.createElement('i');
    playIcon.classList.add('fas');
    playIcon.classList.add('fa-play'); 
    playButton.appendChild(playIcon);

    playButton.addEventListener('click', () => {
      this.player.play(this.song);
    });

    return playButton;
  }

  makePauseButton() {
    const pauseButton = document.createElement('button');
    pauseButton.classList.add('pl-i--btn');
    pauseButton.classList.add('pl-i--pause-btn');
    const pauseIcon = document.createElement('i');
    pauseIcon.classList.add('fas');
    pauseIcon.classList.add('fa-pause');
    pauseButton.appendChild(pauseIcon);

    pauseButton.addEventListener('click', () => {
      this.player.pause();
    });

    return pauseButton;
  }

  static makeItem(song, player) {
    const item = new ItemPlaylistHtmlView(song, player);
    return item.make();
  }
}

class PlaylistHtmlView {
  constructor(container) {
    this.container = container;
    this.controlElements = {};
    this.controlElements.list = this.container.querySelector('#pl--list');
    this.controlElements.toggleBtn = document.querySelector('#pl--toggle-btn');
    this.isShown = false;
    this.controlElements.toggleBtn.addEventListener('click', () => {
      this.container.classList.toggle('pl--showed');
      const btnIcon = this.controlElements.toggleBtn.firstChild;
      btnIcon.classList.toggle('pl-tb--opened');
    });
  }

  setPlayer(player) {
    this.player = player;
  }

  update(playlist) {
    this.playlist = playlist;
    this.clean();
    playlist.forEach((song) => {
      const item = ItemPlaylistHtmlView.makeItem(song, this.player);
      this.controlElements.list.appendChild(item);
    });
  }

  clean() {
    while(this.controlElements.list.firstChild) {
      this.controlElements.list.firstChild.remove();
    }
  }
}


function main() {
  const playerContainer = document.querySelector('#player-container');
  const playerView = AudioPlayerHtmlViewParser.parse(playerContainer);
  const player = new AudioPlayer(playerView.controlElements.audio);
  playerView.setPlayer(player);
  const songs = document.querySelectorAll('.song');
  const playlist = [];
  songs.forEach((song) => {
    const songView = SongHtmlViewParser.parse(song);
    playlist.push(songView.song);
    songView.setPlayer(player);
  });
  player.setPlaylist(playlist.reverse());
  const playlistView = new PlaylistHtmlView(document.querySelector('#playlist'));
  playlistView.setPlayer(player);
  playlistView.update(playlist);
}

window.addEventListener('load', main);
