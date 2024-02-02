import {Point} from "./Point.ts";

export interface Annotation {
    id: string;
    tag: string;
    color: string;
}

export interface Rectangle extends Annotation{
    points: Point[];
}

export interface Circle extends Annotation {
    radius: number;
    center: Point;
}
