import { SVG } from '@voiceflow/ui';

export interface StepItem {
  icon: React.FC;
  name: string;
}

export interface TopStepItem extends StepItem {
  childSteps: StepItem[];
}

export const STEPS: TopStepItem[] = [
  {
    icon: SVG.systemTalk,
    name: 'Talk',
    childSteps: [],
  },
  {
    icon: SVG.systemListen,
    name: 'Listen',
    childSteps: [],
  },
  {
    icon: SVG.systemLogic,
    name: 'Logic',
    childSteps: [],
  },
  {
    icon: SVG.systemEvent,
    name: 'Event',
    childSteps: [],
  },
  {
    icon: SVG.systemDev,
    name: 'Dev',
    childSteps: [],
  },
];
