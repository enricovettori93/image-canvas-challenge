import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {AnnotationSlice} from "./types.ts";
import {Circle, Rectangle} from "../../../shared/interfaces/Annotation.ts";
import {loadImageFromURL} from "../ui/uiSlice.ts";

const initialState: AnnotationSlice = {
    circles: [],
    rectangles: [],
    selectedAnnotationId: null
}

export const annotationSlice = createSlice({
    name: "annotation",
    initialState,
    reducers: {
        addCircle: (state, {payload}: PayloadAction<Circle>) => {
            state.circles.push(payload);
        },
        addRectangle: (state, {payload}: PayloadAction<Rectangle>) => {
            state.rectangles.push(payload);
        },
        updateAnnotation: (state, {payload}: PayloadAction<Circle | Rectangle>) => {
            state.circles = state.circles.map(i => i.id === payload.id ? payload as Circle : i);
            state.rectangles = state.rectangles.map(i => i.id === payload.id ? payload as Rectangle : i);
        },
        reset: (state) => {
            state.circles = [];
            state.rectangles = [];
            state.selectedAnnotationId = null;
        },
        selectAnnotation: (state, {payload}: PayloadAction<string | null>) => {
            state.selectedAnnotationId = state.selectedAnnotationId === payload ? null : payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(loadImageFromURL.pending, (state) => {
            state.circles = [];
            state.rectangles = [];
            state.selectedAnnotationId = null;
        })
    }
})

export const {addCircle, reset, selectAnnotation, addRectangle, updateAnnotation} = annotationSlice.actions;
export default annotationSlice.reducer;
