const recycleBin = document.getElementById('recycleBin');
const foodWasteBin = document.getElementById('foodWasteBin');
const generalTrashBin = document.getElementById('generalTrashBin');
const dangerTrashCan = document.getElementById('dangerTrashCan');
const infectiousTrashCan = document.getElementById('infectiousTrashCan');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const popupElement = document.getElementById('popup');
const popupTitleElement = document.getElementById('popupTitle');
const popupTextElement = document.getElementById('popupText');
const reasonElement = document.getElementById('reason');
const playAgainBtn = document.getElementById('playAgainBtn');
const pointSound = new Audio('images/point.mp3');
const gameOverSound = new Audio('images/game_over.mp3');
const gameWonSound = new Audio('images/game_won.mp3');

let score = 0;
let startTime;
let timerInterval;

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const garbageId = event.dataTransfer.getData('text/plain');
    const garbageElement = document.getElementById(garbageId);
    const binId = event.target.id;

    if (binId === 'recycleBin' && isRecyclable(garbageId)) {
        increaseScore();
        playSound(pointSound);
        garbageElement.classList.add('hide');
    } else if (binId === 'foodWasteBin' && isFoodWaste(garbageId)) {
        increaseScore();
        playSound(pointSound);
        garbageElement.classList.add('hide');
    } else if (binId === 'generalTrashBin' && isGeneralTrash(garbageId)) {
        increaseScore();
        playSound(pointSound);
        garbageElement.classList.add('hide');
    } else if (binId === 'dangerTrashCan' && isDangerTrash(garbageId)) {
        increaseScore();
        playSound(pointSound);
        garbageElement.classList.add('hide');
    } else if (binId === 'infectiousTrashCan' && isInfectiousTrash(garbageId)) {
        increaseScore();
        playSound(pointSound);
        garbageElement.classList.add('hide');
    } else {
        showReason(garbageId, binId);
        playSound(gameOverSound);
        gameOver();
    }

    if (score === 7) {
        playSound(gameWonSound);
        gameWon();
    }
}

function isRecyclable(garbageId) {
    return garbageId !== 'carrots' && garbageId !== 'plasticBag' && garbageId !== 'battery';
}

function isFoodWaste(garbageId) {
    return garbageId === 'carrots';
}

function isGeneralTrash(garbageId) {
    return garbageId === 'plasticBag';
}

function isDangerTrash(garbageId) {
    return garbageId === 'battery';
}

function isInfectiousTrash(garbageId) {
    return garbageId === 'usedTampon';
}

function increaseScore() {
    score++;
    scoreElement.textContent = score;
}

function playSound(sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = Date.now();
    const timeElapsed = currentTime - startTime;
    const minutes = Math.floor(timeElapsed / 60000);
    const seconds = Math.floor((timeElapsed % 60000) / 1000);
    const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
    timerElement.textContent = formattedTime;
}

function padZero(number) {
    return number.toString().padStart(2, '0');
}

function stopTimer() {
    clearInterval(timerInterval);
}

function gameOver() {
    stopTimer();
    const finalTime = timerElement.textContent;
    popupTitleElement.textContent = 'Game Over!';
    popupTextElement.textContent = `Final Score: ${score}\nTime Taken: ${finalTime}`;
    popupElement.classList.remove('hide');
}

function gameWon() {
    stopTimer();
    const finalTime = timerElement.textContent;
    popupTitleElement.textContent = 'You Won!';
    popupTextElement.textContent = `Final Score: ${score}\nTime Taken: ${finalTime}`;
    popupElement.classList.remove('hide');
}

function showReason(garbageId, binId) {
    let reason = '';
    if (binId === 'recycleBin' && !isRecyclable(garbageId)) {
        reason = 'Only recyclable items should go in the recycle bin.';
    } else if (binId === 'foodWasteBin' && !isFoodWaste(garbageId)) {
        reason = 'Only food waste should go in the food waste bin.';
    } else if (binId === 'generalTrashBin' && !isGeneralTrash(garbageId)) {
        reason = 'Only general trash should go in the general trash bin.';
    } else if (binId === 'dangerTrashCan' && !isDangerTrash(garbageId)) {
        reason = 'Only dangerous items should go in the danger trash can.';
    } else if (binId === 'infectiousTrashCan' && !isInfectiousTrash(garbageId)) {
        reason = 'Only infectious waste should go in the infectious trash can.';
    }

    reasonElement.textContent = reason;
    reasonElement.classList.remove('hide');
}

playAgainBtn.addEventListener('click', () => {
    popupElement.classList.add('hide');
    location.reload(); // Reload the page to start a new game
});

const garbageElements = document.querySelectorAll('.garbage');
garbageElements.forEach(garbage => {
    garbage.addEventListener('dragstart', handleDragStart);
});

const bins = document.querySelectorAll('.bin');
bins.forEach(bin => {
    bin.addEventListener('dragover', handleDragOver);
    bin.addEventListener('drop', handleDrop);
});

startTimer();
