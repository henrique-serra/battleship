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
  describe('getShip', () => {
    test('should return the correct ship', () => {
      const c = gameUI.controller;
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
    });

    test('should throw if first param is not a div', () => {
      const c = gameUI.controller;
      const players = [c.player1, c.player2];

      players.forEach((player) => {
        expect(() => gameUI.getShip('div', player)).toThrow('First param must be a div');
      });
    });

    test('should throw if wrong div is provided', () => {
      const c = gameUI.controller;
      const wrongDiv = document.querySelector('.game-container');
      const players = [c.player1, c.player2];

      players.forEach((player) => {
        expect(() => gameUI.getShip(wrongDiv, player)).toThrow('Div must contain class "ship-type"');
      })
    });
  });

  describe('placeShipOnBoard', () => {
    test('should, correctly, place ships on board', () => {
      // Place ships randomly
      for(let i = 1; i < 3; i++) {
        const player = gameUI.controller[`player${i}`];
        const playerGameboard = player.gameboard;
        playerGameboard.ships.forEach((ship) => {
          playerGameboard.placeShipRandomly(ship);
          gameUI.placeShipOnBoard(ship);
          ship.positions.forEach(([row, col]) => {
            const cell = gameUI[`player${i}BoardEl`].querySelector(`[data-row="${row}"][data-col="${col}"]`);
            expect(cell.classList.contains('ship')).toBe(true);
          })
        })
      }
    });
  });

  describe('removeShipOnBoard', () => {
    test('should, correctly, remove ships on board', () => {
      // Place ships randomly
      for(let i = 1; i < 3; i++) {
        const positions = [];
        const player = gameUI.controller[`player${i}`];
        const playerGameboard = player.gameboard;
        playerGameboard.ships.forEach((ship) => {
          playerGameboard.placeShipRandomly(ship);
          positions.push(ship.positions.flat());
          gameUI.placeShipOnBoard(ship, gameUI.controller[`player${i}`]);
          // IMPORTANT!! MUST, FIRST, REMOVE SHIP ON BOARD UI. IF SHIP IS REMOVED ON GAMEBOARD FIRST, SHIP.POSITIONS IS ERASED
          gameUI.removeShipOnBoard(ship);
          playerGameboard.removeShip(ship);
        });

        positions.forEach(([row, col]) => {
          const cell = gameUI[`player${i}BoardEl`].querySelector(`[data-row="${row}"][data-col="${col}"]`);

          expect(cell.classList.contains('ship')).toBe(false);
        })
      };
    })
  })
})