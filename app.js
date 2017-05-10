/**
 * Universidad del Valle de Guatemala
 * 7/05/2017
 * Artificial intelligence
 */
import io from 'socket.io-client';
import prompt from 'prompt';
import { transformBoard, legalMove } from './server/game_core';
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter full port : ', (full_port) => {
  rl.question('Enter tournament id : ', (id) => {
    rl.question('Enter username : ', (username) => {
      
      const socket = io('http://'+full_port);
      socket.on('connect', () => {
        socket.emit('signin', {
          user_name: username,
          tournament_id: id,
          user_role: 'player'
        });
        socket.tournament_id = id;
      });

      socket.on('ok_signin', () => {
        console.log("sucess sign in");
      });

      socket.on('ready', (data) => {
        const gameID = data.game_id;
        const playerTurnID = data.player_turn_id;
        const modBoard = transformBoard(data.board);
        let validMoves = [];
        let otherValid = [];
        for (let x = 0; x < modBoard.length; x++) {
          for (let y = 0; y < modBoard[x].length;y++) {
            let legal = legalMove(x, y, playerTurnID, modBoard);
            if (legal.legal === true) {
              validMoves.push({pos:(x*8+y), weight: legal.weight});
              otherValid.push({x, y});
            }
          }
        }
        //legalMove(3, 2, 1, modBoard);
        const movement = validMoves.reduce(function(prev, curr) {
            return prev.weight > curr.weight ? prev : curr;
        });
        console.log(otherValid);
        console.log(modBoard);
        console.log(movement);
        
        socket.emit('play', {
          tournament_id: socket.tournament_id,
          player_turn_id: playerTurnID,
          game_id: gameID,
          movement: movement.pos
        });
      });

      socket.on('finish', (data) => {
        const game_id = data.game_id;
        const player_turn_id = data.player_turn_id;
        const winnerTurnID = data.winner_turn_id;
        console.log(player_turn_id === winnerTurnID? 'winner':'looser');
        console.log('finish');  
        socket.emit('player_ready', {
          tournament_id: socket.tournament_id,
          game_id,
          player_turn_id
        });
      });

      socket.on('disconnect', () => {
        console.log('disconnect');
      });
    rl.close();
    });
  });
});


