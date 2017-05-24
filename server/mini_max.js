import { legalMove, transformBoard, mapMatrix } from './game_core';
import { 
    changeState, 
    getOpponentTileColor, 
    judge, fullBoard } from './board_functions';
import { BLACK, WHITE, N, EMPTY, TERMINAL, SQUARE_WEIGHTS } from './constants';

// mini max implementation
// recursive
export const minimax = (board, playerColor, playingColor, depth, max_value, min_value) => {
  // console.log(depth);
  // console.log(TERMINAL, 'finish');
  if (depth >= TERMINAL || fullBoard(board)) {
    return { v: (weightScore(board, playingColor)+judge(board)[playingColor]), legalMove: undefined };
  }
  let stateScore = { score: 0 , movement: undefined };
  let max_or_min = undefined;
  // maximize
  if (playerColor === playingColor) {
    max_or_min = true;
  }
  // minimize
  if (playerColor !== playingColor) {
    max_or_min = false;
  }

  // get all valid moves
  const validMoves = getAllValidMoves(board, playingColor);
  
  const modBoard = transformBoard(board);
  // console.log(modBoard);
  
  // console.log(validMoves);
  
  let nextStates = [];
  // get all possible states from legal moves
  validMoves.forEach((legalMove) => {
    const nextBoard = changeState(board, playingColor, legalMove);
    nextStates.push({ nextBoard, legalMove });
    // console.log(transformBoard(nextBoard));
  });  

  if (validMoves.length === 0) {
    // console.log('NO VALID MOVES');
    return { v: (weightScore(board, playingColor)+judge(board)[playingColor]), legalMove: undefined };
  }

  const nextPlayingColor = getOpponentTileColor(playingColor);
  
  // maximize 
  if (max_or_min === true) {
    return maxValue(nextStates, playerColor, nextPlayingColor, depth,  max_value, min_value);
  }
  // minimize
  if (max_or_min === false) {
    return minValue(nextStates, playerColor, nextPlayingColor, depth,  max_value, min_value);
  }
  
}

const maxValue = (nextState, playerColor, playingColor, depth, alpha_max, beta_min) => {
  let v = -Infinity;
  // console.log('length1' + nextState.length);
  nextState.forEach((state) => {
    v = Math.max(v, minimax(state.nextBoard, playerColor, playingColor, depth + 1, alpha_max, beta_min).v);
    // console.log('should compare');
    // console.log(v, beta_min);
    alpha_max = Math.max(alpha_max, v);
    if (beta_min <= alpha_max) { 
      // console.log('max');
      // console.log({ v, legalMove: state.legalMove });
      return { v, legalMove: state.legalMove };
    }
   
  });
  const random = Math.floor(Math.random() * nextState.length);
  // console.log('random', random);
  return { v, legalMove: nextState[random].legalMove };
}

const minValue = (nextState, playerColor, playingColor, depth, alpha_max, beta_min) => {
  let v = Infinity;
  //console.log('length2' + nextState.length);
  nextState.forEach((state) => {
    v = Math.min(v, minimax(state.nextBoard,playerColor, playingColor, depth + 1, alpha_max, beta_min).v);
    beta_min = Math.min(beta_min, v);
    if (beta_min <= alpha_max) { 
      // console.log('min');
      // console.log({ v,  legalMove: state.legalMove });
      return { v,  legalMove: state.legalMove };
    }
   
  });
  const random = Math.floor(Math.random() * nextState.length);
  // console.log('random', random);
  
  return { v, legalMove: nextState[random].legalMove };
}

const getAllValidMoves = (board, playingColor) => {
  let validMoves = [];
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      let legal = legalMove(x, y, playingColor, board);
      if (legal === true) {
        const legalMove = mapMatrix(x, y);
        validMoves.push(legalMove);
        //otherValid.push({ x, y });
      }
    }
  }
  return validMoves;
}

const weightScore = (board, playingColor) => {
  const otc = getOpponentTileColor(playingColor);
  let score = 0;
  for (let x = 0; x < N*N; x++) {
    if (board[x] === playingColor) {
      score += SQUARE_WEIGHTS[x];
    }
    if (board[x] === otc) {
      score -= SQUARE_WEIGHTS[x];
    }
  }
  return score;
}