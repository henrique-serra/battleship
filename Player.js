import Gameboard from "./Gameboard.js";
import Ship from "./Ship.js";

export default class Player {
  constructor(name = 'Player 1', type = 'real') {
    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();
    this.attacks = [];
    this.victories = 0;
    this.defeats = 0;
    this.playerShips = [
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(2),
      new Ship(1),
    ]
  }
}