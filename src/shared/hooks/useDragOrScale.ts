import React, {useEffect, useState} from "react";
import {Point} from "../interfaces/Point.ts";

interface props {
    mainPoint: Point
    isSelected: boolean
    eventType: EventType
    offset?: number
}

type EventType = "scale" | "drag";

const useScale = ({isSelected, mainPoint, eventType, offset = 50}: props) => {
    const [position, setPosition] = React.useState<Point>({
        x: mainPoint.x,
        y: mainPoint.y,
    });
    const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);

    useEffect(() => {
        if (!isSelected) {
            setCurrentEvent(null);
        }
    }, [isSelected]);

    // todo: tipizza
    const eventStart = (e: any) => {
        if (!isSelected) return;
        // console.log(`>> event ${eventType} start`, {x: e.clientX, y: e.clientY});
        e.stopPropagation();
        setCurrentEvent(eventType);
    }

    // todo: tipizza
    const eventEnd = (e: any) => {
        if (!isSelected || currentEvent !== eventType) return;
        // console.log(`>> event ${eventType} end`, {x: e.clientX, y: e.clientY});
        e.stopPropagation();
        setCurrentEvent(null);
    }

    // todo: tipizza
    const eventDoing = (e: any) => {
        if (!isSelected || currentEvent !== eventType) return;
        // console.log(`>> event ${eventType} doing`, {x: e.clientX, y: e.clientY});
        e.stopPropagation();
        setPosition({
            x: e.clientX - offset,
            y: e.clientY - offset
        });
    }

    return {
        position,
        currentEvent,
        eventStart,
        eventEnd,
        eventDoing
    }
}

export default useScale;
