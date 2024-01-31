import React, {ElementRef, useEffect, useState} from "react";
import {Point} from "../interfaces/Point.ts";

interface props {
    annotationRef: ElementRef<any>
    mainPoint: Point
    isSelected: boolean
}

// todo: ha senso? tenere l'unico hook?
const useScale = ({annotationRef, isSelected, mainPoint}: props) => {
    const [position, setPosition] = React.useState<Point>({
        x: mainPoint.x,
        y: mainPoint.y,
    });
    const [currentEvent, setCurrentEvent] = useState<"scale" | null>(null);

    useEffect(() => {
        setPosition({
            x: mainPoint.x,
            y: mainPoint.y
        });
    }, [mainPoint]);

    // todo: tipizza
    const scaleStart = (e: any) => {
        if (!isSelected) return;
        console.log("scale start", {...e});
        e.preventDefault();
        setCurrentEvent("scale");
    }

    // todo: tipizza
    const scaleEnd = (e: any) => {
        if (!isSelected || currentEvent !== "scale") return;
        console.log("scaling end", {...e});
        e.preventDefault();
        setCurrentEvent(null);
    }

    // todo: tipizza
    const scaling = (e: any) => {
        if (!isSelected || currentEvent !== "scale") return;
        console.log("scaling", {...e});
        e.preventDefault();
        setPosition({
            x: e.clientX,
            y: e.clientY
        });
    }

    return {
        position,
        currentEvent,
        scaleStart,
        scaleEnd,
        scaling
    }
}

export default useScale;
