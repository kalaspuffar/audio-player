function createAudioPlayer() {
  var audioPlayer;
  var trackList;
  var trackListLen;
  var currentTrack = 0;
  var informationDiv;
  var progressbar;
  var progressbarWidth;
  var progressmeter;

  return {
    init: init,
  };

  function play() {
    audioPlayer.play();
  }

  function pause() {
    audioPlayer.pause();
  }

  function seeking(e) {
    var percent = e.offsetX / progressbarWidth;
    audioPlayer.currentTime = percent * audioPlayer.duration;
  }

  function displayTime(seconds) {
    var minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds - minutes * 60);
    return minutes+":"+seconds;
  }

  function updateTime() {
    informationDiv.innerHTML =
      displayTime(audioPlayer.currentTime) + ' / ' +
      displayTime(audioPlayer.duration);
    var percent = audioPlayer.currentTime / audioPlayer.duration;
    progressmeter.style.width = (percent * progressbarWidth) + 'px';
  }

  function playCurrentTrack() {
    audioPlayer.pause();
    audioPlayer.src = trackList[currentTrack].src;
    audioPlayer.load();
    audioPlayer.play();
    updateTime();
  }

  function playPrevious() {
    if(currentTrack > 0) {
      currentTrack--;
    } else {
      currentTrack = 0;
    }
    playCurrentTrack();
  }

  function playNext() {
    if(currentTrack < trackListLen - 1) {
      currentTrack++;
    } else {
      currentTrack = trackListLen - 1;
    }
    playCurrentTrack();
  }

  function init(playerElement) {
    trackList = JSON.parse(playerElement.textContent);
    trackListLen = trackList.length;
    audioPlayer = new Audio();
    audioPlayer.addEventListener('ended', function() {
      playNext();
    });
    audioPlayer.addEventListener('timeupdate', function() {
      updateTime();
    });
    audioPlayer.addEventListener('loadedmetadata', function() {
      updateTime();
    });
    audioPlayer.src = trackList[currentTrack].src;

    var playButton = document.createElement('button');
    playButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    playButton.ariaLabel = 'Play';
    playButton.onclick = play;
    var pauseButton = document.createElement('button');
    pauseButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
    pauseButton.ariaLabel = 'Pause';
    pauseButton.onclick = pause;

    var nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fa fa-forward" aria-hidden="true"></i>';
    nextButton.ariaLabel = 'Next';
    nextButton.onclick = playNext;
    var previousButton = document.createElement('button');
    previousButton.innerHTML = '<i class="fa fa-backward" aria-hidden="true"></i>';
    previousButton.ariaLabel = 'Previous';
    previousButton.onclick = playPrevious;

    informationDiv = document.createElement('div');
    informationDiv.className = 'audio-player-info';

    progressbar = document.createElement('div');
    progressbar.className = 'audio-player-progressbar';
    progressbar.addEventListener('click', seeking);
    progressmeter = document.createElement('div');
    progressmeter.className = 'audio-player-progressmeter';
    progressbar.append(progressmeter);

    playerElement.innerHTML = '';
    playerElement.append(previousButton);
    playerElement.append(playButton);
    playerElement.append(pauseButton);
    playerElement.append(informationDiv);
    playerElement.append(progressbar);
    playerElement.append(nextButton);

    progressbarWidth = progressbar.offsetWidth;
  }
}

window.onload = function() {
  var audioPlayers = document.querySelectorAll('.audio-player');
  for(var i=0; i<audioPlayers.length; i++) {
    var player = createAudioPlayer();
    player.init(audioPlayers[i]);
  }
}
