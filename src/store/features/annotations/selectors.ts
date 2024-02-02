import {RootState} from "../../index.ts";
import {createSelector} from "@reduxjs/toolkit";
import {metadataSelector} from "../ui/selectors.ts";
import RectangleAdapter from "../../../shared/adapters/rectangle.adapter.ts";
import CircleAdapter from "../../../shared/adapters/circle.adapter.ts";

const circles = (state: RootState) => state.annotations.circles;
const rectangles = (state: RootState) => state.annotations.rectangles;

/**
 * Transform all circles from state with normalized coordinates into pixel coordinates
 * @param state
 */
export const circlesSelector = createSelector([circles, metadataSelector], (circles, metadata) => {
    const {height = 0, width = 0} = metadata;
    return circles.map(annotation => CircleAdapter.fromNormalizedCoordinateToCanvasCoordinate({
        annotation,
        imageWidth: width,
        imageHeight: height
    }));
});


/**
 * Transform all rectangles from state with normalized coordinates into pixel coordinates
 * @param state
 */
export const rectanglesSelector = createSelector([rectangles, metadataSelector], (rectangles, metadata) => {
    const {height = 0, width = 0} = metadata;
    return rectangles.map(annotation => RectangleAdapter.fromNormalizedCoordinateToCanvasCoordinate({
        annotation,
        imageHeight: height,
        imageWidth: width
    }));
});
