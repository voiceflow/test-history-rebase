export enum Version {
  /** initial version */
  V1_0_0 = '1.0.0',

  /** normalized workspace members */
  V1_1_0 = '1.1.0',

  /** rename `project.members` into `project.platformMembers` and normalize them */
  V1_1_1 = '1.1.1',

  /** improves dashboard DnD ordering */
  V1_2_0 = '1.2.0',

  /** refactor diagram.menuNodeIDs into diagram.menuItems */
  V1_3_0 = '1.3.0',

  V1_4_0 = '1.4.0',

  /** new components migration */
  V1_5_0 = '1.5.0',

  /** workflows */
  V1_6_0 = '1.6.0',

  /** workflows migration */
  V1_7_0 = '1.7.0',

  /** setV3 migration */
  V1_8_0 = '1.8.0',
}

export const CURRENT_VERSION = Version.V1_8_0;
