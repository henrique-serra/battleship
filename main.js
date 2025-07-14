import GameUI from './ui/GameUI.js';
import EventHandlers from './EventHandlers.js';

// Inicializa o jogo quando DOM carrega
document.addEventListener('DOMContentLoaded', () => {
  const gameUI = new GameUI();
  
  // For testing purposes

  // ---------------------------------------

  const eventHandlers = new EventHandlers(gameUI);
});