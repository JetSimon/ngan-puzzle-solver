
import './Grid.css';
import Cell from "./Cell";

interface SolutionGridProps { 
    grid : number[][];
}

function SolutionGrid(props : SolutionGridProps) {

    const {grid} = props;

    function columnString() {
        const width = grid[0]?.length ?? 0;
        return `repeat(${width}, 1fr)`;
    }

    function onCellUpdated(x : number, y : number, filled : boolean) {
        x;y;filled;
    }

    function getIndex(x : number, y : number) {
        const width = grid[0].length;
        return (width * y) + x;
    }

    function hexColorCode(baseNumber : number) {
        const n = (baseNumber * 0xfffff * 1000000).toString(16);
        return '#' + n.slice(0, 6);
    }

    function getCells() {
        const cells = [];
        const height = grid.length;
        const width = grid[0].length;
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                cells.push([x,y]);
            }
        }
        return cells.map((element) => <Cell color={grid[element[1]][element[0]] == 1 ? "black" : hexColorCode(grid[element[1]][element[0]])} editable={false} x={element[0]} y={element[1]} onCellUpdated={onCellUpdated} key={getIndex(element[0], element[1])} filled={grid[element[1]][element[0]] > 0}></Cell>);
    }

    if(grid == null || grid[0] == null) {
        return <div></div>
    }


    return (
        <div className="GridHolder">
            <div style={{gridTemplateColumns:columnString()}} className="Grid">
                {getCells()}
            </div>
        </div>
    );
}

export default SolutionGrid;