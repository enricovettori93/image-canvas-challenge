import {Rectangle as RectangleObject} from "../../../shared/interfaces/Annotation.ts";
import {calculateDistanceBetweenPoints} from "../../../shared/helpers";
import React from "react";
import useDragOrScale from "../../../shared/hooks/useDragOrScale.ts";

interface props {
    rectangle: RectangleObject
    isSelected: boolean
    handleClick: (id: string) => void
    handleUpdateAnnotation: (annotation: RectangleObject) => void
}

const Rectangle = ({rectangle, isSelected, handleClick, handleUpdateAnnotation}: props) => {
    const [topLeft, topRight, bottomLeft, bottomRight] = rectangle.points;
    const width = calculateDistanceBetweenPoints(topLeft, topRight);
    const height = calculateDistanceBetweenPoints(topLeft, bottomLeft);

    const {
        position,
        eventStart: dragStart,
        eventEnd: dragEnd,
        eventDoing: dragging,
    } = useDragOrScale({
        mainPoint: rectangle.points[0],
        isSelected,
        eventType: "drag",
        offset: 50
    });

    // todo: tipizza
    const onClick = (e: React.MouseEvent<SVGRectElement>) => {
        e.preventDefault();
        handleClick(rectangle.id);
    }

    // todo: use points.at(-1)
    const bottomRightPoint = rectangle.points[rectangle.points.length - 1];

    return (
        <>
            <rect
                width={width}
                height={height}
                onClick={onClick}
                x={topLeft.x}
                y={topLeft.y}
                fill="yellow"
                stroke="black"
                strokeWidth="1"
                className={`annotation ${isSelected && "annotation-selected"}`}
                {...isSelected && {
                    onMouseDown: dragStart,
                    onMouseMove: dragging,
                    onMouseUp: (e) => {
                        dragEnd(e);
                        // todo: rottissima sta cosa
                        handleUpdateAnnotation({
                            ...rectangle,
                            points: [position, rectangle.points[1], rectangle.points[2], rectangle.points[3]]
                        });
                    }
                }}
            />
            <text
                x={(topLeft.x + topRight.x) / 2}
                y={(topLeft.y + bottomRight.y) / 2}
                strokeWidth="1px"
                textAnchor="middle"
                alignmentBaseline="central"
            >
                {rectangle.tag}
            </text>
            <circle
                cx={bottomRightPoint.x}
                cy={bottomRightPoint.y}
                r="5"
                fill="black"
                className="scale-dot"
            />
        </>
    );
};

export default Rectangle;
