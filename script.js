// Drag and drop
interact('.garbage').draggable({
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
  
  // Drop targets
  var recycleBin = document.getElementById('recycle-bin');
  var generalTrashBin = document.getElementById('general-trash-bin');
  var foodWasteBin = document.getElementById('food-waste-bin');
  
  // Counter variables
  var score = 0;
  var totalGarbages = 5;
  var garbagesInCorrectBins = 0;
  
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
  
  // Drop event listeners
  interact('.trash-bin').dropzone({
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
  
  // Game over
  function endGame() {
    interact('.garbage').unset();
    interact('.trash-bin').unset();
    alert('Game Over! Your score is ' + score);
  }
  