import {Point} from "../../../shared/interfaces/Point.ts";
import React from "react";

interface minProps {
    p: Point
    tag: string
}

type props = minProps & React.SVGTextElementAttributes<SVGTextElement>;

const Text = ({p, tag, ...rest}: props) => {
    return (
        <text
            x={p.x}
            y={p.y}
            strokeWidth="1px"
            textAnchor="middle"
            alignmentBaseline="central"
            className="annotation-tag"
            {...rest}
        >
            {tag}
        </text>
    );
};

export default Text;
