/**
 * @jest-environment jsdom
 */

import GameUI from './GameUI.js';
import Controller from '../Controller.js';
import BoardRenderer from './BoardRenderer.js';
import Ship from '../Ship.js';
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

})