const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const gameStatus = document.querySelector('#game-status');
const bestScoreLabel = document.querySelector('#best-score');
const bestScoreValue = document.querySelector('#best-score-value');
const scoreValue = document.querySelector('#score');
const overlay = document.querySelector('#game-overlay');
const startButton = document.querySelector('#start-btn');
const pauseButton = document.querySelector('#pause-btn');
const restartButton = document.querySelector('#restart-btn');
const board = document.querySelector('#snake-board');
const stage = document.querySelector('.game-stage');
const dpadButtons = document.querySelectorAll('.pad-button[data-direction]');
const bestScoreMemoryKey = '__suwanSnakeBestScore';

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

class SnakeGame {
  constructor(options) {
    this.board = options.board;
    this.stage = options.stage;
    this.statusEl = options.statusEl;
    this.bestScoreLabel = options.bestScoreLabel;
    this.bestScoreValue = options.bestScoreValue;
    this.scoreValue = options.scoreValue;
    this.overlay = options.overlay;
    this.startButton = options.startButton;
    this.pauseButton = options.pauseButton;
    this.restartButton = options.restartButton;
    this.gridSize = 20;
    this.tickMs = 140;
    this.maxTickMs = 80;
    this.initialized = false;
    this.running = false;
    this.paused = false;
    this.gameOver = false;
    this.loopId = null;
    this.pendingDirection = 'right';
    this.direction = 'right';
    this.score = 0;
    this.bestScore = this.readBestScore();
    this.snake = [];
    this.food = { x: 0, y: 0 };
    this.cells = [];
    this.swipeStart = null;

    this.boundKeydown = this.handleKeydown.bind(this);
    this.boundResize = this.render.bind(this);
    this.boundPointerDown = this.handlePointerDown.bind(this);
    this.boundPointerUp = this.handlePointerUp.bind(this);
    this.boundPointerCancel = this.handlePointerCancel.bind(this);
    this.boundControlClick = this.handleControlClick.bind(this);
  }

  readBestScore() {
    const storageValue = window.localStorage?.getItem('suwan-snake-best');
    if (storageValue !== undefined && storageValue !== null) {
      const parsed = Number(storageValue);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    const fallback = window[bestScoreMemoryKey];
    return Number.isFinite(fallback) ? fallback : 0;
  }

  init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.buildBoard();
    this.bestScoreValue.textContent = String(this.bestScore);
    this.bestScoreLabel.textContent = `Best ${this.bestScore}`;
    this.updateStatus('Ready');
    this.setOverlay('Press Start to begin the snake game.');
    this.bindEvents();
    this.reset();
  }

  buildBoard() {
    if (!this.board) {
      return;
    }

    const fragment = document.createDocumentFragment();
    this.cells = [];

    for (let i = 0; i < this.gridSize * this.gridSize; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'snake-cell';
      fragment.appendChild(cell);
      this.cells.push(cell);
    }

    this.board.replaceChildren(fragment);
  }

