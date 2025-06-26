export default class BoardRenderer {
  constructor(playerContainer, opponentContainer) {
    this.playerContainer = playerContainer;
    this.opponentContainer = opponentContainer;
  }

  createGameBoardsHTML() {
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    function createGrid(boardId) {
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
          
          gridHTML += `<div class="grid-cell" data-position="${position}" data-row="${rowIndex}" data-col="${colIndex}">${position}</div>`;
        });
      }
      
      gridHTML += '</div>';
      return gridHTML;
    }
    
    return `
      <div class="game-boards">
        <div class="board-section">
          <h2 class="board-title">🛡️ Sua Frota</h2>
          ${createGrid('player-board')}
          <div class="ships-remaining">
            <div class="ship-type">
                <span class="ship-name">🚢 Porta-aviões (5)</span>
                <span class="ship-count">1</span>
            </div>
            <div class="ship-type">
                <span class="ship-name">🛥️ Cruzador (4)</span>
                <span class="ship-count">1</span>
            </div>
            <div class="ship-type">
                <span class="ship-name">⛵ Contratorpedeiro (3)</span>
                <span class="ship-count">2</span>
            </div>
            <div class="ship-type">
                <span class="ship-name">🚤 Submarino (2)</span>
                <span class="ship-count">1</span>
            </div>
          </div>
        </div>
        <div class="board-section">
          <h2 class="board-title">🎯 Campo Inimigo</h2>
          ${createGrid('enemy-board')}
          <div class="ships-remaining">
            <div class="ship-type">
                <span class="ship-name">🚢 Porta-aviões (5)</span>
                <span class="ship-count">1</span>
            </div>
            <div class="ship-type">
                <span class="ship-name">🛥️ Cruzador (4)</span>
                <span class="ship-count">1</span>
            </div>
            <div class="ship-type">
                <span class="ship-name">⛵ Contratorpedeiro (3)</span>
                <span class="ship-count">2</span>
            </div>
            <div class="ship-type">
                <span class="ship-name">🚤 Submarino (2)</span>
                <span class="ship-count">1</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}