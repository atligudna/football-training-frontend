export type PitchOrientation =
  | "landscape"
  | "portrait";

export type PitchObjectType =
  | "cone"
  | "pole"
  | "ball"
  | "goal"
  | "player"
  | "arrow"
  | "area"
  | "label";

export type PitchObjectSize =
  | "small"
  | "medium"
  | "large";

export type PitchObjectColor =
  | "blue"
  | "red"
  | "yellow"
  | "white"
  | "black";

export type GoalType =
  | "full"
  | "seven"
  | "mini";

export type PitchLineStyle =
  | "solid"
  | "dashed";

export interface PitchObject {
  id: string;
  type: PitchObjectType;

  /**
   * Position on the pitch as percentage.
   * 0 = left/top
   * 100 = right/bottom
   */
  x: number;
  y: number;

  rotation?: number;
  size?: PitchObjectSize;
  width?: number;
  height?: number;
  color?: PitchObjectColor;
  goalType?: GoalType;
  lineStyle?: PitchLineStyle;

  text?: string;
}

export interface PitchDiagram {
  id: string;
  title: string;
  orientation: PitchOrientation;
  objects: PitchObject[];
}

