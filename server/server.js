/**
 * Server Management
 * Newton Labs
 * 5/02/2017
 */

const serverGame = module.exports = { games: [], game_count:0 };
import UUID from 'uuid';
import Player from '../client/player';
import Game from './game_core';
import FallingObject from '../client/fallingObject';



serverGame.createGame = function(playerId) {
  const actualGame = new Game(
    UUID(), 
    [new Player(playerId, 1)],
    1
  );
  //Store it in the list of game
  this.games.push(actualGame);
  //Keep track
  this.game_count++;
  //return game id
  return { game_id: actualGame.getId(), player_number:1 };
}

serverGame.joinGame = function(i, id) {
  const player_number = this.games[i].addPlayer(id);
  //return game id;
  return { 
    game_id: this.games[i].getId(),
    player_number
  }; 
}

serverGame.leaveGame = function(i, indexPlayer) {
  this.games[i].removePlayer(indexPlayer);
}

serverGame.findGame = function(playerId, game_id) {
  //create first game
  if (this.game_count === 0) {
    return this.createGame(playerId);
  }
  //find for an existing game
  for (let i = 0; i < this.games.length; i++) {
    //if (this.games[i].getId() === game_id) {
      const count = this.games[i].getPlayerCount();
      if (count <= 3) {
        return this.joinGame(i, playerId);
      }
    //}
  }
  //if all games are full
  return this.createGame(playerId);
}

serverGame.endGame = function (playerId) {
  if (this.game_count !== 0) {
    for (let i = 0; i < this.games.length; i++) {
      let game = this.games[i];
      for (let j = 0; j < game.getPlayers().length; j++) {
        let player = game.findPlayer(j);
        if (player.getPlayerId() === playerId) {
          this.leaveGame(i, player.getPlayerNumber()-1);
          if (game.getPlayerCount() === 0) {
            this.games.splice(i, 1);
            this.game_count--;
          }
        }
      }//end inner for
    }//end outer for
  } 
}

serverGame.updatePlayerPosition = function(playerUpdate, user_id) {
  for (let i = 0; i < this.games.length; i++) {
    let game = this.games[i];
    for (let j = 0; j < game.getPlayers().length; j++) {
      let player = game.findPlayer(j);
      if (player.getPlayerId() === user_id) {
        player.updatePos(playerUpdate.x);
        player.setTeam(playerUpdate.team);
        player.setTeamSelected(playerUpdate.teamSelected);
      }
    }//end inner for
  }//end outer for
}

serverGame.getPlayersPosition = function(game_id, user_id) {
  let players = [];
  for (let i = 0; i < this.games.length; i++) {
    let game = this.games[i];
    if (game.getId() === game_id) {
      for (let j = 0; j < game.getPlayers().length; j++) {
        let playerObj = new Object();
        let player = game.findPlayer(j);
        if (player.getPlayerId() !== user_id) {
          let pos = player.getPos();
          playerObj.x = pos.x;
          playerObj.y = pos.y;
          playerObj.number = player.getPlayerNumber();
          playerObj.team = player.getTeam();
          playerObj.teamSelected = player.getTeamSelected();
          players.push(playerObj);
        }
      }//end inner for
    }// end if game_id
  }//end outer for
  return players;
}

serverGame.getPlayersFullPosition = function(game_id, user_id) {
  let players = [];
  for (let i = 0; i < this.games.length; i++) {
    let game = this.games[i];
    if (game.getId() === game_id) {
      for (let j = 0; j < game.getPlayers().length; j++) {
        let player = game.findPlayer(j);
        if (player.getPlayerId() !== user_id) {
          players.push(player);
        }
      }//end inner for
    }// end if game_id
  }//end outer for
  return players;
}

//CHAPI RACING ALGORITHIM
serverGame.addObject = function(game_id, pos_x, pos_y) {
  for (let i = 0; i < this.games.length; i++) {
    let game = this.games[i];
    if (game.getId() === game_id) {
      game.addObject(new FallingObject(pos_x, pos_y));
    }
  }
}

serverGame.addNewObject = function(game_id, object) {
  for (let i = 0; i < this.games.length; i++) {
    let game = this.games[i];
    if (game.getId() === game_id) {
      game.addObject(object); 
    }
  }
}

serverGame.broadCastObjects = function(game_id) {
  for (let i = 0; i < this.games.length; i++) {
    let game = this.games[i];
    if (game.getId() === game_id) {
      return game.getObjects();
    }
  }
}

serverGame.removeObject = function(game_id, object_id) {
  for (let i = 0; i < this.games.length; i++) {
    let game = this.games[i];
    if (game.getId() === game_id) {
      game.removeObject(object_id);
      return object_id;
    }
  }
}

serverGame.getPlayerType = function(game_id, player_id) {
  for (let i = 0; i < this.games.length; i++) {
    let game = this.games[i];
    if (game.getId() === game_id) {
      return game.getPlayerType(player_id);
    }
  }
}

serverGame.prepareNewState = function(game_id) {
  for (let i = 0; i< this.games.length; i++) {
    let game = this.games[i];
    if (game.getId() === game_id && game.getValid() === false) {
      let players = game.getPlayers();
      for (let j = 0; j < players.length; j++) {
        let player = players[j];
        player.setPlayerType(game.getPlayerActualType(player.getTeam()));
        player.setInitialX();
      }
      game.setTypesValid();
      return players;
    }
  }
}

serverGame.sendNewState = function(game_id) {
  for (let i = 0; i< this.games.length; i++) {
    let game = this.games[i];
    if (game.getId() === game_id) {
      let players = game.getPlayers();
      return players;
    }
  }
}

