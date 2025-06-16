import Ship from './Ship.js';

describe('Ship class', () => {
  test('should instantiate correctly with given length', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
    expect(ship.sunk).toBe(false);
  });

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