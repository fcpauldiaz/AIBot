/**
 * Universidad del Valle de Guatemala
 * 7/05/2017
 * Artificial intelligence
 */
import io from 'socket.io-client';
import prompt from 'prompt';


const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter full port : ', (full_port) => {
  rl.question('Enter tournament id : ', (id) => {
      
    const socket = io('http://'+full_port);
    socket.on('connect', () => {
      socket.emit('signin', {
        user_name: "fcpauldiaz",
        tournament_id: +id,
        user_role: 'player'
      });
    });
    socket.on('event', () => {

    });

    socket.on('ok_signin', () => {
      console.log("sucess sign in");
    });

    socket.on('ready', (data) => {
      var gameID = data.game_id;
      var playerTurnID = data.player_turn_id;
      var board = data.board;
      
      console.log(playerTurnID);
      
    });

    socket.on('finish', (data) => {
      var gameID = data.game_id;
      var playerTurnID = data.player_turn_id;
      var winnerTurnID = data.winner_turn_id;
      var board = data.board;
      console.log('finish');  


    });

    socket.on('disconnect', () => {

    });
    rl.close();
  });
});


