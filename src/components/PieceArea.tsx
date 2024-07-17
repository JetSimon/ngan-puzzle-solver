import Grid from "./Grid";

interface PieceAreaProps {
    width : number;
    height : number;
    filledCells : Set<number>;
    amount : number;
    setAmount : (x : number) => void;
}

function PieceArea(props : PieceAreaProps) {

    const {width, height, filledCells, amount, setAmount} = props;

    return (
        <div>
            <Grid width={width} height={height} grid={filledCells} setGrid={(x) => {x}} editable={false}></Grid>
            <label>#</label> <input onChange={(e) => setAmount(Number(e.target.value))} type="number" value={amount}></input>
        </div>
    )
}

export default PieceArea;