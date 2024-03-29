import {ImageMetadata} from "../../store/features/ui/types.ts";
import {Point} from "../interfaces/Point.ts";

/**
 * Draw an image into the main canvas
 * @param file
 */
export const loadFileIntoCanvas = (file: File) => {
    console.log("loading image from", file)
    const canvas = document.querySelector<HTMLCanvasElement>('#editor');
    const ctx = canvas?.getContext('2d');
    return new Promise<ImageMetadata>((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.addEventListener("load", () => {
            requestAnimationFrame(() => {
                ctx?.clearRect(0, 0, image.width, image.height);
                ctx?.drawImage(image, 0, 0, image.width, image.height);
            })
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

export const calculateMedianBetweenTwoPoints = (p1: Point, p2: Point): Point => {
    return {
        x: ((p1.x + p2.x) / 2),
        y: ((p1.y + p2.y) / 2)
    }
}

/**
 * Calculate the radius and the center between two points for generate a circle
 * @param p1
 * @param p2
 */
export const calculateCircleCenterAndRadiusFromTwoPoints = (p1: Point, p2: Point) => {
    const {x, y} = calculateMedianBetweenTwoPoints(p1, p2);
    return {
        radius: calculateDistanceBetweenPoints(p1, p2) / 2,
        x,
        y
    }
}

/**
 * Calculate from 2 points (p[0] and p[3] coordinated) the 4 points required for a rectangle
 *
 * p[0] --- p[1]
 * |          |
 * |          |
 * p[2] --- p[3]
 *
 * @param p1
 * @param p2
 */
export const calculateRectangleFromTwoPoints = (p1: Point, p2: Point) => {
    const points: Point[] = [];
    points.push(p1);
    points.push({x: p2.x, y: p1.y});
    points.push({x: p1.x, y: p2.y});
    points.push(p2);
    return points;
}

/**
 * Calculate a rectangle starting from the top left edge and width / height
 * @param point
 * @param height
 * @param width
 */
export const calculateNewRectangleFromPointAndSizes = ({point, height, width}: {
    point: Point,
    height: number,
    width: number
}) => {
    return [
        point,
        {
            x: point.x + width,
            y: point.y
        },
        {
            x: point.x,
            y: point.y + height
        },
        {
            x: point.x + width,
            y: point.y + height
        }
    ]
}

export const transformNormalizedCoordinatesInPoint = ({p, width, height}: {p: Point, width: number, height: number}): Point => {
    return {
        x: p.x * width,
        y: p.y * height
    }
}

export const transformPointInNormalizedCoordinates = ({p, width, height}: {p: Point, width: number, height: number}): Point => {
    return {
        x: p.x / width,
        y: p.y / height
    }
}

export const askForLabelName = (prev = '') => {
    return prompt(prev ? "Edit annotation" : "Add annotation", prev);
}

export const generateColor = () => {
    // thx chatgpt
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blu = Math.floor(Math.random() * 256);

    return "#" +
        red.toString(16).padStart(2, '0') +
        green.toString(16).padStart(2, '0') +
        blu.toString(16).padStart(2, '0');
}
