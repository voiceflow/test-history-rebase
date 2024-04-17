import { Enum } from '@voiceflow/dtos';

export const TemplateID = {
  COLLECT_CUSTOMER_FEEDBACK: 'collect-customer-feedback',
  DATE_PARSER: 'date-parser',
  DYNAMIC_CAROUSEL: 'dynamic-carousel',
  FETCH_USER_INFORMATION: 'fetch-user-information',
  HELLO_WORLD: 'hello-world',
  VIDEO_RESPONSE: 'video-response',
  LISTEN: 'listen',
};

export type TemplateID = Enum<typeof TemplateID>;

export interface FunctionStarterTemplate {
  templateID: TemplateID;
  name: string;
  description: string;
}

export const starterTemplates: Array<FunctionStarterTemplate> = [
  {
    templateID: TemplateID.HELLO_WORLD,
    name: 'Hello world',
    description: 'A starter template to get you started with functions.',
  },
  {
    templateID: TemplateID.FETCH_USER_INFORMATION,
    name: 'Fetch user information',
    description: 'Demonstrates how to make an HTTP request to fetch user information.',
  },
  {
    templateID: TemplateID.COLLECT_CUSTOMER_FEEDBACK,
    name: 'Collect customer feedback',
    description: 'Demonstrates how to capture feedback and send to feedback submission endpoint.',
  },
  {
    templateID: TemplateID.DATE_PARSER,
    name: 'Date parser',
    description: 'Convert input messages to human readable dates (e.g. 3/6/2024, 2:33:39 PM).',
  },
  {
    templateID: TemplateID.DYNAMIC_CAROUSEL,
    name: 'Dynamic carousel response',
    description: 'Demonstrates how to return a carousel response for product recommendations.',
  },
  {
    templateID: TemplateID.VIDEO_RESPONSE,
    name: 'Video response',
    description:
      'Demonstrates how to use a function to show a video to a user. This needs to be paired with the video extension to work as intended.',
  },
  {
    templateID: TemplateID.LISTEN,
    name: 'Listen',
    description: 'Demonstrates how to use listen functionality to leave from a certain path based on user input',
  },
];
