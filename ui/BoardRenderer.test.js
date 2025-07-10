/**
 * @jest-environment jsdom
 */

import BoardRenderer from './BoardRenderer.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import Gameboard from '../Gameboard.js';

let playerBoardEl;
let enemyBoardEl;
let boardRenderer;
let player1Gameboard;
let player2Gameboard;

describe('BoardRenderer', () => {
  beforeEach(() => {
    const htmlPath = join(__dirname, '../index.html');
    const htmlContent = readFileSync(htmlPath, 'utf8');
    document.body.innerHTML = htmlContent;
    playerBoardEl = document.querySelector('#player-board');
    enemyBoardEl = document.querySelector('#enemy-board');
    player1Gameboard = new Gameboard();
    player2Gameboard = new Gameboard();
    boardRenderer = new BoardRenderer(player1Gameboard, player2Gameboard);
  });

  describe('createHTMLElement', () => {
    test('should be an instance of HTMLElement', () => {
      expect(boardRenderer.createHTMLElement() instanceof HTMLElement).toBe(true);
    });

    test('should create div with classes', () => {
      const div = boardRenderer.createHTMLElement(['game-boards', 'board-sections']);
      expect(div.classList).toHaveLength(2);
      expect(div.classList.contains('game-boards')).toBe(true);
      expect(div.classList.contains('board-sections')).toBe(true);
    });

    test('should create div with id', () => {
      const div = boardRenderer.createHTMLElement(undefined, 'id-test');
      expect(div.id).toBe('id-test');
    });

    test('should create span', () => {
      const span = boardRenderer.createHTMLElement(undefined, undefined, 'span');
      expect(span instanceof HTMLSpanElement).toBe(true);
    });

    test('should throw with invalid element', () => {
      expect(() => boardRenderer.createHTMLElement(undefined, undefined, 'adcbd')).toThrow('Invalid HTML Element: adcbd');
    })
  });

  describe('createPlayer1BoardSection', () => {
    test('should have h2.board-title', () => {
      const divBoardSection = boardRenderer.createPlayer1BoardSection();
      const h2 = divBoardSection.querySelector('.board-title');
      expect(h2).toBeDefined();
      expect(h2 instanceof HTMLHeadingElement).toBe(true);
      expect(h2.tagName).toBe('H2');
    });
  });
})