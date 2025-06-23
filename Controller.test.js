import Controller from "./Controller";

const c = new Controller();

describe('Controller', () => {
  test('Controller exists', () => {
    expect(c).toBeDefined();
  });

  test('controller.attack calls receiveAttack on target board', () => {
    const spy = jest.spyOn(c.player2.gameboard, 'receiveAttack');
    c.attack(c.player2, 3, 3);
    expect(spy).toHaveBeenCalledWith(3, 3);
    spy.mockRestore();
  })
})