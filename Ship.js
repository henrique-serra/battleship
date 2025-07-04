export default class Ship {
  static shipCatalog = [
    {
      name: 'patrol',
      length: 1,
      emoji: '⛵',
    },
    {
      name: 'submarine',
      length: 2,
      emoji: '🚤',
    },
    {
      name: 'destroyer',
      length: 3,
      emoji: '🛥️',
    },
    {
      name: 'battleship',
      length: 4,
      emoji: '🚢',
    },
    {
      name: 'carrier',
      length: 5,
      emoji: '🛳️',
    },
  ];
  
  constructor(length, hits = 0, sunk = false) {
    if (typeof length !== 'number' || !Number.isInteger(length)) throw new Error('length must be an integer');
    if (length < 1 || length > 5) throw new Error('length must be between 1 and 5');

    this.shipInfo = Ship.shipCatalog[length - 1];
    this.hits = hits;
    this.sunk = sunk;
    this.positions = [];
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.hits === this.shipInfo.length ? true : false;
  }
}