  bindEvents() {
    document.addEventListener('keydown', this.boundKeydown);
    window.addEventListener('resize', this.boundResize);
    window.addEventListener('orientationchange', this.boundResize);
    this.board.addEventListener('pointerdown', this.boundPointerDown);
    this.board.addEventListener('pointerup', this.boundPointerUp);
    this.board.addEventListener('pointercancel', this.boundPointerCancel);

    this.startButton?.addEventListener('click', () => this.start());
    this.pauseButton?.addEventListener('click', () => this.togglePause());
    this.restartButton?.addEventListener('click', () => this.restart());
    this.stage?.addEventListener('click', this.boundControlClick);

    dpadButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const direction = button.dataset.direction;
        if (direction) {
          this.applyDirection(direction);
          if (!this.running && !this.gameOver) {
            this.start();
          }
        }
      });
    });
  }

  updateStatus(text) {
    if (this.statusEl) {
      this.statusEl.textContent = text;
      this.statusEl.dataset.state = text.toLowerCase().replace(/\s+/g, '-');
    }
  }

  setOverlay(message, hidden = false) {
    if (!this.overlay) {
      return;
    }

    this.overlay.textContent = message;
    this.overlay.classList.toggle('is-hidden', hidden);
  }

  setScore(value) {
    this.score = value;
    if (this.scoreValue) {
      this.scoreValue.textContent = String(this.score);
      this.scoreValue.dataset.score = String(this.score);
    }
  }

  setBestScore(value) {
    this.bestScore = value;
    if (window.localStorage?.setItem) {
      window.localStorage.setItem('suwan-snake-best', String(this.bestScore));
    } else {
      window[bestScoreMemoryKey] = this.bestScore;
    }
    if (this.bestScoreValue) {
      this.bestScoreValue.textContent = String(this.bestScore);
      this.bestScoreValue.dataset.best = String(this.bestScore);
    }
    if (this.bestScoreLabel) {
      this.bestScoreLabel.textContent = `Best ${this.bestScore}`;
    }
  }

  reset() {
    const mid = Math.floor(this.gridSize / 2);
    this.snake = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ];
    this.direction = 'right';
    this.pendingDirection = 'right';
    this.setScore(0);
    this.gameOver = false;
    this.paused = false;
    this.tickMs = 140;
    this.spawnFood();
    this.updateStatus('Ready');
    if (this.board) {
      this.board.dataset.state = 'ready';
    }
    this.setOverlay('Press Start to begin the snake game.', false);
    this.updateButtons();
    this.render();
  }

  updateButtons() {
    if (this.startButton) {
      this.startButton.textContent = this.gameOver ? 'Restart' : 'Start';
    }

    if (this.pauseButton) {
      this.pauseButton.textContent = this.paused ? 'Resume' : 'Pause';
    }
  }

  clearLoop() {
    if (this.loopId !== null) {
      window.clearInterval(this.loopId);
      this.loopId = null;
    }
    this.running = false;
  }

  start() {
    if (this.running) {
      return;
    }

    if (this.gameOver) {
      this.reset();
    }

    this.clearLoop();
    this.running = true;
    this.paused = false;
    this.updateStatus('Running');
    if (this.board) {
      this.board.dataset.state = 'running';
    }
    this.setOverlay('Swipe or use the controls to play.', true);
    this.updateButtons();
    this.loopId = window.setInterval(() => this.step(), this.tickMs);
  }

  pause() {
    if (!this.running || this.gameOver) {
      return;
    }

    this.clearLoop();
    this.paused = true;
    this.updateStatus('Paused');
    if (this.board) {
      this.board.dataset.state = 'paused';
    }
    this.setOverlay('Paused. Press Pause or Start to continue.', false);
    this.updateButtons();
  }

  togglePause() {
    if (this.running) {
      this.pause();
      return;
    }

    if (this.gameOver) {
      this.restart();
      return;
    }

    this.start();
  }

  restart() {
    this.clearLoop();
    this.reset();
    this.start();
  }

  handleControlClick(event) {
    const button = event.target.closest('[data-direction]');
    if (!button) {
      return;
    }

    if (!this.running && !this.gameOver) {
      this.start();
    }

    this.applyDirection(button.dataset.direction);
  }

  handlePointerDown(event) {
    this.swipeStart = { x: event.clientX, y: event.clientY };
    this.board.setPointerCapture?.(event.pointerId);
  }

  handlePointerUp(event) {
    if (!this.swipeStart) {
      return;
    }

    const dx = event.clientX - this.swipeStart.x;
    const dy = event.clientY - this.swipeStart.y;
    const threshold = Math.max(20, this.board.getBoundingClientRect().width * 0.08);

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      this.applyDirection(dx > 0 ? 'right' : 'left');
    } else if (Math.abs(dy) > threshold) {
      this.applyDirection(dy > 0 ? 'down' : 'up');
    }

    if (!this.running && !this.gameOver) {
      this.start();
    }

    this.swipeStart = null;
  }

  handlePointerCancel() {
    this.swipeStart = null;
  }

  handleKeydown(event) {
    const key = event.key.toLowerCase();
    const directionMap = {
      arrowup: 'up',
      w: 'up',
      arrowdown: 'down',
      s: 'down',
      arrowleft: 'left',
      a: 'left',
      arrowright: 'right',
      d: 'right',
    };

    if (directionMap[key]) {
      event.preventDefault();
      this.applyDirection(directionMap[key]);
      if (!this.running && !this.gameOver) {
        this.start();
      }
      return;
    }

    if (key === ' ' || key === 'spacebar' || key === 'space') {
      event.preventDefault();
      this.togglePause();
      return;
    }

    if (key === 'enter') {
      event.preventDefault();
      if (this.gameOver) {
        this.restart();
      } else if (!this.running) {
        this.start();
      }
    }
  }

  applyDirection(nextDirection) {
    const normalized = nextDirection.toLowerCase();
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };

    if (!opposites[normalized]) {
      return;
    }

    const current = this.pendingDirection || this.direction;
    if (opposites[normalized] === current) {
      return;
    }

    this.pendingDirection = normalized;
  }

  step() {
    if (!this.running || this.gameOver) {
      return;
    }

    this.direction = this.pendingDirection;
    const head = this.snake[0];
    const deltas = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    const delta = deltas[this.direction];
    const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

    const hitsWall =
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= this.gridSize ||
      nextHead.y >= this.gridSize;
    const hitsSelf = this.snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

    if (hitsWall || hitsSelf) {
      this.endGame(hitsWall ? 'Wall collision. Game over.' : 'Self collision. Game over.');
      return;
    }

    this.snake.unshift(nextHead);
    const ateFood = nextHead.x === this.food.x && nextHead.y === this.food.y;

    if (ateFood) {
      this.setScore(this.score + 1);
      if (this.score > this.bestScore) {
        this.setBestScore(this.score);
      }
      this.spawnFood();
      this.tickMs = Math.max(this.maxTickMs, 140 - this.score * 3);
      this.restartLoop();
    } else {
      this.snake.pop();
    }

    this.render();
  }

  restartLoop() {
    if (this.loopId !== null) {
      window.clearInterval(this.loopId);
    }
    this.loopId = window.setInterval(() => this.step(), this.tickMs);
  }

  spawnFood() {
    const occupied = new Set(this.snake.map((segment) => `${segment.x},${segment.y}`));
    let food = null;

    for (let attempt = 0; attempt < this.gridSize * this.gridSize; attempt += 1) {
      const candidate = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize),
      };

      if (!occupied.has(`${candidate.x},${candidate.y}`)) {
        food = candidate;
        break;
      }
    }

    this.food = food || { x: 0, y: 0 };
  }

  endGame(message) {
    this.clearLoop();
    this.gameOver = true;
    this.updateStatus('Game Over');
    if (this.board) {
      this.board.dataset.state = 'game-over';
    }
    this.setOverlay(message || 'Game over. Press Restart to play again.', false);
    this.updateButtons();
    this.render();
  }

  render() {
    if (!this.cells.length) {
      return;
    }

    this.cells.forEach((cell) => {
      cell.className = 'snake-cell';
    });

    const foodIndex = this.food.y * this.gridSize + this.food.x;
    if (this.cells[foodIndex]) {
      this.cells[foodIndex].classList.add('is-food');
    }

    this.snake.forEach((segment, index) => {
      const cell = this.cells[segment.y * this.gridSize + segment.x];
      if (!cell) {
        return;
      }
      cell.classList.add('is-snake');
      if (index === 0) {
        cell.classList.add('is-head');
      }
    });

    if (this.board) {
      this.board.dataset.head = `${this.snake[0].x},${this.snake[0].y}`;
      this.board.dataset.food = `${this.food.x},${this.food.y}`;
      this.board.dataset.length = String(this.snake.length);
    }
  }
}

const snakeGame = new SnakeGame({
  board,
  stage,
  statusEl: gameStatus,
  bestScoreLabel,
  bestScoreValue,
  scoreValue,
  overlay,
  startButton,
  pauseButton,
  restartButton,
});

window.__suwanSnakeGame = snakeGame;

try {
  snakeGame.init();
} catch (error) {
  window.__suwanSnakeInitError = String(error);
  console.error(error);
}
