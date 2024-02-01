import {Point} from "../../../shared/interfaces/Point.ts";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

interface minProps {
    p: Point
}

type props = minProps & React.SVGProps<SVGCircleElement>;

const DragPoint = ({p, ...rest}: props) => {
    const debug = useSelector((state: RootState) => state.ui.debug);
    const DEFAULT_HOVER_RADIUS = rest.r ?? 10;
    return (
        <g>
            <circle
                cx={p.x}
                cy={p.y}
                r={DEFAULT_HOVER_RADIUS}
                fill="black"
                className="scale-dot cursor-grab"
                {...rest}
            />
            {debug && (
                <text x={p.x - 35} y={p.y + 25} fontSize="10">
                    {JSON.stringify(p)}
                </text>
            )}
        </g>
    );
};

export default DragPoint;
