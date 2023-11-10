export const TraceStreamAction = {
  LOOP: 'LOOP',
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  END: 'END',
} as const;

export type TraceStreamAction = (typeof TraceStreamAction)[keyof typeof TraceStreamAction];
