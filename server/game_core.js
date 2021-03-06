import { N } from './constants';

export const transformBoard = (board) => {
  let returnArray = [];
  let innerArray = [];
  for(let i = 1; i < board.length+1; i++) {
    innerArray.push(board[i-1]);
    if (i%N === 0 && i !== 0) {
      returnArray.push(innerArray);
      innerArray = [];
    }
  }
  return returnArray;
}

export const mapMatrix = function(x, y) {
  return x + y * N;
}

export const legalMove = (r, c, color, board) => {
  
  
  let legal = false;
  if (board[mapMatrix(r, c)] === 0) {
    // init vars
    let posX;
    let posY;
    let found;
    let current;
    
    // Searches in each direction
    // x and y describe a given direction in 9 directions
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
          current = board[mapMatrix(posY, posX)];
        } catch(err){
          continue;
        }
        
        // Check the first cell in the direction specified by x and y
        // If the cell is empty, out of bounds or contains the same color
        // skip the rest of the algorithm to begin checking another direction
        if (current === undefined || current === 0 || current === color || (x === 0 && y === 0))
        {
          continue;
        }
        
        // check along that direction
        while (!found)
        {

          posX += x;
          posY += y;
          

          try {
            current = board[mapMatrix(posY, posX)];
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
            legal = true;
            
          }
          // keep checking until not more legal
          else if (current !== 0)
          {
            //keep searching
            found = true;
            // console.log('should keep searching');
            
            // console.log(posX, posY);
            while(true) {
              try {
                current = board[mapMatrix(posY, posX)];
              } catch(err) {
                break;
              }
              posX += x;
              posY += y;
              
              if (current === color) {
                legal =  true;
                break;
              }
              if (current === 0 || current === undefined){
                break;
              }

            }
          }
          else {
            found = true; //current = 0 break looop
          }
        }
      }
    }
  }
  return legal;
}


