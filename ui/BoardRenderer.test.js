/**
 * @jest-environment jsdom
 */

import BoardRenderer from './BoardRenderer.js';

describe('BoardRenderer', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="player-board"></div>
      <div id="enemy-board"></div>
    `;
  });

  test('should find DOM elements', () => {
    const playerBoardEl = document.querySelector('#player-board');
    const enemyBoardEl = document.querySelector('#enemy-board');
    const boardRenderer = new BoardRenderer(playerBoardEl, enemyBoardEl);

    expect(boardRenderer.playerContainer).toBeDefined();
    expect(boardRenderer.opponentContainer).toBeDefined();
  })
})