export default class BoardRenderer {
  constructor(playerContainer, opponentContainer) {
    this.playerContainer = playerContainer;
    this.opponentContainer = opponentContainer;
  }

  getCell(board, row, col) {
    if (!board || typeof board.querySelector !== 'function') throw new Error('Invalid board parameter');
    if (typeof row !== 'number' || typeof col !== 'number') throw new Error('Invalid parameter type');
    if (!Number.isFinite(row) || !Number.isFinite(col)) throw new Error('Invalid special number');
    if (row < 0 || col < 0 || row >= 10 || col >= 10) throw new Error('Coordinates out of range');
    
    const index = ((row * 11) + 13) + col;
    const cell = board.querySelector(`div:nth-child(${index})`);
    return cell;
  }

  insertClass(board, action, row, col) {
    if (!action || typeof action !== 'string' || action.trim() === '') throw new Error('Invalid action parameter');
    if(!['ship', 'hit', 'miss', 'sunk'].includes(action)) throw new Error('Action not recognized');
    
    const cell = this.getCell(board, row, col);
    if(!cell.classList.contains(action)) cell.classList.add(action);
  }

  removeClass(board, action, row, col) {
    if (!action || typeof action !== 'string' || action.trim() === '') throw new Error('Invalid action parameter');
    if(!['ship', 'hit', 'miss', 'sunk'].includes(action)) throw new Error('Action not recognized');
    
    const cell = this.getCell(board, row, col);
    if(cell.classList.contains(action)) cell.classList.remove(action);
  }
}