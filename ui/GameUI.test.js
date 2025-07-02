/**
 * @jest-environment jsdom
 */

import GameUI from './GameUI.js';
import Controller from '../Controller.js';
import BoardRenderer from './BoardRenderer.js';
import { readFileSync } from 'fs';
import { join } from 'path';

let gameUI;

beforeEach(() => {
  const htmlPath = join(__dirname, '../index.html');
  const htmlContent = readFileSync(htmlPath, 'utf8');
  document.body.innerHTML = htmlContent;
  gameUI = new GameUI();
});

describe('GameUI', () => {
  test('GameUI instantiates correctly', () => {
    expect(gameUI).toBeDefined();
    expect(gameUI.playerBoardEl.tagName).toBe('DIV');
    expect(gameUI.playerBoardEl.classList.contains('grid')).toBe(true);
    expect(gameUI.playerBoardEl.id).toBe('player-board');
    expect(gameUI.enemyBoardEl.tagName).toBe('DIV');
    expect(gameUI.enemyBoardEl.classList.contains('grid')).toBe(true);
    expect(gameUI.enemyBoardEl.id).toBe('enemy-board');
    expect(gameUI.controller instanceof Controller).toBe(true);
    expect(gameUI.boardRenderer instanceof BoardRenderer).toBe(true);
  });

  describe('getShip', () => {
    test('should return the correct ship', () => {
      const c = new Controller();
      const carrierDiv = document.querySelector('[data-ship-type="carrier"]');
      const carrierShip = c.player1.gameboard.ships[4];
      
      const shipTypes = [
        'patrol',
        'submarine',
        'destroyer',
        'battleship',
        'carrier',
      ];

      // Player 1
      shipTypes.forEach((shipType, index) => {
        const shipTypeDiv = document.querySelector(`[data-ship-type="${shipType}"]`);
        expect(gameUI.getShip(shipTypeDiv, c.player1)).toBe(c.player1.gameboard.ships[index]);
      });

      // Player 2
      shipTypes.forEach((shipType, index) => {
        const shipTypeDiv = document.querySelector(`[data-ship-type="${shipType}"]`);
        expect(gameUI.getShip(shipTypeDiv, c.player2)).toBe(c.player2.gameboard.ships[index]);
      });
    })
  })
})