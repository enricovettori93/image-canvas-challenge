import {Circle as CircleObject} from "../../../shared/interfaces/Annotation.ts";
import {CIRCLE_RADIUS_DEFAULT} from "../../../shared/constants";
import {Point} from "../../../shared/interfaces/Point.ts";
import Draggable from "../Draggable";

interface props {
    canSelect: boolean
    isSelected: boolean
    circle: CircleObject
    handleClick: () => void
    // todo: tipizza
    handleUpdateMove: (coordinate: Point) => void
    handleUpdateRadius: () => void
}

const Circle = ({circle, canSelect, handleUpdateMove, handleUpdateRadius, isSelected, handleClick}: props) => {
    // todo: tipizza
    const handleDragStart = (e: any) => {
        if (!isSelected) return;
        console.log("drag start", {...e});
    }

    // todo: tipizza
    const handleDragEnd = (e: any) => {
        if (!isSelected) return;
        console.log("drag end", {...e});
        handleUpdateMove({x: e.clientX, y: e.clientY});
    }

    return (
        <Draggable
            canDrag={isSelected}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
        >
            <div
                className={`rounded-full flex justify-center items-center bg-red-200 ${(canSelect && !isSelected) && "hover:bg-red-300 cursor-pointer"} ${isSelected && "bg-red-500 cursor-grab"} w-2 h-2 absolute z-[9999]`}
                onClick={handleClick}
                style={{
                    width: circle.radius,
                    height: circle.radius,
                    "marginLeft": circle.center?.x - CIRCLE_RADIUS_DEFAULT,
                    "marginTop": circle.center?.y - CIRCLE_RADIUS_DEFAULT
                }}
            >
                <span className="right-1/2 left-1/2 top-1/2 text-black font-light">{circle.tag}</span>
                {
                    isSelected && (
                        <div className="absolute top-[-3px] left-1/2 right-1/2 bg-black w-2 h-2 rounded-full"></div>
                    )
                }
            </div>
        </Draggable>
    );
};

export default Circle;
