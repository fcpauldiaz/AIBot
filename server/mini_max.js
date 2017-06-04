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
    return { v: (weightScore(board, playingColor) + judge(board)[playingColor]), legalMove: undefined };
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
  
  
  let nextStates = [];
  // get all possible states from legal moves
  validMoves.forEach((legalMove) => {
    const nextBoard = changeState(board, playingColor, legalMove);
    nextStates.push({ nextBoard, legalMove });
    // console.log(transformBoard(nextBoard));
  });  

  if (validMoves.length === 0) {
    // console.log('NO VALID MOVES');
    return { v: heuristic(board, playingColor), legalMove: undefined };
  }

  let nextPlayingColor = playingColor;
  if (depth > 0) {
    nextPlayingColor = getOpponentTileColor(nextPlayingColor);
  }
  
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
  for (let state of nextState) {
    v = Math.max(v, minimax(state.nextBoard, playerColor, playingColor, depth + 1, alpha_max, beta_min).v);
    state.v = v;
    // console.log('should compare');
    // console.log(v, beta_min);
    if (v >= beta_min) { 
      // console.log('max');
      // console.log({ v, legalMove: state.legalMove });
      return { v, legalMove: state.legalMove };
    }
    alpha_max = Math.max(alpha_max, v);
  }
  nextState.sort((a, b) => {
    return parseFloat(a.v) - parseFloat(b.v);
  });
  
  const rNext = nextState[nextState.length-1];
  return { rNext.v, legalMove: rNext.legalMove };
}

