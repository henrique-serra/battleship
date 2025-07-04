export default class BoardRenderer {
  constructor(player1Container, player2Container, player1GameBoard, player2GameBoard) {
    this.player1Container = player1Container;
    this.player2Container = player2Container;
    this.player1GameBoard = player1GameBoard;
    this.player2GameBoard = player2GameBoard;
  }

  createGameBoardsHTML() {
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    const createGrid = function createGrid (boardId) {
      let gridHTML = `<div class="grid" id="${boardId}">`;
      
      // Primeira linha - header com coordenadas
      gridHTML += '<div class="grid-cell coordinate"></div>'; // canto vazio
      columns.forEach(col => {
        gridHTML += `<div class="grid-cell coordinate">${col}</div>`;
      });
      
      // Linhas 1-10 do jogo
      for (let row = 1; row <= 10; row++) {
        // Primeira célula da linha - número da linha
        gridHTML += `<div class="grid-cell coordinate">${row}</div>`;
        
        // Células de jogo da linha
        columns.forEach(col => {
          const position = `${col}${row}`;
          const rowIndex = row - 1; // Para array 0-indexed
          const colIndex = columns.indexOf(col); // Para array 0-indexed
          
          gridHTML += `<div class="grid-cell" data-position="${position}" data-row="${rowIndex}" data-col="${colIndex}"></div>`;
        });
      }
      
      gridHTML += '</div>';
      return gridHTML;
    };

    const firstLetterCaps = function firstLetterCaps(str) {
      return str[0].toUpperCase().concat(str.slice(1));
    }

    const createShipTypeDivs = function createShipTypeDivs() {
      let shipTypeDivs = '';
      Object.entries(this.player1GameBoard.shipsGroupedByName).forEach(([shipName, ships]) => {
        shipTypeDivs += `
        <div class="ship-type" data-ship-type="${shipName}">
          <span class="ship-name">🛳️ ${firstLetterCaps(shipName)} (${ships[0].shipInfo.length})</span>
          <span class="btn-random" title="Randomly position ship">🔀</span>
          <span class="ship-count">${ships.length}</span>
        </div>
            `
      })
      return shipTypeDivs;
    }
    
    return `
      <div class="game-boards">
        <div class="board-section">
          <h2 class="board-title">🛡️ Your Fleet</h2>
          ${createGrid('player-board')}
          <div class="ships-remaining">
            ${createShipTypeDivs()}
            <div class="fleet-controls-section">
              <button class="btn-clear-all" title="Remove all ships from board">🧹</button>
              <button class="btn-random-all" title="Randomly position all ships">🔀</button>
            </div>
          </div>
        </div>
        <div class="board-section">
          <h2 class="board-title">🎯 Enemy Field</h2>
          ${createGrid('enemy-board')}
          <div class="ships-remaining">
            ${createShipTypeDivs()}
            <div class="fleet-controls-section">
              <button class="btn-clear-all" title="Remove all ships from board">🧹</button>
              <button class="btn-random-all" title="Randomly position all ships">🔀</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}