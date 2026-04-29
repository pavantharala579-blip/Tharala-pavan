export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

export interface GameState {
  snake: Coordinate[];
  food: Coordinate;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export type Coordinate = { x: number; y: number };
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
