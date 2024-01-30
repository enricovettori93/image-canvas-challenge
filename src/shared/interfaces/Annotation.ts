import {Point} from "./Point.ts";

// todo: handle annotation type
export enum AnnotationType {
    "CIRCLE" = "CIRCLE",
    "RECTANGLE" = "RECTANGLE"
}

// interface Movable {
//     move: ({ x, y }: Point) => void
// }

export interface Annotation {
    id: string;
    tag: string;
}

export interface Rectangle extends Annotation{
    points: Point[];
}

export interface Circle extends Annotation {
    radius: number;
    center: Point;
}

// export class Annotation {
//     public points: Point[];
//     public id: string;
//     public tag: string;
//
//     constructor({id, points = [], tag = ""}: { id: string, points: Point[], tag: string }) {
//         this.id = id;
//         this.points = points;
//         this.tag = tag;
//     }
// }

// export class Circle {
//     public radius: number;
//     public id: string;
//     public tag: string;
//     public center: Point;
//
//     constructor({id, x, y, tag}: { id: string; x: number, y: number; tag: string; }) {
//         this.id = id;
//         this.tag = tag;
//         this.center = {
//             x, y
//         }
//         // todo: random number in pixels?
//         this.radius = 50;
//     }
//
//     // public move: ({ x, y }: Point) => void;
// }
