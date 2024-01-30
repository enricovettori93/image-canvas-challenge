import {default as CircleComponent} from "./Circle";
import {Point} from "../../shared/interfaces/Point.ts";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import AnnotationFactory from "../../shared/factory/annotation.factory.ts";
import {addCircle, selectAnnotation, updateAnnotation} from "../../store/features/annotations/annotationSlice.ts";
import {ToolboxSelection} from "../../store/features/ui/types.ts";
import {Circle} from "../../shared/interfaces/Annotation.ts";

const Canvas = () => {
    // todo: use this variable to show a preview of what's happening on the screen
    const [isDrawning, setIsDrawing] = useState(false);
    const circles = useSelector((state: RootState) => state.annotations.circles);
    const selectedAnnotationId = useSelector((state: RootState) => state.annotations.selectedAnnotationId);
    const imageMetadata = useSelector((state: RootState) => state.ui.imageMetadata);
    const toolboxSelectedMode = useSelector((state: RootState) => state.ui.toolboxMode);
    const dispatch = useDispatch();

    const [mouseCoordinates, setMouseCoordinates] = useState<{
        initial: Point | null,
        final: Point | null
    }>({initial: null, final: null});

    const resetCoordinate = () => {
        setMouseCoordinates({initial: null, final: null});
    }

    useEffect(() => {
        resetCoordinate();
    }, [imageMetadata]);

    useEffect(() => {
        const {initial, final} = mouseCoordinates;
        if (initial && !final) {
            setIsDrawing(true);
        }
        if (initial && final) {
            handleNewRegion({initial, final});
            setIsDrawing(false);
            resetCoordinate();
        }
    }, [mouseCoordinates]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if ([ToolboxSelection.NONE, ToolboxSelection.SELECTION].includes(toolboxSelectedMode)) return;
        console.log("mouse down", {...e})
        setMouseCoordinates(prev => ({...prev, initial: {x: e.clientX, y: e.clientY}}));
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if ([ToolboxSelection.NONE, ToolboxSelection.SELECTION].includes(toolboxSelectedMode)) return;
        console.log("mouse up", {...e})
        setMouseCoordinates((prev) => {
            // Prevent "fake" inputs, update correctly the state only if there's a initial point
            return prev.initial ? {
                initial: prev.initial,
                final: {x: e.clientX, y: e.clientY}
            } : {
                initial: null,
                final: null
            };
        });
    }

    const handleNewRegion = ({initial, final}: { initial: Point, final: Point }) => {
        if (toolboxSelectedMode === ToolboxSelection.CIRCLE) {
            dispatch(addCircle(AnnotationFactory.createCircle({initial, final})));
        } else if (toolboxSelectedMode === ToolboxSelection.RECTANGLE) {
            // todo: fare
        }
    }

    const handleUpdateMode = (item: Circle, coordinate: Point) => {
        dispatch(updateAnnotation({
            ...item,
            center: coordinate
        }));
    }

    const handleClick = (id: string) => {
        dispatch(selectAnnotation(id));
    }

    return (
        <div className="relative">
            {
                // todo: gestire altro oltre ai cerchi
                circles.map(item => (
                    <CircleComponent
                        key={item.id}
                        circle={item}
                        isSelected={item.id === selectedAnnotationId}
                        canSelect={toolboxSelectedMode === ToolboxSelection.SELECTION}
                        handleUpdateMove={(p) => handleUpdateMode(item, p)}
                        handleUpdateRadius={() => {}}
                        handleClick={() => handleClick(item.id)}
                    />
                ))
            }
            <canvas
                id="editor"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                height={imageMetadata?.height || 0} width={imageMetadata?.width || 0}
            >
            </canvas>
        </div>
    );
};

export default Canvas;
