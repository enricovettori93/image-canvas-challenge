import {describe, expect, test, vi} from 'vitest';
import {Point} from "../src/shared/interfaces/Point";
import AnnotationFactory from "../src/shared/factory/annotation.factory";

global.prompt = vi.fn();

describe("Annotation factory", () => {
    test("should create a circle", () => {
        const p1: Point = {
            x: 10,
            y: 10,
        }
        const p2: Point = {
            x: 20,
            y: 20,
        }

        const circle = AnnotationFactory.createCircle({initial: p1, final: p2});

        expect({x: 15, y: 15}).toStrictEqual(circle.center);
    })

    test("should create a rectangle", () => {
        const p1: Point = {
            x: 10,
            y: 10,
        }
        const p2: Point = {
            x: 20,
            y: 20,
        }

        const rectangle = AnnotationFactory.createRectangle({initial: p1, final: p2});

        expect([{x: 10, y: 10}, {x: 20, y: 10}, {x: 10, y: 20}, {x: 20, y: 20}]).toStrictEqual(rectangle.points);
    })
})
