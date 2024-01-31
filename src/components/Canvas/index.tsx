import {default as CircleComponent} from "./Circle";
import {Point} from "../../shared/interfaces/Point.ts";
import React, {createRef, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import AnnotationFactory from "../../shared/factory/annotation.factory.ts";
import {
    addCircle,
    addRectangle,
    selectAnnotation,
    updateAnnotation
} from "../../store/features/annotations/annotationSlice.ts";
import {ToolboxSelection} from "../../store/features/ui/types.ts";
import {Circle, Rectangle} from "../../shared/interfaces/Annotation.ts";
import {X_CANVAS_DELTA, Y_CANVAS_DELTA} from "../../shared/constants";
import {default as RectangleComponent} from "./Rectangle";

const Canvas = () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    // todo: use this variable to show a preview of what's happening on the screen
    const [isDrawing, setIsDrawing] = useState(false);
    const [mouseCoordinates, setMouseCoordinates] = useState<{
        initial: Point | null,
        hover: Point | null,
        final: Point | null
    }>({initial: null, hover: null, final: null});
    const circles = useSelector((state: RootState) => state.annotations.circles);
    const rectangles = useSelector((state: RootState) => state.annotations.rectangles);
    const selectedAnnotationId = useSelector((state: RootState) => state.annotations.selectedAnnotationId);
    const imageMetadata = useSelector((state: RootState) => state.ui.imageMetadata);
    const toolboxSelectedMode = useSelector((state: RootState) => state.ui.toolboxMode);
    const dispatch = useDispatch();

    const reset = () => {
        setIsDrawing(false);
        setMouseCoordinates({initial: null, final: null, hover: null});
    }

    useEffect(() => {
        window.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                reset();
            }
        })
    }, []);

    useEffect(() => {
        reset();
    }, [imageMetadata, toolboxSelectedMode]);

    useEffect(() => {
        const {initial, final} = mouseCoordinates;
        // console.log("changed mouse coordinates", mouseCoordinates)
        if (initial && !final) {
            setIsDrawing(true);
        }
        if (initial && final) {
            handleNewRegion({initial, final});
            reset();
        }
    }, [mouseCoordinates]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (toolboxSelectedMode === ToolboxSelection.SELECTION) return;
        // console.log("mouse down", {...e})
        setMouseCoordinates((prev) => {
            if (!prev.initial) {
                return {
                    initial: {x: e.clientX - X_CANVAS_DELTA, y: e.clientY - Y_CANVAS_DELTA},
                    hover: prev.hover,
                    final: null
                }
            } else {
                return {
                    initial: prev.initial,
                    hover: null,
                    final: {x: e.clientX - X_CANVAS_DELTA, y: e.clientY - Y_CANVAS_DELTA}
                }
            }
        });
    }

    // todo: type any
    const handleMouseHover = (e: any) => {
        if (!isDrawing) return;
        setMouseCoordinates(prev => ({
            ...prev,
            hover: {x: e.clientX - X_CANVAS_DELTA, y: e.clientY - Y_CANVAS_DELTA}
        }));
    }

    const handleNewRegion = ({initial, final}: { initial: Point, final: Point }) => {
        switch (toolboxSelectedMode) {
            case ToolboxSelection.CIRCLE:
                dispatch(addCircle(AnnotationFactory.createCircle({initial, final})));
                break;
            case ToolboxSelection.RECTANGLE:
                dispatch(addRectangle(AnnotationFactory.createRectangle({initial, final})));
                break;
        }
    }

    const handleUpdateAnnotation = (item: Circle | Rectangle) => {
        dispatch(updateAnnotation(item));
    }

    const handleClick = (id: string) => {
        dispatch(selectAnnotation(id));
    }

    return (
        <>
            <svg
                height={imageMetadata?.height || 0} width={imageMetadata?.width || 0}
                className={`absolute ${toolboxSelectedMode !== ToolboxSelection.SELECTION && "pointer-events-none"}`}
                xmlns="http://www.w3.org/2000/svg">
                {
                    circles.map(item => (
                        <CircleComponent
                            key={item.id}
                            circle={item}
                            isSelected={item.id === selectedAnnotationId}
                            handleUpdateAnnotation={handleUpdateAnnotation}
                            handleClick={handleClick}
                        />
                    ))
                }
                {
                    rectangles.map(item => (
                        <RectangleComponent
                            key={item.id}
                            rectangle={item}
                            isSelected={item.id === selectedAnnotationId}
                            handleUpdateAnnotation={handleUpdateAnnotation}
                            handleClick={handleClick}
                        />
                    ))
                }
                {
                    mouseCoordinates.initial && mouseCoordinates.hover && (
                        <line x1={mouseCoordinates.initial.x}
                              y1={mouseCoordinates.initial.y}
                              x2={mouseCoordinates.hover.x}
                              y2={mouseCoordinates.hover.y}
                              stroke="black"
                        />
                    )
                }
            </svg>
            <canvas
                id="editor"
                {...([ToolboxSelection.CIRCLE, ToolboxSelection.RECTANGLE].includes(toolboxSelectedMode)) && {
                    onMouseMove: handleMouseHover,
                    onMouseDown: handleMouseDown
                }}
                ref={canvasRef}
                height={imageMetadata?.height || 0} width={imageMetadata?.width || 0}
            >
            </canvas>
        </>
    );
};

export default Canvas;
