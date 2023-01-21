export enum Version {
  /** initial version */
  V1_0_0 = '1.0.0',

  /** normalized workspace members */
  V1_1_0 = '1.1.0',

  /** rename `project.members` into `project.platformMembers` and normalize them */
  V1_1_1 = '1.1.1',
}

export const CURRENT_VERSION = Version.V1_1_1;
