/**
 * @jest-environment jsdom
 */

import GameUI from './GameUI.js';
import Controller from '../Controller.js';
import BoardRenderer from './BoardRenderer.js';
import { readFileSync } from 'fs';
import { join } from 'path';

let gameUI;

beforeEach(() => {
  const htmlPath = join(__dirname, '../index.html');
  const htmlContent = readFileSync(htmlPath, 'utf8');
  document.body.innerHTML = htmlContent;
  gameUI = new GameUI();
});

describe('GameUI', () => {
  test('GameUI instantiates correctly', () => {
    expect(gameUI).toBeDefined();
    expect(gameUI.playerBoardEl.tagName).toBe('DIV');
    expect(gameUI.playerBoardEl.classList.contains('grid')).toBe(true);
    expect(gameUI.playerBoardEl.id).toBe('player-board');
    expect(gameUI.enemyBoardEl.tagName).toBe('DIV');
    expect(gameUI.enemyBoardEl.classList.contains('grid')).toBe(true);
    expect(gameUI.enemyBoardEl.id).toBe('enemy-board');
    expect(gameUI.controller instanceof Controller).toBe(true);
    expect(gameUI.boardRenderer instanceof BoardRenderer).toBe(true);
  })
})