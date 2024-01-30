import {Circle as CircleObject} from "../../../shared/interfaces/Annotation.ts";
import {Point} from "../../../shared/interfaces/Point.ts";
import React, {createRef, useEffect, useState} from "react";
import {calculateDistanceBetweenPoints} from "../../../shared/helpers";

interface props {
    isSelected: boolean
    circle: CircleObject
    handleClick: (id: string) => void
    handleUpdateAnnotation: (annotation: CircleObject) => void
}

const Circle = ({circle, handleUpdateAnnotation, isSelected, handleClick}: props) => {
    const elementRef = createRef<SVGCircleElement>();
    const [position, setPosition] = React.useState<Point & { radius: number }>({
        x: circle.center.x,
        y: circle.center.y,
        radius: circle.radius
    });
    const [currentEvent, setCurrentEvent] = useState<"scale" | "drag" | null>(null);

    useEffect(() => {
        setPosition({
            radius: circle.radius,
            x: circle.center.x,
            y: circle.center.y
        });
    }, [circle]);

    // todo: tipizza
    const dragStart = (e: any) => {
        if (!isSelected) return;
        console.log("drag start", {...e});
        e.preventDefault();
        setCurrentEvent("drag");
    }

    // todo: tipizza
    const dragEnd = (e: any) => {
        if (!isSelected || currentEvent !== "drag") return;
        console.log("drag end", {...e});
        e.preventDefault();
        setCurrentEvent(null);
        handleUpdateAnnotation({...circle, center: {x: e.clientX, y: e.clientY}});
    }

    // todo: tipizza
    const dragging = (e: any) => {
        if (!isSelected || currentEvent !== "drag") return;
        console.log("dragging", {...e}, currentEvent);
        e.preventDefault();
        setPosition(prev => ({
            ...prev,
            x: e.clientX,
            y: e.clientY,
        }));
    }

    // todo: tipizza
    const scaleStart = (e: any) => {
        if (!isSelected) return;
        console.log("scale start", {...e});
        e.preventDefault();
        setCurrentEvent("scale");
    }

    // todo: tipizza
    const scaleEnd = (e: any) => {
        if (!isSelected || currentEvent !== "scale") return;
        console.log("scaling end", {...e});
        e.preventDefault();
        setCurrentEvent(null);
        // console.log("scaling end distance", calculateDistanceBetweenPoints(circle.center, {x: e.clientX, y: e.clientY}));
        handleUpdateAnnotation({...circle, radius: calculateDistanceBetweenPoints(circle.center, {x: e.clientX, y: e.clientY})});
    }

    // todo: tipizza
    const scaling = (e: any) => {
        if (!isSelected || currentEvent !== "scale") return;
        console.log("scaling", {...e});
        e.preventDefault();
        // console.log("scaling distance calcolo", calculateDistanceBetweenPoints(circle.center, {x: e.clientX, y: e.clientY}));
        setPosition(prev => ({
            ...prev,
            radius: calculateDistanceBetweenPoints(circle.center, {x: e.clientX, y: e.clientY})
        }));
    }

    // todo: tipizza
    const onClick = (e: any) => {
        // console.log("on click -> isDragging", isDragging)
        if (currentEvent === "drag") return;
        e.preventDefault();
        handleClick(circle.id);
    }

    return (
        <>
            <circle
                ref={elementRef}
                onClick={onClick}
                cx={position.x}
                cy={position.y}
                r={position.radius}
                stroke="black"
                strokeWidth="1"
                fill="red"
                className={`circle ${isSelected && "selected"}`}
                {...isSelected && {
                    onMouseDown: dragStart,
                    onMouseUp: dragEnd,
                    onMouseMove: dragging
                }}
            />
            <circle
                cx={position.x}
                cy={position.y - circle.radius}
                r="5"
                fill="black"
                {...isSelected && {
                    onMouseDown: scaleStart,
                    onMouseUp: scaleEnd,
                    onMouseMove: scaling
                }}
            />
            <text
                x={position.x}
                y={position.y}
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
