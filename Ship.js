export default class Ship {
  constructor(length, hits = 0, sunk = false) {
    if (typeof length !== 'number' || !Number.isInteger(length)) throw new Error('length must be an integer');
    if (length < 1 || length > 5) throw new Error('length must be between 1 and 5');
    
    this.length = length;
    this.type = this.getShipType(length);
    this.hits = hits;
    this.sunk = sunk;
  }

  getShipType(length) {
    const shipTypes = {
      5: 'carrier',
      4: 'battleship',
      3: 'destroyer',
      2: 'submarine',
      1: 'patrol',
    };

    return shipTypes[length];
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.hits === this.length ? true : false;
  }
}