import { SQUARE_WEIGHTS, N } from './constants';
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

export const hMove = (board, playing_color) => {
  const modBoard = transformBoard(board);
  let validMoves = [];
  for (let x = 0; x < modBoard.length; x++) {
    for (let y = 0; y < modBoard[x].length;y++) {
      let legal = legalMove(x, y, playing_color, modBoard);
      if (legal.legal === true) {
        const pos = x * N + y;
        validMoves.push({pos, weight: legal.weight + SQUARE_WEIGHTS[pos]});
      }
    }
  }
  console.log(validMoves);
  const movement = validMoves.reduce(function(prev, curr) {
      return prev.weight > curr.weight ? prev : curr;
  });
  return movement;

}