import Gameboard from './Gameboard.js';

describe('Gameboard class', () => {
  const gameboard = new Gameboard();
  test('should instantiate correctly', () => {
    expect(gameboard).toBeDefined();
    expect(Array.isArray(gameboard.defenseBoard)).toBe(true);
    expect(Array.isArray(gameboard.attackBoard)).toBe(true);
  });

  describe('placeShip(0,0, new Ship(3)) should ')
})