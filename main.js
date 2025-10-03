import Game from './Game.js';

const canvas = document.getElementById('gameCanvas');
const startBtn = document.getElementById('startBtn');

const game = new Game(canvas, {
  initialTime: 60,
  spawnInterval: 1800, // ms
});

startBtn.addEventListener('click', () => {
  if (!game.running) game.start();
  else game.reset();
});
