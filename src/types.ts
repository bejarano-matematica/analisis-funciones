export interface Point {
  x: number;
  y: number;
}

export interface FunctionData {
  id: string;
  name: string;
  description: string;
  points?: Point[]; // For piecewise linear
  formula?: (x: number) => number; // For continuous
  domain: [number, number];
  range: [number, number];
  roots: number[];
  rootLabels?: string[];
  positivity: [number, number][];
  negativity: [number, number][];
  growth: [number, number][];
  decay: [number, number][];
  extrema: { x: number; y: number; type: 'max' | 'min' }[];
  constantIntervals: [number, number][];
}

export type QuestionType = 'dom' | 'im' | 'roots' | 'pos' | 'neg' | 'growth' | 'decay' | 'extrema' | 'value_at' | 'constant';
export type GameStatus = 'welcome' | 'getName' | 'playing';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  explanation: string;
  options?: string[]; // for multiple choice if needed, otherwise input
}
