import {Circle, Rectangle} from "../interfaces/Annotation.ts";
import {v4 as uuidv4} from "uuid";
import {CIRCLE_RADIUS_DEFAULT} from "../constants";
import {calculateCenterAndRadius, calculateFourAngles} from "../helpers";
import {Point} from "../interfaces/Point.ts";

export default class AnnotationFactory {
    static createCircle({initial, final}: { initial: Point, final: Point }): Circle {
        // todo: normalizzare la coordinata
        const {x, y, radius} = calculateCenterAndRadius(initial, final);
        // todo: fai meglio
        // const tag = prompt("Please enter an annotation tag");
        const tag = "asd"
        return { id: uuidv4(), tag: `${tag}`, center: { x, y }, radius: radius || CIRCLE_RADIUS_DEFAULT };
    }

    static createRectangle({initial, final}: { initial: Point, final: Point }): Rectangle {
        // todo: normalizzare la coordinata
        const points = calculateFourAngles(initial, final);
        // todo: fai meglio
        // const tag = prompt("Please enter an annotation tag");
        const tag = "asd"
        return { id: uuidv4(), tag: `${tag}`, points };
    }
}