const minValue = (nextState, playerColor, playingColor, depth, alpha_max, beta_min) => {
  let v = Infinity;
  //console.log('length2' + nextState.length);
  for (let state of nextState) {
    v = Math.min(v, minimax(state.nextBoard,playerColor, playingColor, depth + 1, alpha_max, beta_min).v);
    state.v = v;
    if (v <= alpha_max) { 
      // console.log('min');
      // console.log({ v,  legalMove: state.legalMove });
      return { v,  legalMove: state.legalMove };
    }
    beta_min = Math.min(beta_min, v);
  };
  nextState.sort((a, b) => {
    return parseFloat(a.v) - parseFloat(b.v);
  });
  
  const rNext = nextState[0];
  return { rNext.v, legalMove: rNext.legalMove };
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
const heuristic = (board, my_color) => {
  let my_tiles = 0, opp_tiles = 0, i, j, k, my_front_tiles = 0, opp_front_tiles = 0, x, y;
  let p = 0, c = 0, l = 0, m = 0, f = 0, d = 0;
  const opp_color = getOpponentTileColor(my_color);
  let X1 = [-1, -1, 0, 1, 1, 1, 0, -1];
  let Y1 = [0, 1, 1, 1, 0, -1, -1, -1];
  for(i=0; i<8; i++) {
    for(j=0; j<8; j++)  {
      if(board[mapMatrix(i,j)] === my_color)  {
        d += SQUARE_WEIGHTS[mapMatrix(i, j)]
        my_tiles++;
      } else if(board[mapMatrix(i,j)] === opp_color)  {
        d -= SQUARE_WEIGHTS[mapMatrix(i, j)]
        opp_tiles++;
      }
      if(board[mapMatrix(i,j)] !== 0)   {
        for(k=0; k<8; k++)  {
          x = i + X1[k]; y = j + Y1[k];
          if(x >= 0 && x < 8 && y >= 0 && y < 8 && board[mapMatrix(x,y)] == '-') {
            if(board[mapMatrix(i,j)] == my_color)  my_front_tiles++;
            else opp_front_tiles++;
            break;
          }
        }
      }
    }
  }
  if(my_tiles > opp_tiles)
    p = (100.0 * my_tiles)/(my_tiles + opp_tiles);
  else if(my_tiles < opp_tiles)
    p = -(100.0 * opp_tiles)/(my_tiles + opp_tiles);
  else p = 0;

  if(my_front_tiles > opp_front_tiles)
    f = -(100.0 * my_front_tiles)/(my_front_tiles + opp_front_tiles);
  else if(my_front_tiles < opp_front_tiles)
    f = (100.0 * opp_front_tiles)/(my_front_tiles + opp_front_tiles);
  else f = 0;

// Corner occupancy
  my_tiles = opp_tiles = 0;
  if(board[mapMatrix(0,0)] == my_color) my_tiles++;
  else if(board[mapMatrix(0,0)] == opp_color) opp_tiles++;
  if(board[mapMatrix(0,7)] == my_color) my_tiles++;
  else if(board[mapMatrix(0,7)] == opp_color) opp_tiles++;
  if(board[mapMatrix(7,0)] == my_color) my_tiles++;
  else if(board[mapMatrix(7,0)] == opp_color) opp_tiles++;
  if(board[mapMatrix(7,7)] == my_color) my_tiles++;
  else if(board[mapMatrix(7,7)] == opp_color) opp_tiles++;
  c = 25 * (my_tiles - opp_tiles);

// Corner closeness
  my_tiles = opp_tiles = 0;
  if(board[mapMatrix(0,0)] === 0)   {
   if(board[mapMatrix(0,1)] == my_color) my_tiles++;
    else if(board[mapMatrix(0,1)] == opp_color) opp_tiles++;
    if(board[mapMatrix(1,1)] == my_color) my_tiles++;
    else if(board[mapMatrix(1,1)] == opp_color) opp_tiles++;
    if(board[mapMatrix(1,0)] == my_color) my_tiles++;
    else if(board[mapMatrix(1,0)] == opp_color) opp_tiles++;
  }
  if(board[mapMatrix(0,7)] === 0)   {
    if(board[mapMatrix(0,6)] == my_color) my_tiles++;
    else if(board[mapMatrix(0,6)] == opp_color) opp_tiles++;
    if(board[mapMatrix(1,6)] == my_color) my_tiles++;
    else if(board[mapMatrix(1,6)] == opp_color) opp_tiles++;
    if(board[mapMatrix(1,7)] == my_color) my_tiles++;
    else if(board[mapMatrix(1,7)] == opp_color) opp_tiles++;
  }
  if(board[mapMatrix(7,0)] === 0)   {
   if(board[mapMatrix(7,1)] == my_color) my_tiles++;
    else if(board[mapMatrix(7,1)] == opp_color) opp_tiles++;
    if(board[mapMatrix(6,1)] == my_color) my_tiles++;
    else if(board[mapMatrix(6,1)] == opp_color) opp_tiles++;
    if(board[mapMatrix(6,0)] == my_color) my_tiles++;
    else if(board[mapMatrix(6,0)] == opp_color) opp_tiles++;
  }
  if(board[mapMatrix(7,7)] === 0)   {
  if(board[mapMatrix(6,7)] == my_color) my_tiles++;
    else if(board[mapMatrix(6,7)] == opp_color) opp_tiles++;
    if(board[mapMatrix(6,6)] == my_color) my_tiles++;
    else if(board[mapMatrix(6,6)] == opp_color) opp_tiles++;
    if(board[mapMatrix(7,6)] == my_color) my_tiles++;
    else if(board[mapMatrix(7,6)] == opp_color) opp_tiles++;
  }
  l = -12.5 * (my_tiles - opp_tiles);
  my_tiles = num_valid_moves(my_color, board);
  opp_tiles = num_valid_moves(opp_color, board);
  if(my_tiles > opp_tiles)
    m = (100.0 * my_tiles)/(my_tiles + opp_tiles);
  else if(my_tiles < opp_tiles)
    m = -(100.0 * opp_tiles)/(my_tiles + opp_tiles);
  else m = 0;

  // final weighted score
  let score = (10 * p) + (801.724 * c) + (382.026 * l) + (78.922 * m) + (74.396 * f) + (10 * d);
  return score;

}

const num_valid_moves = (board, playingColor) => {
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
  return validMoves.length;
}