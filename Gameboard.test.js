import Gameboard from './Gameboard.js';

let gameboard;

describe('Gameboard class', () => {
  beforeEach(() => gameboard = new Gameboard());
  test('should instantiate correctly', () => {
    expect(gameboard).toBeDefined();
    expect(Array.isArray(gameboard.defenseBoard)).toBe(true);
    expect(Array.isArray(gameboard.attacks)).toBe(true);
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
          const testTitle = `placeShip(${length}, ${row}, ${col}, ${horizontally}): ${expectedDescription}`;
          test(testTitle, () => {
            gameboard.placeShip(length, row, col, horizontally);
            const ship = gameboard.defenseBoard[row][col].ship;
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
          const testTitle = `placeShip(${length}, ${row}, ${col}, ${horizontally}): ${expectedDescription}`;
          test(testTitle, () => {
            gameboard.placeShip(length, row, col, horizontally);
            const ship = gameboard.defenseBoard[row][col].ship;
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
            const testTitle = `placeShip(${length}, ${row}, ${col}, ${horizontally}): should throw`;
            test(testTitle, () => expect(() => gameboard.placeShip(length, row, col, horizontally)).toThrow('Off limits!'));
          });
        });
        describe('Vertically', () => {
          offLimits.vertically.forEach(({ length, row, col, horizontally }) => {
            const testTitle = `placeShip(${length}, ${row}, ${col}, ${horizontally}): should throw`;
            test(testTitle, () => expect(() => gameboard.placeShip(length, row, col, horizontally)).toThrow('Off limits!'));
          })
        });
        describe('Size not allowed', () => {
          offLimits.sizeNotAllowed.forEach(({ length, row, col, horizontally }) => {
            const testTitle = `length of ${length} not allowed`;
            test(testTitle, () => expect(() => gameboard.placeShip(length, row, col, horizontally)).toThrow('Size of ship not allowed!'));
          })
        })
      });
      describe('Type error', () => {
        error.typeError.forEach(({ length, row, col, horizontally }) => {
          const testTitle = `placeShip(${length}, ${row}, ${col}, ${horizontally}): should throw`;
          test(testTitle, () => expect(() => gameboard.placeShip(length, row, col, horizontally)).toThrow('Type error!'));
        })
      });
      describe('Overlapping ships', () => {
        error.overlappingShip.forEach(({ first, overlap, description }) => {
          test(description, () => {
            const firstShipArgs = Object.values(first);
            const overlapArgs = Object.values(overlap);
            gameboard.placeShip(...firstShipArgs);
            expect(() => gameboard.placeShip(...overlapArgs)).toThrow('Position already occupied!');
          })
        })
      })
    })
  });

  describe('receiveAttack', () => {
    const testCases = {
      success: {
        hit: [
          { 
            shipPosition: { length: 2, row: 0, col: 0, horizontally: true },
            attackCoordinates: { row: 0, col: 0 },
          }
        ],
        noHit: [
          { 
            shipPosition: { length: 2, row: 0, col: 0, horizontally: true },
            attackCoordinates: { row: 5, col: 5 },
          }
        ]
      },
      error: [

      ],
    }
  })
})