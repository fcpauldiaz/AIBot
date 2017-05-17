import { legalMove, transformBoard, mapMatrix } from './game_core';
import { 
    changeState, 
    getOpponentTileColor, 
    judge } from './board_functions';
import { BLACK, WHITE, N, EMPTY, TERMINAL } from './constants';
// mini max implementation
// recursive
// 
export const minimax = (board, playerColor, playingColor, depth, max_value, min_value) => {
  if (depth >= TERMINAL) {
    return judge(board)[playingColor];
  }
  let stateScore = { score: 0 , movement: undefined };
  let max_or_min = undefined;
  //maximize
  if (playerColor === playingColor) {
    max_or_min = true;
  }
  //minimize
  if (playerColor !== playingColor) {
    max_or_min = false;
  }

  //get valid moves
  let validMoves = [];
  let otherValid = [];
  let possibleBoards = [];
  const modBoard = transformBoard(board);
  console.log(modBoard);
  for (let x = 0; x < modBoard.length; x++) {
    for (let y = 0; y < modBoard[x].length; y++) {
      let legal = legalMove(x, y, playingColor, board);
      if (legal === true) {
        const legalMove = mapMatrix(x, y);
        validMoves.push(legalMove);
        otherValid.push({ x, y });
      }
    }
  }
  // console.log(validMoves);
  // console.log(otherValid);
  let nextStates = [];
  //get all possible states from legal moves
  validMoves.forEach((legalMove) => {
    const nextBoard = changeState(board, playingColor, legalMove);
    nextStates.push({ nextBoard, legalMove });
    //console.log(transformBoard(nextBoard));
  });  
  nextStates.forEach((nextBoard) => {
    //const nextPlayingColor = getOpponentTileColor(playingColor);
    let nextScore = minimax(nextBoard.nextBoard, playingColor, alpha+1, beta);
    console.log('next', nextScore);
    stateScore.movement = nextBoard.legalMove;
    if (playingColor === BLACK) {
      // BLACK wants to maximize --> update stateScore iff nextScore is larger
      if (nextScore > stateScore) { 
        stateScore.score = nextScore;
      }
      else {
        // WHITE wants to minimize --> update stateScore iff nextScore is smaller
        if(nextScore < stateScore) {
          stateScore.score = nextScore;
        }
      }
    }
  });
  console.log(stateScore);
  return stateScore;
  
}

const maxValue = (boards, depth, max_value, min_value) => {
  let v = -10000;
  boards.forEach((nextBoard) => {
    v = max(v, minimax(nextBoard, depth + 1, max_value, min_value));
    if (v >= min_value) { 
      return v;
    }
    max_value = max(max_value, v);
  });
  return v;
}

const minValue = (boards, depth, max_value, min_value) => {
  let v = 10000;
  boards.forEach((nextBoard) => {
    v = min(v, minimax(nextBoard, depth + 1, max_value, min_value));
    if (v <= min_value) { 
      return v;
    }
    max_value = min(max_value, v);
  });
  return v;
}