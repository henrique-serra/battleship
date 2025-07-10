import Ship from "./Ship.js";

export default class Gameboard {
  constructor() {
    this.defenseBoard = this.createGameBoard();
    this.missedAttacks = [];
    this.ships = [
      new Ship(1),
      new Ship(1),
      new Ship(2),
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];
    this.shipsGroupedByName = this.groupShipsByName();
  }

  groupShipsByName() {
    return this.ships.reduce((shipsGrouped, ship) => {
      if (!shipsGrouped[ship.shipInfo.name]) {
        shipsGrouped[ship.shipInfo.name] = [];
      }
      shipsGrouped[ship.shipInfo.name].push(ship);
      return shipsGrouped;
    }, {})
  }

  getShipsPositionedByName() {
    return Object.entries(this.shipsGroupedByName).reduce((shipsPositioned, [shipType, ships]) => {
      shipsPositioned[shipType] = ships.filter((ship) => ship.positions.length > 0);
      return shipsPositioned;
    }, {})
  }

  getShipsNotPositionedByName() {
    return Object.entries(this.shipsGroupedByName).reduce((shipsNotPositioned, [shipType, ships]) => {
      shipsNotPositioned[shipType] = ships.filter((ship) => ship.positions.length === 0);
      return shipsNotPositioned;
    }, {})
  }

  getQtyShipsNotPositioned(shipType) {
    const shipsNotPositioned = this.getShipsNotPositionedByName();
    return shipsNotPositioned[shipType].length;
  }

  allShipsPositioned() {
    for (const { positions } of this.ships) {
      if (positions.length === 0) return false;
    }

    return true;
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
    const { length } = ship.shipInfo;
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
    const maxRow = horizontally ? 10 : (10 - ship.shipInfo.length);
    const maxCol = horizontally ? (10 - ship.shipInfo.length) : 10;

    const row = Math.floor(Math.random() * (maxRow));
    const col = Math.floor(Math.random() * (maxCol));

    if(horizontally) {
      for(let i = col; i < (col + ship.shipInfo.length); i++) {
        const shipOnBoard = this.defenseBoard[row][i].ship;
        if(shipOnBoard) return this.placeShipRandomly(ship);
      }
    } else {
      for(let i = row; i < (row + ship.shipInfo.length); i++) {
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
      ship.hit();
      return { hit: true, ship }
    } else {
      this.missedAttacks.push([row, col]);
      return { hit: false, ship: null }
    }
  }

  allShipsSunk() {
    for (const ship of this.ships) {
      if(!ship.isSunk()) return false;
    }

    return true;
  }

  getRemainingShipsByType() {
    const allShipsByName = this.groupShipsByName();
    const remainingShips = {};
    
    // Para cada tipo de navio, conta apenas os não afundados
    Object.entries(allShipsByName).forEach(([shipType, ships]) => {
      remainingShips[shipType] = ships.filter(ship => !ship.isSunk()).length;
    });
    
    return remainingShips;
  }

  getTotalShipsByType() {
    const totalShips = {};
    
    this.ships.forEach(ship => {
      const shipType = ship.shipInfo.name;
      
      if (!totalShips[shipType]) {
        totalShips[shipType] = 0;
      }
      
      totalShips[shipType]++;
    });
    
    return totalShips;
  }

  isShipTypeDestroyed(shipType) {
    const shipsOfType = this.ships.filter(ship => ship.shipInfo.name === shipType);
    
    return shipsOfType.length > 0 && shipsOfType.every(ship => ship.isSunk());
  }

  removeShipsByType(shipType) {
    console.log(`Removing ships of type: ${shipType}`);
    
    // Encontra navios do tipo especificado
    const shipsToRemove = this.ships.filter(ship => ship.shipInfo.name === shipType);
    
    if (shipsToRemove.length === 0) {
      console.warn(`No ships of type "${shipType}" found to remove`);
      return;
    }
    
    // Remove navios das células do tabuleiro
    shipsToRemove.forEach(ship => {
      ship.positions.forEach(([row, col]) => {
        // Remove referência do navio da célula
        if (this.defenseBoard[row] && this.defenseBoard[row][col]) {
          this.defenseBoard[row][col].ship = null;
        }
      });
    });
    
    // Remove navios do array this.ships
    this.ships = this.ships.filter(ship => ship.shipInfo.name !== shipType);
    
    console.log(`Removed ${shipsToRemove.length} ships of type "${shipType}"`);
    
    return shipsToRemove; // Retorna navios removidos (útil para debug)
  }

  resetGameboard() {
    this.defenseBoard = this.createGameBoard();
    this.missedAttacks = [];
    this.ships = [
      new Ship(1),
      new Ship(1),
      new Ship(2),
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];
  }
}