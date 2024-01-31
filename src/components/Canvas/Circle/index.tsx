import React, {createRef} from "react";
import {Circle as CircleObject} from "../../../shared/interfaces/Annotation.ts";
import {Point} from "../../../shared/interfaces/Point.ts";
import useDragOrScale from "../../../shared/hooks/useDragOrScale.ts";

interface props {
    circle: CircleObject
    isSelected: boolean
    handleClick: (id: string) => void
    handleUpdateAnnotation: (annotation: CircleObject) => void
}

const Circle = ({circle, handleUpdateAnnotation, isSelected, handleClick}: props) => {
    const elementRef = createRef<SVGCircleElement>();
    const edgeRef = createRef<SVGCircleElement>();

    const {
        position: centerPosition,
        eventStart: dragStart,
        eventEnd: dragEnd,
        eventDoing: dragging,
    } = useDragOrScale({
        mainPoint: circle.center,
        isSelected,
        eventType: "drag",
        offset: 50
    });

    const {
        position: dragEdgePosition,
        eventStart: scaleStart,
        eventEnd: scaleEnd,
        eventDoing: scaling,
        currentEvent: scalingEvent
    } = useDragOrScale({
        mainPoint: {
            x: circle.center.x,
            y: circle.center.y + circle.radius
        },
        isSelected,
        eventType: "scale",
        offset: 50
    });

    const radius = scalingEvent === "scale" ? Math.abs(circle.center.y - dragEdgePosition.y) : circle.radius;

    const edgePoint: Point = {
        x: centerPosition.x,
        y: centerPosition.y + radius
    };

    const onClick = (e: React.MouseEvent<SVGCircleElement>) => {
        e.stopPropagation();
        handleClick(circle.id);
    }

    return (
        <>
            <circle
                ref={elementRef}
                onClick={onClick}
                cx={centerPosition.x}
                cy={centerPosition.y}
                r={radius}
                stroke="black"
                strokeWidth="1"
                fill="red"
                className={`annotation ${isSelected && "annotation-selected"}`}
                {...isSelected && {
                    onMouseDown: dragStart,
                    onMouseMove: dragging,
                    onMouseUp: (e) => {
                        handleUpdateAnnotation({...circle, center: centerPosition});
                        dragEnd(e);
                    },
                }}
            />
            <circle
                ref={edgeRef}
                cx={edgePoint.x}
                cy={edgePoint.y}
                r="10"
                fill="black"
                className="scale-dot"
                {...isSelected && {
                    onMouseDown: scaleStart,
                    onMouseMove: scaling,
                    onMouseUp: (e) => {
                        const radius = Math.abs(circle.center.y - dragEdgePosition.y);
                        console.log("radius mouse up", radius)
                        handleUpdateAnnotation({...circle, radius });
                        scaleEnd(e);
                    }
                }}
            />
            <text
                x={centerPosition.x}
                y={centerPosition.y}
                strokeWidth="1px"
                textAnchor="middle"
                alignmentBaseline="central"
            >
                {circle.tag}
            </text>
        </>
    );
};

export default Circle;
