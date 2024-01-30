import {ReactNode, useState} from "react";
import {Point} from "../../../shared/interfaces/Point.ts";

interface props {
    canDrag: boolean
    handleDragEnd?: (p: Point) => void
    handleDragStart?: (p: Point) => void
    style?: Object
    className?: string
    children?: ReactNode
}

const Draggable = ({children, style, className, handleDragEnd, handleDragStart, canDrag}: props) => {
    const [isDragging, setIsDragging] = useState(false);

    // todo: tipizza
    const dragStart = (e: any) => {
        if (!canDrag) return;
        console.log("drag start", {...e});
        setIsDragging(true);
        handleDragStart && handleDragStart(e);
    }

    // todo: tipizza
    const dragEnd = (e: any) => {
        if (!canDrag) return;
        console.log("drag end", {...e});
        setIsDragging(false);
        handleDragEnd && handleDragEnd(e);
    }

    return (
        <div
            className={`${className} ${isDragging ? "opacity-50" : "opacity-100"}`}
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            draggable
            style={style}
        >
            {children}
        </div>
    );
};

export default Draggable;
