import Ship from './Ship.js';

describe('Ship class', () => {
  test('should increment hits when hit() is called', () => {
    const ship = new Ship(2);
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  test('isSunk() should return true if hits === length', () => {
    const ship = new Ship(1);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
})