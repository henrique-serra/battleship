import Player from './Player.js';

let player;
beforeEach(() => player = new Player());

describe('Player', () => {
  test('Player exists', () => {
    expect(player).toBeDefined();
  });
})