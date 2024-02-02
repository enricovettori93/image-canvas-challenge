import React, {useEffect, useState} from "react";
import {Point} from "../interfaces/Point.ts";

interface props {
    mainPoint: Point
    isSelected: boolean
    eventType: EventType
    offsetX?: number
    offsetY?: number
}

type EventType = "scale" | "drag";

const useScale = ({isSelected, mainPoint, eventType, offsetY = 0, offsetX = 0}: props) => {
    const [position, setPosition] = React.useState<Point>({...mainPoint});
    const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);

    useEffect(() => {
        if (!isSelected) {
            setCurrentEvent(null);
        }
    }, [isSelected]);

    const eventStart = (e: React.MouseEvent<any>) => {
        console.log(`>> event ${eventType} start start`, {...e})
        if (!isSelected) return;
        console.log(`>> event ${eventType} start`, {x: e.clientX, y: e.clientY});
        e.stopPropagation();
        setCurrentEvent(eventType);
    }

    const eventEnd = (e: React.MouseEvent<any>) => {
        if (!isSelected || currentEvent !== eventType) return;
        console.log(`>> event ${eventType} end`, {x: e.clientX, y: e.clientY});
        e.stopPropagation();
        setCurrentEvent(null);
    }

    const eventDoing = (e: React.MouseEvent<any>) => {
        if (!isSelected || currentEvent !== eventType) return;
        console.log(`>> event ${eventType} doing`, {x: e.clientX, y: e.clientY});
        e.stopPropagation();
        setPosition({
            x: e.clientX - offsetX,
            y: e.clientY - offsetY
        });
    }

    const eventLeave = (e: React.MouseEvent<any>) => {
        if (isSelected && currentEvent) {
            console.log(`>> event ${eventType} leave - set currentEvent to null`, currentEvent)
            e.stopPropagation();
            setCurrentEvent(null);
        }
    }

    return {
        position,
        currentEvent,
        eventStart,
        eventEnd,
        eventLeave,
        eventDoing
    }
}

export default useScale;
