export default class Ship {
  constructor(length, hits = 0, sunk = false) {
    if (typeof length !== 'number' || !Number.isInteger(length)) throw new Error('length must be an integer');
    if (length < 1 || length > 5) throw new Error('length must be between 1 and 5');
    
    // this.length = length;
    // this.shipTypes = {
    //   1: 'patrol',
    //   2: 'submarine',
    //   3: 'destroyer',
    //   4: 'battleship',
    //   5: 'carrier',
    // };

    this.shipCatalog = [
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

    this.shipInfo = this.shipCatalog[length];
    // this.type = this.getShipType(length);
    // this.emoji = ;
    this.hits = hits;
    this.sunk = sunk;
    this.positions = [];
  }

  // getShipType(length) {
  //   return this.shipTypes[length];
  // }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.hits === this.shipInfo.length ? true : false;
  }
}