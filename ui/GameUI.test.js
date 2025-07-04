/**
 * @jest-environment jsdom
 */

import GameUI from './GameUI.js';
import Controller from '../Controller.js';
import BoardRenderer from './BoardRenderer.js';
import Ship from '../Ship.js';
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
      const carrierShip = c.player1.gameboard.ships.find(({ shipInfo }) => shipInfo.name = 'carrier');

      const players = [c.player1, c.player2];
      players.forEach((player, index) => {
        Ship.shipCatalog.forEach(({ name }, index) => {
          const shipTypeDiv = document.querySelector(`[data-ship-type="${name}"]`);
          const shipOnGameBoard = player.gameboard.ships.find(({ shipInfo }) => shipInfo.name === name);
          expect(gameUI.getShip(shipTypeDiv, player)).toBe(shipOnGameBoard);
        });
      })
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

  describe('getShipsToBePlaced', () => {
    test('should return 1 after placing 1 patrol', () => {
      const player1Gameboard = gameUI.controller.player1.gameboard;
      const player1Ships = player1Gameboard.ships;
      const player1ShipsGroupedByName = player1Gameboard.shipsGroupedByName;
      player1Gameboard.placeShipRandomly(player1ShipsGroupedByName.patrol[0]);
      expect(gameUI.getShipsToBePlaced('patrol')).toBe(player1Gameboard.shipsGroupedByName.patrol[1]);
    })
  })

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