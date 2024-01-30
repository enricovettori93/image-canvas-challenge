import {Rectangle as RectangleObject} from "../../../shared/interfaces/Annotation.ts";
import {calculateDistanceBetweenPoints} from "../../../shared/helpers";

interface props {
    rectangle: RectangleObject
}

const Rectangle = ({rectangle}: props) => {
    const [topLeft, topRight, bottomLeft, bottomRight] = rectangle.points;
    const width = calculateDistanceBetweenPoints(topLeft, topRight);
    const height = calculateDistanceBetweenPoints(topLeft, bottomLeft);

    return (
        <>
            <rect
                width={width}
                height={height}
                x={topLeft.x}
                y={topLeft.y}
                fill="yellow"
                stroke="black"
                strokeWidth="1"
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
            {
                rectangle.points.map(point => (
                    <circle
                        cx={point.x}
                        cy={point.y}
                        r="5"
                        fill="black"
                    />
                ))
            }
        </>
    );
};

export default Rectangle;
