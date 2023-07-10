// Create audio context
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Function to initialize audio context
function initializeAudioContext() {
  // Create an empty buffer source node
  var buffer = audioContext.createBufferSource();

  // Connect the buffer source to the destination (speakers)
  buffer.connect(audioContext.destination);

  // Start the buffer source
  buffer.start();
}

// Check if audio is enabled
function isAudioEnabled() {
  return audioContext.state === 'running';
}

// Function to ask user to enable audio
function askEnableAudio() {
  var popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = 'Enable audio in Safari settings to play the game.';

  var enableButton = document.createElement('button');
  enableButton.textContent = 'Enable Audio';
  enableButton.addEventListener('click', function () {
    // Initialize audio context
    initializeAudioContext();

    // Check if audio is enabled after initialization
    if (isAudioEnabled()) {
      overlay.remove();
    }
  });

  popup.appendChild(enableButton);

  var overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.appendChild(popup);

  document.body.appendChild(overlay);
}

// Check if audio is enabled on page load
if (!isAudioEnabled()) {
  askEnableAudio();
}

// Drag and drop
var interactDraggable;
var interactDropzone;

// Counter variables
var score = 0;
var totalGarbages = 6;
var garbagesInCorrectBins = 0;

// Create audio elements
var scoreSound = new Audio('images/point.mp3');
var gameOverSound = new Audio('images/game_over.mp3');
var wonSound = new Audio('images/game_won.mp3');

function initializeGame() {
  interactDraggable = interact('.garbage').draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    autoScroll: true,
    onmove: dragMoveListener
  });

  interact('.garbage').on('dragend', function (event) {
    var garbage = event.target;
    garbage.style.transform = 'none';
    garbage.setAttribute('data-x', '0');
    garbage.setAttribute('data-y', '0');
  });

  // Drop targets
  var recycleBin = document.getElementById('recycle-bin');
  var generalTrashBin = document.getElementById('general-trash-bin');
  var foodWasteBin = document.getElementById('food-waste-bin');

  interactDropzone = interact('.trash-bin').dropzone({
    accept: '.garbage',
    ondrop: function (event) {
      var garbage = event.relatedTarget;
      var bin = event.target;

      if (checkBin(garbage, bin.id)) {
        garbage.style.display = 'none';
        score += 10;
        garbagesInCorrectBins++;

        // Play score sound effect
        scoreSound.currentTime = 0; // Reset sound to start
        scoreSound.play();

        if (garbagesInCorrectBins === totalGarbages) {
          endGame();
        }
      } else {
        endGame();
      }

      document.getElementById('score').textContent = 'Score: ' + score;
    }
  });
}

// Drag move listener
function dragMoveListener(event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// Check if garbage is in the correct bin
function checkBin(garbage, binId) {
    if (garbage.id === 'carrots' && binId === 'food-waste-bin') {
      return true;
    } else if (
      (garbage.id === 'can' ||
        garbage.id === 'plastic-bottle' ||
        garbage.id === 'newspaper' ||
        garbage.id === 'plastic-bag') &&
      binId === 'recycle-bin'
    ) {
      return true;
    } else if (
      // Add conditions for Danger bin
      (garbage.id === 'dangerous-item') && 
      binId === 'danger-bin'
    ) {
      return true;
    } else {
      return false;
    }
  }

// Game over
function endGame() {
  interactDraggable.unset();
  interactDropzone.unset();

  // Reset garbage positions
  var garbages = document.querySelectorAll('.garbage');
  for (var i = 0; i < garbages.length; i++) {
    garbages[i].style.transform = 'none';
    garbages[i].setAttribute('data-x', '0');
    garbages[i].setAttribute('data-y', '0');
    garbages[i].style.display = 'block';
  }

  var finalScore = score;
  score = 0;
  garbagesInCorrectBins = 0;

  document.getElementById('score').textContent = 'Score: ' + finalScore;

  if (finalScore === totalGarbages * 10) {
    var popup = document.createElement('div');
    popup.className = 'popup congratulations';
    popup.innerHTML =
      'Congratulations! You cleared the game with a perfect score of ' +
      finalScore;

    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.appendChild(popup);

    document.body.appendChild(overlay);
    wonSound.play();
    score = 0;

    // Close popup on click
    overlay.addEventListener('click', function () {
      overlay.remove();
      initializeGame(); // Start a new game
    });
  } else {
    var popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = 'Game Over! Your score is ' + finalScore;
    score = 0;
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.appendChild(popup);

    document.body.appendChild(overlay);

    // Play game over sound effect
    gameOverSound.play();

    // Close popup on click
    overlay.addEventListener('click', function () {
      overlay.remove();
      initializeGame(); // Start a new game
    });
  }
}

initializeGame(); // Start the initial game
