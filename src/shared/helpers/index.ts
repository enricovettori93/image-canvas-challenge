import {ImageMetadata} from "../../store/features/ui/types.ts";
import {Point} from "../interfaces/Point.ts";

export const loadFileIntoCanvas = (file: File) => {
    console.log("loading image from", file)
    const canvas = document.getElementById('editor') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    return new Promise<ImageMetadata>((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.addEventListener("load", () => {
            ctx?.clearRect(0, 0, image.width, image.height);
            ctx?.drawImage(image, 0, 0, image.width, image.height);
            resolve({
                src: image.src,
                height: image.height,
                width: image.width
            });
        })

        image.addEventListener("error", () => {
            reject("Cannot load image")
        })
    });
}

/**
 * Calculate the distance between two points using the Pitagora's theorem
 * @param p1
 * @param p2
 */
export const calculateDistanceBetweenPoints = (p1: Point, p2: Point) => {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

/**
 * Calculate the radius and the center between two points for generate a circle
 * @param p1
 * @param p2
 */
export const calculateCenterAndRadius = (p1: Point, p2: Point) => {
    const medianPoint = {
        x: ((p1.x + p2.x) / 2),
        y: ((p1.y + p2.y) / 2)
    }
    return {
        radius: calculateDistanceBetweenPoints(p1, p2) / 2,
        x: medianPoint.x,
        y: medianPoint.y
    }
}

/**
 * Calculate from two points the 4 points required for a rectangle
 *
 * p[0] --- p[1]
 * |          |
 * |          |
 * p[2] --- p[3]
 *
 * @param p1
 * @param p2
 */
export const calculateFourAngles = (p1: Point, p2: Point) => {
    const points: Point[] = [];
    points.push(p1);
    points.push({x: p2.x, y: p1.y});
    points.push({x: p1.x, y: p2.y});
    points.push(p2);
    return points;
}
