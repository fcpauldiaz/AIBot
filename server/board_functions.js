// function to flip positions

import { BLACK, WHITE, N, EMPTY } from 'constants';
 
/*
 * board  1D array
 * playingColor 1 or 0
 * position tile movement
 */
export const getTilePositionsToFlip = (board, playingColor, position) => {

  const otc = getOpponentTileColor(playingColor);

  // Possible move directions
  const deltaDirections ={
    down: ix(0, 1), // Down
    right_down: ix(1, 1), // Right down
    right: ix(1, 0), // Right
    right_up: ix(1, -1), // Right up
    up: ix(0, -1), // Up
    left_up: ix(-1, -1), // Left up
    left: ix(-1, 0), // Left
    left_down: ix(-1, 1) // Left down
  };

  // Auxiliar movement directions
  const lefts = [
        deltaDirections.left,
        deltaDirections.left_down,
        deltaDirections.left_up
      ],
      rights = [
          deltaDirections.right,
          deltaDirections.right_down,
          deltaDirections.right_up
      ];

  // Calculate which tiles to flip
  let  tilePositionsToFlip = [];

  // For each movement direction
  for (movementKey in deltaDirections){

    // Movement delta
    let movementDelta = deltaDirections[movementKey],

    // Position tracker
        cPosition = position,

    // Tiles positions captured over this movement direction
        positionsToFlip = [],

    // Flag indicating if theere are tiles to capture in this movement direction
        shouldCaptureInThisDirection = false;

    // While position tracker is on board
    while(isOnBoard(cPosition)){

      // Avoid logic on first tile
      if(cPosition !== position){

        // If in this new position is an opponent tile
        if(board[cPosition] === otc){
          positionsToFlip.push(cPosition);
        }
        else{

          // If the current position contains an empty tile, means that we didn't
          // reach a tile of the same color, therefore shouldn't flip any coin in
          // this direction. Else, if the current position holds a tile with the
          // same color of the playing turn, we should mark our findings to turn
          shouldCaptureInThisDirection = board[cPosition] !== EMPTY;
          break;
        }
      }

      // Check if next movement is going to wrap a row

      // Off board
      if((cPosition % N === 0 && lefts.indexOf(movementDelta) > -1) ||
        ((cPosition % N === N - 1) && rights.indexOf(movementDelta) > -1))
        break;

      // Move
      cPosition += movementDelta;
    }

    // If we should capture
    if(shouldCaptureInThisDirection){
      for(var i = 0; i < positionsToFlip.length; i++){
        tilePositionsToFlip.push(positionsToFlip[i]);
      }
    }
  }

  return tilePositionsToFlip;
};
const ix = (x, y) => {
  return x + y * N;
}
const isOnBoard = (position) => {
  return position >= 0 && position < Math.pow(N, 2);
}

const getOpponentTileColor = (tileColor) => {
  return tileColor === BLACK ? WHITE : BLACK;
}

export const judge = (board) => {
  let judgement = {};
  judgement[BLACK] = 0;
  judgement[WHITE] = 0;
  judgement[EMPTY] = 0;

  for(let i = 0; i < board.length; i++){
    judgement[board[i]]++;
  }

  return judgement;
}