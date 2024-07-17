
import './Grid.css';
import Cell from "./Cell";

interface GridProps { 
    grid : Set<number>;
    setGrid : (grid : Set<number>) => void;
    width : number;
    height : number;
    editable : boolean;
}

function Grid(props : GridProps) {

    const {grid, setGrid, width, height, editable} = props;

    function columnString() {
        return `repeat(${width}, 1fr)`;
    }

    function getIndex(x : number, y : number) {
        return (width * y) + x;
    }

    function onCellUpdated(x : number, y : number, filled : boolean) {
        const idx = getIndex(x,y);
        if(filled) {
            const newGrid = new Set([...grid]); 
            newGrid.add(idx);
            setGrid(newGrid);
        }
        else {
            const newGrid = new Set([...grid]);
            newGrid.delete(idx);
            setGrid(newGrid);
        }
    }

    function isCellFilled(x : number, y : number) {
        const idx = getIndex(x,y);
        return grid.has(idx);
    }

    function getCells() {
        const cells = [];
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                cells.push([x,y]);
            }
        }
        return cells.map((element) => <Cell color="black" editable={editable} x={element[0]} y={element[1]} onCellUpdated={onCellUpdated} key={getIndex(element[0], element[1])} filled={isCellFilled(element[0], element[1])}></Cell>);
    }

    return (
        <div className="GridHolder">
            <div style={{gridTemplateColumns:columnString()}} className="Grid">
                {getCells()}
            </div>
        </div>
    );
}

export default Grid;