export const ProjectVersion = {
  V1_0: 1.0,
  V1_1: 1.1,
  V1_2: 1.2,
} as const;

export type ProjectVersion = (typeof ProjectVersion)[keyof typeof ProjectVersion];

export const LATEST_PROJECT_VERSION = ProjectVersion.V1_2;
