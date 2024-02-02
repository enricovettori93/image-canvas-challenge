import {describe, expect, test} from 'vitest';
import {Circle, Rectangle} from "../src/shared/interfaces/Annotation";
import CircleAdapter from "../src/shared/adapters/circle.adapter";
import RectangleAdapter from "../src/shared/adapters/rectangle.adapter";

describe("Circle adapter", () => {
    test("should normalize coordinates", () => {
        const circle: Circle = {
            color: "color",
            center: {
                x: 50,
                y: 50
            },
            tag: "tag",
            radius: 5,
            id: "id"
        };

        expect(CircleAdapter.fromCanvasCoordinateToNormalizedCoordinate({
            annotation: circle,
            imageHeight: 100,
            imageWidth: 100
        })).toStrictEqual({
            color: "color",
            center: {
                x: 0.5,
                y: 0.5
            },
            tag: "tag",
            radius: 5,
            id: "id"
        })
    })

    test("should de-normalize coordinates", () => {
        const circle: Circle = {
            color: "color",
            center: {
                x: 0.5,
                y: 0.5
            },
            tag: "tag",
            radius: 5,
            id: "id"
        };
        expect(CircleAdapter.fromNormalizedCoordinateToCanvasCoordinate({
            annotation: circle,
            imageHeight: 100,
            imageWidth: 100
        })).toStrictEqual({
            color: "color",
            center: {
                x: 50,
                y: 50
            },
            tag: "tag",
            radius: 5,
            id: "id"
        })
    })
})

describe("Rectangle adapter", () => {
    test("should normalize coordinates", () => {
        const rectangle: Rectangle = {
            tag: "tag",
            points: [{
                x: 10, y: 10
            }, {
                x: 20, y: 10
            }, {
                x: 10, y: 20
            }, {
                x: 20, y: 20
            }],
            id: "id",
            color: "color"
        };

        expect(RectangleAdapter.fromCanvasCoordinateToNormalizedCoordinate({
            annotation: rectangle,
            imageWidth: 100,
            imageHeight: 100
        })).toStrictEqual({
            tag: "tag",
            points: [{
                x: 0.1, y: 0.1
            }, {
                x: 0.2, y: 0.1
            }, {
                x: 0.1, y: 0.2
            }, {
                x: 0.2, y: 0.2
            }],
            id: "id",
            color: "color"
        })
    })

    test("should de-normalize coordinates", () => {
        const rectangle: Rectangle = {
            tag: "tag",
            points: [{
                x: 0.1, y: 0.1
            }, {
                x: 0.2, y: 0.1
            }, {
                x: 0.1, y: 0.2
            }, {
                x: 0.2, y: 0.2
            }],
            id: "id",
            color: "color"
        };

        expect(RectangleAdapter.fromNormalizedCoordinateToCanvasCoordinate({
            annotation: rectangle,
            imageWidth: 100,
            imageHeight: 100
        })).toStrictEqual({
            tag: "tag",
            points: [{
                x: 10, y: 10
            }, {
                x: 20, y: 10
            }, {
                x: 10, y: 20
            }, {
                x: 20, y: 20
            }],
            id: "id",
            color: "color"
        })
    })
})
