export default class Ship {
  constructor(length, hits = 0, sunk = false) {
    this.length = length;
    this.hits = hits;
    this.sunk = sunk;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.hits === this.length ? true : false;
  }
}