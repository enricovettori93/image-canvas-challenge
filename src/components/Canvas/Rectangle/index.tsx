import {Rectangle as RectangleObject} from "../../../shared/interfaces/Annotation.ts";
import {calculateDistanceBetweenPoints} from "../../../shared/helpers";
import useDrag from "../../../shared/hooks/useDrag.ts";
import {createRef, useEffect} from "react";

interface props {
    rectangle: RectangleObject
    isSelected: boolean
    handleClick: (id: string) => void
    handleUpdateAnnotation: (annotation: RectangleObject) => void
}

const Rectangle = ({rectangle, isSelected, handleClick, handleUpdateAnnotation}: props) => {
    const elementRef = createRef<SVGRectElement>();
    const [topLeft, topRight, bottomLeft, bottomRight] = rectangle.points;
    const width = calculateDistanceBetweenPoints(topLeft, topRight);
    const height = calculateDistanceBetweenPoints(topLeft, bottomLeft);
    console.log(topLeft, topRight, bottomLeft, bottomRight)

    const {position, dragStart, dragEnd, dragging, currentEvent} = useDrag({
        annotationRef: elementRef,
        mainPoint: rectangle.points[0],
        isSelected
    });

    // todo: check  che non convince troppo
    useEffect(() => {
        if (currentEvent === null && position) {
            // handleUpdateAnnotation({...rectangle, points: [position, ...rectangle.points.slice(-1)]});
        }
    }, [position, currentEvent]);

    // todo: tipizza
    const onClick = (e: any) => {
        e.preventDefault();
        handleClick(rectangle.id);
    }

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
                {...isSelected && {
                    onMouseDown: dragStart,
                    onMouseUp: dragEnd,
                    onMouseMove: dragging
                }}
            />
            {/*<text*/}
            {/*    x={(topLeft.x + topRight.x) / 2}*/}
            {/*    y={(topLeft.y + bottomRight.y) / 2}*/}
            {/*    strokeWidth="1px"*/}
            {/*    textAnchor="middle"*/}
            {/*    alignmentBaseline="central"*/}
            {/*>*/}
            {/*    {rectangle.tag}*/}
            {/*</text>*/}
            {/*{*/}
            {/*    rectangle.points.map(point => (*/}
            {/*        <circle*/}
            {/*            cx={point.x}*/}
            {/*            cy={point.y}*/}
            {/*            r="5"*/}
            {/*            fill="black"*/}
            {/*        />*/}
            {/*    ))*/}
            {/*}*/}
        </>
    );
};

export default Rectangle;
