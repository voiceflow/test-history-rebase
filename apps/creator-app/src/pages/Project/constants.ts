import { Path } from '@/config/routes';

export const TIMEOUT_COUNT = 15 * 60 * 1000;

export const DIAGRAM_ROUTES = [
  Path.CANVAS_NODE,
  Path.PROJECT_CANVAS,
  Path.PROJECT_PROTOTYPE,
  Path.CANVAS_COMMENTING,
  Path.CANVAS_COMMENTING_THREAD,
];

export enum ShareProjectTab {
  INVITE = 'INVITE',
  EXPORT = 'EXPORT',
  PROTOTYPE = 'PROTOTYPE',
}
