import './App.css'
import Grid from './components/Grid'
import { useState } from 'react';

import { getGrid, getPieces, solve } from './Utils';
import SolutionGrid from './components/SolutionGrid';

function App() {

  const [grid, setGrid] = useState(new Set<number>());
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(3);

  const [drawingGrid, setDrawingGrid] = useState(new Set<number>());

  const [solutionGrid, setSolutionGrid] = useState<number[][]>([]);

  function solveGrid() {
      const actualGrid = getGrid(grid, width, height);
      solve(actualGrid, getPieces(getGrid(drawingGrid, 12, 12)), setSolutionGrid);
  }

  return (
    <div>
      <h3>Tile Game Puzzle Solver For Ngân ❤️</h3>

      <p>You can click on tiles here to add walls (marked as black)</p>
      <Grid grid={grid} setGrid={setGrid} width={width} height={height} editable={true}></Grid>

      <p>Change the size to match your puzzle</p>
      <label>Width</label>
      <input onChange={(e) => setWidth(Number(e.target.value))} type="number" value={width}></input>
      <label>Height</label>
      <input onChange={(e) => setHeight(Number(e.target.value))} type="number" value={height}></input>

      <p>Draw all the pieces in this box (make sure they aren't touching)</p>
      <Grid grid={drawingGrid} setGrid={setDrawingGrid} width={12} height={12} editable={true}></Grid>

      <p>Click here to solve and the solution will show below! (May take awhile to calculate)</p>
      <button onClick={solveGrid}>Solve!</button>

      <p>Solution:</p>
      <SolutionGrid grid={solutionGrid}></SolutionGrid>
    </div>
  )
}

export default App
