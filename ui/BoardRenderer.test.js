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

  describe('insertClass', () => {
    const insertClassCases = {
      success: {
        ship: [
          { action: 'ship', row: 0, col: 0, description: 'should add ship class at top-left corner' },
          { action: 'ship', row: 5, col: 5, description: 'should add ship class at middle position' },
          { action: 'ship', row: 9, col: 9, description: 'should add ship class at bottom-right corner' },
          { action: 'ship', row: 2, col: 7, description: 'should add ship class at arbitrary position' }
        ],
        hit: [
          { action: 'hit', row: 1, col: 1, description: 'should add hit class when ship is hit' },
          { action: 'hit', row: 0, col: 5, description: 'should add hit class at edge position' },
          { action: 'hit', row: 9, col: 0, description: 'should add hit class at corner position' },
          { action: 'hit', row: 4, col: 6, description: 'should add hit class at center area' }
        ],
        miss: [
          { action: 'miss', row: 3, col: 3, description: 'should add miss class when attack misses' },
          { action: 'miss', row: 0, col: 0, description: 'should add miss class at top-left' },
          { action: 'miss', row: 9, col: 9, description: 'should add miss class at bottom-right' },
          { action: 'miss', row: 7, col: 2, description: 'should add miss class at random position' }
        ],
        sunk: [
          { action: 'sunk', row: 2, col: 2, description: 'should add sunk class when ship is completely destroyed' },
          { action: 'sunk', row: 8, col: 1, description: 'should add sunk class near edge' },
          { action: 'sunk', row: 0, col: 9, description: 'should add sunk class at top-right corner' },
          { action: 'sunk', row: 6, col: 4, description: 'should add sunk class in middle area' }
        ]
      },
      
      error: {
        invalidAction: [
          { action: null, row: 0, col: 0, description: 'should throw when action is null', errorMsg: 'Invalid action parameter' },
          { action: undefined, row: 5, col: 5, description: 'should throw when action is undefined', errorMsg: 'Invalid action parameter' },
          { action: 123, row: 1, col: 1, description: 'should throw when action is not a string', errorMsg: 'Invalid action parameter' },
          { action: '', row: 3, col: 3, description: 'should throw when action is empty string', errorMsg: 'Invalid action parameter' },
        ],
        actionNotRecognized: [
          { action: 'invalid', row: 2, col: 2, description: 'should throw when action is not recognized', errorMsg: 'Action not recognized' },
          { action: 'not an action', row: 1, col: 1, description: 'should throw when action is different from hit, miss, sunk or ship', errorMsg: 'Action not recognized' },
        ]
      },
      
      edge: [
        { action: 'hit', row: 0, col: 0, description: 'should work at top-left corner (0,0)' },
        { action: 'miss', row: 0, col: 9, description: 'should work at top-right corner (0,9)' },
        { action: 'ship', row: 9, col: 0, description: 'should work at bottom-left corner (9,0)' },
        { action: 'sunk', row: 9, col: 9, description: 'should work at bottom-right corner (9,9)' },
        { action: 'hit', row: 0, col: 5, description: 'should work at top edge middle' },
        { action: 'miss', row: 9, col: 5, description: 'should work at bottom edge middle' },
        { action: 'ship', row: 5, col: 0, description: 'should work at left edge middle' },
        { action: 'sunk', row: 5, col: 9, description: 'should work at right edge middle' }
      ],
      
      multiple: {
        uniqueActions: [
          { 
            sequence: [
              { action: 'ship', row: 1, col: 1 },
              { action: 'hit', row: 1, col: 1 }
            ],
            description: 'should be able to apply hit to a cell that already has ship class'
          },
          {
            sequence: [
              { action: 'ship', row: 2, col: 2 },
              { action: 'hit', row: 2, col: 2 },
              { action: 'sunk', row: 2, col: 2 }
            ],
            description: 'should be able to apply sunk to a cell that has ship and hit classes'
          },
        ],
        repeatedActions: [
          {
            sequence: [
              { action: 'ship', row: 3, col: 3 },
              { action: 'ship', row: 3, col: 3 }
            ],
            description: 'should handle repeated ship placement on same cell'
          },
          {
            sequence: [
              { action: 'miss', row: 4, col: 4 },
              { action: 'miss', row: 4, col: 4 }
            ],
            description: 'should handle repeated miss action on same cell'
          },
          {
            sequence: [
              { action: 'ship', row: 5, col: 5 },
              { action: 'hit', row: 5, col: 5 },
              { action: 'hit', row: 5, col: 5 }
            ],
            description: 'should handle repeated hit action on same cell'
          },
          {
            sequence: [
              { action: 'ship', row: 6, col: 6 },
              { action: 'hit', row: 6, col: 6 },
              { action: 'sunk', row: 6, col: 6 },
              { action: 'sunk', row: 6, col: 6 }
            ],
            description: 'should handle repeated sunk action on same cell'
          },
          {
            sequence: [
              { action: 'hit', row: 7, col: 7 },
              { action: 'hit', row: 7, col: 7 },
              { action: 'hit', row: 7, col: 7 }
            ],
            description: 'should handle multiple repeated hit actions on same cell'
          },
          {
            sequence: [
              { action: 'miss', row: 8, col: 8 },
              { action: 'miss', row: 8, col: 8 },
              { action: 'miss', row: 8, col: 8 },
              { action: 'miss', row: 8, col: 8 }
            ],
            description: 'should handle multiple repeated miss actions on same cell'
          }
        ]
      }
    };
    
    describe('Success cases', () => {
      Object.values(insertClassCases.success).flat().forEach(({ action, row, col, description }) => {
        test(`insertClass(playerBoardEl, ${action}, ${row}, ${col}) ${description}`, () => {
          const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
          const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);
          boardRenderer.insertClass(playerBoardEl, action, row, col);
          boardRenderer.insertClass(enemyBoardEl, action, row, col);
          expect(cellPlayer.classList.contains(action)).toBe(true);
          expect(cellEnemy.classList.contains(action)).toBe(true);
        })
      });
    });

    describe('Error cases', () => {
      Object.values(insertClassCases.error).flat().forEach(({ action, row, col, description, errorMsg }) => {
        test(`${description}`, () => {
          expect(() => boardRenderer.insertClass(playerBoardEl, action, row, col)).toThrow(errorMsg);
        })
      })
    });

    describe('Edge cases', () => {
      insertClassCases.edge.forEach(({ action, row, col, description }) => {
        test(description, () => {
          const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
          const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);
          boardRenderer.insertClass(playerBoardEl, action, row, col);
          boardRenderer.insertClass(enemyBoardEl, action, row, col);
          expect(cellPlayer.classList.contains(action)).toBe(true);
          expect(cellEnemy.classList.contains(action)).toBe(true);
        })
      })
    });

    describe('Multiple hits', () => {
      describe('Unique actions', () => {
        insertClassCases.multiple.uniqueActions.forEach(({ sequence, description }) => {
          test(description, () => {
            const { row, col } = sequence[0];
            const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
            const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);
  
            sequence.forEach(({ action, row, col }) => {
              boardRenderer.insertClass(playerBoardEl, action, row, col);
              boardRenderer.insertClass(enemyBoardEl, action, row, col);
            });
            
            sequence.forEach(({ action }) => {
              expect(cellPlayer.classList.contains(action)).toBe(true);
              expect(cellEnemy.classList.contains(action)).toBe(true);
            })
          })
        });
      });

      describe('Repeated actions', () => {
        insertClassCases.multiple.repeatedActions.forEach(({ sequence, description }) => {
          test(description, () => {
            let actions = [];
            const { row, col } = sequence[0];
            const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
            const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);
            
            sequence.forEach(({ action, row, col }) => {
              boardRenderer.insertClass(playerBoardEl, action, row, col);
              boardRenderer.insertClass(enemyBoardEl, action, row, col);
              actions.push(action);
            });
            
            const playerClasses = [...cellPlayer.classList];
            const enemyClasses = [...cellEnemy.classList];
            actions = [...new Set(actions)];

            expect(playerClasses).toEqual(['grid-cell', ...actions]);
            expect(enemyClasses).toEqual(['grid-cell', ...actions]);
          })
        });
      })
    })
  });

  describe('removeClass', () => {
    const removeClassCases = {
      success: {
        ship: [
          { action: 'ship', row: 0, col: 0, description: 'should remove ship class at top-left corner' },
          { action: 'ship', row: 5, col: 5, description: 'should remove ship class at middle position' },
          { action: 'ship', row: 9, col: 9, description: 'should remove ship class at bottom-right corner' },
          { action: 'ship', row: 2, col: 7, description: 'should remove ship class at arbitrary position' }
        ],
        hit: [
          { action: 'hit', row: 1, col: 1, description: 'should remove hit class when removing hit' },
          { action: 'hit', row: 0, col: 5, description: 'should remove hit class at edge position' },
          { action: 'hit', row: 9, col: 0, description: 'should remove hit class at corner position' },
          { action: 'hit', row: 4, col: 6, description: 'should remove hit class at center area' }
        ],
        miss: [
          { action: 'miss', row: 3, col: 3, description: 'should remove miss class when removing miss' },
          { action: 'miss', row: 0, col: 0, description: 'should remove miss class at top-left' },
          { action: 'miss', row: 9, col: 9, description: 'should remove miss class at bottom-right' },
          { action: 'miss', row: 7, col: 2, description: 'should remove miss class at random position' }
        ],
        sunk: [
          { action: 'sunk', row: 2, col: 2, description: 'should remove sunk class when removing sunk status' },
          { action: 'sunk', row: 8, col: 1, description: 'should remove sunk class near edge' },
          { action: 'sunk', row: 0, col: 9, description: 'should remove sunk class at top-right corner' },
          { action: 'sunk', row: 6, col: 4, description: 'should remove sunk class in middle area' }
        ]
      },
      
      error: {
        invalidAction: [
          { action: null, row: 0, col: 0, description: 'should throw when action is null', errorMsg: 'Invalid action parameter' },
          { action: undefined, row: 5, col: 5, description: 'should throw when action is undefined', errorMsg: 'Invalid action parameter' },
          { action: 123, row: 1, col: 1, description: 'should throw when action is not a string', errorMsg: 'Invalid action parameter' },
          { action: '', row: 3, col: 3, description: 'should throw when action is empty string', errorMsg: 'Invalid action parameter' },
        ],
        actionNotRecognized: [
          { action: 'invalid', row: 2, col: 2, description: 'should throw when action is not recognized', errorMsg: 'Action not recognized' },
          { action: 'not an action', row: 1, col: 1, description: 'should throw when action is different from hit, miss, sunk or ship', errorMsg: 'Action not recognized' },
        ]
      },
      
      edge: [
        { action: 'hit', row: 0, col: 0, description: 'should work at top-left corner (0,0)' },
        { action: 'miss', row: 0, col: 9, description: 'should work at top-right corner (0,9)' },
        { action: 'ship', row: 9, col: 0, description: 'should work at bottom-left corner (9,0)' },
        { action: 'sunk', row: 9, col: 9, description: 'should work at bottom-right corner (9,9)' },
        { action: 'hit', row: 0, col: 5, description: 'should work at top edge middle' },
        { action: 'miss', row: 9, col: 5, description: 'should work at bottom edge middle' },
        { action: 'ship', row: 5, col: 0, description: 'should work at left edge middle' },
        { action: 'sunk', row: 5, col: 9, description: 'should work at right edge middle' }
      ],
      
      multiple: {
        uniqueActions: [
          { 
            sequence: [
              { action: 'ship', row: 1, col: 1, add: true },
              { action: 'hit', row: 1, col: 1, add: true },
              { action: 'hit', row: 1, col: 1, add: false }
            ],
            description: 'should be able to remove hit from a cell that has ship and hit classes'
          },
          {
            sequence: [
              { action: 'ship', row: 2, col: 2, add: true },
              { action: 'hit', row: 2, col: 2, add: true },
              { action: 'sunk', row: 2, col: 2, add: true },
              { action: 'sunk', row: 2, col: 2, add: false }
            ],
            description: 'should be able to remove sunk from a cell that has ship, hit and sunk classes'
          },
          {
            sequence: [
              { action: 'ship', row: 3, col: 3, add: true },
              { action: 'hit', row: 3, col: 3, add: true },
              { action: 'sunk', row: 3, col: 3, add: true },
              { action: 'hit', row: 3, col: 3, add: false },
              { action: 'ship', row: 3, col: 3, add: false }
            ],
            description: 'should be able to remove multiple classes sequentially'
          }
        ],
        repeatedActions: [
          {
            sequence: [
              { action: 'ship', row: 3, col: 3, add: true },
              { action: 'ship', row: 3, col: 3, add: false },
              { action: 'ship', row: 3, col: 3, add: false }
            ],
            description: 'should handle repeated ship removal on same cell'
          },
          {
            sequence: [
              { action: 'miss', row: 4, col: 4, add: true },
              { action: 'miss', row: 4, col: 4, add: false },
              { action: 'miss', row: 4, col: 4, add: false }
            ],
            description: 'should handle repeated miss removal on same cell'
          },
          {
            sequence: [
              { action: 'hit', row: 5, col: 5, add: true },
              { action: 'hit', row: 5, col: 5, add: false },
              { action: 'hit', row: 5, col: 5, add: false },
              { action: 'hit', row: 5, col: 5, add: false }
            ],
            description: 'should handle multiple repeated hit removals on same cell'
          },
          {
            sequence: [
              { action: 'sunk', row: 6, col: 6, add: true },
              { action: 'sunk', row: 6, col: 6, add: false },
              { action: 'sunk', row: 6, col: 6, add: false },
              { action: 'sunk', row: 6, col: 6, add: false },
              { action: 'sunk', row: 6, col: 6, add: false }
            ],
            description: 'should handle multiple repeated sunk removals on same cell'
          }
        ]
      },
      
      nonExistentClass: [
        { action: 'ship', row: 1, col: 1, description: 'should handle removing ship class when cell does not have ship class' },
        { action: 'hit', row: 2, col: 2, description: 'should handle removing hit class when cell does not have hit class' },
        { action: 'miss', row: 3, col: 3, description: 'should handle removing miss class when cell does not have miss class' },
        { action: 'sunk', row: 4, col: 4, description: 'should handle removing sunk class when cell does not have sunk class' }
      ]
    };
    
    describe('Success cases', () => {
      Object.values(removeClassCases.success).flat().forEach(({ action, row, col, description }) => {
        test(`removeClass(playerBoardEl, ${action}, ${row}, ${col}) ${description}`, () => {
          const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
          const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);
          
          // First add the class
          boardRenderer.insertClass(playerBoardEl, action, row, col);
          boardRenderer.insertClass(enemyBoardEl, action, row, col);
          expect(cellPlayer.classList.contains(action)).toBe(true);
          expect(cellEnemy.classList.contains(action)).toBe(true);
          
          // Then remove it
          boardRenderer.removeClass(playerBoardEl, action, row, col);
          boardRenderer.removeClass(enemyBoardEl, action, row, col);
          expect(cellPlayer.classList.contains(action)).toBe(false);
          expect(cellEnemy.classList.contains(action)).toBe(false);
        })
      });
    });

    describe('Error cases', () => {
      Object.values(removeClassCases.error).flat().forEach(({ action, row, col, description, errorMsg }) => {
        test(`${description}`, () => {
          expect(() => boardRenderer.removeClass(playerBoardEl, action, row, col)).toThrow(errorMsg);
        })
      })
    });

    describe('Edge cases', () => {
      removeClassCases.edge.forEach(({ action, row, col, description }) => {
        test(description, () => {
          const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
          const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);
          
          // First add the class
          boardRenderer.insertClass(playerBoardEl, action, row, col);
          boardRenderer.insertClass(enemyBoardEl, action, row, col);
          expect(cellPlayer.classList.contains(action)).toBe(true);
          expect(cellEnemy.classList.contains(action)).toBe(true);
          
          // Then remove it
          boardRenderer.removeClass(playerBoardEl, action, row, col);
          boardRenderer.removeClass(enemyBoardEl, action, row, col);
          expect(cellPlayer.classList.contains(action)).toBe(false);
          expect(cellEnemy.classList.contains(action)).toBe(false);
        })
      })
    });

    describe('Multiple operations', () => {
      describe('Unique actions', () => {
        removeClassCases.multiple.uniqueActions.forEach(({ sequence, description }) => {
          test(description, () => {
            const { row, col } = sequence[0];
            const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
            const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);

            sequence.forEach(({ action, row, col, add }) => {
              if (add) {
                boardRenderer.insertClass(playerBoardEl, action, row, col);
                boardRenderer.insertClass(enemyBoardEl, action, row, col);
              } else {
                boardRenderer.removeClass(playerBoardEl, action, row, col);
                boardRenderer.removeClass(enemyBoardEl, action, row, col);
              }
            });
            
            // Check which classes should remain
            const expectedClasses = ['grid-cell'];
            sequence.forEach(({ action, add }) => {
              if (add && !expectedClasses.includes(action)) {
                expectedClasses.push(action);
              } else if (!add && expectedClasses.includes(action)) {
                expectedClasses.splice(expectedClasses.indexOf(action), 1);
              }
            });
            
            const playerClasses = [...cellPlayer.classList];
            const enemyClasses = [...cellEnemy.classList];
            
            expectedClasses.forEach(className => {
              expect(playerClasses).toContain(className);
              expect(enemyClasses).toContain(className);
            });
            
            // Check that removed classes are not present
            const removedActions = sequence.filter(({add}) => !add).map(({action}) => action);
            const uniqueRemovedActions = [...new Set(removedActions)];
            const finalAddedActions = sequence.filter(({add}) => add).map(({action}) => action);
            const stillPresentActions = [...new Set(finalAddedActions)];
            
            uniqueRemovedActions.forEach(action => {
              if (!stillPresentActions.includes(action)) {
                expect(playerClasses).not.toContain(action);
                expect(enemyClasses).not.toContain(action);
              }
            });
          })
        });
      });

      describe('Repeated actions', () => {
        removeClassCases.multiple.repeatedActions.forEach(({ sequence, description }) => {
          test(description, () => {
            const { row, col } = sequence[0];
            const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
            const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);
            
            sequence.forEach(({ action, row, col, add }) => {
              if (add) {
                boardRenderer.insertClass(playerBoardEl, action, row, col);
                boardRenderer.insertClass(enemyBoardEl, action, row, col);
              } else {
                boardRenderer.removeClass(playerBoardEl, action, row, col);
                boardRenderer.removeClass(enemyBoardEl, action, row, col);
              }
            });
            
            const playerClasses = [...cellPlayer.classList];
            const enemyClasses = [...cellEnemy.classList];
            
            // After adding and then removing the same action multiple times, 
            // the class should not be present
            const firstAction = sequence[0].action;
            expect(playerClasses).not.toContain(firstAction);
            expect(enemyClasses).not.toContain(firstAction);
            expect(playerClasses).toContain('grid-cell');
            expect(enemyClasses).toContain('grid-cell');
          })
        });
      })
    });

    describe('Non-existent class removal', () => {
      removeClassCases.nonExistentClass.forEach(({ action, row, col, description }) => {
        test(description, () => {
          const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
          const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);
          
          // Ensure class is not present initially
          expect(cellPlayer.classList.contains(action)).toBe(false);
          expect(cellEnemy.classList.contains(action)).toBe(false);
          
          // Try to remove non-existent class - should not throw error
          expect(() => {
            boardRenderer.removeClass(playerBoardEl, action, row, col);
            boardRenderer.removeClass(enemyBoardEl, action, row, col);
          }).not.toThrow();
          
          // Class should still not be present
          expect(cellPlayer.classList.contains(action)).toBe(false);
          expect(cellEnemy.classList.contains(action)).toBe(false);
        })
      });
    });
  });

  // Auxiliary methods
  describe('Auxiliary methods!', () => {
    describe('getCell', () => {
      test('getCell - comprehensive position testing', () => {
        for (let row = 0; row < 10; row++) {
          for (let col = 0; col < 10; col++) {
              const cellPlayer = boardRenderer.getCell(playerBoardEl, row, col);
              expect(cellPlayer).toBeTruthy();
              expect(cellPlayer.tagName).toBe('DIV');
              expect(cellPlayer.classList.contains('grid-cell')).toBe(true);
              expect(cellPlayer.classList.contains('coordinate')).toBe(false);
              const cellEnemy = boardRenderer.getCell(enemyBoardEl, row, col);
              expect(cellEnemy).toBeTruthy();
              expect(cellEnemy.tagName).toBe('DIV');
              expect(cellEnemy.classList.contains('grid-cell')).toBe(true);
              expect(cellEnemy.classList.contains('coordinate')).toBe(false);
          }
        }
      });

      describe('getCell - errorCases', () => {
        const errorCases = {
          invalidCoordinates: {
            message: 'Coordinates out of range',
            cases: [
              { row: -1, col: 0, description: 'negative row' },
              { row: 0, col: -1, description: 'negative col' },
              { row: -1, col: -1, description: 'both negative' },
              { row: 10, col: 0, description: 'row out of bounds (10)' },
              { row: 0, col: 10, description: 'col out of bounds (10)' },
              { row: 10, col: 10, description: 'both out of bounds' },
              { row: 15, col: 5, description: 'row far out of bounds' },
              { row: 5, col: 15, description: 'col far out of bounds' },
              { row: 100, col: 100, description: 'extremely out of bounds' }
            ]
          },
          invalidTypes: {
            message: 'Invalid parameter type',
            cases: [
              { row: 'string', col: 0, description: 'row is string' },
              { row: 0, col: 'string', description: 'col is string' },
              { row: null, col: 0, description: 'row is null' },
              { row: 0, col: null, description: 'col is null' },
              { row: undefined, col: 0, description: 'row is undefined' },
              { row: 0, col: undefined, description: 'col is undefined' },
              { row: {}, col: 0, description: 'row is object' },
              { row: 0, col: [], description: 'col is array' },
              { row: true, col: 0, description: 'row is boolean' },
              { row: 0, col: false, description: 'col is boolean' }
            ]
          },
          invalidSpecialNumbers: {
            message: 'Invalid special number',
            cases: [
              { row: NaN, col: 0, description: 'row is NaN' },
              { row: 0, col: NaN, description: 'col is NaN' },
              { row: Infinity, col: 0, description: 'row is Infinity' },
              { row: 0, col: Infinity, description: 'col is Infinity' },
              { row: -Infinity, col: 0, description: 'row is -Infinity' },
              { row: 0, col: -Infinity, description: 'col is -Infinity' }
            ]
          },
          invalidBoards: {
            message: 'Invalid board parameter',
            cases: [
              { board: null, row: 0, col: 0, description: 'board is null' },
              { board: undefined, row: 0, col: 0, description: 'board is undefined' },
              { board: 'string', row: 0, col: 0, description: 'board is string' },
              { board: {}, row: 0, col: 0, description: 'board is plain object' },
              { board: [], row: 0, col: 0, description: 'board is array' },
              { board: 42, row: 0, col: 0, description: 'board is number' },
              { board: true, row: 0, col: 0, description: 'board is boolean' }
            ]
          }
        };

        // Testes organizados por categoria
        Object.entries(errorCases).forEach(([categoryName, { message, cases }]) => {
          describe(`${categoryName} - should throw "${message}"`, () => {
            cases.forEach((testCase) => {
              const { description } = testCase;
              
              test(`${description}`, () => {
                expect(() => {
                  if (categoryName === 'invalidBoards') {
                    const { board, row, col } = testCase;
                    boardRenderer.getCell(board, row, col);
                  } else {
                    const { row, col } = testCase;
                    boardRenderer.getCell(playerBoardEl, row, col);
                  }
                }).toThrow(message);
              });
            });
          });
        });

        // Teste adicional para verificar consistência das mensagens
        describe('Error message consistency', () => {
          test('should always throw the same message for the same error category', () => {
            // invalidCoordinates
            expect(() => boardRenderer.getCell(playerBoardEl, -1, 0))
              .toThrow('Coordinates out of range');
            expect(() => boardRenderer.getCell(playerBoardEl, 10, 5))
              .toThrow('Coordinates out of range');
            
            // invalidTypes
            expect(() => boardRenderer.getCell(playerBoardEl, 'string', 0))
              .toThrow('Invalid parameter type');
            expect(() => boardRenderer.getCell(playerBoardEl, null, 0))
              .toThrow('Invalid parameter type');
            
            // invalidSpecialNumbers
            expect(() => boardRenderer.getCell(playerBoardEl, NaN, 0))
              .toThrow('Invalid special number');
            expect(() => boardRenderer.getCell(playerBoardEl, Infinity, 0))
              .toThrow('Invalid special number');
            
            // invalidBoards
            expect(() => boardRenderer.getCell(null, 0, 0))
              .toThrow('Invalid board parameter');
            expect(() => boardRenderer.getCell({}, 0, 0))
              .toThrow('Invalid board parameter');
          });
        });

        // Teste de performance com erros padronizados
        test('should handle errors efficiently', () => {
          const startTime = performance.now();
          
          const errorTests = [
            () => boardRenderer.getCell(null, 0, 0),
            () => boardRenderer.getCell(playerBoardEl, 'invalid', 0),
            () => boardRenderer.getCell(playerBoardEl, NaN, 0),
            () => boardRenderer.getCell(playerBoardEl, -1, 0)
          ];
          
          errorTests.forEach(test => {
            expect(test).toThrow();
          });
          
          const endTime = performance.now();
          expect(endTime - startTime).toBeLessThan(10);
        });
      });
    })
  })
})