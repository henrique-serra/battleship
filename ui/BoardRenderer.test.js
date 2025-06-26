/**
 * @jest-environment jsdom
 */

import BoardRenderer from './BoardRenderer.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import Gameboard from '../Gameboard.js';

let playerBoardEl;
let enemyBoardEl;
let boardRenderer;

describe('BoardRenderer', () => {
  beforeEach(() => {
    const htmlPath = join(__dirname, '../index.html');
    const htmlContent = readFileSync(htmlPath, 'utf8');
    document.body.innerHTML = htmlContent;
    playerBoardEl = document.querySelector('#player-board');
    enemyBoardEl = document.querySelector('#enemy-board');
    boardRenderer = new BoardRenderer(playerBoardEl, enemyBoardEl);
  });

  describe('createGameBoardsHTML', () => {
    let htmlString, container, playerBoard, enemyBoard;
    beforeEach(() => {
      htmlString = boardRenderer.createGameBoardsHTML();
      container = document.createElement('div');
      container.innerHTML = htmlString;
      playerBoard = container.querySelector('#player-board');
      enemyBoard = container.querySelector('#enemy-board');
    });

    describe('HTML structure validation', () => {
      test('should return valid HTML string', () => {
        expect(typeof htmlString).toBe('string');
        expect(htmlString.trim()).not.toBe('');
        expect(htmlString).toContain('<div class="game-boards">');
      });

      test('should create main container with correct class', () => {
        const gameBoards = container.querySelector('.game-boards');
        expect(gameBoards).toBeTruthy();
        expect(gameBoards.tagName).toBe('DIV');
      });

      test('should create exactly 2 board sections', () => {
        const boardSections = container.querySelectorAll('.board-section');
        expect(boardSections).toHaveLength(2);
      });

      test('should create both player and enemy boards with correct IDs', () => {
        expect(playerBoard).toBeTruthy();
        expect(enemyBoard).toBeTruthy();
        expect(playerBoard.classList.contains('grid')).toBe(true);
        expect(enemyBoard.classList.contains('grid')).toBe(true);
      });

      test('should have correct board titles', () => {
        const titles = container.querySelectorAll('.board-title');
        expect(titles).toHaveLength(2);
        expect(titles[0].textContent).toBe('🛡️ Sua Frota');
        expect(titles[1].textContent).toBe('🎯 Campo Inimigo');
      });
    });

    describe('Grid Cell structure', () => {
      test('should create 121 .grid-cells per board', () => {
        const playerCells = playerBoard.querySelectorAll('.grid-cell');
        const enemyCells = enemyBoard.querySelectorAll('.grid-cell');

        expect(playerCells).toHaveLength(121);
        expect(enemyCells).toHaveLength(121);
      });

      test('should create 21 .grid-cell.coordinate cells per board', () => {
        const playerCoordinates = playerBoard.querySelectorAll('.grid-cell.coordinate');
        const enemyCoordinates = enemyBoard.querySelectorAll('.grid-cell.coordinate');

        expect(playerCoordinates).toHaveLength(21);
        expect(enemyCoordinates).toHaveLength(21);
      });

      test('should create 100 playable cells per board', () => {
        const playerGameCells = playerBoard.querySelectorAll('[data-row][data-col]');
        const enemyGameCells = enemyBoard.querySelectorAll('[data-row][data-col]');

        expect(playerGameCells).toHaveLength(100);
        expect(enemyGameCells).toHaveLength(100);
      });

      describe('Coordinate Headers', () => {
        test('should have correct column headers', () => {
          const expectedColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

          expectedColumns.forEach((col, index) => {
            const headerCell = playerBoard.querySelectorAll('.grid-cell')[index + 1];
            expect(headerCell.textContent).toBe(col);
            expect(headerCell.classList.contains('coordinate')).toBe(true);
          })
        });

        test('should have correct row numbers', () => {
          for(let row = 1; row <= 10; row++) {
            const rowNumberIndex = 11 + (row - 1) * 11;
            const rowCell = playerBoard.querySelectorAll('.grid-cell')[rowNumberIndex];
            expect(rowCell.textContent).toBe(row.toString());
            expect(rowCell.classList.contains('coordinate')).toBe(true);
          }
        });

        test('should have empty corner cell', () => {
          const playerCorner = playerBoard.querySelector('.grid-cell');
          const enemyCorner = enemyBoard.querySelector('.grid-cell');

          expect(playerCorner.textContent).toBe('');
          expect(enemyCorner.textContent).toBe('');
          expect(playerCorner.classList.contains('coordinate')).toBe(true);
          expect(enemyCorner.classList.contains('coordinate')).toBe(true);
        })
      })
    });

    describe('Data Attributes validation', () => {
      test('should have correct data-row attributes', () => {
        const gameCells = playerBoard.querySelectorAll('[data-row][data-col]');

        for(let row = 0; row < 10; row++) {
          const cellsInRow = [...gameCells].filter((cell) => cell.getAttribute('data-row') === row.toString());
          expect(cellsInRow).toHaveLength(10);
        };
      });

      test('should have correct data-col attributes', () => {
        const gameCells = playerBoard.querySelectorAll('[data-row][data-col]');

        for(let col = 0; col < 10; col++) {
          const cellsInCol = [...gameCells].filter((cell) => cell.getAttribute('data-col') === col.toString());
          expect(cellsInCol).toHaveLength(10);
        }
      });

      test('should have correct data-position attributes', () => {
        const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        for(let row = 0; row < 10; row++) {
          for(let col = 0; col < 10; col++) {
            const expectedPosition = `${columns[col]}${row + 1}`;
            const cell = playerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);

            expect(cell).toBeTruthy();
            expect(cell.getAttribute('data-position')).toBe(expectedPosition);
          }
        }
      });

      test('should verify specific position mappings', () => {
        const testCases = [
          { row: 0, col: 0, position: 'A1' },
          { row: 0, col: 9, position: 'J1' },
          { row: 9, col: 0, position: 'A10' },
          { row: 9, col: 9, position: 'J10' },
          { row: 4, col: 4, position: 'E5' },
          { row: 2, col: 7, position: 'H3' },
        ];

        testCases.forEach(({ row, col, position }) => {
          const cell = playerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);

          expect(cell.getAttribute('data-position')).toBe(position);
        })
      })
    });

    describe('CSS Classes validation', () => {
      test('coordinate cells should have correct classes', () => {
        const playerBoard = container.querySelector('#player-board');
        const coordinateCells = playerBoard.querySelectorAll('.coordinate');
        
        coordinateCells.forEach(cell => {
          expect(cell.classList.contains('grid-cell')).toBe(true);
          expect(cell.classList.contains('coordinate')).toBe(true);
          expect(cell.hasAttribute('data-row')).toBe(false);
          expect(cell.hasAttribute('data-col')).toBe(false);
          expect(cell.hasAttribute('data-position')).toBe(false);
        });
      });

      test('game cells should have correct classes', () => {
        const playerBoard = container.querySelector('#player-board');
        const gameCells = playerBoard.querySelectorAll('[data-position]');
        
        gameCells.forEach(cell => {
          expect(cell.classList.contains('grid-cell')).toBe(true);
          expect(cell.classList.contains('coordinate')).toBe(false);
          expect(cell.hasAttribute('data-row')).toBe(true);
          expect(cell.hasAttribute('data-col')).toBe(true);
        });
      });
    });

    describe('Board Consistency', () => {
      test('both boards should have identical structure', () => {
        const playerBoard = container.querySelector('#player-board');
        const enemyBoard = container.querySelector('#enemy-board');
        
        const playerCells = playerBoard.querySelectorAll('.grid-cell');
        const enemyCells = enemyBoard.querySelectorAll('.grid-cell');

        expect(playerCells.length).toBe(enemyCells.length);

        const playerGameCells = playerBoard.querySelectorAll('[data-position]');
        const enemyGameCells = enemyBoard.querySelectorAll('[data-position]');
        expect(playerGameCells.length).toBe(enemyGameCells.length);

        playerGameCells.forEach((playerCell, index) => {
          const enemyCell = enemyGameCells[index];
          expect(playerCell.getAttribute('data-position')).toBe(enemyCell.getAttribute('data-position'));
          expect(playerCell.getAttribute('data-row')).toBe(enemyCell.getAttribute('data-row'));
          expect(playerCell.getAttribute('data-col')).toBe(enemyCell.getAttribute('data-col'));
        })
      });

      test('should have no duplicate data-position values per board', () => {
        const playerBoard = container.querySelector('#player-board');
        const gameCells = playerBoard.querySelectorAll('[data-position]');

        const positions = [...gameCells].map((cell) => cell.getAttribute('data-position'));
        const uniquePositions = [...new Set(positions)];

        expect(positions.length).toBe(uniquePositions.length);
        expect(uniquePositions).toHaveLength(100);
      });
    });

    describe('Edge Cases and Error Handling', () => {
      test('should handle HTML injection safely', () => {
        expect(htmlString).not.toContain('<script');
        expect(htmlString).not.toContain('javascript:');
        expect(htmlString).not.toContain('onclick');
        expect(htmlString).not.toContain('onerror');
      });

      test('generated HTML should be parseable', () => {
        expect(() => {
          const testDiv = document.createElement('div');
          testDiv.innerHTML = htmlString;
        }).not.toThrow();
      });

      test('should maintain consistent board IDs', () => {
        expect(playerBoard.id).toBe('player-board');
        expect(enemyBoard.id).toBe('enemy-board');

        const allIds = container.querySelectorAll('[id]');
        const ids = [...allIds].map((el) => el.id);
        const uniqueIds = [...new Set(ids)];
        expect(ids.length).toBe(uniqueIds.length);
      })
    });

    describe('Performance and Efficiency', () => {
      test('should generate HTML in reasonable time', () => {
        const startTime = performance.now();
        const html = boardRenderer.createGameBoardsHTML();
        const endTime = performance.now();
        
        expect(endTime - startTime).toBeLessThan(100);
        expect(html.length).toBeGreaterThan(1000);
      });

      test('should generate consistent output', () => {
        const html1 = boardRenderer.createGameBoardsHTML();
        const html2 = boardRenderer.createGameBoardsHTML();
        
        expect(html1).toBe(html2); 
      });
    })
  })
})