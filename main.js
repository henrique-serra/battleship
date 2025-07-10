import GameUI from './ui/GameUI.js';
import EventHandlers from './EventHandlers.js';

// Inicializa o jogo quando DOM carrega
document.addEventListener('DOMContentLoaded', () => {
  const gameUI = new GameUI();
  
  // For testing purposes
  gameUI.boardRenderer.controller.setPhase('attacks');
  const largestShip = gameUI.boardRenderer.player2Gameboard.ships.at(-1);
  gameUI.placeShip(largestShip, 'enemy-board', 0, 0);
  gameUI.boardRenderer.updateShipCount('enemy-board', largestShip.shipInfo.name);
  gameUI.attack('enemy-board', 0, 0);
  gameUI.attack('enemy-board', 0, 3);
  gameUI.attack('enemy-board', 0, 7);

  const patrolShipPlayer1 = gameUI.boardRenderer.player1Gameboard.ships[0];
  gameUI.placeShip(patrolShipPlayer1, 'player-board', 0, 0);
  gameUI.boardRenderer.updateShipCount('player-board', 'patrol');
  const playerBoard = document.querySelector('#player-board');
  const patrolTypeDiv = playerBoard.nextElementSibling.querySelector('[data-ship-type="patrol"]');
  gameUI.selectShip(patrolTypeDiv);
  // ---------------------------------------

  const eventHandlers = new EventHandlers(gameUI);
});