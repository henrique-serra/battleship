import Player from './Player.js';

let player;
beforeEach(() => player = new Player());

describe('Player', () => {
  test('Player exists', () => {
    expect(player).toBeDefined();
  });
<<<<<<< HEAD

  test('attack(x,y) should return [x,y]', () => {
    expect(player.attack(0,0)).toEqual([0,0]);
  });

  test('attack(x,y) should push [x,y] to player.attacks', () => {
    player.attack(0,0);
    expect(player.attacks).toEqual([[0,0]]);
  })
=======
>>>>>>> gameboard
})