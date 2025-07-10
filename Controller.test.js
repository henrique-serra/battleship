import Controller from "./Controller";
import Player from "./Player";

let c;
beforeEach(() => c = new Controller());

describe('Controller', () => {
  test('Controller exists', () => {
    expect(c).toBeDefined();
  });

  describe('attack', () => {
    beforeEach(() => c.setPhase('attacks'));

    test('controller.attack calls receiveAttack on target board', () => {
      const spy = jest.spyOn(c.player2.gameboard, 'receiveAttack');
      c.attack(c.player2, 3, 3);
      expect(spy).toHaveBeenCalledWith(3, 3);
      spy.mockRestore();
    });

    test('should add attack coordinates to attacker attacks array when player1 attacks player2', () => {
      // Player1 ataca Player2
      c.attack(c.player2, 5, 7);
      
      // O ataque deve ser registrado na array de ataques do player1
      expect(c.player1.attacks).toContainEqual([5, 7]);
      expect(c.player1.attacks.length).toBe(1);
      
      // Player2 não deve ter ataques registrados
      expect(c.player2.attacks.length).toBe(0);
    });

    test('should add attack coordinates to attacker attacks array when player2 attacks player1', () => {
      // Player2 ataca Player1
      c.attack(c.player1, 2, 4);
      
      // O ataque deve ser registrado na array de ataques do player2
      expect(c.player2.attacks).toContainEqual([2, 4]);
      expect(c.player2.attacks.length).toBe(1);
      
      // Player1 não deve ter ataques registrados
      expect(c.player1.attacks.length).toBe(0);
    });

    test('should accumulate multiple attacks in the attacker attacks array', () => {
      // Player1 faz múltiplos ataques
      c.attack(c.player2, 0, 0);
      c.attack(c.player2, 1, 1);
      c.attack(c.player2, 9, 9);
      
      expect(c.player1.attacks).toHaveLength(3);
      expect(c.player1.attacks).toContainEqual([0, 0]);
      expect(c.player1.attacks).toContainEqual([1, 1]);
      expect(c.player1.attacks).toContainEqual([9, 9]);
    });

    test('should handle alternating attacks correctly', () => {
      // Ataques alternados
      c.attack(c.player2, 1, 2); // Player1 ataca
      c.attack(c.player1, 3, 4); // Player2 ataca
      c.attack(c.player2, 5, 6); // Player1 ataca novamente
      
      // Verificar ataques do Player1
      expect(c.player1.attacks).toHaveLength(2);
      expect(c.player1.attacks).toContainEqual([1, 2]);
      expect(c.player1.attacks).toContainEqual([5, 6]);
      
      // Verificar ataques do Player2
      expect(c.player2.attacks).toHaveLength(1);
      expect(c.player2.attacks).toContainEqual([3, 4]);
    });

    test('should maintain attack history even when attacking same position', () => {
      // Atacar a mesma posição múltiplas vezes (mesmo que não seja permitido no jogo real)
      c.attack(c.player2, 4, 4);
      c.attack(c.player2, 4, 4);
      
      // Ambos os ataques devem ser registrados
      expect(c.player1.attacks).toHaveLength(2);
      expect(c.player1.attacks.filter(attack => 
        attack[0] === 4 && attack[1] === 4
      )).toHaveLength(2);
    });

    test('should work with custom named players', () => {
      const customController = new Controller(
        new Player('Alice', 'real'),
        new Player('Bob', 'computer')
      );
      customController.gamePhase = 'attacks';
      // Alice ataca Bob
      customController.attack(customController.player2, 7, 8);
      
      expect(customController.player1.attacks).toContainEqual([7, 8]);
      expect(customController.player1.name).toBe('Alice');
      expect(customController.player2.attacks).toHaveLength(0);
    });

    test('should throw if gamePhase is not "attacks"', () => {
      c.gamePhase = 'positioning';
      expect(() => c.attack(c.player2, 0, 0)).toThrow("Can't attack during positioning phase");
    })
  });

  describe('getWinner', () => {
    test('Player 1 wins', () => {
      const player1Gameboard = c.player1.gameboard;
      const player2Gameboard = c.player2.gameboard;
      
      // Place all ships randomly
      player1Gameboard.ships.forEach((ship) => {
        player1Gameboard.placeShipRandomly(ship);
      });
      player2Gameboard.ships.forEach((ship) => {
        player2Gameboard.placeShipRandomly(ship);
      });

      c.setPhase('attacks');

      player2Gameboard.ships.forEach(({ positions }) => {
        positions.forEach(([row, col]) => {
          c.attack(c.player2, row, col);
        });
      });

      expect(c.getWinner()).toBe(c.player1);
    });

    test('Player 2 wins', () => {
      const player1Gameboard = c.player1.gameboard;
      const player2Gameboard = c.player2.gameboard;
      
      // Place all ships randomly
      player1Gameboard.ships.forEach((ship) => {
        player1Gameboard.placeShipRandomly(ship);
      });
      player2Gameboard.ships.forEach((ship) => {
        player2Gameboard.placeShipRandomly(ship);
      });

      c.setPhase('attacks');

      player1Gameboard.ships.forEach(({ positions }) => {
        positions.forEach(([row, col]) => {
          c.attack(c.player1, row, col);
        });
      });

      expect(c.getWinner()).toBe(c.player2);
    });

    test('No winner', () => {
      const player1Gameboard = c.player1.gameboard;
      const player2Gameboard = c.player2.gameboard;
      
      // Place all ships randomly
      player1Gameboard.ships.forEach((ship) => {
        player1Gameboard.placeShipRandomly(ship);
      });
      player2Gameboard.ships.forEach((ship) => {
        player2Gameboard.placeShipRandomly(ship);
      });

      expect(c.getWinner()).toBeNull();
    });
  });

  describe('resetGame method', () => {
    test('should create new players', () => {
      const originalPlayers = [c.player1, c.player2];
      
      c.resetGame();

      const newPlayers = [c.player1, c.player2];

      newPlayers.forEach((newPlayer, index) => {
        expect(newPlayer).not.toBe(originalPlayers[index]);
      })
    });

    test('should be player1 turn after reset', () => {
      c.resetGame();
      expect(c.turn).toBe(c.player1);
    });

    test('gamePhase should be positioning after reset', () => {
      c.resetGame();
      expect(c.gamePhase).toBe('positioning');
    })
  });

  describe('turn management', () => {
    const turnManagementCases = {
      initialization: [
        {
          description: 'should initialize with player1 as current turn',
          expectedPlayer: 'player1'
        }
      ],
      
      changeTurn: [
        {
          description: 'should change from player1 to player2',
          initialPlayer: 'player1',
          expectedPlayer: 'player2'
        },
        {
          description: 'should change from player2 to player1',
          initialPlayer: 'player2', 
          expectedPlayer: 'player1'
        },
        {
          description: 'should alternate turns multiple times',
          changes: 5,
          expectedFinalPlayer: 'player2' // Ímpar = player2
        }
      ],

      getCurrentPlayer: [
        {
          description: 'should return player1 initially',
          expectedPlayer: 'player1'
        },
        {
          description: 'should return player2 after one turn change',
          turnChanges: 1,
          expectedPlayer: 'player2'
        },
        {
          description: 'should return player1 after two turn changes',
          turnChanges: 2,
          expectedPlayer: 'player1'
        }
      ],

      isPlayerTurn: [
        {
          description: 'should return true for player1 initially',
          checkPlayer: 'player1',
          expected: true
        },
        {
          description: 'should return false for player2 initially',
          checkPlayer: 'player2',
          expected: false
        },
        {
          description: 'should return true for player2 after turn change',
          turnChanges: 1,
          checkPlayer: 'player2',
          expected: true
        },
        {
          description: 'should return false for player1 after turn change',
          turnChanges: 1,
          checkPlayer: 'player1',
          expected: false
        }
      ],

      resetGame: [
        {
          description: 'should reset turn to player1 after multiple changes',
          turnChanges: 7,
          expectedPlayerAfterReset: 'player1'
        }
      ]
    };

    describe('initialization', () => {
      turnManagementCases.initialization.forEach((testCase) => {
        test(testCase.description, () => {
          expect(c.turn).toBe(c.player1);
          expect(c.getCurrentPlayer()).toBe(c.player1);
        });
      });
    });

    describe('changeTurn method', () => {
      turnManagementCases.changeTurn.forEach((testCase) => {
        if (testCase.changes) {
          test(testCase.description, () => {
            // Executa múltiplas mudanças de turno
            for (let i = 0; i < testCase.changes; i++) {
              c.changeTurn();
            }
            const expectedPlayer = testCase.expectedFinalPlayer === 'player1' ? c.player1 : c.player2;
            expect(c.turn).toBe(expectedPlayer);
          });
        } else {
          test(testCase.description, () => {
            // Define turno inicial se especificado
            if (testCase.initialPlayer === 'player2') {
              c.turn = c.player2;
            }
            
            c.changeTurn();
            
            const expectedPlayer = testCase.expectedPlayer === 'player1' ? c.player1 : c.player2;
            expect(c.turn).toBe(expectedPlayer);
          });
        }
      });

      test('should maintain object references', () => {
        const initialPlayer = c.turn;
        c.changeTurn();
        const newPlayer = c.turn;
        
        expect(initialPlayer).not.toBe(newPlayer);
        expect(newPlayer === c.player1 || newPlayer === c.player2).toBe(true);
      });
    });

    describe('getCurrentPlayer method', () => {
      turnManagementCases.getCurrentPlayer.forEach((testCase) => {
        test(testCase.description, () => {
          // Executa mudanças de turno se especificado
          if (testCase.turnChanges) {
            for (let i = 0; i < testCase.turnChanges; i++) {
              c.changeTurn();
            }
          }
          
          const expectedPlayer = testCase.expectedPlayer === 'player1' ? c.player1 : c.player2;
          expect(c.getCurrentPlayer()).toBe(expectedPlayer);
        });
      });
    });

    describe('isPlayerTurn method', () => {
      turnManagementCases.isPlayerTurn.forEach((testCase) => {
        test(testCase.description, () => {
          // Executa mudanças de turno se especificado
          if (testCase.turnChanges) {
            for (let i = 0; i < testCase.turnChanges; i++) {
              c.changeTurn();
            }
          }
          
          const playerToCheck = testCase.checkPlayer === 'player1' ? c.player1 : c.player2;
          expect(c.isPlayerTurn(playerToCheck)).toBe(testCase.expected);
        });
      });

      test('should work with both players simultaneously', () => {
        expect(c.isPlayerTurn(c.player1)).toBe(true);
        expect(c.isPlayerTurn(c.player2)).toBe(false);
        
        c.changeTurn();
        
        expect(c.isPlayerTurn(c.player1)).toBe(false);
        expect(c.isPlayerTurn(c.player2)).toBe(true);
      });
    });
  });
});