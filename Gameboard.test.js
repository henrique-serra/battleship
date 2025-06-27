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

  describe('removeShip', () => {
    const removeShipCases = {
      success: [
        {
          ships: [
            { shipIndex: 0, row: 0, col: 0, horizontally: true },
            { shipIndex: 1, row: 1, col: 0, horizontally: true },
            { shipIndex: 2, row: 2, col: 0, horizontally: true },
            { shipIndex: 3, row: 3, col: 0, horizontally: true },
            { shipIndex: 4, row: 4, col: 0, horizontally: true },
          ]
        },
        {
          ships: [
            { shipIndex: 0, row: 0, col: 0, horizontally: false },
            { shipIndex: 1, row: 0, col: 1, horizontally: false },
            { shipIndex: 2, row: 0, col: 2, horizontally: false },
            { shipIndex: 3, row: 0, col: 3, horizontally: false },
            { shipIndex: 4, row: 0, col: 4, horizontally: false },
          ]
        }
      ],
    }

    test('ship.positions should have length 0', () => {
      removeShipCases.success.forEach(({ ships }) => {
        ships.forEach((ship) => {
          const { shipIndex, ...otherProps } = ship;
          const gameboardShip = gameboard.ships[shipIndex];
          gameboard.placeShip(gameboardShip, ...Object.values(otherProps));
          // Before removal
          expect(gameboardShip.positions).toHaveLength(gameboardShip.length);
          // Removal
          gameboard.removeShip(gameboardShip);
          expect(gameboardShip.positions).toHaveLength(0);
        });
      })
    });

    test('defenseBoard should reflect removal of ship', () => {
      removeShipCases.success.forEach(({ ships }) => {
        ships.forEach(({ shipIndex, row, col, horizontally }) => {
          const ship = gameboard.ships[shipIndex];
          gameboard.placeShip(ship, row, col, horizontally);
          const { positions } = ship;
          // Removal
          gameboard.removeShip(ship);
          positions.forEach(([r, c]) => {
            expect(gameboard.defenseBoard[r][c].ship).toBeNull();
            expect(gameboard.defenseBoard[r][c].hitTaken).toBe(false);
          })
        })
      })
    });

    test('should handle ship not on gameboard', () => {
      const ship = new Ship(2);
      
      expect(() => {
        gameboard.removeShip(ship);
      }).toThrow('Ship not found on gameboard');
    });

    test('should handle already removed ship', () => {
      const ship = gameboard.ships[0];
      gameboard.placeShip(ship, 0, 0, true);
      
      gameboard.removeShip(ship);
      
      expect(() => {
        gameboard.removeShip(ship);
      }).toThrow('Ship not found on gameboard');
    });
  })

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
        // Caso 0: Todos os 5 navios posicionados em linha horizontal
        {
          ships: [
            { shipIndex: 0, row: 0, col: 0, horizontally: true }, // length 1: [0,0]
            { shipIndex: 1, row: 1, col: 0, horizontally: true }, // length 2: [1,0], [1,1]
            { shipIndex: 2, row: 2, col: 0, horizontally: true }, // length 3: [2,0], [2,1], [2,2]
            { shipIndex: 3, row: 3, col: 0, horizontally: true }, // length 4: [3,0], [3,1], [3,2], [3,3]
            { shipIndex: 4, row: 4, col: 0, horizontally: true }  // length 5: [4,0], [4,1], [4,2], [4,3], [4,4]
          ],
          attacksReceived: [
            // Afundar navio length 1
            { row: 0, col: 0 },
            // Afundar navio length 2
            { row: 1, col: 0 }, { row: 1, col: 1 },
            // Afundar navio length 3
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
            // Afundar navio length 4
            { row: 3, col: 0 }, { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 },
            // Afundar navio length 5
            { row: 4, col: 0 }, { row: 4, col: 1 }, { row: 4, col: 2 }, { row: 4, col: 3 }, { row: 4, col: 4 }
          ]
        },
        
        // Caso 1: Navios em posições espalhadas (horizontal e vertical)
        {
          ships: [
            { shipIndex: 0, row: 0, col: 0, horizontally: true },  // length 1: [0,0]
            { shipIndex: 1, row: 2, col: 2, horizontally: false }, // length 2: [2,2], [3,2]
            { shipIndex: 2, row: 5, col: 5, horizontally: true },  // length 3: [5,5], [5,6], [5,7]
            { shipIndex: 3, row: 6, col: 0, horizontally: false }, // length 4: [6,0], [7,0], [8,0], [9,0]
            { shipIndex: 4, row: 0, col: 5, horizontally: true }   // length 5: [0,5], [0,6], [0,7], [0,8], [0,9]
          ],
          attacksReceived: [
            // Afundar todos os navios
            { row: 0, col: 0 },                                           // length 1
            { row: 2, col: 2 }, { row: 3, col: 2 },                     // length 2
            { row: 5, col: 5 }, { row: 5, col: 6 }, { row: 5, col: 7 }, // length 3
            { row: 6, col: 0 }, { row: 7, col: 0 }, { row: 8, col: 0 }, { row: 9, col: 0 }, // length 4
            { row: 0, col: 5 }, { row: 0, col: 6 }, { row: 0, col: 7 }, { row: 0, col: 8 }, { row: 0, col: 9 } // length 5
          ]
        },
        
        // Caso 2: Posicionamento em cantos e extremos
        {
          ships: [
            { shipIndex: 0, row: 9, col: 9, horizontally: true },  // length 1: [9,9]
            { shipIndex: 1, row: 0, col: 8, horizontally: true },  // length 2: [0,8], [0,9]
            { shipIndex: 2, row: 7, col: 0, horizontally: false }, // length 3: [7,0], [8,0], [9,0]
            { shipIndex: 3, row: 0, col: 0, horizontally: true },  // length 4: [0,0], [0,1], [0,2], [0,3]
            { shipIndex: 4, row: 2, col: 5, horizontally: false }  // length 5: [2,5], [3,5], [4,5], [5,5], [6,5]
          ],
          attacksReceived: [
            // Afundar todos
            { row: 9, col: 9 },
            { row: 0, col: 8 }, { row: 0, col: 9 },
            { row: 7, col: 0 }, { row: 8, col: 0 }, { row: 9, col: 0 },
            { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 },
            { row: 2, col: 5 }, { row: 3, col: 5 }, { row: 4, col: 5 }, { row: 5, col: 5 }, { row: 6, col: 5 }
          ]
        }
      ],
      
      notAllSunk: [
        // 1. Apenas um navio completamente afundado
        {
          ships: [
            { shipIndex: 0, row: 0, col: 0, horizontally: true }, // length 1
            { shipIndex: 1, row: 2, col: 2, horizontally: true }, // length 2
            { shipIndex: 2, row: 4, col: 4, horizontally: true }, // length 3
            { shipIndex: 3, row: 6, col: 0, horizontally: true }, // length 4
            { shipIndex: 4, row: 8, col: 0, horizontally: true }  // length 5
          ],
          attacksReceived: [
            { row: 0, col: 0 } // Só o menor navio afundado
          ],
          description: 'should return false when only one ship is sunk'
        },
        
        // 2. Vários navios com danos parciais
        {
          ships: [
            { shipIndex: 0, row: 0, col: 0, horizontally: true }, // length 1
            { shipIndex: 1, row: 2, col: 2, horizontally: true }, // length 2
            { shipIndex: 2, row: 4, col: 4, horizontally: true }, // length 3
            { shipIndex: 3, row: 6, col: 0, horizontally: true }, // length 4
            { shipIndex: 4, row: 8, col: 0, horizontally: true }  // length 5
          ],
          attacksReceived: [
            { row: 0, col: 0 },           // length 1 afundado
            { row: 2, col: 2 },           // length 2 parcialmente atingido
            { row: 4, col: 4 }, { row: 4, col: 5 }, // length 3 parcialmente atingido
            { row: 6, col: 0 }, { row: 6, col: 1 }, { row: 6, col: 2 }, // length 4 parcialmente atingido
            { row: 8, col: 0 }, { row: 8, col: 1 }, { row: 8, col: 2 }, { row: 8, col: 3 } // length 5 parcialmente atingido
          ],
          description: 'should return false when ships have partial damage'
        },
        
        // 3. Nenhum navio atingido
        {
          ships: [
            { shipIndex: 0, row: 0, col: 0, horizontally: true },
            { shipIndex: 1, row: 2, col: 2, horizontally: true },
            { shipIndex: 2, row: 4, col: 4, horizontally: true },
            { shipIndex: 3, row: 6, col: 0, horizontally: true },
            { shipIndex: 4, row: 8, col: 0, horizontally: true }
          ],
          attacksReceived: [
            { row: 1, col: 1 }, { row: 3, col: 3 }, { row: 5, col: 5 } // Todos os ataques erram
          ],
          description: 'should return false when no ships are hit'
        },
        
        // 4. Quase todos afundados, mas não todos
        {
          ships: [
            { shipIndex: 0, row: 0, col: 0, horizontally: true }, // length 1
            { shipIndex: 1, row: 2, col: 2, horizontally: true }, // length 2
            { shipIndex: 2, row: 4, col: 4, horizontally: true }, // length 3
            { shipIndex: 3, row: 6, col: 0, horizontally: true }, // length 4
            { shipIndex: 4, row: 8, col: 0, horizontally: true }  // length 5
          ],
          attacksReceived: [
            // Afundar os 4 primeiros navios
            { row: 0, col: 0 },
            { row: 2, col: 2 }, { row: 2, col: 3 },
            { row: 4, col: 4 }, { row: 4, col: 5 }, { row: 4, col: 6 },
            { row: 6, col: 0 }, { row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 },
            // Deixar o último navio (length 5) parcialmente atingido
            { row: 8, col: 0 }, { row: 8, col: 1 }, { row: 8, col: 2 }, { row: 8, col: 3 }
            // Falta { row: 8, col: 4 } para afundar completamente
          ],
          description: 'should return false when one ship remains partially intact'
        }
      ],
    };

    describe('all ships sunk', () => {
      allShipsSunkCases.allSunk.forEach(({ ships, attacksReceived }, index) => {
        test(`case ${index} should return true`, () => {
          ships.forEach(({ shipIndex, row, col, horizontally }) => {
            const ship = gameboard.ships[shipIndex];
            gameboard.placeShip(ship, row, col, horizontally);
          });
          attacksReceived.forEach(({ row, col }) => gameboard.receiveAttack(row, col));
          expect(gameboard.allShipsSunk()).toBe(true);
        })
      })
    });

    describe('not all ships sunk', () => {
      allShipsSunkCases.notAllSunk.forEach(({ ships, attacksReceived, description }) => {
        test(description, () => {
          ships.forEach(({ shipIndex, row, col, horizontally }) => gameboard.placeShip(gameboard.ships[shipIndex], row, col, horizontally));
          attacksReceived.forEach(({ row, col }) => gameboard.receiveAttack(row, col));
          expect(gameboard.allShipsSunk()).toBe(false);
        })
      })
    })
  });

  describe('resetGameboard method', () => {
    test('should reset defenseBoard to initial state', () => {
      // Arrange: modify the board first
      gameboard.placeShip(gameboard.ships[2], 2, 2, true);
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
      gameboard.placeShip(gameboard.ships[1], 0, 0, true);
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

    test('should replace ships in ships array for new ships', () => {
      // Arrange: place multiple ships
      const ship1 = gameboard.ships[0];
      const ship2 = gameboard.ships[1];
      const ship3 = gameboard.ships[2];
      const ship4 = gameboard.ships[3];
      const ship5 = gameboard.ships[4];
      
      gameboard.placeShip(ship1, 0, 0, true);
      gameboard.placeShip(ship2, 2, 2, false);
      gameboard.placeShip(ship3, 5, 5, true);
      gameboard.placeShip(ship4, 1, 1, false);
      gameboard.placeShip(ship5, 9, 0, true);
      
      // Act
      gameboard.resetGameboard();
      
      // Assert
      expect(gameboard.ships[0]).not.toBe(ship1);
      expect(gameboard.ships[1]).not.toBe(ship2);
      expect(gameboard.ships[2]).not.toBe(ship3);
      expect(gameboard.ships[3]).not.toBe(ship4);
      expect(gameboard.ships[4]).not.toBe(ship5);

      expect(gameboard.ships).toHaveLength(5);

      gameboard.ships.forEach((ship, index) => {
        expect(ship.hits).toBe(0);
        expect(ship.sunk).toBe(false);
        expect(ship.positions).toHaveLength(0);
        expect(index).toBe(ship.length - 1);
      });
    });

    test('should completely reset a complex game state', () => {
      // Arrange: create a complex game state
      // Place ships using predefined ships from constructor (ordered by size)
      const ship1 = gameboard.ships[0]; // length 1
      const ship2 = gameboard.ships[1]; // length 2
      const ship3 = gameboard.ships[2]; // length 3
      const ship4 = gameboard.ships[3]; // length 4
      const ship5 = gameboard.ships[4]; // length 5
      
      gameboard.placeShip(ship1, 9, 9, true);   // [9,9]
      gameboard.placeShip(ship2, 6, 6, true);   // [6,6] to [6,7]
      gameboard.placeShip(ship3, 2, 2, false);  // [2,2] to [4,2]
      gameboard.placeShip(ship4, 0, 0, true);   // [0,0] to [0,3]
      gameboard.placeShip(ship5, 5, 0, true);   // [5,0] to [5,4]
      
      // Make attacks (hits and misses)
      gameboard.receiveAttack(0, 0); // hit ship4
      gameboard.receiveAttack(0, 1); // hit ship4
      gameboard.receiveAttack(2, 2); // hit ship3
      gameboard.receiveAttack(6, 6); // hit ship2
      gameboard.receiveAttack(9, 9); // hit ship1 (sunk)
      gameboard.receiveAttack(5, 0); // hit ship5
      
      gameboard.receiveAttack(1, 1); // miss
      gameboard.receiveAttack(3, 3); // miss
      gameboard.receiveAttack(5, 5); // miss
      gameboard.receiveAttack(8, 8); // miss
      
      // Verify complex state exists
      expect(gameboard.ships).toHaveLength(5); // All 5 ships should be placed
      expect(gameboard.missedAttacks).toHaveLength(4);
      expect(gameboard.defenseBoard[9][9].ship).toBe(ship1);
      expect(gameboard.defenseBoard[6][6].ship).toBe(ship2);
      expect(gameboard.defenseBoard[2][2].ship).toBe(ship3);
      expect(gameboard.defenseBoard[0][0].ship).toBe(ship4);
      expect(gameboard.defenseBoard[5][0].ship).toBe(ship5);
      
      // Act
      gameboard.resetGameboard();
      
      // Assert
      expect(gameboard.ships[0]).not.toBe(ship1);
      expect(gameboard.ships[1]).not.toBe(ship2);
      expect(gameboard.ships[2]).not.toBe(ship3);
      expect(gameboard.ships[3]).not.toBe(ship4);
      expect(gameboard.ships[4]).not.toBe(ship5);

      expect(gameboard.ships).toHaveLength(5);

      gameboard.ships.forEach((ship, index) => {
        expect(ship.hits).toBe(0);
        expect(ship.sunk).toBe(false);
        expect(ship.positions).toHaveLength(0);
        expect(index).toBe(ship.length - 1);
      });
      
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

    test('should reset hitTaken property for all cells', () => {
      // Arrange: place ship and attack it
      gameboard.placeShip(gameboard.ships[2], 1, 1, true);
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
      gameboard.placeShip(gameboard.ships[1], 0, 0, true);
      gameboard.receiveAttack(5, 5);
      
      // Act: call reset multiple times
      gameboard.resetGameboard();
      gameboard.resetGameboard();
      gameboard.resetGameboard();
      
      expect(gameboard.ships).toHaveLength(5);

      gameboard.ships.forEach((ship, index) => {
        expect(ship.hits).toBe(0);
        expect(ship.sunk).toBe(false);
        expect(ship.positions).toHaveLength(0);
        expect(index).toBe(ship.length - 1);
      });
      
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
      gameboard.placeShip(gameboard.ships[3], 0, 0, true);
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