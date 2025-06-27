import Controller from "./Controller";
import Player from "./Player";

let c;
beforeEach(() => c = new Controller());

describe('Controller', () => {
  test('Controller exists', () => {
    expect(c).toBeDefined();
  });

  describe('attack', () => {
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
      
      // Alice ataca Bob
      customController.attack(customController.player2, 7, 8);
      
      expect(customController.player1.attacks).toContainEqual([7, 8]);
      expect(customController.player1.name).toBe('Alice');
      expect(customController.player2.attacks).toHaveLength(0);
    });

    test.skip('should throw if gamePhase is not "attacks"', () => {

    })
  });

  describe('getWinner', () => {
    test('Player 1 wins', () => {
      const player1Gameboard = c.player1.gameboard;
      const player2Gameboard = c.player2.gameboard;
      
      // Place all ships randomly
      player1Gameboard.ships.forEach((ship) => {
        player1Gameboard.placeShipRandomly(ship);
        player2Gameboard.placeShipRandomly(ship);
      });

      player2Gameboard.ships.forEach(({ positions }) => {
        positions.forEach(([row, col]) => {
          c.attack(c.player2, row, col);
        });
      });

      expect(c.getWinner()).toBe(c.player1);
    });

    describe('Player 2 wins', () => {
      
    });

    describe('No winner', () => {
      
    });

    describe('Error cases', () => {
      
    });
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

    describe('resetGame method', () => {
      const resetGameCases = {
        completeReset: [
          {
            description: 'should create new players with fresh gameboards',
            setup: () => {
              // Adiciona navios e faz ataques para "sujar" o estado
              c.player1.gameboard.placeShip(2, 0, 0, true);
              c.player2.gameboard.placeShip(3, 5, 5, false);
              c.attack(c.player1, 0, 0);
              c.attack(c.player2, 5, 5);
              c.changeTurn(); // Muda para player2
            }
          },
          {
            description: 'should reset after complex game state',
            setup: () => {
              // Cenário complexo
              c.player1.gameboard.placeShip(1, 1, 1, true);
              c.player1.gameboard.placeShip(2, 3, 3, true);
              c.player2.gameboard.placeShip(4, 0, 0, true);
              
              // Múltiplos ataques
              c.attack(c.player1, 1, 1); // hit
              c.attack(c.player2, 0, 0); // hit
              c.attack(c.player1, 9, 9); // miss
              c.attack(c.player2, 0, 1); // hit
              
              // Múltiplas mudanças de turno
              c.changeTurn();
              c.changeTurn();
              c.changeTurn();
            }
          }
        ],

        stateVerification: [
          {
            description: 'should have empty gameboards after reset',
            verification: (originalPlayer1, originalPlayer2) => {
              expect(c.player1.gameboard.ships).toHaveLength(0);
              expect(c.player2.gameboard.ships).toHaveLength(0);
              expect(c.player1.gameboard.missedAttacks).toHaveLength(0);
              expect(c.player2.gameboard.missedAttacks).toHaveLength(0);
            }
          },
          {
            description: 'should create different object instances',
            verification: (originalPlayer1, originalPlayer2) => {
              expect(c.player1).not.toBe(originalPlayer1);
              expect(c.player2).not.toBe(originalPlayer2);
              expect(c.player1.gameboard).not.toBe(originalPlayer1.gameboard);
              expect(c.player2.gameboard).not.toBe(originalPlayer2.gameboard);
            }
          },
          {
            description: 'should preserve player identities',
            verification: (originalPlayer1, originalPlayer2) => {
              expect(c.player1.name).toBe(originalPlayer1.name);
              expect(c.player2.name).toBe(originalPlayer2.name);
              expect(c.player1.type).toBe(originalPlayer1.type);
              expect(c.player2.type).toBe(originalPlayer2.type);
            }
          },
          {
            description: 'should reset turn to player1',
            verification: () => {
              expect(c.turn).toBe(c.player1);
              expect(c.getCurrentPlayer()).toBe(c.player1);
              expect(c.isPlayerTurn(c.player1)).toBe(true);
              expect(c.isPlayerTurn(c.player2)).toBe(false);
            }
          },
          {
            description: 'should have clean attack arrays',
            verification: () => {
              expect(c.player1.attacks).toHaveLength(0);
              expect(c.player2.attacks).toHaveLength(0);
            }
          }
        ]
      };

      resetGameCases.completeReset.forEach((testCase, index) => {
        test(`case ${index}: ${testCase.description}`, () => {
          // Salva referências originais
          const originalPlayer1 = c.player1;
          const originalPlayer2 = c.player2;
          const originalPlayer1Name = c.player1.name;
          const originalPlayer2Name = c.player2.name;
          const originalPlayer1Type = c.player1.type;
          const originalPlayer2Type = c.player2.type;

          // Executa setup específico do caso
          testCase.setup();

          // Verifica que o estado foi alterado
          const hasShips = c.player1.gameboard.ships.length > 0 || c.player2.gameboard.ships.length > 0;
          const hasMissedAttacks = c.player1.gameboard.missedAttacks.length > 0 || c.player2.gameboard.missedAttacks.length > 0;
          const isNotPlayer1Turn = !c.isPlayerTurn(c.player1);

          if (hasShips || hasMissedAttacks || isNotPlayer1Turn) {
            // Estado foi alterado, então o reset deve fazer diferença
          }

          // Executa reset
          c.resetGame();

          // Executa todas as verificações
          resetGameCases.stateVerification.forEach((verification) => {
            verification.verification(originalPlayer1, originalPlayer2);
          });

          // Verificação específica de preservação de nomes/tipos
          expect(c.player1.name).toBe(originalPlayer1Name);
          expect(c.player2.name).toBe(originalPlayer2Name);
          expect(c.player1.type).toBe(originalPlayer1Type);
          expect(c.player2.type).toBe(originalPlayer2Type);
        });
      });

      test('should handle reset from winning state', () => {
        // Setup um jogo onde player1 ganhou
        c.player1.gameboard.placeShip(2, 0, 0, true);
        c.player2.gameboard.placeShip(1, 5, 5, true);
        
        // Player1 ganha
        c.attack(c.player2, 5, 5);
        
        expect(c.getWinner()).toBe(c.player1);
        
        // Reset
        c.resetGame();
        
        // Não deveria haver vencedor
        expect(() => c.getWinner()).toThrow('No ships on gameboard!');
        
        // Deveria ser possível começar novo jogo
        c.player1.gameboard.placeShip(1, 0, 0, true);
        c.player2.gameboard.placeShip(1, 9, 9, true);
        
        expect(c.getWinner()).toBeNull();
      });

      test('should maintain consistent state after multiple resets', () => {
        for (let i = 0; i < 3; i++) {
          // Setup jogo
          c.player1.gameboard.placeShip(1, i, i, true);
          c.player2.gameboard.placeShip(1, 9-i, 9-i, true);
          c.changeTurn();
          
          // Reset
          c.resetGame();
          
          // Verificações
          expect(c.turn).toBe(c.player1);
          expect(c.player1.gameboard.ships).toHaveLength(0);
          expect(c.player2.gameboard.ships).toHaveLength(0);
        }
      });
    });

    describe('integration with game flow', () => {
      test('should maintain consistent turn state during attacks', () => {
        // Coloca navios
        c.player1.gameboard.placeShip(2, 0, 0, true);
        c.player2.gameboard.placeShip(2, 0, 0, true);
        
        // Player1 ataca
        expect(c.isPlayerTurn(c.player1)).toBe(true);
        c.attack(c.player2, 0, 0);
        
        // Muda turno
        c.changeTurn();
        expect(c.isPlayerTurn(c.player2)).toBe(true);
        
        // Player2 ataca
        c.attack(c.player1, 0, 0);
        
        // Turno ainda é do player2
        expect(c.isPlayerTurn(c.player2)).toBe(true);
      });

      test('should work correctly when game ends', () => {
        // Setup jogo que player1 vai ganhar
        c.player1.gameboard.placeShip(1, 0, 0, true);
        c.player2.gameboard.placeShip(1, 5, 5, true);
        
        // Player1 ataca e ganha
        expect(c.isPlayerTurn(c.player1)).toBe(true);
        c.attack(c.player2, 5, 5);
        
        // Jogo terminou, mas turno ainda é válido
        expect(c.getWinner()).toBe(c.player1);
        expect(c.isPlayerTurn(c.player1)).toBe(true);
      });
    });
  });

  describe('clearGame', () => {
    describe('Success cases', () => {
      test('should reset both players gameboards', () => {
        // Arrange: simula um estado de jogo com navios posicionados
        c.player1.gameboard.placeShip(2, 0, 0, true);
        c.player2.gameboard.placeShip(3, 1, 1, false);
        
        // Espiona os métodos resetGameboard
        const spy1 = jest.spyOn(c.player1.gameboard, 'resetGameboard');
        const spy2 = jest.spyOn(c.player2.gameboard, 'resetGameboard');

        // Act
        c.clearGame();

        // Assert
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);

        spy1.mockRestore();
        spy2.mockRestore();
      });

      test('should clear player1 attacks array', () => {
        // Arrange: adiciona alguns ataques ao array
        c.player1.attacks = [
          { row: 0, col: 0 },
          { row: 1, col: 1 },
          { row: 2, col: 2 }
        ];

        // Act
        c.clearGame();

        // Assert
        expect(c.player1.attacks).toEqual([]);
        expect(c.player1.attacks).toHaveLength(0);
      });

      test('should clear player2 attacks array', () => {
        // Arrange: adiciona alguns ataques ao array
        c.player2.attacks = [
          { row: 3, col: 3 },
          { row: 4, col: 4 },
          { row: 5, col: 5 },
          { row: 6, col: 6 }
        ];

        // Act
        c.clearGame();

        // Assert
        expect(c.player2.attacks).toEqual([]);
        expect(c.player2.attacks).toHaveLength(0);
      });

      test('should reset turn to player1', () => {
        // Arrange: muda o turno para player2
        c.turn = c.player2;

        // Act
        c.clearGame();

        // Assert
        expect(c.turn).toBe(c.player1);
      });

      test('should clear all game state components in one operation', () => {
        // Arrange: configura um estado de jogo complexo
        c.player1.gameboard.placeShip(4, 0, 0, true);
        c.player2.gameboard.placeShip(2, 2, 2, false);
        
        c.player1.attacks = [
          { row: 0, col: 0 },
          { row: 1, col: 1 }
        ];
        c.player2.attacks = [
          { row: 5, col: 5 },
          { row: 7, col: 7 },
          { row: 9, col: 9 }
        ];
        
        c.turn = c.player2;

        // Spies para verificar chamadas
        const resetSpy1 = jest.spyOn(c.player1.gameboard, 'resetGameboard');
        const resetSpy2 = jest.spyOn(c.player2.gameboard, 'resetGameboard');

        // Act
        c.clearGame();

        // Assert: verifica se todos os componentes foram resetados
        expect(resetSpy1).toHaveBeenCalledTimes(1);
        expect(resetSpy2).toHaveBeenCalledTimes(1);
        expect(c.player1.attacks).toEqual([]);
        expect(c.player2.attacks).toEqual([]);
        expect(c.turn).toBe(c.player1);

        resetSpy1.mockRestore();
        resetSpy2.mockRestore();
      });

      test('should work correctly when called multiple times consecutively', () => {
        // Arrange: configura estado inicial
        c.player1.attacks = [{ row: 0, col: 0 }];
        c.player2.attacks = [{ row: 1, col: 1 }];
        c.turn = c.player2;

        const resetSpy1 = jest.spyOn(c.player1.gameboard, 'resetGameboard');
        const resetSpy2 = jest.spyOn(c.player2.gameboard, 'resetGameboard');

        // Act: chama clearGame múltiplas vezes
        c.clearGame();
        c.clearGame();
        c.clearGame();

        // Assert: verifica se o estado permanece consistente
        expect(resetSpy1).toHaveBeenCalledTimes(3);
        expect(resetSpy2).toHaveBeenCalledTimes(3);
        expect(c.player1.attacks).toEqual([]);
        expect(c.player2.attacks).toEqual([]);
        expect(c.turn).toBe(c.player1);

        resetSpy1.mockRestore();
        resetSpy2.mockRestore();
      });

      test('should work correctly when called on fresh c instance', () => {
        // Arrange: c novo (sem configuração adicional)
        const resetSpy1 = jest.spyOn(c.player1.gameboard, 'resetGameboard');
        const resetSpy2 = jest.spyOn(c.player2.gameboard, 'resetGameboard');

        // Act
        c.clearGame();

        // Assert: deve funcionar mesmo com estado "limpo"
        expect(resetSpy1).toHaveBeenCalledTimes(1);
        expect(resetSpy2).toHaveBeenCalledTimes(1);
        expect(c.player1.attacks).toEqual([]);
        expect(c.player2.attacks).toEqual([]);
        expect(c.turn).toBe(c.player1);

        resetSpy1.mockRestore();
        resetSpy2.mockRestore();
      });
    });

    describe('Edge cases', () => {
      test('should handle arrays with different sizes', () => {
        // Arrange: arrays de ataques com tamanhos diferentes
        c.player1.attacks = new Array(100).fill({ row: 0, col: 0 });
        c.player2.attacks = [{ row: 1, col: 1 }];

        // Act
        c.clearGame();

        // Assert
        expect(c.player1.attacks).toEqual([]);
        expect(c.player2.attacks).toEqual([]);
      });

      test('should maintain object references after clearing', () => {
        // Arrange: guarda referências originais
        const originalPlayer1 = c.player1;
        const originalPlayer2 = c.player2;
        const originalGameboard1 = c.player1.gameboard;
        const originalGameboard2 = c.player2.gameboard;

        // Act
        c.clearGame();

        // Assert: referências dos objetos devem permanecer as mesmas
        expect(c.player1).toBe(originalPlayer1);
        expect(c.player2).toBe(originalPlayer2);
        expect(c.player1.gameboard).toBe(originalGameboard1);
        expect(c.player2.gameboard).toBe(originalGameboard2);
      });
    });

    describe('Integration tests', () => {
      test('should allow new game to start properly after clearing', () => {
        // Arrange: simula um jogo completo
        c.player1.gameboard.placeShip(2, 0, 0, true);
        c.player2.gameboard.placeShip(2, 1, 1, false);
        c.attack(c.player2, 1, 1);
        c.attack(c.player1, 0, 0);
        c.turn = c.player2;

        // Act: limpa o jogo
        c.clearGame();

        // Assert: deve ser possível iniciar um novo jogo
        expect(() => {
          c.player1.gameboard.placeShip(3, 0, 0, true);
          c.player2.gameboard.placeShip(3, 2, 2, false);
          c.attack(c.player2, 0, 0);
        }).not.toThrow();

        // Verifica se o novo estado foi aplicado corretamente
        expect(c.player1.attacks).toHaveLength(1);
        expect(c.turn).toBe(c.player1);
      });
    });
  });
});