import Player from '../client/player';
import FallingObject from '../client/fallingObject';

export default class Game {
  constructor(id, players, playerCount)  {
    this.id = id;
    this.players = players;
    this.numberAvailable = [2, 3, 4];
    this.team1Type = ['bomber', 'car'];
    this.team2Type = ['bomber', 'car'];
    this.objectsArray = [];
    this.playerCount = playerCount;
    this.typesValid = false;
  }
  
  getId() {  
    return this.id; 
  }

  setTypesValid() {
    this.typesValid = true;
  }

  getValid() {
    return this.typesValid;
  }

  increasePlayerCount() {
    this.playerCount++;
  }

  decreasePlayerCount() {
    this.playerCount--;
  }

  removePlayer(index) {
    this.players.splice(index, 1);
    this.addNumber(index);
    this.decreasePlayerCount();
  }

  addPlayer(id) {
    this.increasePlayerCount();
    const playerNum = this.getPlayerNumber();
    this.players.push(new Player(id, playerNum));
    return playerNum;
  }

  getPlayers() {
    return this.players;
  }

  findPlayer(index) {
    return this.players[index];
  }

  getPlayerCount() {
    return this.playerCount;
  }

  addObject(object) {
    this.objectsArray.push(new FallingObject(object));
  }

  removeObject(object_id) {
    for (let i = 0; i < this.objectsArray.length; i++) {
      const object = this.objectsArray[i];
      if (object.getId() === object_id) {
        //remove object from array
        this.objectsArray.splice(i, 1);
        //nothing else to do;
        return;
      }
    }
  }

  getObjects() {
    return this.objectsArray;
  }

  getObjectsLength() {
    return this.objects.length;
  }
  //use when player is added
  getPlayerNumber() {
    return this.numberAvailable.shift();
  }
  //use when player retires from game
  addNumber(number) {
    //inserts at first position
    this.numberAvailable.unshift(number+1);
    this.numberAvailable = this.numberAvailable.sort();
  }

  getPlayerActualType(team) {
    if (team === 1) {
        return this.team1Type.shift();
    }
    if (team === 2) {
      return this.team2Type.shift();
    }
    console.log('team not found')
    console.log(team)
    return -1;
  }

   getPlayerType(player_id) {

    for (let i = 0; i < this.players.length; i++) {
      let player = this.players[i];
      if (player.getPlayerId() === player_id) {
        if (player.getTeam() === 1) {
          const type = this.team1Type.shift();
          return type;
        }
        if (player.getTeam() === 2) {
          const type = this.team2Type.shift();
          return type;
        }
      }
    }
    return -1; //should get here, error
  }

}
