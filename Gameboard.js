import Ship from "./Ship.js";

export default class Gameboard {
  constructor() {
    this.defenseBoard = this.createGameBoard();
    this.missedAttacks = [];
    this.ships = [
      new Ship(1),
      new Ship(2),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ]
  }

  createGameBoard() {
    return Array.from({ length: 10 }, (_) => Array.from({ length: 10 }, (_) => ({ ship: null, hitTaken: false })));
  }

  offLimits(length, row, col, horizontally) {
    const rowLength = this.defenseBoard[0].length;
    const colLength = this.defenseBoard.length;
    if(horizontally) {
      return (col + length) > rowLength ? true : false;
    }
    return (row + length) > colLength ? true : false;
  }

  checkTypeError(length, row, col, horizontally = true) {
    return (
      typeof length !== 'number' ||
      typeof row !== 'number' ||
      typeof col !== 'number' ||
      typeof horizontally !== 'boolean'
    )
  }

  placeShip(ship, row, col, horizontally = true) {
    const { length } = ship;
    if(arguments.length < 3 || length === undefined || row === undefined || col === undefined) {
      throw new Error('Missing value(s)!');
    };
    if(this.checkTypeError(length, row, col, horizontally)) throw new Error('Type error!');
    if(length > 10 || length < 0) throw new Error('Size of ship not allowed!');
    if(this.offLimits(length, row, col, horizontally) || row < 0 || col < 0) throw new Error('Off limits!');

    if(horizontally) {
      for (let i = col; i < (col + length); i++) {
        if(this.defenseBoard[row][i].ship !== null) throw new Error('Position already occupied!');
        ship.positions.push([row, i])
      }
    } else {
      for (let i = row; i < (row + length); i++) {
        if(this.defenseBoard[i][col].ship !== null) throw new Error('Position already occupied!');
        ship.positions.push([i, col]);
      }
    }

    for (const [r, c] of ship.positions) {
      this.defenseBoard[r][c].ship = ship;
    }

    return ship;
  }

  placeShipRandomly(ship) {
    const horizontally = Math.random() < 0.5;
    const maxRow = horizontally ? 10 : (10 - ship.length);
    const maxCol = horizontally ? (10 - ship.length) : 10;

    const row = Math.floor(Math.random() * (maxRow));
    const col = Math.floor(Math.random() * (maxCol));

    if(horizontally) {
      for(let i = col; i < (col + ship.length); i++) {
        const shipOnBoard = this.defenseBoard[row][i].ship;
        if(shipOnBoard) return this.placeShipRandomly(ship);
      }
    } else {
      for(let i = row; i < (row + ship.length); i++) {
        const shipOnBoard = this.defenseBoard[i][col].ship;
        if(shipOnBoard) return this.placeShipRandomly(ship);
      }
    }

    this.placeShip(ship, row, col, horizontally);
    return { row, col, horizontally };
  }

  removeShip(ship) {
    if(!ship) throw new Error('Invalid ship');
    if(!this.ships.includes(ship) || ship.positions.length === 0) throw new Error('Ship not found on gameboard');

    ship.positions.forEach(([row, col]) => {
      this.defenseBoard[row][col].ship = null;
      this.defenseBoard[row][col].hitTaken = false;
    });

    ship.positions = [];
  }

  receiveAttack(row, col) {
    if(
      row < 0 ||
      col < 0 ||
      row >= this.defenseBoard.length ||
      col >= this.defenseBoard[0].length ||
      typeof row !== 'number' ||
      typeof col !== 'number'
    ) throw new Error();
    
    const ship = this.defenseBoard[row][col].ship;
    if(ship) {
      ship.hit()
    } else {
      this.missedAttacks.push([row, col]);
    }
  }

  allShipsSunk() {
    for (const ship of this.ships) {
      if(!ship.isSunk()) return false;
    }

    return true;
  }

  resetGameboard() {
    this.defenseBoard = this.createGameBoard();
    this.missedAttacks = [];
    this.ships = [
      new Ship(1),
      new Ship(2),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];
  }
}