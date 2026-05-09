export interface BallEvent {
  id: string;
  over: number;
  ball: number;
  batsman: string;
  bowler: string;
  runs: number;
  extras: number;
  wicket: boolean;
  wicketType?: string;
  isFour: boolean;
  isSix: boolean;
  commentary?: string;
  timestamp: number;
}

export const RR_COLORS = {
  pink: "#EB1C6B",
  blue: "#2D2E83",
  gold: "#C4A45A",
  white: "#FFFFFF",
};
