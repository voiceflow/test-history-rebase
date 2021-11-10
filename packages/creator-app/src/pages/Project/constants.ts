import { Path } from '@/config/routes';

export const PAGES_MATCHES = {
  prototype: [Path.PROJECT_PROTOTYPE],
  tools: [Path.PROJECT_TOOLS],
  canvas: [Path.PROJECT_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY],
  migrate: [Path.PROJECT_MIGRATE],
  publish: [Path.PROJECT_PUBLISH],
  conversations: [Path.CONVERSATIONS],
  prototype_webhook: [Path.PROTOTYPE_WEBHOOK],
};

export const TIMEOUT_COUNT = 5 * 60 * 1000;

export enum QUERY_PARAMS {
  PREVIEWING = 'previewing',
}
