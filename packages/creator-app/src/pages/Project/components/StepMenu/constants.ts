import { SVG } from '@voiceflow/ui';

export interface StepItem {
  icon: React.FC;
  name: string;
  tooltipText?: string;
  tooltipLink?: string;
}

export interface TopStepItem extends StepItem {
  childSteps?: StepItem[];
}

export const STEPS: TopStepItem[] = [
  {
    icon: SVG.systemTalk,
    name: 'Talk',
    childSteps: [
      {
        icon: SVG.systemMessage,
        name: 'Text',
        tooltipText: '',
        tooltipLink: '',
      },
      {
        icon: SVG.systemImage,
        name: 'Image',
        tooltipText: 'Add images and GIFs to your assistant.',
        tooltipLink: '',
      },
      {
        icon: SVG.systemCard,
        name: 'Card',
        tooltipText: '',
        tooltipLink: '',
      },
      {
        icon: SVG.systemCarousel,
        name: 'Carousel',
        tooltipText: '',
        tooltipLink: '',
      },
    ],
  },
  {
    icon: SVG.systemListen,
    name: 'Listen',
    childSteps: [
      {
        icon: SVG.choiceV2,
        name: 'Choice',
        tooltipText: '',
        tooltipLink: '',
      },
      {
        icon: SVG.button,
        name: 'Buttons',
        tooltipText: '',
        tooltipLink: '',
      },
      {
        icon: SVG.captureV2,
        name: 'Capture',
        tooltipText: '',
        tooltipLink: '',
      },
    ],
  },
  {
    icon: SVG.systemLogic,
    name: 'Logic',
    childSteps: [
      {
        icon: SVG.ifV2,
        name: 'Condition',
        tooltipText: '',
        tooltipLink: '',
      },
      {
        icon: SVG.systemSet,
        name: 'Set variable',
        tooltipText: '',
        tooltipLink: '',
      },
      {
        icon: SVG.randomV2,
        name: 'Random',
        tooltipText: '',
        tooltipLink: '',
      },
      {
        icon: SVG.flowV2,
        name: 'Flow',
        tooltipText: '',
        tooltipLink: '',
      },
    ],
  },
  {
    icon: SVG.systemEvent,
    name: 'Event',
  },
  {
    icon: SVG.systemDev,
    name: 'Dev',
    childSteps: [
      {
        icon: SVG.api,
        name: 'API',
        tooltipText: '',
        tooltipLink: '',
      },
      {
        icon: SVG.systemCode,
        name: 'Javascript',
        tooltipText: '',
        tooltipLink: '',
      },
      {
        icon: SVG.api,
        name: 'Action',
        tooltipText: '',
        tooltipLink: '',
      },
    ],
  },
];
