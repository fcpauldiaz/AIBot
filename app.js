/**
 * Universidad del Valle de Guatemala
 * 7/05/2017
 * Artificial intelligence
 */
import io from 'socket.io-client';
import prompt from 'prompt';
import { minimax } from './server/mini_max';
import { hMove } from './server/heuristic';
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
        const board = data.board;


        console.log('play', playerTurnID);
        const movement = minimax(board, playerTurnID, playerTurnID, 0, -Infinity, Infinity);
        const h_move = hMove(board, playerTurnID);
        let move = -1;
        if (h_move.weight > movement.v) {
          move = h_move.pos;
        } else {
          move = movement.legalMove;
        }


        console.log('****** MOVEMENT *****');
        console.log(movement);

        socket.emit('play', {
          tournament_id: socket.tournament_id,
          player_turn_id: playerTurnID,
          game_id: gameID,
          movement: move
        });
      });

      socket.on('finish', (data) => {
        const game_id = data.game_id;
        const player_turn_id = data.player_turn_id;
        const winnerTurnID = data.winner_turn_id;

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


