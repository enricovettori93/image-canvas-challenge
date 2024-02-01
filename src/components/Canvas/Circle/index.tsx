import React from "react";
import {Circle as CircleObject} from "../../../shared/interfaces/Annotation.ts";
import {Point} from "../../../shared/interfaces/Point.ts";
import useDragOrScale from "../../../shared/hooks/useDragOrScale.ts";
import Text from "../Text";
import DragPoint from "../DragPoint";
import {askForLabelName} from "../../../shared/helpers";
import EditLabel from "../EditLabel";

interface props {
    circle: CircleObject
    isSelected: boolean
    currentMousePosition: Point | null
    handleClick: (id: string) => void
    handleUpdateAnnotation: (annotation: CircleObject) => void
}

const Circle = ({circle, handleUpdateAnnotation, isSelected, handleClick}: props) => {
    const {
        position: dragCenterPosition,
        eventStart: dragStart,
        eventEnd: dragEnd,
        eventLeave: dragLeave,
        eventDoing: dragging,
        currentEvent: dragEvent,
    } = useDragOrScale({
        mainPoint: circle.center,
        isSelected,
        eventType: "drag",
        offsetX: 17,
        offsetY: 45
    });

    const {
        position: dragEdgePosition,
        eventStart: scaleStart,
        eventEnd: scaleEnd,
        eventLeave: scaleLeave,
        eventDoing: scaling,
        currentEvent: scalingEvent
    } = useDragOrScale({
        mainPoint: {
            x: circle.center.x,
            y: circle.center.y + circle.radius
        },
        isSelected,
        eventType: "scale",
        offsetX: 50,
        offsetY: 50
    });

    const radius = scalingEvent === "scale" ? Math.abs(circle.center.y - dragEdgePosition.y) : circle.radius;

    const isIdle = !dragEvent && !scalingEvent;

    const edgePoint: Point = {
        x: dragCenterPosition.x,
        y: dragCenterPosition.y + radius
    }

    const onClick = (e: React.MouseEvent<SVGCircleElement>) => {
        e.stopPropagation();
        handleClick(circle.id);
    }

    const handleEditLabel = (e: React.MouseEvent<SVGRectElement>) => {
        e.stopPropagation();
        const newLabelValue = askForLabelName(circle.tag);
        handleUpdateAnnotation({...circle, tag: `${newLabelValue}`});
    }

    const topRight: Point = {
        x: dragCenterPosition.x + radius,
        y: dragCenterPosition.y - radius
    }

    const handleDragEnd = () => {
        handleUpdateAnnotation({...circle, center: dragCenterPosition});
    }

    const handleScaleEnd = () => {
        handleUpdateAnnotation({
            ...circle,
            radius: Math.abs(circle.center.y - dragEdgePosition.y)
        });
    }

    return (
        <g>
            <circle
                onClick={onClick}
                cx={dragCenterPosition.x}
                cy={dragCenterPosition.y}
                r={radius}
                stroke="black"
                strokeWidth="1"
                fill="red"
                className={`annotation ${isSelected && "annotation-selected"}`}
                {...isSelected && {
                    onMouseDown: dragStart,
                    onMouseMove: dragging,
                    onMouseUp: (e) => {
                        dragEnd(e);
                        handleUpdateAnnotation({...circle, center: dragCenterPosition});
                    },
                }}
            />
            {
                isIdle && (
                    <Text p={{x: dragCenterPosition.x, y: dragCenterPosition.y - 30}} tag={circle.tag}/>
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
                            !scalingEvent && (
                                <DragPoint
                                    p={{
                                        x: dragCenterPosition.x,
                                        y: dragCenterPosition.y
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
                            !dragEvent && (
                                <DragPoint
                                    p={{
                                        x: edgePoint.x,
                                        y: edgePoint.y
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

export default Circle;
