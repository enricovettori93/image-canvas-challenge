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
import {circlesSelector, rectanglesSelector} from "../../store/features/annotations/selectors.ts";
import {metadataSelector} from "../../store/features/ui/selectors.ts";
import CircleAdapter from "../../shared/adapters/circle.adapter.ts";
import RectangleAdapter from "../../shared/adapters/rectangle.adapter.ts";

const Canvas = () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const [, setIsDrawing] = useState(false);
    const [mouseCoordinates, setMouseCoordinates] = useState<{
        initial: Point | null,
        hover: Point | null,
        final: Point | null
    }>({initial: null, hover: null, final: null});
    const dispatch = useDispatch();
    const circles = useSelector(circlesSelector);
    const rectangles = useSelector(rectanglesSelector);
    const selectedAnnotationId = useSelector((state: RootState) => state.annotations.selectedAnnotationId);
    const imageMetadata = useSelector(metadataSelector);
    const imageError = useSelector((state: RootState) => state.ui.image.error);
    const toolboxSelectedMode = useSelector((state: RootState) => state.ui.toolboxMode);
    const debug = useSelector((state: RootState) => state.ui.debug);

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

    const handleMouseHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setMouseCoordinates(prev => ({
            ...prev,
            hover: {x: e.clientX - X_CANVAS_DELTA, y: e.clientY - Y_CANVAS_DELTA}
        }));
    }

    const handleNewRegion = ({initial, final}: { initial: Point, final: Point }) => {
        switch (toolboxSelectedMode) {
            case ToolboxSelection.CIRCLE:
                dispatch(addCircle(CircleAdapter.fromCanvasCoordinateToNormalizedCoordinate({
                    annotation: AnnotationFactory.createCircle({initial, final}),
                    imageHeight: imageMetadata.height,
                    imageWidth: imageMetadata.width,
                })));
                break;
            case ToolboxSelection.RECTANGLE:
                dispatch(addRectangle(RectangleAdapter.fromCanvasCoordinateToNormalizedCoordinate({
                    annotation: AnnotationFactory.createRectangle({initial, final}),
                    imageHeight: imageMetadata.height,
                    imageWidth: imageMetadata.width
                })));
                break;
        }
    }

    const handleUpdateRectangle = (item: Rectangle) => {
        dispatch(updateAnnotation(RectangleAdapter.fromCanvasCoordinateToNormalizedCoordinate({
            annotation: item,
            imageHeight: imageMetadata.height,
            imageWidth: imageMetadata.width
        })));
    }

    const handleUpdateCircle = (item: Circle) => {
        dispatch(updateAnnotation(CircleAdapter.fromCanvasCoordinateToNormalizedCoordinate({
            annotation: item,
            imageHeight: imageMetadata.height,
            imageWidth: imageMetadata.width,
        })));
    }

    const handleClick = (id: string) => {
        dispatch(selectAnnotation(id));
    }

    if (imageError) {
        return (
            <p className="text-red-500 text-3xl">Error loading the image {imageError}</p>
        )
    }

    return (
        <>
            {
                debug && (
                    <span className="absolute">
                        Mouse coordinate on canvas {JSON.stringify(mouseCoordinates.hover)}
                    </span>
                )
            }
            <svg
                className={`absolute ${toolboxSelectedMode !== ToolboxSelection.SELECTION && "pointer-events-none"}`}
                xmlns="http://www.w3.org/2000/svg"
                height={imageMetadata?.height || 0} width={imageMetadata?.width || 0}
            >
                {
                    circles.map(item => (
                        <CircleComponent
                            key={item.id}
                            circle={item}
                            currentMousePosition={mouseCoordinates.hover}
                            isSelected={item.id === selectedAnnotationId}
                            handleUpdateAnnotation={handleUpdateCircle}
                            handleClick={handleClick}
                        />
                    ))
                }
                {
                    rectangles.map(item => (
                        <RectangleComponent
                            key={item.id}
                            rectangle={item}
                            currentMousePosition={mouseCoordinates.hover}
                            isSelected={item.id === selectedAnnotationId}
                            handleUpdateAnnotation={handleUpdateRectangle}
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
                ref={canvasRef}
                {...([ToolboxSelection.CIRCLE, ToolboxSelection.RECTANGLE].includes(toolboxSelectedMode)) && {
                    onMouseMove: handleMouseHover,
                    onMouseDown: handleMouseDown
                }}
                height={imageMetadata?.height || 0} width={imageMetadata?.width || 0}
            >
            </canvas>
        </>
    );
};

export default Canvas;
