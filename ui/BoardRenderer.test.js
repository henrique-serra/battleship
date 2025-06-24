/**
 * @jest-environment jsdom
 */

import { error } from 'console';
import BoardRenderer from './BoardRenderer.js';
import { readFileSync } from 'fs';
import { join } from 'path';

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
  })

  test('should find DOM elements', () => {
    expect(boardRenderer.playerContainer).toBeDefined();
    expect(boardRenderer.opponentContainer).toBeDefined();
  });

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
  })

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