import Gameboard from './Gameboard.js';
import Ship from './Ship.js';

let gameboard;

beforeEach(() => gameboard = new Gameboard());

describe('Gameboard class', () => {
  test('should instantiate correctly', () => {
    expect(gameboard).toBeDefined();
    expect(Array.isArray(gameboard.defenseBoard)).toBe(true);
    expect(Array.isArray(gameboard.missedAttacks)).toBe(true);
    expect(Array.isArray(gameboard.ships)).toBe(true);
  });

  describe('placeShip should place ships correctly', () => {
    const placeShipCases = {
      success: {
        horizontally: [
          { length: 2, row: 0, col: 0, horizontally: true, expectedDescription: 'ship at [0,0], [0,1] should be defined' },
          { length: 3, row: 2, col: 5, horizontally: true, expectedDescription: 'ship at [2,5], [2,6], [2,7] should be defined' },
          { length: 4, row: 4, col: 3, horizontally: true, expectedDescription: 'ship at [4,3], [4,4], [4,5], [4,6] should be defined' },
          { length: 1, row: 6, col: 6, horizontally: true, expectedDescription: 'ship at [6,6] should be defined' },
          { length: 1, row: 9, col: 9, horizontally: true, expectedDescription: 'ship at [9,9] should be defined' },
          { length: 1, row: 0, col: 9, horizontally: true, expectedDescription: 'ship at [0,9] should be defined' },
        ],
        vertically: [
          { length: 2, row: 0, col: 0, horizontally: false, expectedDescription: 'ship at [0,0], [1,0] should be defined' },
          { length: 3, row: 5, col: 3, horizontally: false, expectedDescription: 'ship at [5,3], [6,3], [7,3] should be defined' },
          { length: 4, row: 2, col: 7, horizontally: false, expectedDescription: 'ship at [2,7], [3,7], [4,7], [5,7] should be defined' },
          { length: 1, row: 9, col: 9, horizontally: false, expectedDescription: 'ship at [9,9] should be defined' },
          { length: 3, row: 7, col: 9, horizontally: false, expectedDescription: 'ship at [7,9], [8,9], [9,9]' },
        ]
      },
      error: {
        offLimits: {
          horizontally: [
            { length: 2, row: 0, col: 9, horizontally: true },
            { length: 3, row: 0, col: 8, horizontally: true },
            { length: 5, row: 3, col: 7, horizontally: true },
            { length: 1, row: 0, col: 11, horizontally: true },
            { length: 1, row: 0, col: -11, horizontally: true },
          ],
          vertically: [
            { length: 2, row: 9, col: 0, horizontally: false },
            { length: 3, row: 8, col: 0, horizontally: false },
            { length: 4, row: 7, col: 4, horizontally: false },
            { length: 1, row: 10, col: 0, horizontally: false },
            { length: 1, row: -1, col: 0, horizontally: false },
          ],
          sizeNotAllowed: [
            { length: 11, row: 0, col: 9, horizontally: true },
            { length: -2, row: 0, col: 9, horizontally: true },
          ]
        },
        typeError: [
          { length: '3', row: 0, col: null, horizontally: true },
          { length: 3, row: 0, col: null, horizontally: true },
          { length: 3, row: 0, col: 0, horizontally: 'true' },
        ],
        missingValues: [
            { length: undefined, row: 0, col: 9, missingValue: 'length' },
            { length: 3, row: undefined, col: 4, missingValue: 'row' },
            { length: 3, row: 2, col: undefined, missingValue: 'col' },
        ],
        overlappingShip: [
          {
            first: { length: 3, row: 2, col: 2, horizontally: true },
            overlap: { length: 2, row: 2, col: 3, horizontally: true },
            description: 'should throw when overlapping horizontally'
          },
          {
            first: { length: 3, row: 5, col: 5, horizontally: false },
            overlap: { length: 2, row: 6, col: 5, horizontally: false },
            description: 'should throw when overlapping vertically'
          },
          {
            first: { length: 2, row: 0, col: 0, horizontally: true },
            overlap: { length: 2, row: 0, col: 0, horizontally: false },
            description: 'should throw when overlapping on same cell [0,0]'
          }
        ]
      }
    };

    describe('Success cases', () => {
      const {success} = placeShipCases;
      describe('Horizontally', () => {
        success.horizontally.forEach(({ length, row, col, horizontally, expectedDescription }) => {
          const ship = new Ship(length);
          const testTitle = `placeShip(${ship.type} of length ${ship.length}, ${row}, ${col}, ${horizontally}): ${expectedDescription}`;
          test(testTitle, () => {
            gameboard.placeShip(ship, row, col, horizontally);
            for (let i = col; i < (length + col); i++) {
              expect(gameboard.defenseBoard[row][i].ship).toBeDefined();
              // Test if same ship object
              expect(gameboard.defenseBoard[row][i].ship).toBe(ship);
            }
          })
        })
      });
      describe('Vertically', () => {
        success.vertically.forEach(({ length, row, col, horizontally, expectedDescription }) => {
          const ship = new Ship(length);
          const testTitle = `placeShip(${ship.type} of length ${ship.length}, ${row}, ${col}, ${horizontally}): ${expectedDescription}`;
          test(testTitle, () => {
            gameboard.placeShip(ship, row, col, horizontally);
            for (let i = row; i < (length + row); i++) {
              expect(gameboard.defenseBoard[i][col].ship).toBeDefined();
              // Test if same ship object
              expect(gameboard.defenseBoard[i][col].ship).toBe(ship);
            }
          })
        })
      })
    });

    describe('Error cases', () => {
      const { error } = placeShipCases;
      describe('Off limits', () => {
        const { offLimits } = error;
        describe('Horizontally', () => {
          offLimits.horizontally.forEach(({ length, row, col, horizontally }) => {
            const ship = new Ship(length);
            const testTitle = `placeShip(${ship.type}, ${row}, ${col}, ${horizontally}): should throw`;
            test(testTitle, () => expect(() => gameboard.placeShip(ship, row, col, horizontally)).toThrow('Off limits!'));
          });
        });
        describe('Vertically', () => {
          offLimits.vertically.forEach(({ length, row, col, horizontally }) => {
            const ship = new Ship(length);
            const testTitle = `placeShip(${ship.type}, ${row}, ${col}, ${horizontally}): should throw`;
            test(testTitle, () => expect(() => gameboard.placeShip(ship, row, col, horizontally)).toThrow('Off limits!'));
          })
        });
      });
      describe('Overlapping ships', () => {
        error.overlappingShip.forEach(({ first, overlap, description }) => {
          test(description, () => {
            const { length: firstShipLength, ...firstShipOtherProps } = first;
            const firstShip = new Ship(firstShipLength);
            const { length: secondShipLength, ...secondShipOtherProps } = overlap;
            const secondShip = new Ship(secondShipLength);
            gameboard.placeShip(firstShip, ...Object.values(firstShipOtherProps));
            expect(() => gameboard.placeShip(secondShip, ...Object.values(secondShipOtherProps))).toThrow('Position already occupied!');
          })
        })
      })
    })
  });

  describe('receiveAttack', () => {
    const receiveAttackCases = {
      success: {
        hit: [
          { 
            shipPosition: { length: 2, row: 0, col: 0, horizontally: true },
            attackCoordinates: { row: 0, col: 0 },
          },
          {
            shipPosition: { length: 3, row: 4, col: 4, horizontally: true },
            attackCoordinates: { row: 4, col: 5 }, // meio do navio horizontal
          },
          {
            shipPosition: { length: 4, row: 6, col: 2, horizontally: true },
            attackCoordinates: { row: 6, col: 5 }, // último segmento
          },
          {
            shipPosition: { length: 2, row: 1, col: 1, horizontally: false },
            attackCoordinates: { row: 2, col: 1 }, // vertical, segundo segmento
          },
          {
            shipPosition: { length: 3, row: 7, col: 3, horizontally: false },
            attackCoordinates: { row: 7, col: 3 }, // vertical, primeiro segmento
          },
          {
            shipPosition: { length: 1, row: 9, col: 9, horizontally: true },
            attackCoordinates: { row: 9, col: 9 }, // navio de tamanho 1
          }
        ],
        noHit: [
            {
              shipPosition: { length: 2, row: 0, col: 0, horizontally: true },
              attackCoordinates: { row: 5, col: 5 }, // célula vazia distante
            },
            {
              shipPosition: { length: 3, row: 4, col: 4, horizontally: true },
              attackCoordinates: { row: 4, col: 1 }, // mesma linha, mas fora do navio
            },
            {
              shipPosition: { length: 1, row: 9, col: 9, horizontally: true },
              attackCoordinates: { row: 8, col: 9 }, // logo acima do navio
            },
            {
              shipPosition: { length: 3, row: 6, col: 2, horizontally: false },
              attackCoordinates: { row: 9, col: 2 }, // logo abaixo do navio vertical
            },
            {
              shipPosition: { length: 4, row: 2, col: 2, horizontally: true },
              attackCoordinates: { row: 3, col: 2 }, // mesma coluna, mas linha diferente
            },
          ],
      },
      error: {
        type: [
          { row: -1, col: 0, description: 'row is negative' },
          { row: 0, col: -1, description: 'col is negative' },
          { row: 10, col: 5, description: 'row is out of bounds' },
          { row: 4, col: 10, description: 'col is out of bounds' },
          { row: undefined, col: 0, description: 'row is undefined' },
          { row: 0, col: null, description: 'col is null' },
          { row: '2', col: 2, description: 'row is string' },
          { row: 2, col: '2', description: 'col is string' },
        ],
      } 
    };

    function placeMockShip({ gameboard, length, row, col, horizontally, mockShip }) {
      if(horizontally) {
        for (let i = col; i < (length + col); i++) {
          gameboard.defenseBoard[row][i].ship = mockShip;
        }
      } else {
        for (let i = row; i < (length + row); i++) {
          gameboard.defenseBoard[i][col].ship = mockShip;
        }
      }
    }

    describe('Success cases', () => {
      describe('hit', () => {
        receiveAttackCases.success.hit.forEach(({ shipPosition, attackCoordinates }, index) => {
          test(`case ${index}: should trigger ship.hit()`, () => {
            const { length, row, col, horizontally } = shipPosition;
            const { row: attackRow, col: attackCol } = attackCoordinates;
  
            const mockShip = { hit: jest.fn() };
  
            // Position mockShip manually. Can't use placeShip, or it will create an actual instance of Ship
            placeMockShip({ gameboard, length, row, col, horizontally, mockShip });
  
            gameboard.receiveAttack(attackRow, attackCol);
            expect(mockShip.hit).toHaveBeenCalled();
          })
        })
      });
  
      describe('no hit', () => {
        receiveAttackCases.success.noHit.forEach(({ shipPosition, attackCoordinates }, index) => {
          test(`case ${index}: should not trigger ship.hit()`, () => {
            const { length, row, col, horizontally } = shipPosition;
            const { row: attackRow, col: attackCol } = attackCoordinates;
  
            const mockShip = { hit: jest.fn() };
  
            // Position mockShip manually. Can't use placeShip, or it will create an actual instance of Ship
            placeMockShip({ gameboard, length, row, col, horizontally, mockShip });
  
            gameboard.receiveAttack(attackRow, attackCol);
            expect(mockShip.hit).not.toHaveBeenCalled();
          });

          test(`case ${index}: should push attackCoordinates into gameboard.missedAttacks`, () => {
            const { length, row, col, horizontally } = shipPosition;
            const { row: attackRow, col: attackCol } = attackCoordinates;
  
            const mockShip = { hit: jest.fn() };
  
            // Position mockShip manually. Can't use placeShip, or it will create an actual instance of Ship
            placeMockShip({ gameboard, length, row, col, horizontally, mockShip });
  
            gameboard.receiveAttack(attackRow, attackCol);
            expect(gameboard.missedAttacks).toEqual([[attackRow, attackCol]]);
          })
        })
      });
    });

    describe('Error cases', () => {
      receiveAttackCases.error.type.forEach(({ row, col, description }) => {
        test(`${description} should throw`, () => {
          expect(() => gameboard.receiveAttack(row, col)).toThrow();
        })
      })
    })
  });

  describe('allShipsSunk method', () => {
    const allShipsSunkCases = {
      allSunk: [
        {
          ships: [
            { length: 1, row: 0, col: 0, horizontally: true }
          ],
          attacksReceived: [
            { row: 0, col: 0}
          ]
        },
        // Dois navios pequenos em posições distintas
        {
          ships: [
            { length: 1, row: 0, col: 0, horizontally: true },
            { length: 1, row: 5, col: 5, horizontally: true }
          ],
          attacksReceived: [
            { row: 0, col: 0 },
            { row: 5, col: 5 }
          ]
        },
        // Um navio horizontal e um vertical
        {
          ships: [
            { length: 2, row: 1, col: 1, horizontally: true },  // [1,1] e [1,2]
            { length: 3, row: 4, col: 4, horizontally: false }  // [4,4], [5,4], [6,4]
          ],
          attacksReceived: [
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 4, col: 4 },
            { row: 5, col: 4 },
            { row: 6, col: 4 }
          ]
        },
        // Navios de tamanhos variados
        {
          ships: [
            { length: 4, row: 0, col: 0, horizontally: true }, // [0,0] a [0,3]
            { length: 1, row: 9, col: 9, horizontally: true }  // [9,9]
          ],
          attacksReceived: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 9, col: 9 }
          ]
        }
      ],
      notAllSunk: [
        // 1. Um navio foi atingido parcialmente
        {
          ships: [
            { length: 3, row: 0, col: 0, horizontally: true }
          ],
          attacksReceived: [
            { row: 0, col: 0 },
            { row: 0, col: 1 }
          ],
          description: 'should return false when ship was only partially hit'
        },
        // 2. Dois navios — apenas um afundado
        {
          ships: [
            { length: 1, row: 1, col: 1, horizontally: true },
            { length: 2, row: 3, col: 3, horizontally: true }
          ],
          attacksReceived: [
            { row: 1, col: 1 },  // navio 1 afundado
            { row: 3, col: 3 }   // navio 2 parcialmente atingido
          ],
          description: 'should return false when one ship remains partially intact'
        },
        // 3. Nenhum navio foi atingido
        {
          ships: [
            { length: 2, row: 0, col: 0, horizontally: true },
            { length: 3, row: 2, col: 2, horizontally: false }
          ],
          attacksReceived: [
            { row: 9, col: 9 }, // ataque completamente fora
            { row: 4, col: 4 }
          ],
          description: 'should return false when no ships were hit'
        },
        // 4. Um dos navios está afundado, o outro não recebeu ataque
        {
          ships: [
            { length: 1, row: 1, col: 1, horizontally: true },
            { length: 2, row: 5, col: 5, horizontally: false }
          ],
          attacksReceived: [
            { row: 1, col: 1 } // só o primeiro afundado
          ],
          description: 'should return false when one ship was not touched'
        }
      ],
      errors: [
        {
          ships: [],  // Nenhum navio colocado
          attacksReceived: [],
          description: 'should throw if no ships were placed',
          errorMsg: 'No ships on gameboard!'
        }
      ]
    };

    describe('all ships sunk', () => {
      allShipsSunkCases.allSunk.forEach(({ ships, attacksReceived }, index) => {
        test(`case ${index} should return true`, () => {
          ships.forEach((ship) => gameboard.placeShip(...Object.values(ship)));
          attacksReceived.forEach(({ row, col }) => gameboard.receiveAttack(row, col));
          expect(gameboard.allShipsSunk()).toBe(true);
        })
      })
    });

    describe('not all ships sunk', () => {
      allShipsSunkCases.notAllSunk.forEach(({ ships, attacksReceived, description }) => {
        test(description, () => {
          ships.forEach((ship) => gameboard.placeShip(...Object.values(ship)));
          attacksReceived.forEach(({ row, col }) => gameboard.receiveAttack(row, col));
          expect(gameboard.allShipsSunk()).toBe(false);
        })
      })
    })

    describe('error cases', () => {
      allShipsSunkCases.errors.forEach(({ ships, attacksReceived, description, errorMsg }) => {
        test(description, () => {
          ships.forEach((ship) => gameboard.placeShip(...Object.values(ship)));
          attacksReceived.forEach(({ row, col }) => gameboard.receiveAttack(row, col));
          expect(() => gameboard.allShipsSunk()).toThrow(errorMsg);
        })
      })
    })
  });

  describe('resetGameboard method', () => {
    test('should reset defenseBoard to initial state', () => {
      // Arrange: modify the board first
      gameboard.placeShip(3, 2, 2, true);
      gameboard.receiveAttack(5, 5); // miss
      gameboard.receiveAttack(2, 2); // hit
      
      // Act
      gameboard.resetGameboard();
      
      // Assert: check that defenseBoard is back to initial state
      expect(gameboard.defenseBoard).toHaveLength(10);
      expect(gameboard.defenseBoard[0]).toHaveLength(10);
      
      // Verify all cells are reset
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          expect(gameboard.defenseBoard[row][col]).toEqual({
            ship: null,
            hitTaken: false
          });
        }
      }
    });

    test('should clear missedAttacks array', () => {
      // Arrange: add some missed attacks
      gameboard.placeShip(2, 0, 0, true);
      gameboard.receiveAttack(5, 5); // miss
      gameboard.receiveAttack(7, 3); // miss
      gameboard.receiveAttack(9, 9); // miss
      
      expect(gameboard.missedAttacks).toHaveLength(3);
      
      // Act
      gameboard.resetGameboard();
      
      // Assert
      expect(gameboard.missedAttacks).toEqual([]);
      expect(gameboard.missedAttacks).toHaveLength(0);
    });

    test('should clear ships array', () => {
      // Arrange: place multiple ships
      const ship1 = gameboard.placeShip(4, 0, 0, true);
      const ship2 = gameboard.placeShip(3, 2, 2, false);
      const ship3 = gameboard.placeShip(2, 5, 5, true);
      const ship4 = gameboard.placeShip(1, 9, 9, true);
      
      expect(gameboard.ships).toHaveLength(4);
      expect(gameboard.ships).toContain(ship1);
      expect(gameboard.ships).toContain(ship2);
      expect(gameboard.ships).toContain(ship3);
      expect(gameboard.ships).toContain(ship4);
      
      // Act
      gameboard.resetGameboard();
      
      // Assert
      expect(gameboard.ships).toEqual([]);
      expect(gameboard.ships).toHaveLength(0);
    });

    test('should completely reset a complex game state', () => {
      // Arrange: create a complex game state
      // Place ships
      const ship1 = gameboard.placeShip(4, 0, 0, true);   // [0,0] to [0,3]
      const ship2 = gameboard.placeShip(3, 2, 2, false);  // [2,2] to [4,2]
      const ship3 = gameboard.placeShip(2, 6, 6, true);   // [6,6] to [6,7]
      const ship4 = gameboard.placeShip(1, 9, 9, true);   // [9,9]
      
      // Make attacks (hits and misses)
      gameboard.receiveAttack(0, 0); // hit ship1
      gameboard.receiveAttack(0, 1); // hit ship1
      gameboard.receiveAttack(2, 2); // hit ship2
      gameboard.receiveAttack(6, 6); // hit ship3
      gameboard.receiveAttack(9, 9); // hit ship4 (sunk)
      
      gameboard.receiveAttack(1, 1); // miss
      gameboard.receiveAttack(3, 3); // miss
      gameboard.receiveAttack(5, 5); // miss
      gameboard.receiveAttack(8, 8); // miss
      
      // Verify complex state exists
      expect(gameboard.ships).toHaveLength(4);
      expect(gameboard.missedAttacks).toHaveLength(4);
      expect(gameboard.defenseBoard[0][0].ship).toBe(ship1);
      expect(gameboard.defenseBoard[2][2].ship).toBe(ship2);
      
      // Act
      gameboard.resetGameboard();
      
      // Assert: everything should be reset
      expect(gameboard.ships).toEqual([]);
      expect(gameboard.missedAttacks).toEqual([]);
      
      // Verify all board positions are reset
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          expect(gameboard.defenseBoard[row][col]).toEqual({
            ship: null,
            hitTaken: false
          });
        }
      }
    });

    test('should allow placing new ships after reset', () => {
      // Arrange: fill board with ships
      gameboard.placeShip(4, 0, 0, true);
      gameboard.placeShip(3, 2, 2, false);
      gameboard.placeShip(2, 6, 6, true);
      
      // Act: reset and place new ships
      gameboard.resetGameboard();
      
      // Assert: should be able to place ships in previously occupied positions
      expect(() => {
        gameboard.placeShip(5, 0, 0, true);  // Same position as before
        gameboard.placeShip(3, 2, 2, true);  // Same starting position, different orientation
        gameboard.placeShip(1, 6, 6, false); // Same position, different orientation
      }).not.toThrow();
      
      expect(gameboard.ships).toHaveLength(3);
      expect(gameboard.defenseBoard[0][0].ship).toBeDefined();
      expect(gameboard.defenseBoard[2][2].ship).toBeDefined();
      expect(gameboard.defenseBoard[6][6].ship).toBeDefined();
    });

    test('should reset even when called on empty gameboard', () => {
      // Arrange: start with fresh gameboard (no ships, no attacks)
      const initialShipsLength = gameboard.ships.length;
      const initialMissedAttacksLength = gameboard.missedAttacks.length;
      
      expect(initialShipsLength).toBe(0);
      expect(initialMissedAttacksLength).toBe(0);
      
      // Act
      gameboard.resetGameboard();
      
      // Assert: should still work without errors
      expect(gameboard.ships).toEqual([]);
      expect(gameboard.missedAttacks).toEqual([]);
      expect(gameboard.defenseBoard).toHaveLength(10);
      expect(gameboard.defenseBoard[0]).toHaveLength(10);
    });

    test('should reset hitTaken property for all cells', () => {
      // Arrange: place ship and attack it
      gameboard.placeShip(3, 1, 1, true);
      gameboard.receiveAttack(1, 1); // hit
      
      // Manually set hitTaken to true for testing
      gameboard.defenseBoard[1][1].hitTaken = true;
      gameboard.defenseBoard[5][5].hitTaken = true;
      
      // Act
      gameboard.resetGameboard();
      
      // Assert: all hitTaken should be false
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          expect(gameboard.defenseBoard[row][col].hitTaken).toBe(false);
        }
      }
    });

    test('should be idempotent - multiple calls should have same effect', () => {
      // Arrange: create some state
      gameboard.placeShip(2, 0, 0, true);
      gameboard.receiveAttack(5, 5);
      
      // Act: call reset multiple times
      gameboard.resetGameboard();
      gameboard.resetGameboard();
      gameboard.resetGameboard();
      
      // Assert: should be same as calling once
      expect(gameboard.ships).toEqual([]);
      expect(gameboard.missedAttacks).toEqual([]);
      
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          expect(gameboard.defenseBoard[row][col]).toEqual({
            ship: null,
            hitTaken: false
          });
        }
      }
    });

    test('should maintain board dimensions after reset', () => {
      // Arrange: place ships and attacks
      gameboard.placeShip(4, 0, 0, true);
      gameboard.receiveAttack(5, 5);
      
      // Act
      gameboard.resetGameboard();
      
      // Assert: board should maintain 10x10 dimensions
      expect(gameboard.defenseBoard).toHaveLength(10);
      gameboard.defenseBoard.forEach(row => {
        expect(row).toHaveLength(10);
      });
    });

  });
})