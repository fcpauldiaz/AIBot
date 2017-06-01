/**
 * Universidad del Valle de Guatemala
 * 7/05/2017
 * Artificial intelligence
 */
import io from 'socket.io-client';
import prompt from 'prompt';
import { transformBoard, legalMove } from './server/game_core';
import { getTilePositionsToFlip } from './server/board_functions';
const readline = require('readline');
const SQUARE_WEIGHTS  = [
  20, -3, 11,  8,  8,  11, -3, 20,
  -3, -7, -4,  1,  1, -4, -7, -3,
  11, -4,  2,  2,  2,  2, -4, 11,
  8,  1,  2,  -3,  -3,  2,  1, 8,
  8,  1,  2,  -3, -3,  2,  1,  8,
  11, -4,  2,  2,  2,  2, -4,  11,
  -3, -7, -4,  1,  1, -4, -7, -3,
  20, -3,  11,  8,  8,  11, -3, 20
];
const SQUARE_WEIGHTS2  = [
  4,  -3,  2,  2,  2,  2, -3,  4,
  -3, -10, -1, -1, -1, -1, -10, -3,
  2,  -1,  1,  0,  0,  1, -1,  2,
  2,  -1,  0,  1,  1,  0, -1,  2,
  2,  -1,  0,  1,  1,  0, -1,  2,
  2,  -1,  1,  0,  0,  1, -1,  2,
  -3, -10, -1, -1, -1, -1, -10, -3,
  4,  -3,  2,  2,  2,  2, -3,  4
];

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
        socket.tiro = 0;
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
              const pos = x * 8 + y;
              //const h = getTilePositionsToFlip(data.board, playerTurnID, pos);
              //validMoves.push({pos, weight: h.length + SQUARE_WEIGHTS2[pos]});
              validMoves.push({ pos, weight: legal.weight + SQUARE_WEIGHTS2[pos] });
              otherValid.push({x, y});
            }
          }
        }
        //legalMove(3, 2, 1, modBoard);
        const movement = validMoves.reduce(function(prev, curr) {
            return prev.weight > curr.weight ? prev : curr;
        });
        socket.tiro += 1;
        // console.log(validMoves);
        // console.log(otherValid);
        // console.log(modBoard);
        // console.log(movement);
       


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
        console.log(socket.tiro, 'total tiros');
        socket.tiro = 0;
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