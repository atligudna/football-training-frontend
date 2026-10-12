"use client";

import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";

import {
    Copy,
    Goal,
    RectangleHorizontal,
    RectangleVertical,
    Trash2,
    RotateCcw,
    RotateCw,
    BringToFront,
    SendToBack,
    Undo2,
    Redo2,
} from "lucide-react";

import {
    Button,
} from "@/components/ui/button";

import {
    Card,
} from "@/components/ui/card";

import {
    PitchCanvas,
} from "./PitchCanvas";

import type {
    PitchObject,
    PitchObjectSize,
    PitchOrientation,
} from "../types/pitch-builder";

function normalizeRotation(
    rotation: number
) {
    return (
        ((rotation % 360) + 360) %
        360
    );
}
function clonePitchObjects(
    objects: PitchObject[]
): PitchObject[] {
    return objects.map(
        (object) => ({
            ...object,
        })
    );
}
interface PitchHistoryState {
    objects: PitchObject[];
    orientation: PitchOrientation;
}

export function PitchBuilderClient() {
    const [
        orientation,
        setOrientation,
    ] =
        useState<PitchOrientation>(
            "landscape"
        );

    const [
        objects,
        setObjects,
    ] = useState<PitchObject[]>(
        []
    );

    const [
        undoStack,
        setUndoStack,
    ] = useState<PitchHistoryState[]>([]);

    const [
        redoStack,
        setRedoStack,
    ] = useState<PitchHistoryState[]>([]);

    const textEditSnapshotRef =
        useRef<PitchObject[] | null>(
            null
        );
    const [
        selectedObjectIds,
        setSelectedObjectIds,
    ] = useState<string[]>([]);
    const pushHistorySnapshot =
        useCallback(
            (
                snapshot: PitchHistoryState
            ) => {
                setUndoStack(
                    (currentStack) => [
                        ...currentStack.slice(-49),
                        {
                            objects:
                                clonePitchObjects(
                                    snapshot.objects
                                ),
                            orientation:
                                snapshot.orientation,
                        },
                    ]
                );

                setRedoStack([]);
            },
            []
        );
    const recordHistory =
        useCallback(() => {
            pushHistorySnapshot({
                objects,
                orientation,
            });
        }, [
            objects,
            orientation,
            pushHistorySnapshot,
        ]);

    const selectedObjectId =
        selectedObjectIds[
        selectedObjectIds.length - 1
        ];

    const setSelectedObjectId =
        useCallback(
            (
                objectId:
                    | string
                    | undefined
            ) => {
                setSelectedObjectIds(
                    objectId
                        ? [objectId]
                        : []
                );
            },
            []
        );
    const handleSelectObject =
        useCallback(
            (
                objectId?: string,
                additive = false
            ) => {
                if (!objectId) {
                    if (!additive) {
                        setSelectedObjectIds(
                            []
                        );
                    }

                    return;
                }

                if (!additive) {
                    setSelectedObjectIds([
                        objectId,
                    ]);

                    return;
                }

                setSelectedObjectIds(
                    (currentIds) => {
                        if (
                            currentIds.includes(
                                objectId
                            )
                        ) {
                            return currentIds.filter(
                                (id) =>
                                    id !== objectId
                            );
                        }

                        return [
                            ...currentIds,
                            objectId,
                        ];
                    }
                );
            },
            []
        );

    function handleAddCone() {
        const coneCount =
            objects.filter(
                (object) =>
                    object.type === "cone"
            ).length;

        const offset =
            (coneCount % 6) * 3;

        const cone: PitchObject = {
            id: crypto.randomUUID(),
            type: "cone",
            x: 40 + offset,
            y: 40 + offset,
            size: "medium",
        };
        recordHistory();

        setObjects(
            (currentObjects) => [
                ...currentObjects,
                cone,
            ]
        );

        setSelectedObjectId(
            cone.id
        );
    }
    function handleClearPitch() {
        if (
            objects.length === 0
        ) {
            return;
        }

        const confirmed =
            window.confirm(
                "Remove all objects from the pitch?"
            );

        if (!confirmed) {
            return;
        }

        setObjects([]);

        setSelectedObjectId(
            undefined
        );
    }
    function handleChangeSelectedSize(
        size: PitchObjectSize
    ) {
        handleUpdateSelectedObject({
            size,
        });
    }
    function handleAddPole() {
        const poleCount =
            objects.filter(
                (object) =>
                    object.type === "pole"
            ).length;

        const offset =
            (poleCount % 6) * 3;

        const pole: PitchObject = {
            id: crypto.randomUUID(),
            type: "pole",
            x: 50 + offset,
            y: 50 + offset,
            size: "medium",
        };
        recordHistory();

        setObjects(
            (currentObjects) => [
                ...currentObjects,
                pole,
            ]
        );

        setSelectedObjectId(
            pole.id
        );
    }
    function handleAddBall() {
        const ballCount =
            objects.filter(
                (object) =>
                    object.type === "ball"
            ).length;

        const offset =
            (ballCount % 6) * 3;

        const ball: PitchObject = {
            id: crypto.randomUUID(),
            type: "ball",
            x: 45 + offset,
            y: 45 + offset,
            size: "medium",
        };
        recordHistory();

        setObjects(
            (currentObjects) => [
                ...currentObjects,
                ball,
            ]
        );

        setSelectedObjectId(
            ball.id
        );
    }
    function handleAddPlayer() {
        const playerCount =
            objects.filter(
                (object) =>
                    object.type === "player"
            ).length;

        const offset =
            (playerCount % 6) * 3;

        const player: PitchObject = {
            id: crypto.randomUUID(),
            type: "player",
            x: 50 + offset,
            y: 40 + offset,
            size: "medium",
            color: "blue",
        };

        recordHistory();
        setObjects(
            (currentObjects) => [
                ...currentObjects,
                player,
            ]
        );

        setSelectedObjectId(
            player.id
        );
    }
    function handleAddGoal() {
        const goalCount =
            objects.filter(
                (object) =>
                    object.type === "goal"
            ).length;

        const offset =
            (goalCount % 5) * 3;

        const goal: PitchObject = {
            id: crypto.randomUUID(),
            type: "goal",
            x: 50 + offset,
            y: 50 + offset,
            size: "medium",
            goalType: "full",
        };
        recordHistory();

        setObjects(
            (currentObjects) => [
                ...currentObjects,
                goal,
            ]
        );

        setSelectedObjectId(
            goal.id
        );
    }
    function handleRotateSelected(
        degrees: number
    ) {
        if (!selectedObject) {
            return;
        }

        const currentRotation =
            selectedObject.rotation ?? 0;

        const nextRotation =
            normalizeRotation(
                currentRotation +
                degrees
            );

        handleUpdateSelectedObject({
            rotation: nextRotation,
        });
    }
    const handleUpdateSelectedObject =
        useCallback(
            (
                updates: Partial<PitchObject>
            ) => {
                if (!selectedObjectId) {
                    return;
                }

                recordHistory();

                setObjects(
                    (currentObjects) =>
                        currentObjects.map(
                            (object) =>
                                object.id ===
                                    selectedObjectId
                                    ? {
                                        ...object,
                                        ...updates,
                                    }
                                    : object
                        )
                );
            },
            [
                selectedObjectId,
                recordHistory,
            ]
        );
    function handleOrientationChange(
        nextOrientation: PitchOrientation
    ) {
        if (
            nextOrientation === orientation
        ) {
            return;
        }
        recordHistory();
        const landscapeToPortrait =
            orientation === "landscape" &&
            nextOrientation === "portrait";

        setObjects(
            (currentObjects) =>
                currentObjects.map(
                    (object) => {
                        const nextPosition =
                            landscapeToPortrait
                                ? {
                                    x:
                                        100 -
                                        object.y,
                                    y: object.x,
                                }
                                : {
                                    x: object.y,
                                    y:
                                        100 -
                                        object.x,
                                };

                        const shouldRotate =
                            object.type === "goal" ||
                            object.type === "arrow" ||
                            object.type === "area";

                        const rotationDelta =
                            landscapeToPortrait
                                ? 90
                                : -90;

                        return {
                            ...object,
                            ...nextPosition,

                            rotation:
                                shouldRotate
                                    ? normalizeRotation(
                                        (object.rotation ??
                                            0) +
                                        rotationDelta
                                    )
                                    : object.rotation,
                        };
                    }
                )
        );

        setOrientation(
            nextOrientation
        );
    }
    function handleAddArrow() {
        const arrowCount =
            objects.filter(
                (object) =>
                    object.type === "arrow"
            ).length;

        const offset =
            (arrowCount % 5) * 3;

        const arrow: PitchObject = {
            id: crypto.randomUUID(),
            type: "arrow",
            x: 50 + offset,
            y: 50 + offset,
            size: "medium",
            rotation: 0,
            lineStyle: "solid",
            color: "white"
        };
        recordHistory();

        setObjects(
            (currentObjects) => [
                ...currentObjects,
                arrow,
            ]
        );

        setSelectedObjectId(
            arrow.id
        );
    }
    function handleAddArea() {
        const areaCount =
            objects.filter(
                (object) =>
                    object.type === "area"
            ).length;

        const offset =
            (areaCount % 5) * 3;

        const area: PitchObject = {
            id: crypto.randomUUID(),
            type: "area",
            x: 50 + offset,
            y: 50 + offset,
            width: 150,
            height: 95,
            rotation: 0,
            color: "yellow",
            lineStyle: "solid",
        };

        recordHistory();
        setObjects(
            (currentObjects) => [
                ...currentObjects,
                area,
            ]
        );

        setSelectedObjectId(
            area.id
        );
    }
    function handleAddLabel() {
        const labelCount =
            objects.filter(
                (object) =>
                    object.type === "label"
            ).length;

        const offset =
            (labelCount % 5) * 3;

        const label: PitchObject = {
            id: crypto.randomUUID(),
            type: "label",
            x: 50 + offset,
            y: 50 + offset,
            size: "medium",
            rotation: 0,
            color: "white",
            text: "Text",
        };

        recordHistory();
        setObjects(
            (currentObjects) => [
                ...currentObjects,
                label,
            ]
        );

        setSelectedObjectId(
            label.id
        );
    }
    function handleBringForward() {
        if (!selectedObjectId) {
            return;
        }

        const index = objects.findIndex(
            (object) =>
                object.id === selectedObjectId
        );

        if (
            index === -1 ||
            index === objects.length - 1
        ) {
            return;
        }

        recordHistory();

        setObjects((currentObjects) => {
            const nextObjects = [
                ...currentObjects,
            ];

            const temp =
                nextObjects[index];

            nextObjects[index] =
                nextObjects[index + 1];

            nextObjects[index + 1] =
                temp;

            return nextObjects;
        });
    }
    function handleSendBackward() {
        if (!selectedObjectId) {
            return;
        }

        const index = objects.findIndex(
            (object) =>
                object.id === selectedObjectId
        );

        if (index <= 0) {
            return;
        }

        recordHistory();

        setObjects((currentObjects) => {
            const nextObjects = [
                ...currentObjects,
            ];

            const temp =
                nextObjects[index];

            nextObjects[index] =
                nextObjects[index - 1];

            nextObjects[index - 1] =
                temp;

            return nextObjects;
        });
    }

    function handleMoveObjects(
        objectIds: string[],
        deltaX: number,
        deltaY: number
    ) {
        setObjects(
            (currentObjects) =>
                currentObjects.map(
                    (object) => {
                        if (
                            !objectIds.includes(
                                object.id
                            )
                        ) {
                            return object;
                        }

                        return {
                            ...object,
                            x: Math.min(
                                99,
                                Math.max(
                                    1,
                                    object.x +
                                    deltaX
                                )
                            ),
                            y: Math.min(
                                99,
                                Math.max(
                                    1,
                                    object.y +
                                    deltaY
                                )
                            ),
                        };
                    }
                )
        );
    }

    const handleDeleteSelected =
        useCallback(() => {
            if (
                selectedObjectIds.length === 0
            ) {
                return;
            }
            recordHistory();

            setObjects(
                (currentObjects) =>
                    currentObjects.filter(
                        (object) =>
                            !selectedObjectIds.includes(
                                object.id
                            )
                    )
            );

            setSelectedObjectIds([]);
        }, [selectedObjectIds,
            recordHistory,
        ]);

    const handleDuplicateSelected =
        useCallback(() => {
            if (
                selectedObjectIds.length === 0
            ) {
                return;
            }

            const selectedObjects =
                objects.filter(
                    (object) =>
                        selectedObjectIds.includes(
                            object.id
                        )
                );

            if (
                selectedObjects.length === 0
            ) {
                return;
            }

            const duplicatedObjects =
                selectedObjects.map(
                    (object) => ({
                        ...object,
                        id: crypto.randomUUID(),
                        x: Math.min(
                            object.x + 4,
                            96
                        ),
                        y: Math.min(
                            object.y + 4,
                            96
                        ),
                    })
                );

            recordHistory();
            setObjects(
                (currentObjects) => [
                    ...currentObjects,
                    ...duplicatedObjects,
                ]
            );

            setSelectedObjectIds(
                duplicatedObjects.map(
                    (object) => object.id
                )
            );
        }, [
            objects,
            selectedObjectIds,
            recordHistory,
        ]);
    const handleSelectObjects =
        useCallback(
            (
                objectIds: string[],
                additive = false
            ) => {
                if (!additive) {
                    setSelectedObjectIds(
                        objectIds
                    );
                    return;
                }

                setSelectedObjectIds(
                    (currentIds) => [
                        ...new Set([
                            ...currentIds,
                            ...objectIds,
                        ]),
                    ]
                );
            },
            []
        );

    function handleResizeObject(
        objectId: string,
        width: number,
        height: number
    ) {
        setObjects(
            (currentObjects) =>
                currentObjects.map(
                    (object) =>
                        object.id === objectId
                            ? {
                                ...object,
                                width,
                                height,
                            }
                            : object
                )
        );
    }
    const handleUndo =
        useCallback(() => {
            if (undoStack.length === 0) {
                return;
            }

            const previousState =
                undoStack[
                undoStack.length - 1
                ];

            const currentState:
                PitchHistoryState = {
                objects:
                    clonePitchObjects(
                        objects
                    ),
                orientation,
            };

            setUndoStack(
                undoStack.slice(0, -1)
            );

            setRedoStack(
                (currentStack) => [
                    ...currentStack.slice(-49),
                    currentState,
                ]
            );

            setObjects(
                clonePitchObjects(
                    previousState.objects
                )
            );

            setOrientation(
                previousState.orientation
            );

            setSelectedObjectIds([]);
        }, [
            objects,
            orientation,
            undoStack,
        ]);
    const handleRedo =
        useCallback(() => {
            if (redoStack.length === 0) {
                return;
            }

            const nextState =
                redoStack[
                redoStack.length - 1
                ];

            const currentState:
                PitchHistoryState = {
                objects:
                    clonePitchObjects(
                        objects
                    ),
                orientation,
            };

            setRedoStack(
                redoStack.slice(0, -1)
            );

            setUndoStack(
                (currentStack) => [
                    ...currentStack.slice(-49),
                    currentState,
                ]
            );

            setObjects(
                clonePitchObjects(
                    nextState.objects
                )
            );

            setOrientation(
                nextState.orientation
            );

            setSelectedObjectIds([]);
        }, [
            objects,
            orientation,
            redoStack,
        ]);

    useEffect(() => {
        function handleKeyDown(
            event: KeyboardEvent
        ) {
            const target =
                event.target as HTMLElement | null;

            const isTyping =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.isContentEditable;

            if (isTyping) {
                return;
            }

            if (
                event.key === "Delete" ||
                event.key === "Backspace"
            ) {
                if (!selectedObjectId) {
                    return;
                }

                event.preventDefault();

                handleDeleteSelected();
                return;
            }
            const undoShortcut =
                (event.metaKey ||
                    event.ctrlKey) &&
                !event.shiftKey &&
                event.key.toLowerCase() === "z";

            if (undoShortcut) {
                event.preventDefault();

                handleUndo();
                return;
            }

            const redoShortcut =
                (event.metaKey ||
                    event.ctrlKey) &&
                event.shiftKey &&
                event.key.toLowerCase() === "z";

            if (redoShortcut) {
                event.preventDefault();

                handleRedo();
                return;
            }
            if (
                (event.metaKey ||
                    event.ctrlKey) &&
                event.key.toLowerCase() === "c"
            ) {
                if (!selectedObjectId) {
                    return;
                }

                event.preventDefault();

                handleDuplicateSelected();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        selectedObjectId,
        handleDeleteSelected,
        handleDuplicateSelected,
        handleUndo,
        handleRedo,
    ]);


    const selectedObject =
        objects.find(
            (object) =>
                object.id === selectedObjectId
        );

    const coneCount =
        objects.filter(
            (object) =>
                object.type === "cone"
        ).length;
    const poleCount =
        objects.filter(
            (object) =>
                object.type === "pole"
        ).length;
    const ballCount =
        objects.filter(
            (object) =>
                object.type === "ball"
        ).length;
    const playerCount =
        objects.filter(
            (object) =>
                object.type === "player"
        ).length;
    const goalCount =
        objects.filter(
            (object) =>
                object.type === "goal"
        ).length;

    const arrowCount =
        objects.filter(
            (object) =>
                object.type === "arrow"
        ).length;

    const areaCount =
        objects.filter(
            (object) =>
                object.type === "area"
        ).length;
    const labelCount =
        objects.filter(
            (object) =>
                object.type === "label"
        ).length;

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center gap-2">
                    <Goal className="h-6 w-6" />

                    <h1 className="text-3xl font-bold tracking-tight">
                        Pitch Builder
                    </h1>
                </div>

                <p className="mt-2 text-muted-foreground">
                    Create football pitch
                    diagrams for drills and
                    training sessions.
                </p>
            </header>

            <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
                <Card className="h-fit p-4">
                    <div>
                        <h2 className="font-semibold">
                            Pitch settings
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Choose the pitch
                            orientation.
                        </p>
                    </div>

                    <div className="mt-4 space-y-2">
                        <Button
                            type="button"
                            variant={
                                orientation ===
                                    "landscape"
                                    ? "default"
                                    : "outline"
                            }
                            className="w-full justify-start"
                            onClick={() =>
                                handleOrientationChange(
                                    "landscape"
                                )
                            }
                        >
                            <RectangleHorizontal className="h-4 w-4" />
                            Landscape
                        </Button>

                        <Button
                            type="button"
                            variant={
                                orientation ===
                                    "portrait"
                                    ? "default"
                                    : "outline"
                            }
                            className="w-full justify-start"
                            onClick={() =>
                                handleOrientationChange(
                                    "portrait"
                                )
                            }
                        >
                            <RectangleVertical className="h-4 w-4" />
                            Portrait
                        </Button>
                    </div>


                    <div className="mt-6 border-t pt-4">
                        <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold">
                                Objects
                            </p>

                            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                                {objects.length}
                            </span>
                        </div>


                        <div className="space-y-1 px-1 text-xs text-muted-foreground">
                            <p>
                                {coneCount}{" "}
                                {coneCount === 1
                                    ? "cone"
                                    : "cones"}{" "}
                                on pitch
                            </p>
                            <p>
                                {poleCount}{" "}
                                {poleCount === 1
                                    ? "pole"
                                    : "poles"}{" "}
                                on pitch
                            </p>
                            <p>
                                {ballCount}{" "}
                                {ballCount === 1
                                    ? "ball"
                                    : "balls"}{" "}
                                on pitch
                            </p>
                            <p>
                                {playerCount}{" "}
                                {playerCount === 1
                                    ? "player"
                                    : "players"}{" "}
                                on pitch
                            </p>
                            <p>
                                {goalCount}{" "}
                                {goalCount === 1
                                    ? "goal"
                                    : "goals"}{" "}
                                on pitch
                            </p>
                            <p>
                                {arrowCount}{" "}
                                {arrowCount === 1
                                    ? "arrow"
                                    : "arrows"}{" "}
                                on pitch
                            </p>
                            <p>
                                {areaCount}{" "}
                                {areaCount === 1
                                    ? "area"
                                    : "areas"}{" "}
                                on pitch
                            </p>
                            <p>
                                {labelCount}{" "}
                                {labelCount === 1
                                    ? "label"
                                    : "labels"}{" "}
                                on pitch
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <p className="font-semibold">
                            Selection
                        </p>

                        {(
                            selectedObject?.type === "cone" ||
                            selectedObject?.type === "pole" ||
                            selectedObject?.type === "ball" ||
                            selectedObject?.type === "player" ||
                            selectedObject?.type === "goal" ||
                            selectedObject?.type === "arrow" ||
                            selectedObject?.type === "label"
                        ) && (
                                <div>
                                    <p className="mb-2 text-sm font-medium">
                                        Size
                                    </p>

                                    <div className="grid grid-cols-3 gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                                selectedObject.size === "small"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                handleChangeSelectedSize(
                                                    "small"
                                                )
                                            }
                                        >
                                            Small
                                        </Button>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                                !selectedObject.size ||
                                                    selectedObject.size === "medium"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                handleChangeSelectedSize(
                                                    "medium"
                                                )
                                            }
                                        >
                                            Medium
                                        </Button>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                                selectedObject.size === "large"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                handleChangeSelectedSize(
                                                    "large"
                                                )
                                            }
                                        >
                                            Large
                                        </Button>
                                    </div>
                                </div>
                            )}

                        {selectedObject?.type === "player" && (
                            <div>
                                <p className="mb-2 text-sm font-medium">
                                    Player color
                                </p>

                                <div className="grid grid-cols-5 gap-2">
                                    {(
                                        [
                                            "blue",
                                            "red",
                                            "yellow",
                                            "white",
                                            "black",
                                        ] as const
                                    ).map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            aria-label={`${color} player`}
                                            onClick={() =>
                                                handleUpdateSelectedObject({
                                                    color,
                                                })
                                            }
                                            className={[
                                                "h-9 rounded-md border-2",
                                                selectedObject.color === color
                                                    ? "border-foreground"
                                                    : "border-transparent",
                                                color === "blue"
                                                    ? "bg-blue-500"
                                                    : color === "red"
                                                        ? "bg-red-500"
                                                        : color === "yellow"
                                                            ? "bg-yellow-400"
                                                            : color === "white"
                                                                ? "bg-white"
                                                                : "bg-black",
                                            ].join(" ")}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedObject?.type === "goal" && (
                            <div>
                                <p className="mb-2 text-sm font-medium">
                                    Goal type
                                </p>

                                <div className="grid gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            selectedObject.goalType === "full" ||
                                                !selectedObject.goalType
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            handleUpdateSelectedObject({
                                                goalType: "full",
                                            })
                                        }
                                    >
                                        Full-size goal
                                    </Button>

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            selectedObject.goalType === "seven"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            handleUpdateSelectedObject({
                                                goalType: "seven",
                                            })
                                        }
                                    >
                                        7-a-side goal
                                    </Button>

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            selectedObject.goalType === "mini"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            handleUpdateSelectedObject({
                                                goalType: "mini",
                                            })
                                        }
                                    >
                                        Mini goal
                                    </Button>
                                </div>
                            </div>
                        )}

                        {(
                            selectedObject?.type === "goal" ||
                            selectedObject?.type === "pole" ||
                            selectedObject?.type === "arrow" ||
                            selectedObject?.type === "area" ||
                            selectedObject?.type === "label"
                        ) && (
                                <div>
                                    <p className="mb-2 text-sm font-medium">
                                        Rotation
                                    </p>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleRotateSelected(
                                                    -45
                                                )
                                            }
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            45°
                                        </Button>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleRotateSelected(
                                                    45
                                                )
                                            }
                                        >
                                            <RotateCw className="h-4 w-4" />
                                            45°
                                        </Button>
                                    </div>

                                    <p className="mt-2 text-center text-xs text-muted-foreground">
                                        {selectedObject.rotation ?? 0}°
                                    </p>
                                </div>
                            )}

                        {(
                            selectedObject?.type === "arrow" ||
                            selectedObject?.type === "area"
                        ) && (
                                <div>
                                    <p className="mb-2 text-sm font-medium">
                                        Line style
                                    </p>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                                !selectedObject.lineStyle ||
                                                    selectedObject.lineStyle === "solid"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                handleUpdateSelectedObject({
                                                    lineStyle: "solid",
                                                })
                                            }
                                        >
                                            Solid
                                        </Button>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                                selectedObject.lineStyle === "dashed"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                handleUpdateSelectedObject({
                                                    lineStyle: "dashed",
                                                })
                                            }
                                        >
                                            Dashed
                                        </Button>
                                    </div>
                                </div>
                            )}

                        {selectedObject?.type === "area" && (
                            <div>
                                <p className="mb-2 text-sm font-medium">
                                    Area color
                                </p>

                                <div className="grid grid-cols-5 gap-2">
                                    {(
                                        [
                                            "white",
                                            "yellow",
                                            "red",
                                            "blue",
                                            "black",
                                        ] as const
                                    ).map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            aria-label={`${color} area`}
                                            onClick={() =>
                                                handleUpdateSelectedObject({
                                                    color,
                                                })
                                            }
                                            className={[
                                                "h-9 rounded-md border-2",
                                                selectedObject.color === color
                                                    ? "border-foreground"
                                                    : "border-transparent",
                                                color === "blue"
                                                    ? "bg-blue-500"
                                                    : color === "red"
                                                        ? "bg-red-500"
                                                        : color === "yellow"
                                                            ? "bg-yellow-400"
                                                            : color === "black"
                                                                ? "bg-black"
                                                                : "bg-white",
                                            ].join(" ")}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedObject?.type === "arrow" && (
                            <div>
                                <p className="mb-2 text-sm font-medium">
                                    Arrow color
                                </p>

                                <div className="grid grid-cols-5 gap-2">
                                    {(
                                        [
                                            "white",
                                            "yellow",
                                            "red",
                                            "blue",
                                            "black",
                                        ] as const
                                    ).map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            aria-label={`${color} arrow`}
                                            onClick={() =>
                                                handleUpdateSelectedObject({
                                                    color,
                                                })
                                            }
                                            className={[
                                                "h-9 rounded-md border-2",
                                                selectedObject.color === color
                                                    ? "border-foreground"
                                                    : "border-transparent",
                                                color === "blue"
                                                    ? "bg-blue-500"
                                                    : color === "red"
                                                        ? "bg-red-500"
                                                        : color === "yellow"
                                                            ? "bg-yellow-400"
                                                            : color === "black"
                                                                ? "bg-black"
                                                                : "bg-white",
                                            ].join(" ")}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {selectedObject?.type === "label" && (
                            <div>
                                <label
                                    htmlFor="pitch-label-text"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Text
                                </label>

                                <input
                                    id="pitch-label-text"
                                    type="text"
                                    value={
                                        selectedObject.text ?? ""
                                    }
                                    maxLength={40}

                                    onFocus={() => {
                                        textEditSnapshotRef.current =
                                            clonePitchObjects(
                                                objects
                                            );
                                    }}

                                    onChange={(event) => {
                                        const text =
                                            event.target.value;

                                        setObjects(
                                            (currentObjects) =>
                                                currentObjects.map(
                                                    (object) =>
                                                        object.id ===
                                                            selectedObjectId
                                                            ? {
                                                                ...object,
                                                                text,
                                                            }
                                                            : object
                                                )
                                        );
                                    }}

                                    onBlur={() => {
                                        const snapshot =
                                            textEditSnapshotRef.current;

                                        if (!snapshot) {
                                            return;
                                        }

                                        const oldObject =
                                            snapshot.find(
                                                (object) =>
                                                    object.id ===
                                                    selectedObjectId
                                            );

                                        const currentObject =
                                            objects.find(
                                                (object) =>
                                                    object.id ===
                                                    selectedObjectId
                                            );

                                        const oldText =
                                            oldObject?.text ?? "";

                                        const currentText =
                                            currentObject?.text ?? "";

                                        if (
                                            oldText !== currentText
                                        ) {
                                            pushHistorySnapshot({
                                                objects: snapshot,
                                                orientation,
                                            });
                                        }

                                        textEditSnapshotRef.current =
                                            null;
                                    }}

                                    className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Enter text..."
                                />
                            </div>
                        )}
                        {selectedObject?.type === "label" && (
                            <div>
                                <p className="mb-2 text-sm font-medium">
                                    Text color
                                </p>

                                <div className="grid grid-cols-5 gap-2">
                                    {(
                                        [
                                            "white",
                                            "yellow",
                                            "red",
                                            "blue",
                                            "black",
                                        ] as const
                                    ).map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            aria-label={`${color} text`}
                                            onClick={() =>
                                                setObjects(
                                                    (currentObjects) =>
                                                        currentObjects.map(
                                                            (object) =>
                                                                object.id ===
                                                                    selectedObjectId
                                                                    ? {
                                                                        ...object,
                                                                        color,
                                                                    }
                                                                    : object
                                                        )
                                                )
                                            }
                                            className={[
                                                "h-9 rounded-md border-2",
                                                selectedObject.color === color
                                                    ? "border-foreground"
                                                    : "border-transparent",
                                                color === "blue"
                                                    ? "bg-blue-500"
                                                    : color === "red"
                                                        ? "bg-red-500"
                                                        : color === "yellow"
                                                            ? "bg-yellow-400"
                                                            : color === "black"
                                                                ? "bg-black"
                                                                : "bg-white",
                                            ].join(" ")}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedObjectId ? (
                            <div className="mt-3 space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    {selectedObject?.type === "cone"
                                        ? "Cone"
                                        : selectedObject?.type === "pole"
                                            ? "Pole"
                                            : selectedObject?.type === "ball"
                                                ? "Ball"
                                                : selectedObject?.type === "player"
                                                    ? "Player"
                                                    : selectedObject?.type === "goal"
                                                        ? "Goal"
                                                        : selectedObject?.type === "arrow"
                                                            ? "Arrow"
                                                            : selectedObject?.type === "area"
                                                                ? "Area"
                                                                : selectedObject?.type === "label"
                                                                    ? "Text"
                                                                    : "Object"}{" "}
                                    selected. Drag it to move it.
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={
                                        handleDuplicateSelected
                                    }
                                >
                                    <Copy className="h-4 w-4" />
                                    {selectedObjectIds.length > 1
                                        ? `Duplicate (${selectedObjectIds.length})`
                                        : "Duplicate"}
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBringForward}
                                    >
                                        <BringToFront className="h-4 w-4" />
                                        Forward
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleSendBackward}
                                    >
                                        <SendToBack className="h-4 w-4" />
                                        Backward
                                    </Button>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full justify-start"
                                    onClick={
                                        handleDeleteSelected
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {selectedObjectIds.length > 1
                                        ? `Delete (${selectedObjectIds.length})`
                                        : "Delete selected"}
                                </Button>
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-muted-foreground">
                                Select an object on
                                the pitch to edit it.
                            </p>
                        )}
                        {selectedObjectIds.length > 1 && (
                            <p className="mt-1 text-sm font-medium">
                                {selectedObjectIds.length}{" "}
                                objects selected
                            </p>
                        )}
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start"
                            disabled={
                                objects.length === 0
                            }
                            onClick={
                                handleClearPitch
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear pitch
                        </Button>
                    </div>
                </Card>

                <div className="min-w-0 space-y-3">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={
                                undoStack.length === 0
                            }
                            onClick={handleUndo}
                        >
                            <Undo2 className="h-4 w-4" />
                            Undo
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={
                                redoStack.length === 0
                            }
                            onClick={handleRedo}
                        >
                            <Redo2 className="h-4 w-4" />
                            Redo
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 rounded-lg border bg-card p-2">
                        <button
                            type="button"
                            onClick={handleAddCone}
                            className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-xs hover:bg-muted"
                            title="Add cone"
                        >
                            <svg
                                viewBox="0 0 40 40"
                                className="h-7 w-7"
                            >
                                <path
                                    d="M20 7 L29 27 L11 27 Z"
                                    fill="#f97316"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <rect
                                    x="9"
                                    y="26"
                                    width="22"
                                    height="5"
                                    rx="2"
                                    fill="#f97316"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>

                            <span>Cone</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleAddPole}
                            className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-xs hover:bg-muted"
                            title="Add pole"
                        >
                            <svg
                                viewBox="0 0 40 40"
                                className="h-7 w-7"
                            >
                                <rect
                                    x="17"
                                    y="5"
                                    width="6"
                                    height="27"
                                    rx="3"
                                    fill="#facc15"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />

                                <rect
                                    x="12"
                                    y="30"
                                    width="16"
                                    height="5"
                                    rx="2"
                                    fill="#facc15"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>

                            <span>Pole</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleAddBall}
                            className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-xs hover:bg-muted"
                            title="Add ball"
                        >
                            <svg
                                viewBox="0 0 40 40"
                                className="h-7 w-7"
                            >
                                <circle
                                    cx="20"
                                    cy="20"
                                    r="12"
                                    fill="white"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />

                                <circle
                                    cx="20"
                                    cy="20"
                                    r="4"
                                    fill="currentColor"
                                />
                            </svg>

                            <span>Ball</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleAddPlayer}
                            className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-xs hover:bg-muted"
                            title="Add player"
                        >
                            <svg
                                viewBox="0 0 40 40"
                                className="h-7 w-7"
                            >
                                <circle
                                    cx="20"
                                    cy="12"
                                    r="6"
                                    fill="#3b82f6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />

                                <path
                                    d="M11 23 Q20 18 29 23 L27 35 L13 35 Z"
                                    fill="#3b82f6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>

                            <span>Player</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleAddGoal}
                            className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-xs hover:bg-muted"
                            title="Add goal"
                        >
                            <svg
                                viewBox="0 0 44 40"
                                className="h-7 w-8"
                            >
                                <rect
                                    x="5"
                                    y="9"
                                    width="34"
                                    height="22"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                            </svg>

                            <span>Goal</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleAddArrow}
                            className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-xs hover:bg-muted"
                            title="Add arrow"
                        >
                            <svg
                                viewBox="0 0 44 40"
                                className="h-7 w-8"
                            >
                                <line
                                    x1="5"
                                    y1="20"
                                    x2="31"
                                    y2="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M38 20 L28 13 L28 27 Z"
                                    fill="currentColor"
                                />
                            </svg>

                            <span>Arrow</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleAddArea}
                            className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-xs hover:bg-muted"
                            title="Add area"
                        >
                            <svg
                                viewBox="0 0 44 40"
                                className="h-7 w-8"
                            >
                                <rect
                                    x="5"
                                    y="7"
                                    width="34"
                                    height="26"
                                    rx="2"
                                    fill="#facc1533"
                                    stroke="#facc15"
                                    strokeWidth="3"
                                />
                            </svg>

                            <span>Area</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleAddLabel}
                            className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-xs hover:bg-muted"
                            title="Add text"
                        >
                            <span className="text-2xl font-bold leading-none">
                                T
                            </span>

                            <span>Text</span>
                        </button>
                    </div>

                    <PitchCanvas
                        orientation={orientation}
                        objects={objects}
                        selectedObjectIds={
                            selectedObjectIds
                        }
                        onSelectObject={
                            handleSelectObject
                        }
                        onSelectObjects={
                            handleSelectObjects
                        }
                        onMoveObjects={
                            handleMoveObjects
                        }
                        onResizeObject={
                            handleResizeObject
                        }
                        onHistoryCheckpoint={
                            recordHistory
                        }

                    />

                    <p className="text-center text-sm text-muted-foreground">
                        Click an object to select it. Drag to move it around the pitch.
                    </p>
                </div>
            </div>
        </div>
    );
}