import {Circle, Rectangle} from "../interfaces/Annotation.ts";
import {v4 as uuidv4} from "uuid";
import {
    askForLabelName,
    calculateCircleCenterAndRadiusFromTwoPoints,
    calculateRectangleFromTwoPoints, generateColor
} from "../helpers";
import {Point} from "../interfaces/Point.ts";

export default class AnnotationFactory {
    static createCircle({initial, final}: { initial: Point, final: Point }): Circle {
        const {x, y, radius} = calculateCircleCenterAndRadiusFromTwoPoints(initial, final);
        const tag = askForLabelName();
        return { id: uuidv4(), tag: `${tag}`, center: { x, y }, radius: radius, color: generateColor() };
    }

    static createRectangle({initial, final}: { initial: Point, final: Point }): Rectangle {
        const points = calculateRectangleFromTwoPoints(initial, final);
        const tag = askForLabelName();
        return { id: uuidv4(), tag: `${tag}`, points, color: generateColor() };
    }
}
