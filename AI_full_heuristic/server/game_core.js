export const transformBoard = (board) => {
  let returnArray = [];
  let innerArray = [];
  for(let i = 1; i < board.length+1; i++) {
    innerArray.push(board[i-1]);
    if (i%8 === 0 && i !== 0) {
      returnArray.push(innerArray);
      innerArray = [];
    }
  }
  return returnArray;
}

export const mapMatrix = function(x, y) {
  return x + y * 8;
}

export const legalMove = (r, c, color, boardMod) => {
  let board = boardMod.map(a => Object.assign({}, a));
  let legalObj = { legal: false, weight: 0 };
  if (board[r][c] === 0) {
    // Initialize variables
    let posX;
    let posY;
    let found;
    let current;
    
    // Searches in each direction
    // x and y describe a given direction in 9 directions
    // 0, 0 is redundant and will break in the first check
    for (let x = -1; x <= 1; x++)
    {
      for (let y = -1; y <= 1; y++)
      {
        // Variables to keep track of where the algorithm is and
        // whether it has found a valid move
        posX = c + x;
        posY = r + y;
        found = false;

        try {
          current = board[posY][posX];
        } catch(err){
          continue;
        }
        
        // Check the first cell in the direction specified by x and y
        // If the cell is empty, out of bounds or contains the same color
        // skip the rest of the algorithm to begin checking another direction
        if (current === undefined || current === 0 || current === color)
        {
          continue;
        }
        
        // Otherwise, check along that direction
        while (!found)
        {
          // console.log(x, y);
          // console.log(posX, posY)
          // console.log('before');
          posX += x;
          posY += y;
          

          try {
            current = board[posY][posX];
          } catch(err) {
            current = undefined;
          }
          // console.log(color);
          // console.log(x, y);
          // console.log(posX, posY);
          // console.log(current === color);
          // If the algorithm finds another piece of the same color along a direction
          // end the loop to check a new direction, and set legal to true
          if (current === color)
          {
            found = true;
            legalObj.legal = true;
            legalObj.weight += 1
            
          }
          // If the algorithm reaches an out of bounds area or an empty space
          // end the loop to check a new direction, but do not set legal to true yet
          else if (current !== 0)
          {
            //keep searching
            found = true;
            // console.log('should keep searching');
            
            // console.log(posX, posY);
            while(true) {
              try {
                current = board[posY][posX];
              } catch(err) {
                break;
              }
              posX += x;
              posY += y;
              legalObj.weight += 1
              if (current === color) {
                legalObj['legal'] = true;
                break;
              }
              if (current === 0 || current === undefined){
                break;
              }
              // console.log(current);

            }
          }
          else {
            found = true; //current = 0 break looop
          }
        }
      }
    }
  }
  return legalObj;
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