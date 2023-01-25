import { LegacyPath, Path } from '@/config/routes';

export const TIMEOUT_COUNT = 5 * 60 * 1000;

export const DIAGRAM_ROUTES = [
  Path.PROJECT_PROTOTYPE,
  Path.DOMAIN_CANVAS,
  Path.CANVAS_COMMENTING,
  Path.CANVAS_COMMENTING_THREAD,
  Path.CANVAS_MODEL,
  Path.CANVAS_MODEL_ENTITY,
  Path.CANVAS_NODE,
  LegacyPath.PROJECT_CANVAS,
  Path.PROJECT_DOMAIN,
];
