export const ModelFlag = {
  /**
   * specifies a version that should receive normal traffic
   */
  NORMAL: 'n',
  /**
   * specifies a version that should provide feedback
   */
  FEEDBACK: 'F',
  /**
   * specifies a version that is part of an AB test
   */
  AB_TEST: 'ab',
  /**
   * specifies a version that should receive shadow traffic
   */
  SHADOW: 's',
} as const;

export type ModelFlag = (typeof ModelFlag)[keyof typeof ModelFlag];

export interface ModelVersionConfiguration {
  topic: string;

  /**
   * percent of traffic that should be routed to this version
   */
  traffic: number;
  /**
   * flags that affect how traffic is distributed
   */
  trafficType: ModelFlag;

  hasFeedback: boolean;
}

export interface ModelConfiguration {
  [versionID: string]: ModelVersionConfiguration;
}
