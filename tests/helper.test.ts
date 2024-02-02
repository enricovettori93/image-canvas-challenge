import {expect, test} from 'vitest';
import {
    calculateCircleCenterAndRadiusFromTwoPoints,
    calculateDistanceBetweenPoints,
    calculateMedianBetweenTwoPoints,
    calculateNewRectangleFromPointAndSizes,
    calculateRectangleFromTwoPoints,
    transformNormalizedCoordinatesInPoint, transformPointInNormalizedCoordinates
} from "../src/shared/helpers";

test("should calculate distance between 2 points", () => {
    expect(calculateDistanceBetweenPoints({x: 10, y: 20}, {x: 20, y: 20})).toBe(10);
})

test("should calculate the median point between 2 points", () => {
    expect(calculateMedianBetweenTwoPoints({x: 10, y: 20}, {x: 20, y: 20})).toStrictEqual({x: 15, y: 20});
})

test("should calculate center and radius starting from 2 points", () => {
    expect(calculateCircleCenterAndRadiusFromTwoPoints({x: 10, y: 20}, {x: 20, y: 20})).toStrictEqual({
        radius: 5,
        x: 15,
        y: 20
    });
})

test("should calculate a rectangle starting from 2 edge points", () => {
    expect(calculateRectangleFromTwoPoints({x: 10, y: 10}, {x: 20, y: 20})).toStrictEqual([{x: 10, y: 10}, {
        x: 20,
        y: 10
    }, {x: 10, y: 20}, {x: 20, y: 20}]);
})

test("should calculate a rectangle from 1 point and width / height", () => {
    expect(calculateNewRectangleFromPointAndSizes({
        point: {x: 10, y: 10},
        height: 10,
        width: 10
    })).toStrictEqual([{x: 10, y: 10}, {x: 20, y: 10}, {x: 10, y: 20}, {x: 20, y: 20}]);
})

test("should normalize coordinate", () => {
    expect(transformPointInNormalizedCoordinates({
        p: {x: 10, y: 10},
        height: 100,
        width: 100
    })).toStrictEqual({x: 0.1, y: 0.1});
})

test("should de-normalize coordinate", () => {
    expect(transformNormalizedCoordinatesInPoint({
        p: {x: 0.1, y: 0.1},
        height: 100,
        width: 100
    })).toStrictEqual({x: 10, y: 10});
})
