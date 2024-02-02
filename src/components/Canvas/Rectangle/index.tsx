import {Rectangle as RectangleObject} from "../../../shared/interfaces/Annotation.ts";
import {
    askForLabelName,
    calculateDistanceBetweenPoints, calculateMedianBetweenTwoPoints,
    calculateNewRectangleFromPointAndSizes, calculateRectangleFromTwoPoints,
} from "../../../shared/helpers";
import React from "react";
import useDragOrScale from "../../../shared/hooks/useDragOrScale.ts";
import Text from "../Text";
import DragPoint from "../DragPoint";
import {Point} from "../../../shared/interfaces/Point.ts";
import EditLabel from "../EditLabel";

interface props {
    rectangle: RectangleObject
    isSelected: boolean
    currentMousePosition: Point | null
    handleClick: (id: string) => void
    handleUpdateAnnotation: (annotation: RectangleObject) => void
}

const Rectangle = ({rectangle, isSelected, handleClick, handleUpdateAnnotation}: props) => {
    const [topLeft, topRight, bottomLeft, bottomRight] = rectangle.points;
    const center = calculateMedianBetweenTwoPoints(topLeft, bottomRight);

    const {
        position: dragPosition,
        eventStart: dragStart,
        eventEnd: dragEnd,
        eventLeave: dragLeave,
        eventDoing: dragging,
        currentEvent: eventDragging,
    } = useDragOrScale({
        mainPoint: center,
        isSelected,
        eventType: "drag",
        offsetX: 15,
        offsetY: 45
    });

    const {
        position: scalePosition,
        eventStart: scaleStart,
        eventEnd: scaleEnd,
        eventDoing: scaling,
        eventLeave: scaleLeave,
        currentEvent: eventScaling,
    } = useDragOrScale({
        mainPoint: bottomRight,
        isSelected,
        eventType: "scale",
        offsetX: 15,
        offsetY: 45
    });

    const width = calculateDistanceBetweenPoints(topLeft, eventScaling === "scale" ? {
        x: scalePosition.x,
        y: topRight.y
    } : topRight);

    const height = calculateDistanceBetweenPoints(topLeft, eventScaling === "scale" ? {
        x: topLeft.x,
        y: scalePosition.y
    } : bottomLeft);

    const isIdle = !eventDragging && !eventScaling;

    const onClick = (e: React.MouseEvent<SVGRectElement>) => {
        e.preventDefault();
        handleClick(rectangle.id);
    }

    const handleEditLabel = (e: React.MouseEvent<SVGRectElement>) => {
        e.stopPropagation();
        const newLabelValue = askForLabelName(rectangle.tag);
        handleUpdateAnnotation({...rectangle, tag: `${newLabelValue}`});
    }

    const topLeftWhileDragging: Point = {
        x: topLeft.x - (center.x - dragPosition.x),
        y: topLeft.y - (center.y - dragPosition.y)
    }

    const handleDragEnd = () => {
        handleUpdateAnnotation({
            ...rectangle,
            points: calculateNewRectangleFromPointAndSizes({
                point: topLeftWhileDragging,
                width,
                height
            })
        });
    }

    const handleScaleEnd = () => {
        handleUpdateAnnotation({
            ...rectangle,
            points: calculateRectangleFromTwoPoints(topLeft, scalePosition)
        });
    }

    const topLeftCalculated = (): Point => {
        if (eventDragging === "drag") {
            return topLeftWhileDragging;
        }

        return topLeft;
    }

    return (
        <g>
            <rect
                width={width}
                height={height}
                onClick={onClick}
                x={topLeftCalculated().x}
                y={topLeftCalculated().y}
                fill={rectangle.color}
                stroke="black"
                strokeWidth="1"
                className={`annotation ${isSelected && "annotation-selected"}`}
            />
            {
                isIdle && (
                    <Text p={{
                        x: (topLeft.x + topLeft.x + width) / 2,
                        y: (topLeft.y + topLeft.y + height) / 2 - 30
                    }} tag={rectangle.tag}/>
                )
            }
            {
                isSelected && (
                    <>
                        {
                            isIdle && (
                                <EditLabel p={topRight} onClick={handleEditLabel}/>
                            )
                        }
                        {
                            !eventScaling && (
                                <DragPoint
                                    p={{
                                        x: eventDragging === "drag" ? dragPosition.x : center.x,
                                        y: eventDragging === "drag" ? dragPosition.y : center.y
                                    }}
                                    onMouseDown={dragStart}
                                    onMouseMove={dragging}
                                    onMouseLeave={(e: React.MouseEvent<SVGCircleElement>) => {
                                        dragLeave(e);
                                        handleDragEnd();
                                    }}
                                    onMouseUp={(e: React.MouseEvent<SVGCircleElement>) => {
                                        dragEnd(e);
                                        handleDragEnd();
                                    }}
                                />
                            )
                        }
                        {
                            !eventDragging && (
                                <DragPoint
                                    p={{
                                        x: eventScaling === "scale" ? scalePosition.x : bottomRight.x,
                                        y: eventScaling === "scale" ? scalePosition.y : bottomRight.y
                                    }}
                                    onMouseDown={scaleStart}
                                    onMouseMove={scaling}
                                    onMouseLeave={(e: React.MouseEvent<SVGCircleElement>) => {
                                        scaleLeave(e);
                                        handleScaleEnd();
                                    }}
                                    onMouseUp={(e: React.MouseEvent<SVGCircleElement>) => {
                                        scaleEnd(e);
                                        handleScaleEnd();
                                    }}
                                />
                            )
                        }
                    </>
                )
            }
        </g>
    );
};

export default Rectangle;
