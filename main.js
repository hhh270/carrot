'use strict';

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');
const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const backgroundMusic = new Audio('./sound/bg.mp3');
const alert = new Audio('./sound/alert.wav');
const gameWin = new Audio('./sound/Game_win.mp3');

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick);

gameBtn.addEventListener('click', () => {
    if (started) {
        stopGame();
    } else {
        startGame();
    }
});

popUpRefresh.addEventListener('click', () => {
    startGame();
    score = 0;
    hidePopUp();
});

function startGame() {
    started = true;
    backgroundMusic.play();
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
}
function stopGame() {
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY?');
    backgroundMusic.pause();
}

function finishGame(win) {
    started = false;
    hideGameButton();
    showPopUpWithText(win ? 'YOU WON' : 'YOU LOST');
    if (win ? gameWin.play() : alert.play());
    backgroundMusic.pause();
    stopGameTimer();
}

function showStopButton() {
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
}
function hideGameButton() {
    gameBtn.style.visibility = 'hidden';
}
function showPopUpWithText(text) {
    popUpText.innerText = text;
    popUp.classList.remove('pop-up--hide');
}

function showTimerAndScore() {
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function hidePopUp() {
    popUp.classList.add('pop-up--hide');
}

function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if (remainingTimeSec <= 0) {
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            console.log(remainingTimeSec);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}

function initGame() {
    field.innerHTML = '';
    gameScore.innerText = CARROT_COUNT;
    //리셋용도.

    // 벌레와 당근을 생성한 뒤 field에 추가해줌.
    // console.log(fieldRect);
    //x: 0, y: 234
    addItem('carrot', CARROT_COUNT, 'img/carrot.png');
    addItem('bug', BUG_COUNT, 'img/bug.png');
}
function onFieldClick(event) {
    const target = event.target;

    if (!started) {
        return;
    }
    if (target.matches('.carrot')) {
        //당근!!
        carrotSound.play();
        target.remove();
        score++;
        updateScoreBoard();
        if (score === CARROT_COUNT) {
            finishGame(true);
            score = 0;
        }
    } else if (target.matches('.bug')) {
        bugSound.play();
        stopGameTimer();
        finishGame(false);
        score = 0;
    }
}

function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;
    for (let i = 0; i < count; i++) {
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
    //min은 포함되는 값, max는 미포함.
}
