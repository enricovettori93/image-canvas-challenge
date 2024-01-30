import {Circle, Rectangle} from "../../../shared/interfaces/Annotation.ts";

export interface AnnotationSlice {
    circles: Circle[]
    rectangles: Rectangle[]
    selectedAnnotationId: string | null
}
