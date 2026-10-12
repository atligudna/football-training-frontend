"use client";

import {
    useState,
    useRef,
} from "react";

import type {
    PitchObject,
    PitchOrientation,
} from "../types/pitch-builder";

interface PitchCanvasProps {
    orientation: PitchOrientation;
    objects: PitchObject[];
    selectedObjectIds: string[];
    onSelectObject: (
        objectId?: string,
        additive?: boolean
    ) => void;
    onSelectObjects: (
        objectIds: string[],
        additive?: boolean
    ) => void;
    onMoveObjects: (
        objectIds: string[],
        deltaX: number,
        deltaY: number
    ) => void;
    onResizeObject: (
        objectId: string,
        width: number,
        height: number
    ) => void;
    onHistoryCheckpoint: () => void;
}

function clamp(
    value: number,
    min: number,
    max: number
) {
    return Math.min(
        Math.max(value, min),
        max
    );
}

export function PitchCanvas({
    orientation,
    objects,
    selectedObjectIds,
    onSelectObject,
    onSelectObjects,
    onMoveObjects,
    onResizeObject,
    onHistoryCheckpoint,
}: PitchCanvasProps) {
    const [
        draggingObjectId,
        setDraggingObjectId,
    ] = useState<string | null>(
        null
    );

    const isLandscape =
        orientation === "landscape";

    const width = isLandscape
        ? 1000
        : 700;

    const height = isLandscape
        ? 650
        : 1000;

    const centerX = width / 2;
    const centerY = height / 2;
    const [
        resizingObjectId,
        setResizingObjectId,
    ] = useState<string | null>(null);
    const [
        selectionStart,
        setSelectionStart,
    ] = useState<{
        x: number;
        y: number;
    } | null>(null);

    const [
        selectionEnd,
        setSelectionEnd,
    ] = useState<{
        x: number;
        y: number;
    } | null>(null);

    const [
        dragStartPosition,
        setDragStartPosition,
    ] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [
        dragObjectIds,
        setDragObjectIds,
    ] = useState<string[]>([]);

    const [
        selectionAdditive,
        setSelectionAdditive,
    ] = useState(false);

    const interactionHistorySaved =
        useRef(false);

    function getPointerPositionFromSvg(
        clientX: number,
        clientY: number,
        svg: SVGSVGElement
    ) {
        const rect =
            svg.getBoundingClientRect();

        const x =
            ((clientX - rect.left) /
                rect.width) *
            100;

        const y =
            ((clientY - rect.top) /
                rect.height) *
            100;

        return {
            x: clamp(x, 1, 99),
            y: clamp(y, 1, 99),
        };
    }

    function getPointerPosition(
        event: React.PointerEvent<SVGSVGElement>
    ) {
        return getPointerPositionFromSvg(
            event.clientX,
            event.clientY,
            event.currentTarget
        );
    }

    function handlePointerMove(
        event: React.PointerEvent<SVGSVGElement>
    ) {
        if (resizingObjectId) {
            if (
                !interactionHistorySaved.current
            ) {
                onHistoryCheckpoint();

                interactionHistorySaved.current =
                    true;
            }

            handleResizePointerMove(event);

            return;
        }

        if (
            draggingObjectId &&
            dragStartPosition &&
            dragObjectIds.length > 0
        ) {
            if (
                !interactionHistorySaved.current
            ) {
                onHistoryCheckpoint();

                interactionHistorySaved.current =
                    true;
            }

            const position =
                getPointerPosition(event);

            const deltaX =
                position.x -
                dragStartPosition.x;

            const deltaY =
                position.y -
                dragStartPosition.y;

            onMoveObjects(
                dragObjectIds,
                deltaX,
                deltaY
            );

            setDragStartPosition(
                position
            );

            return;
        }

        if (selectionStart) {
            setSelectionEnd(
                getPointerPosition(event)
            );
        }
    }

    function handlePointerUp(
        event: React.PointerEvent<SVGSVGElement>
    ) {
        if (
            selectionStart &&
            selectionEnd
        ) {
            const deltaX =
                Math.abs(
                    selectionEnd.x -
                    selectionStart.x
                );

            const deltaY =
                Math.abs(
                    selectionEnd.y -
                    selectionStart.y
                );

            const wasDragSelection =
                deltaX > 0.8 ||
                deltaY > 0.8;

            if (wasDragSelection) {
                const minX = Math.min(
                    selectionStart.x,
                    selectionEnd.x
                );

                const maxX = Math.max(
                    selectionStart.x,
                    selectionEnd.x
                );

                const minY = Math.min(
                    selectionStart.y,
                    selectionEnd.y
                );

                const maxY = Math.max(
                    selectionStart.y,
                    selectionEnd.y
                );

                const objectIdsInside =
                    objects
                        .filter(
                            (object) =>
                                object.x >= minX &&
                                object.x <= maxX &&
                                object.y >= minY &&
                                object.y <= maxY
                        )
                        .map(
                            (object) =>
                                object.id
                        );

                onSelectObjects(
                    objectIdsInside,
                    selectionAdditive
                );
            } else if (
                !selectionAdditive
            ) {
                // Venjulegur smellur
                // á tóman völl.
                onSelectObject(
                    undefined,
                    false
                );
            }
        }

        setSelectionStart(null);
        setSelectionEnd(null);
        setSelectionAdditive(false);

        setDraggingObjectId(null);
        setResizingObjectId(null);

        setDragStartPosition(null);
        setDragObjectIds([]);
        interactionHistorySaved.current =
            false;

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId
            );
        }
    }
    function handleResizePointerMove(
        event: React.PointerEvent<SVGSVGElement>
    ) {
        if (!resizingObjectId) {
            return;
        }

        const object =
            objects.find(
                (item) =>
                    item.id === resizingObjectId
            );

        if (
            !object ||
            object.type !== "area"
        ) {
            return;
        }

        const rect =
            event.currentTarget.getBoundingClientRect();

        // Pointer position in SVG coordinates
        const pointerX =
            ((event.clientX - rect.left) /
                rect.width) *
            width;

        const pointerY =
            ((event.clientY - rect.top) /
                rect.height) *
            height;

        // Center of the area in SVG coordinates
        const objectX =
            (object.x / 100) * width;

        const objectY =
            (object.y / 100) * height;

        // Difference from center of area
        const dx =
            pointerX - objectX;

        const dy =
            pointerY - objectY;

        // Undo the rotation of the area
        const rotation =
            object.rotation ?? 0;

        const radians =
            (-rotation * Math.PI) /
            180;

        const cos =
            Math.cos(radians);

        const sin =
            Math.sin(radians);

        const localX =
            dx * cos -
            dy * sin;

        const localY =
            dx * sin +
            dy * cos;

        // Area grows from its center
        const newWidth =
            Math.max(
                50,
                Math.abs(localX) * 2
            );

        const newHeight =
            Math.max(
                40,
                Math.abs(localY) * 2
            );

        onResizeObject(
            object.id,
            newWidth,
            newHeight
        );
    }
    function handleCanvasPointerDown(
        event: React.PointerEvent<SVGSVGElement>
    ) {
        const position =
            getPointerPosition(event);

        setSelectionStart(position);
        setSelectionEnd(position);

        setSelectionAdditive(
            event.metaKey ||
            event.ctrlKey
        );

        event.currentTarget.setPointerCapture(
            event.pointerId
        );
    }
    function handlePointerCancel(
        event: React.PointerEvent<SVGSVGElement>
    ) {
        setSelectionStart(null);
        setSelectionEnd(null);
        setSelectionAdditive(false);

        setDraggingObjectId(null);
        setResizingObjectId(null);

        setDragStartPosition(null);
        setDragObjectIds([]);

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId
            );
        }
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-emerald-700 p-3 shadow-sm">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full touch-none select-none"
                role="img"
                aria-label="Football pitch builder"
                onPointerDown={
                    handleCanvasPointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
                onPointerCancel={
                    handlePointerCancel
                }
            >
                <g pointerEvents="none">
                    <rect
                        x="10"
                        y="10"
                        width={width - 20}
                        height={height - 20}
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                    />

                    {isLandscape ? (
                        <>
                            <line
                                x1={centerX}
                                y1="10"
                                x2={centerX}
                                y2={height - 10}
                                stroke="white"
                                strokeWidth="4"
                            />

                            <circle
                                cx={centerX}
                                cy={centerY}
                                r="85"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <circle
                                cx={centerX}
                                cy={centerY}
                                r="6"
                                fill="white"
                            />

                            <rect
                                x="10"
                                y={centerY - 165}
                                width="165"
                                height="330"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <rect
                                x={width - 175}
                                y={centerY - 165}
                                width="165"
                                height="330"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <rect
                                x="10"
                                y={centerY - 80}
                                width="65"
                                height="160"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <rect
                                x={width - 75}
                                y={centerY - 80}
                                width="65"
                                height="160"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <circle
                                cx="115"
                                cy={centerY}
                                r="6"
                                fill="white"
                            />

                            <circle
                                cx={width - 115}
                                cy={centerY}
                                r="6"
                                fill="white"
                            />

                            <rect
                                x="-10"
                                y={centerY - 55}
                                width="20"
                                height="110"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <rect
                                x={width - 10}
                                y={centerY - 55}
                                width="20"
                                height="110"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />
                        </>
                    ) : (
                        <>
                            <line
                                x1="10"
                                y1={centerY}
                                x2={width - 10}
                                y2={centerY}
                                stroke="white"
                                strokeWidth="4"
                            />

                            <circle
                                cx={centerX}
                                cy={centerY}
                                r="85"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <circle
                                cx={centerX}
                                cy={centerY}
                                r="6"
                                fill="white"
                            />

                            <rect
                                x={centerX - 165}
                                y="10"
                                width="330"
                                height="165"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <rect
                                x={centerX - 165}
                                y={height - 175}
                                width="330"
                                height="165"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <rect
                                x={centerX - 80}
                                y="10"
                                width="160"
                                height="65"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <rect
                                x={centerX - 80}
                                y={height - 75}
                                width="160"
                                height="65"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />

                            <circle
                                cx={centerX}
                                cy="115"
                                r="6"
                                fill="white"
                            />

                            <circle
                                cx={centerX}
                                cy={height - 115}
                                r="6"
                                fill="white"
                            />
                        </>
                    )}
                </g>

                {objects.map(
                    (object) => {
                        const x =
                            (object.x / 100) *
                            width;

                        const y =
                            (object.y / 100) *
                            height;

                        const isSelected =
                            selectedObjectIds.includes(
                                object.id
                            );

                        const scale =
                            object.size === "small"
                                ? 0.5
                                : object.size === "large"
                                    ? 1.1
                                    : 0.8;
                        const canRotate =
                            object.type === "pole" ||
                            object.type === "goal" ||
                            object.type === "arrow" ||
                            object.type === "area" ||
                            object.type === "label";

                        const appliedRotation =
                            canRotate
                                ? object.rotation ?? 0
                                : 0;
                        const playerColor =
                            object.color === "red"
                                ? "#ef4444"
                                : object.color === "yellow"
                                    ? "#facc15"
                                    : object.color === "white"
                                        ? "#ffffff"
                                        : object.color === "black"
                                            ? "#111827"
                                            : "#3b82f6";
                        const goalWidth =
                            object.goalType === "mini"
                                ? 42
                                : object.goalType === "seven"
                                    ? 68
                                    : 92;

                        const goalHeight =
                            object.goalType === "mini"
                                ? 24
                                : object.goalType === "seven"
                                    ? 34
                                    : 44;

                        const arrowLength =
                            object.size === "small"
                                ? 55
                                : object.size === "large"
                                    ? 125
                                    : 90;

                        const arrowColor =
                            object.color === "red"
                                ? "#ef4444"
                                : object.color === "yellow"
                                    ? "#facc15"
                                    : object.color === "blue"
                                        ? "#3b82f6"
                                        : object.color === "black"
                                            ? "#111827"
                                            : "#ffffff";
                        const areaColor =
                            object.color === "red"
                                ? "#ef4444"
                                : object.color === "yellow"
                                    ? "#facc15"
                                    : object.color === "blue"
                                        ? "#3b82f6"
                                        : object.color === "black"
                                            ? "#111827"
                                            : "#ffffff";
                        const areaWidth =
                            object.width ?? 150;

                        const areaHeight =
                            object.height ?? 95;
                        const labelColor =
                            object.color === "red"
                                ? "#ef4444"
                                : object.color === "yellow"
                                    ? "#facc15"
                                    : object.color === "blue"
                                        ? "#3b82f6"
                                        : object.color === "black"
                                            ? "#111827"
                                            : "#ffffff";

                        const labelFontSize =
                            object.size === "small"
                                ? 22
                                : object.size === "large"
                                    ? 42
                                    : 30;

                        const labelText =
                            object.text || "Text";

                        const labelWidth = Math.max(
                            48,
                            labelText.length *
                            labelFontSize *
                            0.62
                        );

                        if (
                            object.type !== "cone" &&
                            object.type !== "pole" &&
                            object.type !== "ball" &&
                            object.type !== "player" &&
                            object.type !== "goal" &&
                            object.type !== "arrow" &&
                            object.type !== "area" &&
                            object.type !== "label"
                        ) {
                            return null;
                        }

                        return (
                            <g
                                key={object.id}
                                transform={
                                    object.type === "arrow" ||
                                        object.type === "area" ||
                                        object.type === "label"
                                        ? `translate(${x} ${y}) rotate(${appliedRotation})`
                                        : `translate(${x} ${y}) rotate(${appliedRotation}) scale(${scale})`
                                } onPointerDown={(event) => {
                                    event.stopPropagation();

                                    const additive =
                                        event.metaKey ||
                                        event.ctrlKey;

                                    const isAlreadySelected =
                                        selectedObjectIds.includes(
                                            object.id
                                        );

                                    if (additive) {
                                        onSelectObject(
                                            object.id,
                                            true
                                        );

                                        return;
                                    }

                                    /*
                                     * Ef objectið er þegar hluti af
                                     * multi-selection höldum við
                                     * selectioninu þegar drag byrjar.
                                     */
                                    if (!isAlreadySelected) {
                                        onSelectObject(
                                            object.id,
                                            false
                                        );
                                    }

                                    const idsToDrag =
                                        isAlreadySelected &&
                                            selectedObjectIds.length > 1
                                            ? selectedObjectIds
                                            : [object.id];

                                    const svg =
                                        event.currentTarget
                                            .ownerSVGElement;

                                    if (!svg) {
                                        return;
                                    }

                                    const position =
                                        getPointerPositionFromSvg(
                                            event.clientX,
                                            event.clientY,
                                            svg
                                        );

                                    interactionHistorySaved.current =
                                        false;
                                    setDraggingObjectId(
                                        object.id
                                    );

                                    setDragObjectIds(
                                        idsToDrag
                                    );

                                    setDragStartPosition(
                                        position
                                    );


                                    svg.setPointerCapture(
                                        event.pointerId
                                    );
                                }}
                            >

                                {isSelected && (
                                    object.type === "arrow" ? (
                                        <rect
                                            x={-arrowLength / 2 - 8}
                                            y="-22"
                                            width={arrowLength + 16}
                                            height="44"
                                            rx="8"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeDasharray="6 5"
                                            pointerEvents="none"
                                        />
                                    ) : object.type === "area" ? (
                                        <rect
                                            x={-areaWidth / 2 - 8}
                                            y={-areaHeight / 2 - 8}
                                            width={areaWidth + 16}
                                            height={areaHeight + 16}
                                            rx="8"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeDasharray="6 5"
                                            pointerEvents="none"
                                        />
                                    ) : object.type === "label" ? (
                                        <rect
                                            x={-labelWidth / 2 - 8}
                                            y={-labelFontSize / 2 - 8}
                                            width={labelWidth + 16}
                                            height={labelFontSize + 16}
                                            rx="6"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeDasharray="6 5"
                                            pointerEvents="none"
                                        />
                                    ) : (
                                        <circle
                                            cx="0"
                                            cy="0"
                                            r={
                                                object.type === "goal"
                                                    ? goalWidth / 2 + 10
                                                    : object.type === "pole"
                                                        ? 32
                                                        : object.type === "player"
                                                            ? 29
                                                            : object.type === "ball"
                                                                ? 25
                                                                : 27
                                            }
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeDasharray="6 5"
                                            pointerEvents="none"
                                        />
                                    )
                                )}
                                {object.type === "cone" && (
                                    <>
                                        <circle
                                            cx="0"
                                            cy="0"
                                            r="24"
                                            fill="transparent"
                                        />

                                        <path
                                            d="
          M 0 -18
          L 15 14
          L -15 14
          Z
        "
                                            fill="#f97316"
                                            stroke="white"
                                            strokeWidth="2"
                                        />

                                        <rect
                                            x="-18"
                                            y="12"
                                            width="36"
                                            height="7"
                                            rx="2"
                                            fill="#f97316"
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                    </>
                                )}

                                {object.type === "pole" && (
                                    <>
                                        <rect
                                            x="-18"
                                            y="-32"
                                            width="36"
                                            height="64"
                                            fill="transparent"
                                        />

                                        <rect
                                            x="-5"
                                            y="-28"
                                            width="10"
                                            height="52"
                                            rx="5"
                                            fill="#facc15"
                                            stroke="white"
                                            strokeWidth="2"
                                        />

                                        <rect
                                            x="-11"
                                            y="21"
                                            width="22"
                                            height="7"
                                            rx="2"
                                            fill="#facc15"
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                    </>
                                )}
                                {object.type === "area" &&
                                    isSelected && (
                                        <circle
                                            cx={areaWidth / 2}
                                            cy={areaHeight / 2}
                                            r="10"
                                            fill="white"
                                            stroke="#111827"
                                            strokeWidth="3"
                                            className="cursor-se-resize"
                                            onPointerDown={(
                                                event
                                            ) => {
                                                event.stopPropagation();
                                                interactionHistorySaved.current =
                                                    false;
                                                setResizingObjectId(
                                                    object.id
                                                );

                                                const svg =
                                                    event.currentTarget
                                                        .ownerSVGElement;

                                                svg?.setPointerCapture(
                                                    event.pointerId
                                                );
                                            }}
                                        />
                                    )}

                                {object.type === "ball" && (
                                    <>
                                        <circle
                                            cx="0"
                                            cy="0"
                                            r="21"
                                            fill="transparent"
                                        />

                                        <circle
                                            cx="0"
                                            cy="0"
                                            r="15"
                                            fill="white"
                                            stroke="#111827"
                                            strokeWidth="2"
                                        />

                                        <path
                                            d="
        M 0 -6
        L 6 -2
        L 4 5
        L -4 5
        L -6 -2
        Z
      "
                                            fill="#111827"
                                        />

                                        <line
                                            x1="0"
                                            y1="-6"
                                            x2="0"
                                            y2="-14"
                                            stroke="#111827"
                                            strokeWidth="1.5"
                                        />

                                        <line
                                            x1="6"
                                            y1="-2"
                                            x2="13"
                                            y2="-7"
                                            stroke="#111827"
                                            strokeWidth="1.5"
                                        />

                                        <line
                                            x1="4"
                                            y1="5"
                                            x2="9"
                                            y2="12"
                                            stroke="#111827"
                                            strokeWidth="1.5"
                                        />

                                        <line
                                            x1="-4"
                                            y1="5"
                                            x2="-9"
                                            y2="12"
                                            stroke="#111827"
                                            strokeWidth="1.5"
                                        />

                                        <line
                                            x1="-6"
                                            y1="-2"
                                            x2="-13"
                                            y2="-7"
                                            stroke="#111827"
                                            strokeWidth="1.5"
                                        />
                                    </>
                                )}
                                {object.type === "player" && (
                                    <>
                                        <circle
                                            cx="0"
                                            cy="0"
                                            r="25"
                                            fill="transparent"
                                        />

                                        <circle
                                            cx="0"
                                            cy="-10"
                                            r="8"
                                            fill={playerColor}
                                            stroke="white"
                                            strokeWidth="2"
                                        />

                                        <path
                                            d="
        M -12 3
        Q 0 -2 12 3
        L 9 20
        L -9 20
        Z
      "
                                            fill={playerColor}
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                    </>
                                )}
                                {object.type === "goal" && (
                                    <>
                                        <rect
                                            x={-goalWidth / 2 - 8}
                                            y={-goalHeight / 2 - 8}
                                            width={goalWidth + 16}
                                            height={goalHeight + 16}
                                            fill="transparent"
                                        />

                                        <rect
                                            x={-goalWidth / 2}
                                            y={-goalHeight / 2}
                                            width={goalWidth}
                                            height={goalHeight}
                                            fill="rgba(255,255,255,0.08)"
                                            stroke="white"
                                            strokeWidth="4"
                                            rx="2"
                                        />

                                        <line
                                            x1={-goalWidth / 2}
                                            y1={goalHeight / 2}
                                            x2={-goalWidth / 2 + 10}
                                            y2={goalHeight / 2 + 8}
                                            stroke="white"
                                            strokeWidth="3"
                                        />

                                        <line
                                            x1={goalWidth / 2}
                                            y1={goalHeight / 2}
                                            x2={goalWidth / 2 - 10}
                                            y2={goalHeight / 2 + 8}
                                            stroke="white"
                                            strokeWidth="3"
                                        />

                                        <line
                                            x1={-goalWidth / 2 + 10}
                                            y1={goalHeight / 2 + 8}
                                            x2={goalWidth / 2 - 10}
                                            y2={goalHeight / 2 + 8}
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                    </>
                                )}
                                {object.type === "arrow" && (
                                    <>
                                        <rect
                                            x={-arrowLength / 2 - 12}
                                            y="-18"
                                            width={arrowLength + 24}
                                            height="36"
                                            fill="transparent"
                                        />

                                        <line
                                            x1={-arrowLength / 2}
                                            y1="0"
                                            x2={arrowLength / 2 - 9}
                                            y2="0"
                                            stroke={arrowColor}
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeDasharray={
                                                object.lineStyle === "dashed"
                                                    ? "14 10"
                                                    : undefined
                                            }
                                        />

                                        <path
                                            d={`
        M ${arrowLength / 2} 0
        L ${arrowLength / 2 - 14} -8
        L ${arrowLength / 2 - 14} 8
        Z
      `}
                                            fill={arrowColor}
                                        />
                                    </>
                                )}
                                {object.type === "area" && (
                                    <rect
                                        x={-areaWidth / 2}
                                        y={-areaHeight / 2}
                                        width={areaWidth}
                                        height={areaHeight}
                                        rx="6"
                                        fill={areaColor}
                                        fillOpacity="0.2"
                                        stroke={areaColor}
                                        strokeWidth="4"
                                        strokeDasharray={
                                            object.lineStyle === "dashed"
                                                ? "14 10"
                                                : undefined
                                        }
                                    />
                                )}
                                {object.type === "label" && (
                                    <>
                                        <rect
                                            x={-labelWidth / 2 - 8}
                                            y={-labelFontSize / 2 - 8}
                                            width={labelWidth + 16}
                                            height={labelFontSize + 16}
                                            fill="transparent"
                                        />

                                        <text
                                            x="0"
                                            y="0"
                                            fill={labelColor}
                                            fontSize={labelFontSize}
                                            fontWeight="700"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            pointerEvents="none"
                                        >
                                            {labelText}
                                        </text>
                                    </>
                                )}
                            </g>
                        );
                    }
                )}
                {selectionStart &&
                    selectionEnd && (
                        <rect
                            x={
                                (Math.min(
                                    selectionStart.x,
                                    selectionEnd.x
                                ) /
                                    100) *
                                width
                            }
                            y={
                                (Math.min(
                                    selectionStart.y,
                                    selectionEnd.y
                                ) /
                                    100) *
                                height
                            }
                            width={
                                (Math.abs(
                                    selectionEnd.x -
                                    selectionStart.x
                                ) /
                                    100) *
                                width
                            }
                            height={
                                (Math.abs(
                                    selectionEnd.y -
                                    selectionStart.y
                                ) /
                                    100) *
                                height
                            }
                            fill="#ffffff"
                            fillOpacity="0.12"
                            stroke="#ffffff"
                            strokeWidth="3"
                            strokeDasharray="10 8"
                            pointerEvents="none"
                        />
                    )}
            </svg>
        </div>
    );
}