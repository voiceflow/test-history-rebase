import { CanvasRoute, ProjectRoute, toPath } from '@/config/routes';

export const PAGES_MATCHES = {
  prototype: [toPath(ProjectRoute.PROTOTYPE, ':diagramID?')],
  tools: [toPath(ProjectRoute.TOOLS)],
  canvas: [
    toPath(ProjectRoute.CANVAS, ':diagramID?'),
    toPath(ProjectRoute.CANVAS, ':diagramID', CanvasRoute.COMMENTING),
    toPath(ProjectRoute.CANVAS, ':diagramID', CanvasRoute.MARKUP),
  ],
  migrate: [toPath(ProjectRoute.MIGRATE)],
  publish: [toPath(ProjectRoute.PUBLISH)],
};

export const TIMEOUT_COUNT = 5 * 60 * 1000;
