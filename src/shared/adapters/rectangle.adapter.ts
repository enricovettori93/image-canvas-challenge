import {Rectangle} from "../interfaces/Annotation.ts";
import {transformNormalizedCoordinatesInPoint, transformPointInNormalizedCoordinates} from "../helpers";

export default class RectangleAdapter {
    static fromCanvasCoordinateToNormalizedCoordinate({annotation, imageWidth, imageHeight}: {
        annotation: Rectangle,
        imageWidth: number,
        imageHeight: number
    }) {
        return {
            ...annotation,
            points: annotation.points.map(p => transformPointInNormalizedCoordinates({
                p,
                height: imageHeight,
                width: imageWidth
            }))
        }
    }

    static fromNormalizedCoordinateToCanvasCoordinate({annotation, imageWidth, imageHeight}: {
        annotation: Rectangle,
        imageWidth: number,
        imageHeight: number
    }) {
        return {
            ...annotation,
            points: annotation.points.map(p => transformNormalizedCoordinatesInPoint({
                p,
                height: imageHeight,
                width: imageWidth
            }))
        }
    }
}
