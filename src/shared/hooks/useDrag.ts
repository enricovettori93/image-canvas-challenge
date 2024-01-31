import React, {ElementRef, useEffect, useState} from "react";
import {Point} from "../interfaces/Point.ts";

interface props {
    annotationRef: ElementRef<any>
    mainPoint: Point
    isSelected: boolean
}

// todo: ha senso? tenere l'unico hook?
const useDrag = ({annotationRef, isSelected, mainPoint}: props) => {
    const [position, setPosition] = React.useState<Point>({
        x: mainPoint.x,
        y: mainPoint.y,
    });
    const [currentEvent, setCurrentEvent] = useState<"drag" | null>(null);

    useEffect(() => {
        setPosition({
            x: mainPoint.x,
            y: mainPoint.y
        });
    }, [mainPoint]);

    // todo: tipizza
    const dragStart = (e: any) => {
        if (!isSelected) return;
        console.log("drag start", {...e});
        e.preventDefault();
        setCurrentEvent("drag");
    }

    // todo: tipizza
    const dragEnd = (e: any) => {
        if (!isSelected || currentEvent !== "drag") return;
        console.log("drag end", {...e});
        e.preventDefault();
        setCurrentEvent(null);
    }

    // todo: tipizza
    const dragging = (e: any) => {
        if (!isSelected || currentEvent !== "drag") return;
        console.log("dragging", {...e}, currentEvent);
        e.preventDefault();
        setPosition({
            x: e.clientX,
            y: e.clientY,
        });
    }

    return {
        position,
        currentEvent,
        dragStart,
        dragEnd,
        dragging
    }
}

export default useDrag;
