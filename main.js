import GameUI from './ui/GameUI.js';
import EventHandlers from './EventHandlers.js';

// Inicializa o jogo quando DOM carrega
document.addEventListener('DOMContentLoaded', () => {
  const gameUI = new GameUI();
  gameUI.boardRenderer.controller.setPhase('attacks');
  const largestShip = gameUI.boardRenderer.player1Gameboard.ships.at(-1);
  gameUI.placeShip(largestShip, 'enemy-board', 0, 0);
  gameUI.attack('enemy-board', 0, 0);
  gameUI.attack('enemy-board', 0, 3);
  gameUI.attack('enemy-board', 0, 7);
  const eventHandlers = new EventHandlers(gameUI);
});