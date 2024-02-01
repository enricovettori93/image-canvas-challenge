import {Point} from "../../../shared/interfaces/Point.ts";
import Text from "../Text";
import React from "react";

interface minProps {
    p: Point
    onClick: (e: React.MouseEvent<SVGRectElement>) => void
}

type props = minProps & Record<string, any>;

const EditLabel = ({p, onClick}: props) => {
    const width = 50;
    const height = 20;
    return (
        <g className="cursor-pointer" onClick={onClick}>
            <rect x={p.x - (width / 2)} y={p.y - (height / 2)} width={width} height={height} fill="green" stroke="black" strokeWidth="1"></rect>
            <Text p={p} tag="Edit"/>
        </g>
    );
};

export default EditLabel;
