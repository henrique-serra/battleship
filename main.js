import Controller from './Controller.js';
import BoardRenderer from './ui/BoardRenderer.js';
import GameUI from './ui/GameUI.js';
import EventHandlers from './EventHandlers.js';

// Inicializa o jogo quando DOM carrega
document.addEventListener('DOMContentLoaded', () => {
  const controller = new Controller();
  const boardRenderer = new BoardRenderer(controller.player1.gameboard, controller.player2.gameboard);
  const gameUI = new GameUI(controller, boardRenderer);
  const eventHandlers = new EventHandlers(gameUI);
});