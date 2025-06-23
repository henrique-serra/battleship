import Gameboard from "./Gameboard";

export default class Player {
  constructor(name, type = 'real') {
    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();
    this.attacks = [];
  }

  attack(x, y) {
    this.attacks.push([x, y]);
    return [x, y];
  }
}