function create2dArray(height : number, width : number) {
    const arr = [];
    
    for(let y = 0; y < height; y++) {
        const row = [];
        for(let x = 0; x < width; x++) {
            row.push(0);
        }
        arr.push(row);
    }

    return arr;
}

function printGrid(grid : number[][]) {
    let final = "";
    for(const row of grid) {
        final += row.join("") + "\n";
    }
    console.log(final);
}

export function getGrid(filledCells : Set<number>, width : number, height : number) {
    const grid = create2dArray(height, width);

    for(const idx of filledCells.values()) {
        const x = Math.floor(idx / width);
        const y = idx % width;
        grid[x][y] = 1;
    }

    return grid;
}

function flood(grid : number[][], x : number, y : number, id : number, outputGrid : number[][]) {
    const height = grid.length;
    const width = grid[0].length;

    if(x < 0 || x >= width || y < 0 || y >= height || grid[x][y] == 0 || outputGrid[x][y] == id)
    {
        return;
    }

    outputGrid[x][y] = id;
    
    flood(grid, x + 1, y, id, outputGrid);
    flood(grid, x - 1, y, id, outputGrid);
    flood(grid, x, y + 1, id, outputGrid);
    flood(grid, x, y - 1, id, outputGrid);
}

function getBoundingForId(grid : number[][], id : number) {
    const height = grid.length;
    const width = grid[0].length;

    let minX = Infinity;
    let maxX = -1;
    let minY = Infinity;
    let maxY = -1;

    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            if(grid[x][y] != id) {
                continue;
            }

            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
    }

    return [minX, minY, maxX, maxY];
}

function get2dSlice(grid : number[][], bounds : number[]) {
    const [sx, sy, ex, ey] = bounds;
    const slicedGrid = grid.slice(sx, ex + 1).map(i => i.slice(sy, ey + 1));
    return slicedGrid;
}

export function getPieces(grid : number[][]) {
    const height = grid.length;
    const width = grid[0].length;
    const outputGrid = create2dArray(height, width);

    let currentId = 1;
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            if(grid[x][y] != 0 && outputGrid[x][y] == 0) {
                flood(grid, x, y, currentId, outputGrid);
                currentId++;
            }
        }
    }

    const pieces = [];
    for(let id = 1; id < currentId; id++) {
        const piece = get2dSlice(outputGrid, getBoundingForId(outputGrid, id));

        const h = piece.length;
        const w = piece[0].length;
    
        for(let y = 0; y < h; y++) {
            for(let x = 0; x < w; x++) {
                piece[y][x] = piece[y][x] == id ? 1 : 0;
            }
        }

        pieces.push(piece);
    }

    return pieces;
}

export function deepcopyGrid(arr : number[][]) {
    return JSON.parse(JSON.stringify(arr));
}

function gridString(grid : number[][]) {
    return JSON.stringify(grid);
}

class ObjectSet extends Set{
    add(elem : object){
      return super.add(JSON.stringify(elem));
    }
    has(elem : object){
      return super.has(JSON.stringify(elem));
    }
}

function pieceCanBePlaced(grid : number[][], piece : number[][], x : number, y : number) {

    const height = grid.length;
    const width = grid[0].length;
    const pieceHeight = piece.length;
    const pieceWidth = piece[0].length;
    const rightMost = x + pieceWidth - 1;
    const bottomMost = y + pieceHeight - 1; 

   // console.log(x, y, rightMost, bottomMost)
   // printGrid(grid);
    //printGrid(piece)

    if (x < 0 || x >= width || y < 0 || y >= height) {
        //console.log("oob", x, y, width, height)
        return false;
    }

    if (rightMost >= width || bottomMost >= height) {
        //console.log("bad bad", rightMost, bottomMost)
        return false;
    }
    
    const gridSlice = get2dSlice(grid, [y, x, bottomMost, rightMost]);

    //printGrid(piece);
    //printGrid(gridSlice);
    for(let y = 0; y < pieceHeight; y++) {
        for(let x = 0; x < pieceWidth; x++) {
            if(piece[y][x] != 0 && gridSlice[y][x] != 0)
            {
                return false;
            }
        }
    }

    return true;
}


function placePiece(grid : number[][], piece : number[][], x : number, y : number, id : number) {
    //console.log("placing at",x,y)
    const pieceHeight = piece.length;
    const pieceWidth = piece[0].length;

    for(let dy = 0; dy < pieceHeight; dy++) {
        for(let dx = 0; dx < pieceWidth; dx++) {
            if(piece[dy][dx] != 0) {
                grid[y + dy][x + dx] = id;
            }
        }
    }

    return true;
}

export function solve(grid : number[][], pieces : number[][][], onSolve : (grid : number[][]) => void) {
    return solveRecursive(grid, pieces, pieces.length - 1, 0, 0, new ObjectSet(), onSolve);
}

function solveRecursive(grid : number[][], pieces : number[][][], pieceIndex : number, x : number, y : number, seenAlready : ObjectSet, onSolve : (grid : number[][]) => void) : boolean {
    //console.log(failedSet)

    const height = grid.length;
    const width = grid[0].length;

    const key = { "idx" : pieceIndex, "x" : x, "y" : y, "gridString" : gridString(grid) };
    if(seenAlready.has(key)) {
        return false;
    }

    if(pieceIndex == -1) {
        console.log("solved!");
        printGrid(grid);
        onSolve(grid);
        return true;
    }

    if (x < 0 || x >= width || y < 0 || y >= height) {
        return false;
    }

    const newGrid = deepcopyGrid(grid);
    const piece = pieces[pieceIndex];

    let placedPiece = false;

    if(pieceCanBePlaced(newGrid, piece, x, y)) {
        placePiece(newGrid, piece, x, y, pieceIndex + 2);
        placedPiece = true;
    }
         
    seenAlready.add(key);

    let worked = false;

    if(placedPiece) {
        worked = worked || solveRecursive(newGrid, pieces, pieceIndex - 1, x + 1, y, seenAlready, onSolve);
        worked = worked || solveRecursive(newGrid, pieces, pieceIndex - 1, x - 1, y, seenAlready, onSolve);
        worked = worked || solveRecursive(newGrid, pieces, pieceIndex - 1, x, y + 1, seenAlready, onSolve);
        worked = worked || solveRecursive(newGrid, pieces, pieceIndex - 1, x, y - 1, seenAlready, onSolve);
    }
   
    worked = worked || solveRecursive(grid, pieces, pieceIndex, x + 1, y, seenAlready, onSolve);
    worked = worked || solveRecursive(grid, pieces, pieceIndex, x - 1, y, seenAlready, onSolve);
    worked = worked || solveRecursive(grid, pieces, pieceIndex, x, y + 1, seenAlready, onSolve);
    worked = worked || solveRecursive(grid, pieces, pieceIndex, x, y - 1, seenAlready, onSolve);

    return worked;
}