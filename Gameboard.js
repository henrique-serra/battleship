import Ship from "./Ship.js";

export default class Gameboard {
  constructor() {
    this.defenseBoard = Array.from({ length: 10 }, (_) => Array.from({ length: 10 }, (_) => ({ ship: null, hitTaken: false })));
    this.attackBoard = Array.from({ length: 10 }, (_) => Array.from({ length: 10 }, (_) => ({ hit: false })));
  }

  offLimits(length, row, col, horizontally = true) {
    const rowLength = this.defenseBoard[0].length;
    const colLength = this.defenseBoard.length;
    if(horizontally) {
      return (col + length) > rowLength ? true : false;
    }
    return (row + length) > colLength ? true : false;
  }

  placeShip(length, row, col, horizontally = true) {
    if(this.offLimits(length, row, col, horizontally)) throw new Error('Off limits!');
    
    const ship = new Ship(length);
    if(horizontally) {
      for (let i = col; i < (col + length); i++) {
        this.defenseBoard[row][i].ship = ship;
      }
    }

    for (let i = row; i < (row + length); i++) {
      this.defenseBoard[i][col].ship = ship;
    }
  }
}