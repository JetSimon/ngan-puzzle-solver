import "./Cell.css";

interface CellProps {
    onCellUpdated : (x : number, y : number, filled : boolean) => void;
    x : number;
    y : number;
    editable : boolean;
    filled : boolean;
    color : string;
}

function Cell(props : CellProps) {

    const { x, y, onCellUpdated, editable, filled, color } = props;

    function toggleCell()
    {
        onCellUpdated(x, y, !filled);
    }

    return (
        <div onClick={editable ? toggleCell : () => {}} className="Cell" style={{backgroundColor : filled ? color : "white"}}>
        </div>
    );
}

export default Cell;