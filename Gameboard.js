import Ship from "./Ship.js";

export default class Gameboard {
  constructor() {
    this.defenseBoard = Array.from({ length: 10 }, (_) => Array.from({ length: 10 }, (_) => ({ ship: null, hitTaken: false })));
    this.attackBoard = Array.from({ length: 10 }, (_) => Array.from({ length: 10 }, (_) => ({ hit: false })));
  }

  placeShip(x, y, ship) {
    const { length } = ship;
    this.defenseBoard[y][x].ship = ship;
  }
}