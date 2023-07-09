// Drag and drop
var interactDraggable;
var interactDropzone;

// Counter variables
var score = 0;
var totalGarbages = 5;
var garbagesInCorrectBins = 0;

// Start time
var startTime;

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
  
    var currentTime = new Date().getTime();
    var elapsedTime = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
  
    var popup = document.createElement('div');
    popup.className = 'popup';
  
    if (finalScore === totalGarbages * 10) {
      popup.innerHTML =
        'Congratulations! You cleared the game with a perfect score of ' +
        finalScore +
        ' in ' +
        elapsedTime.toFixed(1) +
        ' seconds.';
    } else {
      popup.innerHTML =
        'Game Over! Your score is ' +
        finalScore +
        ' in ' +
        elapsedTime.toFixed(1) +
        ' seconds.';
    }
  
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.appendChild(popup);
  
    document.body.appendChild(overlay);
  
    // Close popup on click
    overlay.addEventListener('click', function () {
      overlay.remove();
      initializeGame(); // Start a new game
    });
  }
  
  // ...
  
  // Start the stopwatch
  function startStopwatch() {
    startTime = new Date().getTime();
  }
  
  initializeGame(); // Start the initial game
  startStopwatch(); // Start the stopwatch
  