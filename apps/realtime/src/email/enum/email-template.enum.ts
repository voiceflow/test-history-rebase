export const EmailTemplate = {
  WORKFLOW_ASSIGNED: 'd-f87572e7cd544414bee717a04aec91df',
  MENTION_COMMENTING: 'd-14ca722b25a542fea178d4047373dff0',
} as const;

export type EmailTemplate = (typeof EmailTemplate)[keyof typeof EmailTemplate];
