window.addEventListener('load', main);

function main() {
  const songs = document.querySelectorAll('.song');
  songs.forEach(s => {
    const player = s.querySelector('.song-player');
    const coverUrl = s.querySelector('.song-cover').src;
    const songBackgroundDiv = s.querySelector('.song-active-background');
    songBackgroundDiv.style.cssText = `background: linear-gradient(rgba(0,0,0,.5) 0%, rgba(0,0,0,.5) 100%), url(${coverUrl});`;
    player.addEventListener('play', () => {
      const prevSong = document.querySelector('.song-active');
      if (prevSong && s != prevSong) {
        const prevPlayer = prevSong.querySelector('.song-player');
        prevPlayer.pause();
        prevSong.classList.remove('song-active');
      }
      s.classList.add('song-active');
    });
  });
}
