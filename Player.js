import Gameboard from "./Gameboard";

export default class Player {
  constructor(name = 'Player 1', type = 'real') {
    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();
    this.attacks = [];
    this.victories = 0;
    this.defeats = 0;
  }
}