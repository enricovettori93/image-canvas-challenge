import {Circle} from "../interfaces/Annotation.ts";
import {transformNormalizedCoordinatesInPoint, transformPointInNormalizedCoordinates} from "../helpers";

export default class CircleAdapter {
    static fromCanvasCoordinateToNormalizedCoordinate({annotation, imageWidth, imageHeight}: {
        annotation: Circle,
        imageWidth: number,
        imageHeight: number
    }) {
        return {
            ...annotation,
            center: transformPointInNormalizedCoordinates({
                p: annotation.center,
                height: imageHeight,
                width: imageWidth
            })
        }
    }

    static fromNormalizedCoordinateToCanvasCoordinate({annotation, imageWidth, imageHeight}: {
        annotation: Circle,
        imageWidth: number,
        imageHeight: number
    }) {
        return {
            ...annotation,
            center: transformNormalizedCoordinatesInPoint({
                p: annotation.center,
                height: imageHeight,
                width: imageWidth
            })
        }
    }
}
