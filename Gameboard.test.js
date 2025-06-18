import Gameboard from './Gameboard.js';

let gameboard;

describe('Gameboard class', () => {
  beforeEach(() => gameboard = new Gameboard());
  test('should instantiate correctly', () => {
    expect(gameboard).toBeDefined();
    expect(Array.isArray(gameboard.defenseBoard)).toBe(true);
    expect(Array.isArray(gameboard.attackBoard)).toBe(true);
  });

  describe('placeShip should place ships correctly', () => {
    let length = 2;
    let row = 0;
    let col = 0;
    let horizontally = true;
    const placeShipCases = {
      successCases: {
        horizontally: [
          { length: 2, row: 0, col: 0, horizontally: true },
        ],
        vertically: [

        ]
      },
      errorCases: {
        offLimits: {
          horizontally: [

          ],
          vertically: [

          ]
        },
        typeError: [

        ]
      }
    }
    test('horizontally', () => {
      gameboard.placeShip(length, row, col, horizontally);
      const [firstRow] = gameboard.defenseBoard;
      expect(firstRow[0].ship).toBeDefined();
      expect(firstRow[1].ship).toBeDefined();
    });

    test('vertically', () => {
      horizontally = false;
      gameboard.placeShip(length, row, col, horizontally);
      const [firstRow, secondRow] = gameboard.defenseBoard;
      expect(firstRow[0].ship).toBeDefined();
      expect(secondRow[0].ship).toBeDefined();
    });

    describe('off limits should throw', () => {
      test('off limits horizontally', () => {
        row = 0;
        col = 9;
        horizontally = true;
        expect(() => gameboard.placeShip(length, row, col, horizontally)).toThrow('Off limits!');
      });

      test('off limits vertically', () => {
        row = 9;
        col = 0;
        horizontally = false;
        expect(() => gameboard.placeShip(length, row, col, horizontally)).toThrow('Off limits!');
      })
    })
  })
})